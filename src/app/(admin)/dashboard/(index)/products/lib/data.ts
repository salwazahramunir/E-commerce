import prisma from "../../../../../../../lib/prisma";
import { TColumm } from "../columns";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        _count: {
          select: {
            OrderProduct: true,
          },
        },
        name: true,
        price: true,
        stock: true,
        category: {
          select: {
            name: true,
          },
        },
        brand: {
          select: {
            name: true,
          },
        },
        location: {
          select: {
            name: true,
          },
        },
        images: true,
        createdAt: true,
      },
    });

    const response_products: TColumm[] = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        image_url: product.images[0],
        category_name: product.category.name,
        brand_name: product.brand.name,
        price: Number(product.price),
        total_sales: product._count.OrderProduct,
        stock: product.stock,
        createdAt: product.createdAt,
      };
    });

    return response_products;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    });

    return product;
  } catch (error) {
    console.log(error);
    return null;
  }
}
