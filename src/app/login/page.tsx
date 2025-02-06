"use client";

import { useState, useEffect } from "react";
import { signIn, useSession} from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            // Redirect berdasarkan role
            const role = session?.user?.role;
            if (role === "admin") {
                router.push("/pageAdmin/home");
            } else {
                router.push("/pageClient/home");
            }
        }
    }, [session, status, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false, // Hindari redirect otomatis NextAuth
        });

        if (result?.error) {
            alert("Login gagal! Periksa email dan password.");
        } else {
            // Ambil role dari response backend atau localStorage
            const role = session?.user?.role || localStorage.getItem("role");

            // Redirect berdasarkan role
            if (role === "admin") {
                router.push("/pageAdmin/home");
            } else {
                router.push("/pageClient/home");
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex justify-center mb-6">
                    <img className="h-12" src="/logo_horizontal_d.svg" alt="logo" />
                </div>
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
                    Hatch Your Idea
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
                    With Idea Generator V2.0 get daily fresh idea and monitor your competitors
                </p>
            </div>
        </div>
    );
}
