import { TFilter } from "@/hooks/useFilter";
import { Prisma } from "@prisma/client";
import prisma from "../../../../lib/prisma";
import { TProduct } from "@/types";
import { getImageURL } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const res = (await request.json()) as TFilter;

    // query url
    const ORQuery: Prisma.ProductWhereInput[] = [];
    const ANDQuery: Prisma.ProductWhereInput[] = [];

    // kalau res.search tidak kosong
    if (res.search && res.search !== "") {
      // masukkan parameter query where, nama mengandung data yang dicari
      ORQuery.push({
        name: {
          contains: res.search,
          mode: "insensitive",
        },
      });
    }

    // kalau res.minPrice tidak kosong dan lebih dari 0
    if (res.minPrice && res.minPrice > 0) {
      // masukkan parameter query where, price >= minPrice
      ANDQuery.push({
        price: {
          gte: res.minPrice,
        },
      });
    }

    // kalau res.maxPrice tidak kosong dan lebih dari 0
    if (res.maxPrice && res.maxPrice > 0) {
      // masukkan parameter query where, price <= maxPrice
      ANDQuery.push({
        price: {
          lte: res.maxPrice,
        },
      });
    }

    if (res.stocks && res.stocks.length > 0) {
      ORQuery.push({
        stock: {
          in: res.stocks,
        },
      });
    }

    if (res.brands && res.brands.length > 0) {
      ORQuery.push({
        brand: {
          id: {
            in: res.brands,
          },
        },
      });
    }

    if (res.categories && res.categories.length > 0) {
      ORQuery.push({
        category: {
          id: {
            in: res.categories,
          },
        },
      });
    }

    if (res.locations && res.locations.length > 0) {
      ORQuery.push({
        location: {
          id: {
            in: res.locations,
          },
        },
      });
    }

    const products = await prisma.product.findMany({
      where: {
        AND: ANDQuery.length > 0 ? ANDQuery : undefined,
        OR: ORQuery.length > 0 ? ORQuery : undefined,
      },
      select: {
        id: true,
        name: true,
        images: true,
        category: {
          select: {
            name: true,
          },
        },
        price: true,
      },
    });

    const response: TProduct[] = products.map((product) => {
      return {
        id: product.id,
        category_name: product.category.name,
        image_url: getImageURL(product.images[0], "products"),
        name: product.name,
        price: Number(product.price),
      };
    });

    return Response.json(response);
  } catch (error) {
    console.log(error);
    return Response.json({ status: false }, { status: 500 });
  }
}
