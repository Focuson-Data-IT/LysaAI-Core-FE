"use client";

import "@/app/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <title>Monitoring</title>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body className="bg-gray-100 dark:bg-gray-900">
            {children}
        </body>
        </html>
    );
}