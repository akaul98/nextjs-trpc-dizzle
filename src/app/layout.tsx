import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "./providers/trpcProvider";
import { User } from "lucide-react";
import { UserProvider } from "./contexts/users/userContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          <UserProvider> {children}</UserProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
