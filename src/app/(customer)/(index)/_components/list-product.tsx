import React, { ReactNode } from "react";
import { getProducts } from "../lib/data";
import Link from "next/link";
import { rupiahFormat } from "@/lib/utils";
import CardProduct from "./card-product";

interface ListProductProps {
  title: ReactNode;
  isShowDetail?: boolean;
}

export default async function ListProduct({
  title,
  isShowDetail = true,
}: ListProductProps) {
  const products = await getProducts();

  return (
    <div id="picked" className="flex flex-col gap-[30px]">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl leading-[34px]">{title}</h2>
        {isShowDetail && (
          <a
            href="catalog.html"
            className="p-[12px_24px] border border-[#E5E5E5] rounded-full font-semibold"
          >
            Explore All
          </a>
        )}
      </div>
      <div className="grid grid-cols-5 gap-[30px]">
        {products.map((product) => {
          const item = {
            id: product.id,
            image_url: product.image_url,
            name: product.name,
            category_name: product.category.name,
            price: Number(product.price),
          };

          return (
            <CardProduct key={`${product.name}${product.id}`} item={item} />
          );
        })}
      </div>
    </div>
  );
}
