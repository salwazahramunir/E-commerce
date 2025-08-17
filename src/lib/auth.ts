// 1. import package
import { Lucia, Session, User } from "lucia"; // komponen utama untuk autentikasi.
import { PrismaAdapter } from "@lucia-auth/adapter-prisma"; // penghubung Lucia ke database lewat Prisma.
import prisma from "../../lib/prisma"; // client Prisma untuk akses database (dari file lain).
import { role_user } from "@prisma/client"; // enum role user (misal: admin, customer, dll).
import { cache } from "react"; // fitur React untuk menghemat kerja saat fungsi sering dipanggil.
import { cookies } from "next/headers"; // untuk membaca/menulis cookie di Next.js.

// 2. setup adapter, ini wajib supaya Lucia tahu di mana harus cari dan simpan data.
const adapter = new PrismaAdapter(prisma.session, prisma.user);

// 3. konfigurasi Lucia
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false, // cookie akan hilang kalau browser ditutup.
    attributes: {
      secure: process.env.NODE_ENV === "production", // hanya akan aktif di production, supaya cookie hanya dikirim lewat HTTPS.
    },
  },
  getUserAttributes: (attributes) => {
    // Lucia akan ambil field: id, name, email, role dari user (penting agar bisa akses data user saat sudah login.)
    return {
      id: attributes.id,
      name: attributes.name,
      email: attributes.email,
      role: attributes.role,
    };
  },
});

// 4. cek user yang login / ambil user yang Login
// ref: https://v3.lucia-auth.com/tutorials/username-and-password/nextjs-app#validate-requests
export const getUser = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId =
      (await cookies()).get(lucia.sessionCookieName)?.value ?? null; // ambil session ID dari cookie browser.

    // kalau tidak ada → user belum login → return null.
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId); // kalau ada → panggil lucia.validateSession() untuk cek apakah session valid.

    try {
      // kalau session masih valid dan fresh → buat cookie baru untuk memperpanjang session.
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      // kalau session tidak valid → kosongkan cookie (hapus login).
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {
      // Next.js throws error when attempting to set cookies when rendering page
    }

    return result;
  }
);

// 5. Menambahkan typing
// ini memberi tahu TypeScript struktur data agar lucia tau format data, kalau tidak pakai ini maka struktur data menggunakan nilai default
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseUserAttributes: {
      id: number;
      name: string;
      email: string;
      role: role_user;
    };
  }
}
