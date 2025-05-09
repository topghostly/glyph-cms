import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";

import "../globals.css";
import { UserProvider } from "@/store/user-store";

export const metadata: Metadata = {
  title: "Editor • Manage all blogs here",
  description:
    "Manage your blog posts efficiently with an intuitive interface. Search through titles, add new posts, edit existing ones, and delete outdated content with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
