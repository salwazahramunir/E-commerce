"use client";
import { FC, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface LayoutProps {
  children: ReactNode;
}

// Create a client
const queryClient = new QueryClient();

const layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* Provide the client to your App */}
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
};

export default layout;
