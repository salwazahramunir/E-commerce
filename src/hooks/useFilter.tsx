import { stock_product } from "@prisma/client";
import { create } from "zustand";

export type TFilter = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  stocks?: stock_product[] | null;
  brands?: number[] | null;
  categories?: number[] | null;
  locations?: number[] | null;
};

export interface FilterState {
  filter: TFilter; // state
  setFilter: (filter: TFilter) => void; // fungsi untuk mengubah state yang ada di TFilter
}

// buat store useFilter
export const useFilter = create<FilterState>()((set) => ({
  // nilai awal state (filter)
  filter: {
    search: "",
    minPrice: 0,
    maxPrice: 0,
    stocks: null,
    brands: null,
    categories: null,
    locations: null,
  },
  // function update (setFilter)
  setFilter: (filter) =>
    // set((state) => ({ ... })) → memanggil fungsi set dengan state baru.
    set((state) => ({
      filter: {
        ...state.filter, // ...state.filter → copy filter lama (previous state).
        ...filter, // ...filter → timpa dengan field baru yang dikirim.
      },
    })),
}));
