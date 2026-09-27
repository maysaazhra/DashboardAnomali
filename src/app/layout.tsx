import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard Analisis Anomali Data Usaha SE2026 - BPS Kabupaten Banyumas",
  description: "Dashboard interaktif analisis pola ketidakwajaran, sebaran wilayah 27 kecamatan, dan rekomendasi prioritas verifikasi data Sensus Ekonomi 2026 BPS Kabupaten Banyumas.",
  keywords: ["BPS", "Banyumas", "SE2026", "Anomali Data Usaha", "Sensus Ekonomi 2026", "Pemutakhiran Data"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased flex flex-col transition-colors duration-300`}>
        <DataProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
        </DataProvider>
      </body>
    </html>
  );
}

