"use client";

import { useFilter } from "@/hooks/useFilter";
import React, { useEffect, useState } from "react";

export default function SearchBar() {
  const { setFilter } = useFilter();
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    // debounce itu untuk delay, jadi ketika search dijalankan akan ada delay 1,5 detik
    const debounceInput = setTimeout(() => {
      setFilter({
        search: query,
      });
    }, 1500);

    return () => clearTimeout(debounceInput); // untuk membersihkan timer lama sebelum bikin timer baru
  }, [query]); // kalau value berubah maka useEffect akan dijalankan

  return (
    <div
      id="title"
      className="container max-w-[1130px] mx-auto flex items-center justify-between"
    >
      <div className="flex flex-col gap-5">
        <div className="flex gap-5 items-center">
          <a className="page text-sm text-[#6A7789] last-of-type:text-black">
            Shop
          </a>
          <span className="text-sm text-[#6A7789]">/</span>
          <a className="page text-sm text-[#6A7789] last-of-type:text-black">
            Browse
          </a>
          <span className="text-sm text-[#6A7789]">/</span>
          <a className="page text-sm text-[#6A7789] last-of-type:text-black">
            Catalog
          </a>
        </div>
        <h1 className="font-bold text-4xl leading-9">Our Product Catalog</h1>
      </div>
      <form
        action=""
        className="max-w-[480px] w-full bg-white flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300"
      >
        <input
          type="text"
          id=""
          name=""
          className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
          placeholder="Search product by name, brand, category"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <button type="submit" className="flex shrink-0">
          <img src="assets/icons/search-normal.svg" alt="icon" />
        </button>
      </form>
    </div>
  );
}

/*
  Note:
  Kenapa perlu clearTimeout(debounceInput)?

  Misalnya:
  - User mulai ketik "a" → timer 1 dibuat (1500ms).
  - Sebelum 1500ms selesai, user nambah "ab" → timer 2 dibuat.
  - Kalau nggak pakai clearTimeout(timer 1), dua timer akan jalan bersamaan.
  - Akibatnya, setFilter bisa terpanggil dua kali (sekali dari timer 1, sekali dari timer 2) → debounce gagal.

  Dengan clearTimeout:
  - Saat user ketik "ab", timer untuk "a" dibatalkan, jadi hanya timer terakhir yang dieksekusi.
*/
