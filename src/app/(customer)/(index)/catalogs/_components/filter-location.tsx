import { getLocations } from "@/app/(admin)/dashboard/(index)/locations/lib/data";
import React from "react";
import FilterCheckboxItem from "./filter-checkbox-item";

export default async function FilterLocation() {
  const locations = await getLocations();

  return (
    <div className="flex flex-col gap-[14px]">
      <p className="font-semibold leading-[22px]">Location</p>
      {locations.map((item) => {
        return (
          <FilterCheckboxItem
            key={`${item.id + item.name}`}
            id={item.id.toString()}
            value={item.name}
            type="location"
          />
        );
      })}
    </div>
  );
}
