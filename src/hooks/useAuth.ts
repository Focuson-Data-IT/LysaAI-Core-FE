"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
    const { data: session, status } = useSession();

    console.log("📢 Session Data:", session);

    return {
        authUser: session?.user || null,
        isLoading: status === "loading",
        isAuthenticated: !!session,
        login: async () => {
            await signIn("credentials");
        },
        logout: async () => {
            await signOut();
        }
    };
}
