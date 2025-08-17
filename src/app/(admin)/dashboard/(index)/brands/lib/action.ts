"use server";

import { schemaBrand } from "@/lib/schema";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../../lib/prisma";
import { deleteFile, uploadFile } from "@/lib/supabase";

export async function postBrand(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const validate = schemaBrand.safeParse({
    name: formData.get("name"),
    image: formData.get("image"),
  });

  if (!validate.success) {
    return {
      error: validate.error.errors[0].message,
    };
  }

  try {
    // upload image ke supabase
    const fileName = await uploadFile(validate.data.image, "brands");

    await prisma.brand.create({
      data: {
        name: validate.data.name,
        logo: fileName,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to insert data",
    };
  }

  return redirect("/dashboard/brands");
}

export async function updateBrand(
  _: unknown,
  formData: FormData,
  id: number | undefined
): Promise<ActionResult> {
  // ambil input file logo
  const fileUpload = formData.get("image") as File;

  const validate = schemaBrand
    .pick({
      // pick untuk ambil property yang akan diupdate, karena image boleh tidak diisi
      name: true,
    })
    .safeParse({
      name: formData.get("name"),
    });

  if (!validate.success) {
    return {
      error: validate.error.errors[0].message,
    };
  }

  // ambil data brand sesuai dengan id yang akan diupdate, pilih hanya mengembalikan logo saja
  const brand = await prisma.brand.findFirst({
    where: {
      id,
    },
    select: {
      logo: true,
    },
  });

  // variabel yang menampung nama file dari logo
  let fileName = brand?.logo;

  try {
    // jika user upload file/logo baru
    if (fileUpload.size > 0) {
      // upload file ke supabase dan re-assign variabel filename dengan nama file yang akan diupload
      fileName = await uploadFile(fileUpload, "brands");

      // delete file sebelumnya
      if (brand?.logo) {
        await deleteFile(brand.logo, "brands");
      }
    }

    await prisma.brand.update({
      where: {
        id,
      },
      data: {
        name: validate.data.name,
        logo: fileName,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to update data",
    };
  }

  return redirect("/dashboard/brands");
}

export async function deleteBrandById(
  _: unknown,
  formData: FormData,
  id: number
): Promise<ActionResult> {
  const brand = await prisma.brand.findFirst({
    where: {
      id,
    },
    select: {
      logo: true,
    },
  });

  if (!brand) {
    return {
      error: "Brand not found",
    };
  }

  try {
    await deleteFile(brand.logo, "brands");

    await prisma.brand.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to delete data",
    };
  }

  return redirect("/dashboard/brands");
}
