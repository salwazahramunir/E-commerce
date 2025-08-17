"use client";

import { ActionResult } from "@/types";
import Image from "next/image";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { SignIn } from "../lib/actions";

const initialState: ActionResult = {
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="p-[12px_24px] bg-[#0D5CD7] rounded-full text-center font-semibold text-white"
      disabled={pending}
    >
      {pending ? "Loading..." : "Sign In to My Account"}
    </button>
  );
}

export default function SignInPage() {
  const [state, formAction] = useActionState(SignIn, initialState);

  return (
    <div
      id="signin"
      className="bg-[#EFF3FA] min-h-screen pt-[30px] pb-[50px] flex flex-col"
    >
      <div className="container max-w-[1130px] mx-auto flex flex-1 items-center justify-center py-5">
        <form
          action={formAction}
          className="w-[500px] bg-white p-[50px_30px] flex flex-col gap-5 rounded-3xl border border-[#E5E5E5]"
          autoComplete="off"
        >
          <div className="flex justify-center">
            <Image
              src="./assets/logos/logo-black.svg"
              alt="logo"
              width={150}
              height={150}
            ></Image>
          </div>
          <h1 className="font-bold text-2xl leading-[34px]">Sign In</h1>

          {state.error !== "" && (
            <div className="border border-red-300 text-red-500 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <h4 className="font-semibold">Error</h4>
              </div>
              <p className="text-sm mt-1 mx-6">{state.error}</p>
            </div>
          )}

          <div className="flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300">
            <div className="flex shrink-0">
              <Image
                src="./assets/icons/sms.svg"
                alt="icon"
                width={25}
                height={25}
              ></Image>
            </div>
            <input
              type="email"
              id="email"
              name="email"
              className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
              placeholder="Write your email address"
              autoFocus
            ></input>
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300">
              <div className="flex shrink-0">
                <Image
                  src="./assets/icons/lock.svg"
                  alt="icon"
                  width={25}
                  height={25}
                ></Image>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
                placeholder="Write your password"
              ></input>
              {/* <button type="button" className="reveal-password flex shrink-0">
                <Image
                  src="./assets/icons/eye.svg"
                  alt="icon"
                  width={25}
                  height={25}
                ></Image>
              </button> */}
            </div>
            {/* <a
              href=""
              className="text-sm text-[#616369] underline w-fit mr-0 ml-auto"
            >
              Forgot Password
            </a> */}
          </div>
          <div className="flex flex-col gap-3">
            <SubmitButton />
            <Link
              href="/sign-up"
              className="p-[12px_24px] bg-white rounded-full text-center font-semibold border border-[#E5E5E5]"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
