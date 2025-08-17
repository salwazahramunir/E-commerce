"use server";

import { getUser, lucia } from "@/lib/auth";
import { ActionResult } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { schemaSignIn } from "@/lib/schema";
import prisma from "../../../../../../../lib/prisma";
import bcrypt from "bcrypt";

export async function Logout(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  // 1. mengambil data user yang sedang login, termasuk sesi (session).
  const { session } = await getUser();

  // 2. kalau tidak ada sesi (berarti belum login), maka kembalikan error "Unauthorized".
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  // 3. menghapus sesi dari database melalui lucia auth. => user akan benar-benar keluar, dan token session tidak valid lagi.
  // lucia.invalidateSession(session.id) berfungsi untuk menghapus sesi login user dari sisi server (biasanya di database).
  await lucia.invalidateSession(session.id);

  // 4. hapus cookie dari browser
  // createBlankSessionCookie adalah fungsi untuk membuat cookie kosong yang "menimpa" cookie sesi sebelumnya.
  // tujuannya: menghapus cookie sesi dari browser.
  // kenapa harus buat cookie kosong? Karena Set-Cookie di HTTP cuma bisa menimpa, bukan "menghapus" langsung.
  const sessionCookie = lucia.createBlankSessionCookie();

  // 5. set cookie kosong ke browser
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  // 6. redirect ke halaman sign-in
  return redirect("/dashboard/sign-in");
}

/*
  Note:
  🔐 Penjelasan Lengkap:
  Saat user login, Lucia membuat session ID dan menyimpannya di dua tempat:
  1. Di browser → dalam bentuk cookie (session cookie)
  2. Di server (database) → sebagai data sesi yang valid

  🔄 Jadi saat logout, kita harus:
  1. Hapus sesi di server → pakai invalidateSession(session.id)
  2. Hapus cookie di browser → pakai createBlankSessionCookie()
*/

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
  // di sini hanya user dengan role "superadmin" yang bisa login.
  const existingUser = await prisma.user.findFirst({
    where: {
      email: validate.data.email,
      role: "superadmin",
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

  // 10. redirect ke dashboard
  return redirect("/dashboard");
}
