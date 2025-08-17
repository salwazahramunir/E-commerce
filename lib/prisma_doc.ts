// 1. import PrismaClient => class utama dari Prisma untuk berinteraksi dengan database.
import { PrismaClient } from "@prisma/client";
/* 
    JIKA PAKAI EKSTENSI ACCELERATE
    ==============================
    // 2. import withAccelerate => ekstensi dari Prisma Accelerate, fitur dari Prisma untuk meningkatkan performa query, caching, dan edge functions.
    import { withAccelerate } from "@prisma/extension-accelerate";
    
    // 3. inisialisasi prisma client + ekstensi accelerate
    .$extends(withAccelerate()) =>  sehingga fitur-fitur tambahan dari Accelerate bisa digunakan (seperti query batching atau edge optimizations).
    const prisma = new PrismaClient().$extends(withAccelerate());
*/

// 2. inisialisasi prisma
const prisma = new PrismaClient();

// 3. simpan prisma di global (untuk dev hot-reload)
// Next.js melakukan hot-reloading, jadi membuat ulang Prisma client bisa menyebabkan koneksi database berlebihan, solusinya simpan instance prisma ke global object agar hanya dibuat sekali saja selama development.
const globalForPrisma = global as unknown as { prisma: typeof prisma };

// 4. cegah Instansiasi Ulang (Dev Only)
// simpan prisma di global saat env development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// 5. ekspor Prisma
// ekspor instance prisma supaya bisa digunakan di file lain (misalnya di route handler atau API file Next.js).
export default prisma;
