import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

// webhook
export async function POST(request: Request) {
  const body = await request.json();

  const code = body.data.reference_id;

  try {
    await prisma.order.update({
      where: {
        code,
      },
      data: {
        status: body.data.status === "SUCCEEDED" ? "success" : "failed",
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ status: true });
  }
}
