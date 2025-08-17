import { getImageURL } from "@/lib/supabase";
import prisma from "../../../../../../../lib/prisma";
import { TColumn } from "../columns";

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        OrderProduct: {
          include: {
            product: true,
          },
        },
      },
    });

    const response: TColumn[] = orders.map((order) => {
      return {
        id: order.id,
        products: order.OrderProduct?.map((item) => {
          return {
            name: item.product.name,
            image: getImageURL(item.product.images[0]),
          };
        }),
        customer_name: order.user.name,
        price: Number(order.total),
        status: order.status,
      };
    });

    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
}
