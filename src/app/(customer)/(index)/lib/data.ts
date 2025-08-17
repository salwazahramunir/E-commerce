import { getImageURL } from "@/lib/supabase";
import prisma from "../../../../../lib/prisma";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            product: true,
          },
        },
      },
    });

    return categories;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        images: true,
        name: true,
        category: {
          select: {
            name: true,
          },
        },
        price: true,
      },
    });

    const response = products.map((product) => {
      return {
        ...product,
        image_url: getImageURL(product.images[0], "products"),
      };
    });

    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        logo: true,
      },
    });

    const response = brands.map((item) => {
      return {
        ...item,
        logo_url: getImageURL(item.logo, "brands"),
      };
    });

    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
}
