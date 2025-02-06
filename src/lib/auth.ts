import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import fs from "fs";
import path from "path";

// Perluas tipe dari NextAuth agar TypeScript mengenali `id` dan `role`
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }
    interface User {
        id: string;
        name: string;
        email: string;
        password?: string;
        role: string;
    }
    interface JWT {
        id?: string;
        name?: string;
        email?: string;
        role?: string;
    }
}

// Fungsi untuk membaca user dari JSON file
function getUsers() {
    const filePath = path.join(process.cwd(), "src/data/user.json");

    if (!fs.existsSync(filePath)) {
        console.error("❌ File user.json tidak ditemukan!");
        return [];
    }

    try {
        const jsonData = fs.readFileSync(filePath, "utf-8");
        const users = JSON.parse(jsonData);
        console.log("📌 Loaded users from JSON:", users); // Debug apakah data terbaca
        return users;
    } catch (error) {
        console.error("❌ Error parsing user.json:", error);
        return [];
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("🔍 Attempting login with:", credentials);
            
                if (!credentials?.email || !credentials?.password) {
                    console.log("⚠️ Missing credentials:", credentials);
                    throw new Error("Email dan password wajib diisi.");
                }
            
                // Ambil daftar user dari JSON
                const users = getUsers();
                if (!users.length) {
                    console.error("❌ Tidak ada user yang ditemukan di user.json!");
                    throw new Error("Terjadi kesalahan, coba lagi nanti.");
                }
            
                // Cek apakah user ada di database JSON
                const user = users.find(
                    (u: { email: string; password: string }) =>
                        u.email === credentials.email && u.password === credentials.password
                );
            
                console.log("🔍 Checking user:", user ? "✅ User ditemukan" : "❌ User tidak ditemukan");
            
                if (!user) {
                    console.warn("❌ Email atau password salah:", credentials.email);
                    throw new Error("Email atau password salah.");
                }
            
                console.log("✅ Login berhasil:", user.email);
            
                // Kembalikan user tanpa password
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            }                      
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            console.log("🔄 JWT Callback Running");
            
            if (user) {
                console.log("✅ User found in jwt callback:", user);
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.role = user.role;
            } else {
                console.log("⚠️ No user found in jwt callback");
            }
            
            console.log("🆔 Final Token:", token);
            return token;
        },
        async session({ session, token }) {
            console.log("🔄 Session Callback Running");
            
            if (!session.user) {
                console.warn("⚠️ session.user tidak ada, membuat default object");
                session.user = {} as unknown as {
                    id: string;
                    name: string;
                    email: string;
                    role: string;
                };
            }
        
            if (token.id) {
                console.log("✅ Token ditemukan, mengisi session.user");
                Object.assign(session.user, {
                    id: token.id,
                    name: token.name || "",
                    email: token.email || "",
                    role: token.role || "",
                });
            }
        
            console.log("📌 Final Session:", session);
            return session;
        }                
    }
};
