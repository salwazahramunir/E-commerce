"use client";
import { useFilter } from "@/hooks/useFilter";
import { stock_product } from "@prisma/client";
import React, { ChangeEvent } from "react";

interface FilterCheckboxItemProps {
  id: string;
  value: string;
  type?: "stock" | "brand" | "category" | "location";
}

export default function FilterCheckboxItem({
  id,
  value,
  type,
}: FilterCheckboxItemProps) {
  const { filter, setFilter } = useFilter();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (type) {
      case "stock":
        if (e.target.checked) {
          // ketika checked
          setFilter({
            stocks: [
              ...(filter?.stocks ?? []),
              e.target.value as stock_product,
            ],
          });
        } else {
          // ketika unchecked
          setFilter({
            stocks: filter?.stocks?.filter((val) => val !== e.target.value),
          });
        }
        break;
      case "brand":
        if (e.target.checked) {
          // ketika checked
          setFilter({
            brands: [
              ...(filter?.brands ?? []),
              Number.parseInt(e.target.value),
            ],
          });
        } else {
          // ketika unchecked
          setFilter({
            brands: filter?.brands?.filter(
              (val) => val !== Number.parseInt(e.target.value)
            ),
          });
        }
        break;
      case "category":
        const isChecked = e.target.checked;

        setFilter({
          ...filter,
          categories: isChecked
            ? [...(filter?.categories ?? []), Number.parseInt(e.target.value)]
            : filter?.categories?.filter(
                (val) => val !== Number.parseInt(e.target.value)
              ),
        });
        break;
      case "location":
        if (e.target.checked) {
          // ketika checked
          setFilter({
            locations: [
              ...(filter?.locations ?? []),
              Number.parseInt(e.target.value),
            ],
          });
        } else {
          // ketika unchecked
          setFilter({
            locations: filter?.locations?.filter(
              (val) => val !== Number.parseInt(e.target.value)
            ),
          });
        }
        break;
    }
  };

  return (
    <label
      className="font-semibold flex items-center gap-3"
      htmlFor={id + value}
    >
      <input
        id={id + value}
        type="checkbox"
        value={id}
        onChange={onChange}
        className="w-6 h-6 flex shrink-0 appearance-none checked:border-[3px] checked:border-solid checked:border-white rounded-md checked:bg-[#0D5CD7] ring-1 ring-[#0D5CD7]"
      />
      <span>{value}</span>
    </label>
  );
}
