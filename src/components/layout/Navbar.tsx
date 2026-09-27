"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Map, 
  Table, 
  FileText, 
  LayoutDashboard, 
  Upload, 
  RefreshCw, 
  AlertTriangle,
  Building2,
  Sun,
  Moon,
  BrainCircuit
} from "lucide-react";
import { useData } from "@/context/DataContext";
import FileUploadModal from "../dashboard/FileUploadModal";

export default function Navbar() {
  const pathname = usePathname();
  const { summaryStats, isCustomDataLoaded, resetToDefaultData, theme, toggleTheme } = useData();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Ringkasan", icon: LayoutDashboard },
    { href: "/dashboard", label: "Dashboard Analisis", icon: BarChart3 },
    { href: "/random-forest", label: "Model Random Forest", icon: BrainCircuit },
    { href: "/pemetaan", label: "Peta Sebaran", icon: Map },
    { href: "/data", label: "Tabel Anomali", icon: Table },
    { href: "/laporan", label: "Matriks Laporan", icon: FileText },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-white shadow-sm dark:shadow-xl transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-2 sm:gap-4">
          
          {/* Brand Header Top-Left with Official BPS Banyumas & Sensus Ekonomi 2026 Logos */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 group">
            {/* Logo BPS Kabupaten Banyumas */}
            <div className="flex items-center h-10 px-2 py-1 rounded-xl bg-[#0f244a] border border-blue-900/60 shadow-md transition group-hover:opacity-95">
              <img 
                src="/images/logo_bps_banyumas.png" 
                alt="Badan Pusat Statistik Kabupaten Banyumas" 
                className="h-7 w-auto object-contain"
              />
            </div>

            {/* Subtle Divider */}
            <div className="h-7 w-[1.5px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            {/* Logo Sensus Ekonomi 2026 */}
            <div className="flex items-center h-10 px-2 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition group-hover:opacity-95">
              <img 
                src="/images/logo_se2026.png" 
                alt="Sensus Ekonomi 2026" 
                className="h-8 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700/80">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white shadow-sm shadow-cyan-500/30"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Theme Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition duration-200 shadow-sm"
              title={theme === "dark" ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400 animate-pulse" />
              ) : (
                <Moon className="h-4 w-4 text-cyan-600" />
              )}
            </button>

            {/* Anomaly Badge counter */}
            <div className="hidden sm:flex items-center space-x-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1.5 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold whitespace-nowrap">
              <AlertTriangle className="h-3.5 w-3.5 animate-pulse text-amber-600 dark:text-amber-400" />
              <span>{summaryStats.totalAnomali} Anomali</span>
            </div>

            {/* Upload Dataset Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center space-x-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold shadow-md shadow-emerald-900/30 transition whitespace-nowrap"
            >
              <Upload className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Unggah Data</span>
            </button>

            {/* Reset dataset button */}
            {isCustomDataLoaded && (
              <button
                onClick={resetToDefaultData}
                title="Kembalikan ke dataset BPS acuan"
                className="flex items-center space-x-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">Reset</span>
              </button>
            )}
          </div>

        </div>

      </header>

      {/* File Upload Modal Component */}

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </>
  );
}
