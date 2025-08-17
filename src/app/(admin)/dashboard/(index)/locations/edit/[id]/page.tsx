import React from "react";
import { getLocationById } from "../../lib/data";
import { redirect } from "next/navigation";
import FormLocation from "../../_components/form-location";
import { Tparams } from "@/types";

// tambahin async karena ingin akses params
export default async function EditLocationPage({
  params,
}: {
  params: Promise<Tparams>;
}) {
  const { id } = await params;
  const data = await getLocationById(id);

  if (!data) {
    return redirect("/dashboard/locations");
  }

  return <FormLocation type="EDIT" data={data} />;
}
