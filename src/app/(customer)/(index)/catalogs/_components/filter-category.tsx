import { getCategories } from "@/app/(admin)/dashboard/(index)/categories/lib/data";
import React from "react";
import FilterCheckboxItem from "./filter-checkbox-item";

export default async function FilterCategory() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-[14px]">
      <p className="font-semibold leading-[22px]">Categories</p>
      {categories.map((item) => {
        return (
          <FilterCheckboxItem
            key={`${item.id + item.name}`}
            id={item.id.toString()}
            value={item.name}
            type="category"
          />
        );
      })}
    </div>
  );
}
