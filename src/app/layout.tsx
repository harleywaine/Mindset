import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meditation App",
  description: "A meditation app for mental wellness",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[#1A1D1F] text-white`}>
        <ClientProviders>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
