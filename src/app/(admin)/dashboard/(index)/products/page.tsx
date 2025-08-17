import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle } from "lucide-react";
import React from "react";
import Link from "next/link";
import { column } from "./columns";
import { getProducts } from "./lib/data";

export default async function ProductPage() {
  const products = await getProducts();

  return (
    <div className="space-y-4">
      <div className="text-right">
        <Button variant="default" size="sm" className="h-8 gap-1" asChild>
          <Link href="/dashboard/products/create">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your products</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={column} data={products} />
        </CardContent>
      </Card>
    </div>
  );
}
