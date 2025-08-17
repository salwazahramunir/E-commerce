"use client";

import React from "react";
import CardProduct from "../../_components/card-product";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../lib/data";
import { useFilter } from "@/hooks/useFilter";

export default function ProductList() {
  const { filter } = useFilter(); // memanggil state filter

  // Queries berdasarkan filter state
  const { data, isLoading } = useQuery({
    queryKey: ["product-list", filter],
    queryFn: () => fetchProducts(filter),
  });

  console.log(data, "<<<<");

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-[30px]">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-[30px]">
      {data?.map((product) => {
        return <CardProduct key={product.id + product.name} item={product} />;
      })}
    </div>
  );
}
