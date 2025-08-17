"use client";

import React, { ReactNode, useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { useFormStatus } from "react-dom";
import { ActionResult } from "@/types";
import { Product } from "@prisma/client";
import UploadImages from "./upload-images";
import { postProduct, updateProduct } from "../lib/action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: ActionResult = {
  error: "",
};

interface FormProductProps {
  type?: "ADD" | "EDIT";
  data?: Product | null;
  children: ReactNode;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Loading..." : "Save Product"}
    </Button>
  );
}

export default function FormProduct({
  type = "ADD",
  data = null,
  children,
}: FormProductProps) {
  const updateProductWithId = (_: unknown, formData: FormData) =>
    updateProduct(_, formData, data?.id ?? 0);

  const [state, formAction] = useActionState(
    type === "ADD" ? postProduct : updateProductWithId,
    initialState
  );

  return (
    <form action={formAction} autoComplete="off">
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid flex-1 auto-rows-max gap-4">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-slate-700 bg-slate-800 hover:bg-slate-700"
                asChild
              >
                <Link href="/dashboard/products">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Form Product
              </h1>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800 hover:bg-slate-700"
                >
                  Discard
                </Button>
                <SubmitButton />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-[1fr_300px] lg:gap-8">
              {/* Left Column */}
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                {/* Product Details Card */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Product Details
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Lipsum dolor sit amet, consectetur adipiscing elit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {state.error !== "" && (
                      <Alert variant="destructive" className="mb-5">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name" className="text-white">
                          Name
                        </Label>
                        <Input
                          name="name"
                          id="name"
                          type="text"
                          className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                          defaultValue={data?.name}
                          autoFocus
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description" className="text-white">
                          Description
                        </Label>
                        <Textarea
                          name="description"
                          id="description"
                          className="min-h-[120px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                          defaultValue={data?.description}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="price" className="text-white">
                          Price
                        </Label>
                        <Input
                          name="price"
                          id="price"
                          type="number"
                          className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                          defaultValue={Number(data?.price ?? 0)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Category Card */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Product Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">{children}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                {/* Product Status Card */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Product Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <Label className="text-white">Status</Label>
                      <Select name="stock" defaultValue={data?.stock}>
                        <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="preorder">Pre-Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Images Card */}
                <UploadImages images={data ? data.images : []} />
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-800 hover:bg-slate-700"
              >
                Discard
              </Button>
              <SubmitButton />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
