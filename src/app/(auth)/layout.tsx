import { ReactNode } from "react";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Authentication | ProjecTree",
  description: "Sign up, sign in, and manage your account",
};

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await auth.api.getSession({
    headers: await headers(),
  });
  if (user) {
    return redirect("/home");
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col justify-center items-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">ProjecTree</h1>
        <p className="text-gray-600 mt-2">Authentication</p>
      </header>
      <main className="">{children}</main>
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Your App Name. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
