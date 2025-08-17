"use server";

import { schemaSignIn, schemaSignUp } from "@/lib/schema";
import { ActionResult } from "@/types";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import prisma from "../../../../../lib/prisma";

export async function SignIn(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  // 1. validasi input form
  // schemaSignIn = skema Zod untuk validasi email & password.
  // formData.get() mengambil data dari form HTML.
  // safeParse() mengembalikan { success: true/false, data/error } tanpa lempar exception (lebih aman dari parse()).
  const validate = schemaSignIn.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // 2. jika validasi gagal, kembalikan error
  if (!validate.success) {
    return {
      error: validate.error.errors[0].message,
    };
  }

  // 3. cari user di database
  // cari user di database berdasarkan email dan role.
  // di sini hanya user dengan role "customer" yang bisa login.
  const existingUser = await prisma.user.findFirst({
    where: {
      email: validate.data.email,
      role: "customer",
    },
  });

  // 4. jika user tidak ditemukan, beri error
  if (!existingUser) {
    return {
      error: "Incorrect email or password",
    };
  }

  // 5. cek password dengan bcrypt => compareSync
  const comparePassword = bcrypt.compareSync(
    validate.data.password,
    existingUser.password
  );

  // 6. jika password salah, beri error
  if (!comparePassword) {
    return {
      error: "Incorrect email or password",
    };
  }

  // 7. jika berhasil login → buat session dengan Lucia (buat session untuk user)
  const session = await lucia.createSession(existingUser.id, {});

  // 8. buat cookie dari session ID
  const sessionCookie = lucia.createSessionCookie(session.id);

  // 9. set cookie ke browser
  // set cookie ke response, agar browser menyimpan session.
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  // 10. redirect ke "/"
  return redirect("/");
}

export async function SignUp(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const validate = schemaSignUp.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validate.success) {
    return {
      error: validate.error.errors[0].message,
    };
  }

  const hashPassword = bcrypt.hashSync(validate.data.password, 12);

  try {
    await prisma.user.create({
      data: {
        email: validate.data.email,
        name: validate.data.name,
        password: hashPassword,
        role: "customer",
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to sign up",
    };
  }

  return redirect("/sign-in");
}
