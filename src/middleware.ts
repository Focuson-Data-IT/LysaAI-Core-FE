import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
});

// Izinkan NextAuth API
export const config = {
    matcher: ["/((?!api/auth).*)"], // Jangan blokir `api/auth`
};
