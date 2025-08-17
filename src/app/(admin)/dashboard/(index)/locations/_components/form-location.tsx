"use client";

import React, { useActionState } from "react";
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
import { AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ActionResult } from "@/types";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../../../../components/ui/alert";
import { useFormStatus } from "react-dom";
import { Location } from "@prisma/client";
import { postLocation, updateLocation } from "../lib/action";

const initialState: ActionResult = {
  error: "",
};

interface FormLocationProps {
  type?: "ADD" | "EDIT";
  data?: Location | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Loading..." : "Save Location"}
    </Button>
  );
}

export default function FormLocation({
  type = "ADD",
  data = null,
}: FormLocationProps) {
  const updateLocationWithId = (_: unknown, formData: FormData) =>
    updateLocation(_, formData, Number(data?.id));

  // ketika update menggunakan function updateLocationWithId karena action form di useActionState hanya nerima 2 parameter, sedangkan updateLocation ada 3 parameter
  const [state, formAction] = useActionState(
    type === "ADD" ? postLocation : updateLocationWithId,
    initialState
  );
  return (
    <form action={formAction} autoComplete="off">
      <div className="space-y-4 lg:mx-40">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/dashboard/locations">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Form Location
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <SubmitButton />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              Form {type === "ADD" ? "Add" : "Edit"} Location
            </CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.error !== "" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  className="w-full"
                  defaultValue={data?.name}
                  autoFocus
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
