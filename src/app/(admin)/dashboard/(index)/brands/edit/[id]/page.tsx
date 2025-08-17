import React from "react";
import FormBrand from "../../_components/form-brand";
import { getBrandById } from "../../lib/data";
import { redirect } from "next/navigation";
import { Tparams } from "@/types";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<Tparams>;
}) {
  const { id } = await params;
  const brand = await getBrandById(id);

  if (!brand) {
    return redirect("/dashboard/brands");
  }

  return <FormBrand type="EDIT" data={brand} />;
}
