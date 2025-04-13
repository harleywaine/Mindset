import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import ClientProviders from "@/components/providers/ClientProviders";

const ubuntu = Ubuntu({ 
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Meditation App",
  description: "A meditation app for emotional control and visualization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${ubuntu.className} min-h-full flex flex-col text-white`} style={{ background: 'linear-gradient(352deg, #181D21 33.1%, #1F1F1F 107.84%)' }}>
        <ClientProviders>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
