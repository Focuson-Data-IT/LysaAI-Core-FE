"use client";

import { SessionProvider, useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import "@/app/globals.css";
import OurLoading from "@/components/OurLoading";

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
    return <OurLoading />; // FIXED: Menjadikannya JSX valid
  }

  return session ? <Layout>{children}</Layout> : <>{children}</>;
}
