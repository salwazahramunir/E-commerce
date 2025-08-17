// 1. import PrismaClient => class utama dari Prisma untuk berinteraksi dengan database.
import { PrismaClient } from "@prisma/client";

// 2. mendeklarasikan variabel prisma bertipe PrismaClient
let prisma: PrismaClient;

// 3. mendeklarasikan properti baru prisma di objek global (globalThis).
// Ini hanya type declaration agar TypeScript tahu bahwa kita akan menambahkan prisma ke globalThis.
declare const globalThis: {
  prisma: PrismaClient;
};

// 4. cek env aplikasi
if (process.env.NODE_ENV === "production") {
  // jika production, maka langsung buat new PrismaClient() (tidak masalah karena hanya dijalankan sekali saat build).
  prisma = new PrismaClient();
} else {
  /* 
    jika development, cek lagi apakah sudah ada prisma di globalThis atau belum, 
    ini disebabkan karena Hot-reloading dapat menyebabkan file di-import ulang, 
    dan kalau tiap kali import dibuat instance baru PrismaClient, 
    maka akan ada banyak koneksi ke DB.
  */
  if (!globalThis.prisma) {
    // kalau belum ada, buat instance baru dan simpan ke globalThis.prisma.
    globalThis.prisma = new PrismaClient();
  }

  // assign: prisma = globalThis.prisma.
  prisma = globalThis.prisma;
}

// 5. mengekspor instance prisma untuk digunakan di file lain.
export default prisma;
