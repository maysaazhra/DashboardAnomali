"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  Map, 
  Table, 
  FileText,
  AlertTriangle,
  BrainCircuit
} from "lucide-react";
import { useData } from "@/context/DataContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { summaryStats } = useData();

  const navLinks = [
    { href: "/", label: "Ringkasan", icon: LayoutDashboard },
    { href: "/dashboard", label: "Analisis", icon: BarChart3 },
    { href: "/random-forest", label: "Model AI", icon: BrainCircuit },
    { href: "/pemetaan", label: "Peta", icon: Map },
    { href: "/data", label: "Anomali", icon: Table, badge: summaryStats.totalAnomali },
    { href: "/laporan", label: "Laporan", icon: FileText },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-2xl transition-colors duration-300">
      <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-cyan-600 dark:text-cyan-400 font-bold scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-cyan-600 dark:bg-cyan-400 rounded-full animate-pulse" />
              )}
              
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? "text-cyan-600 dark:text-cyan-400" : ""}`} />
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-white shadow-sm">
                    {link.badge > 99 ? "99+" : link.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
