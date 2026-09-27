"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorScheme: "blue" | "teal" | "amber" | "rose" | "purple" | "emerald";
  badge?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = "blue",
  badge
}: StatCardProps) {
  const colorMap = {
    blue: {
      bg: "bg-blue-500/10 dark:bg-blue-500/10 border-blue-500/20",
      iconBg: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
      accent: "text-blue-600 dark:text-blue-400"
    },
    emerald: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-500/20",
      iconBg: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      accent: "text-emerald-600 dark:text-emerald-400"
    },
    teal: {
      bg: "bg-teal-500/10 dark:bg-teal-500/10 border-teal-500/20",
      iconBg: "bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30",
      accent: "text-teal-600 dark:text-teal-400"
    },
    amber: {
      bg: "bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/20",
      iconBg: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
      accent: "text-amber-600 dark:text-amber-400"
    },
    rose: {
      bg: "bg-rose-500/10 dark:bg-rose-500/10 border-rose-500/20",
      iconBg: "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30",
      accent: "text-rose-600 dark:text-rose-400"
    },
    purple: {
      bg: "bg-purple-500/10 dark:bg-purple-500/10 border-purple-500/20",
      iconBg: "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
      accent: "text-purple-600 dark:text-purple-400"
    }
  };

  const currentColors = colorMap[colorScheme] || colorMap.blue;

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${currentColors.bg} bg-white dark:bg-slate-900/80 backdrop-blur-md shadow-md dark:shadow-xl`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">{subtitle}</p>}
        </div>
        
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${currentColors.iconBg} shadow-md`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {badge && (
        <div className="mt-4 flex items-center">
          <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${currentColors.iconBg}`}>
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}
