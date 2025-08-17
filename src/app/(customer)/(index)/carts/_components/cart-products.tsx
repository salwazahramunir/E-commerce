"use client";

import { useCart } from "@/hooks/useCart";
import { rupiahFormat } from "@/lib/utils";
import React from "react";

export default function CartProducts() {
  const { products, increaseQuantity, decreaseQuantity, removeProduct } =
    useCart();

  return (
    <div
      id="cart"
      className="container max-w-[1130px] mx-auto flex flex-col gap-5 mt-[50px]"
    >
      {products.map((item) => (
        <div
          key={item.id + item.name}
          className="product-total-card bg-white flex items-center justify-between p-5 rounded-[20px] border border-[#E5E5E5]"
        >
          <div className="flex items-center w-[340px] gap-5">
            <div className="w-[120px] h-[70px] flex shrink-0 overflow-hidden items-center justify-center">
              <img
                src={item.image_url}
                className="w-full h-full object-contain"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold leading-[22px]">{item.name}</p>
              <p className="text-sm text-[#616369]">{item.category_name}</p>
            </div>
          </div>
          <div className="w-[150px] flex flex-col gap-1">
            <p className="text-sm text-[#616369]">Price</p>
            <p className="font-semibold text-[#0D5CD7] leading-[22px]">
              {rupiahFormat(item.price)}
            </p>
          </div>
          <div className="w-[120px] flex flex-col gap-1">
            <p className="text-sm text-[#616369]">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => decreaseQuantity(item.id)}
                className="w-6 h-6 flex shrink-0"
              >
                <img src="assets/icons/minus-cirlce.svg" alt="minus" />
              </button>
              <p className="text-[#0D5CD7] font-semibold leading-[22px]">
                {item.quantity}
              </p>
              <button
                type="button"
                onClick={() => increaseQuantity(item.id)}
                className="w-6 h-6 flex shrink-0"
              >
                <img src="assets/icons/add-circle.svg" alt="plus" />
              </button>
            </div>
          </div>
          <div className="w-[150px] flex flex-col gap-1">
            <p className="text-sm text-[#616369]">Total</p>
            <p className="font-semibold text-[#0D5CD7] leading-[22px]">
              {rupiahFormat(item.price * item.quantity)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeProduct(item.id)}
            className="p-[12px_24px] bg-white rounded-full text-center font-semibold border border-[#E5E5E5]"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
