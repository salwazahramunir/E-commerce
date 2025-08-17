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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ActionResult } from "@/types";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { SignIn } from "../lib/action";

const initialState: ActionResult = {
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full primary" disabled={pending}>
      {pending ? "Loading..." : "Sign in"}
    </Button>
  );
}

export default function FormSignIn() {
  const [state, formAction] = useActionState(SignIn, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
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
        <form autoComplete="off" action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="m@example.com"
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input name="password" id="password" type="password" />
            </div>
            <div className="flex flex-col gap-3">
              <SubmitButton />
              {/* <Button variant="outline" className="w-full">
                Login with Google
              </Button> */}
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Sign up
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/*
  CATATAN
  =======
  1. useActionState => hook React untuk menjalankan server action saat form disubmit dan menyimpan hasilnya sebagai state tanpa perlu useState atau useEffect.

  2. Kenapa <form action={formAction}> tidak langsung pakai loginAction? 
  Karena loginAction itu adalah server function. Sedangkan <form action=...> butuh fungsi khusus yang bisa dijalankan di client untuk:
    - Mengirim form data ke server
    - Menjalankan loginAction di server
    - Menerima hasil dan update state di client
  Intinya, Karena loginAction adalah server-only function (ada 'use server'), dia tidak bisa di-assign langsung ke form.

  3. useFormStatus => React hook dari Next.js (khususnya Next.js App Router) yang digunakan untuk mengetahui status pengiriman form (submit) saat menggunakan Server Actions.

  REFERENSI
  =========
  https://react.dev/reference/react-dom/hooks/useFormStatus

*/
//
