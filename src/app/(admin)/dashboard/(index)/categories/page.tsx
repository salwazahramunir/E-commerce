import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { getCategories } from "./lib/data";
import { columns } from "./columns";

// ubah jadi async function (server component)
export default async function CategoryPage() {
  const data = await getCategories();

  return (
    <div className="space-y-4">
      <div className="text-right">
        <Button variant="default" size="sm" className="h-8 gap-1" asChild>
          <Link href="/dashboard/categories/create">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Category
            </span>
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage your categories and view and view their sales performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
