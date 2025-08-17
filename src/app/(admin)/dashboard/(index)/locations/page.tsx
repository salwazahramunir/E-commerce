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
import { columns } from "./columns";
import { getLocations } from "./lib/data";

// ubah jadi async function (server component)
export default async function LocationPage() {
  const data = await getLocations();

  return (
    <div className="space-y-4">
      <div className="text-right">
        <Button variant="default" size="sm" className="h-8 gap-1" asChild>
          <Link href="/dashboard/locations/create">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Location
            </span>
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
          <CardDescription>Manage your locations</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
