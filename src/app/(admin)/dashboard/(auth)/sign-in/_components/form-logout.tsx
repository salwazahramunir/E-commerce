"use client";

import { ActionResult } from "@/types";
import { LogOut } from "lucide-react";
import React, { useActionState } from "react";
import { Logout } from "../lib/action";

const initialState: ActionResult = {
  error: "",
};

export default function FormLogout() {
  const [state, formAction] = useActionState(Logout, initialState);

  return (
    <form action={formAction}>
      <button className="flex items-center gap-2">
        <LogOut className="w-4 h-4" />
        Log out
      </button>
    </form>
  );
}
