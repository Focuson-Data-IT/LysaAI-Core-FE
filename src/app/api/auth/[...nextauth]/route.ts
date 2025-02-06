import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

console.log("🔍 NextAuth API route is loaded.");

// Solusi yang terbukti berhasil
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
