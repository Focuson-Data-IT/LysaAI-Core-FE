"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Jangan lakukan redirect saat masih loading
    if (!session) {
      router.replace("/login"); // Jika belum login, arahkan ke halaman login
      return;
    }

    // Cek role user dan redirect sesuai role
    const userRole = session?.user?.role; // Pastikan `session.user.role` ada
    if (userRole === "admin") {
      router.replace("/pageAdmin/home");
    } else {
      router.replace("/pageClient/home");
    }
  }, [session, status, router]);

  return null; // Tidak perlu render apapun karena langsung redirect
}
