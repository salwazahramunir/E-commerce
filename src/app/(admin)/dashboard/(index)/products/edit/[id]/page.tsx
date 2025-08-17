import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getBrands } from "../../../brands/lib/data";
import { getCategories } from "../../../categories/lib/data";
import { getLocations } from "../../../locations/lib/data";
import FormProduct from "../../_components/form-product";
import { Tparams } from "@/types";
import { getProductById } from "../../lib/data";
import { redirect } from "next/navigation";

interface EditPageProp {
  params: Promise<Tparams>;
}

export default async function EditProductPage({ params }: EditPageProp) {
  const { id } = await params;
  const data = await getProductById(id);

  if (!data) {
    return redirect("/dashboard/locations");
  }

  const brands = await getBrands();
  const categories = await getCategories();
  const locations = await getLocations();

  return (
    <FormProduct type="EDIT" data={data}>
      <div className="grid gap-3">
        <Label htmlFor="category" className="text-white">
          Category
        </Label>
        <Select name="category_id" defaultValue={data.category_id.toString()}>
          <SelectTrigger
            id="category_id"
            className="w-full bg-slate-800 border-slate-700 text-white"
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {categories?.map((category) => (
              <SelectItem key={category.id} value={`${category.id}`}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="brand" className="text-white">
          Brand
        </Label>
        <Select name="brand_id" defaultValue={data.brand_id.toString()}>
          <SelectTrigger
            id="brand"
            className="w-full bg-slate-800 border-slate-700 text-white"
          >
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {brands?.map((brand) => (
              <SelectItem key={brand.id} value={`${brand.id}`}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="location" className="text-white">
          Location
        </Label>
        <Select name="location_id" defaultValue={data.location_id.toString()}>
          <SelectTrigger
            id="location"
            className="w-full bg-slate-800 border-slate-700 text-white"
          >
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {locations?.map((location) => (
              <SelectItem key={location.id} value={`${location.id}`}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FormProduct>
  );
}
