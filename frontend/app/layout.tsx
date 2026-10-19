import type { Metadata } from "next";
import "@/styles/globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
  title: "Hotel Guest Check-In Assistant",
  description: "AI-powered self-service hotel check-in",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <LanguageProvider>
          <main className="mx-auto max-w-2xl px-4 py-10">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
