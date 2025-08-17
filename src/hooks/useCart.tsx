import { TCart } from "@/types"; // tipe data dari product dalam keranjang (misalnya id, name, price, quantity).
import { create } from "zustand"; // fungsi utama Zustand untuk bikin store (tempat nyimpen data global).
import { createJSONStorage, persist } from "zustand/middleware"; // middleware supaya data cart bisa disimpan ke sessionStorage (jadi kalau reload halaman, cart nggak langsung hilang).

// interface untuk mendefinisikan bentuk data store.
interface CartState {
  products: TCart[]; // array berisi produk yang ada di keranjang.
  addProduct: (cart: TCart) => void; // fungsi buat menambahkan produk.
  increaseQuantity: (id: number) => void; // fungsi buat menambah jumlah produk (quantity).
  decreaseQuantity: (id: number) => void; // fungsi buat mengurangi jumlah produk.
  removeProduct: (id: number) => void; // fungsi buat menghapus produk dari cart.
}

// membuat store dengan tipe CartState.
export const useCart = create<CartState>()(
  // persist -> bungkus store biar data tetap ada di sessionStorage (hilang kalau tutup browser, tapi masih ada kalau cuma refresh).
  persist(
    // set -> fungsi untuk mengubah state.
    // get -> fungsi untuk ambil state saat ini.
    (set, get) => ({
      products: [],
      addProduct: (cart) =>
        // filter product kalau produk dengan id sama sudah ada → dia buang dulu (filter) lalu tambahin produk baru. Jadi cart tidak punya produk duplikat
        set({
          products: [
            ...get().products.filter((item) => item.id !== cart.id),
            cart,
          ],
        }),
      increaseQuantity: (id) => {
        const newProducts = get().products.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }

          return item;
        });

        set({
          products: newProducts,
        });
      },
      decreaseQuantity: (id) => {
        const newProducts = get().products.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }

          return item;
        });

        set({
          products: newProducts.filter((item) => item.quantity !== 0), // filter kalau qty 0 maka dihapus
        });
      },
      removeProduct: (id) => {
        set({
          products: [...get().products.filter((item) => item.id !== id)],
        });
      },
    }),
    {
      name: "cart-product-belanja", // data cart disimpan di browser dengan key cart-product-belanja.
      storage: createJSONStorage(() => sessionStorage),
      /*
        Disimpan di sessionStorage (bukan localStorage):
        - sessionStorage → hilang kalau browser/tab ditutup.
        - localStorage → tetap ada walaupun browser ditutup.
      */
    }
  )
);
