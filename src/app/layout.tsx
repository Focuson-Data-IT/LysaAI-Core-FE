"use client";

import { SessionProvider, useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import "@/app/globals.css";
import Image from "next/image";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>
          <AuthWrapper>{children}</AuthWrapper>
        </body>
      </html>
    </SessionProvider>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center justify-center w-full h-full">
          <Image
            src="/logo-focus-on-d.png" 
            alt="Loading" 
            width={500}
            height={500}
          />
        </div>
      </div>
    );
  }

  return session ? <Layout>{children}</Layout> : <>{children}</>;
}