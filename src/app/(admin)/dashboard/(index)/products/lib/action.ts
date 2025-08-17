"use server";

import { schemaProduct, schemaProductEdit } from "@/lib/schema";
import { deleteFile, uploadFile } from "@/lib/supabase";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../../lib/prisma";
import { stock_product } from "@prisma/client";
import { error } from "console";

export async function postProduct(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const parse = schemaProduct.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    images: formData.getAll("images"), // getAll karena yang diambil banyak
    brand_id: formData.get("brand_id"),
    category_id: formData.get("category_id"),
    location_id: formData.get("location_id"),
  });

  if (!parse.success) {
    return {
      error: parse.error.errors[0].message,
    };
  }

  const uploaded_images = parse.data.images as File[];
  const file_names = [];

  for (const image of uploaded_images) {
    const filename = await uploadFile(image, "products");
    file_names.push(filename);
  }

  try {
    await prisma.product.create({
      data: {
        name: parse.data.name,
        description: parse.data.description,
        price: Number.parseInt(parse.data.price),
        stock: parse.data.stock as stock_product,
        images: file_names,
        brand_id: Number.parseInt(parse.data.brand_id),
        category_id: Number.parseInt(parse.data.category_id),
        location_id: Number.parseInt(parse.data.location_id),
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to insert data product",
    };
  }

  return redirect("/dashboard/products");
}

export async function updateProduct(
  _: unknown,
  formData: FormData,
  id: number
): Promise<ActionResult> {
  const parse = schemaProductEdit.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    brand_id: formData.get("brand_id"),
    category_id: formData.get("category_id"),
    location_id: formData.get("location_id"),
    id,
  });

  if (!parse.success) {
    return {
      error: parse.error.errors[0].message,
    };
  }

  const product = await prisma.product.findFirst({
    where: {
      id,
    },
  });

  if (!product) {
    return {
      error: "Product not found",
    };
  }

  try {
    const uploaded_images = formData.getAll("images") as File[];
    let file_names = [];

    if (uploaded_images.length === 3) {
      const parseImages = schemaProduct.pick({ images: true }).safeParse({
        images: uploaded_images,
      });

      if (!parseImages.success) {
        return {
          error: parseImages.error.errors[0].message,
        };
      }

      // menambahkan gambar product yang baru
      for (const image of uploaded_images) {
        const filename = await uploadFile(image, "products");
        file_names.push(filename);
      }

      // hapus gambar product yang lama
      for (const image of product.images) {
        await deleteFile(image, "products");
      }
    } else {
      file_names = product.images;
    }

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        name: parse.data.name,
        description: parse.data.description,
        price: Number.parseInt(parse.data.price),
        stock: parse.data.stock as stock_product,
        images: file_names,
        brand_id: Number.parseInt(parse.data.brand_id),
        category_id: Number.parseInt(parse.data.category_id),
        location_id: Number.parseInt(parse.data.location_id),
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to update data",
    };
  }

  return redirect("/dashboard/products");
}

export async function deleteProductById(
  _: unknown,
  formData: FormData,
  id: number
): Promise<ActionResult> {
  const product = await prisma.product.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      images: true,
    },
  });

  if (!product) {
    return {
      error: "Product not found",
    };
  }

  try {
    for (const image of product.images) {
      await deleteFile(image, "products");
    }

    await prisma.product.delete({
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

  return redirect("/dashboard/products");
}
