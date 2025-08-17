import React from "react";
import { getCategoryById } from "../../lib/data";
import { redirect } from "next/navigation";
import FormCategory from "@/app/(admin)/dashboard/(index)/categories/_components/form-category";
import { Tparams } from "@/types";

// tambahin async karena ingin akses params
export default async function EditCategoryPage({
  params,
}: {
  params: Promise<Tparams>;
}) {
  const { id } = await params;
  const data = await getCategoryById(id);

  if (!data) {
    return redirect("/dashboard/categories");
  }

  return <FormCategory type="EDIT" data={data} />;
}
