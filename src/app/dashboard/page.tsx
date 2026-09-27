"use client";

import React from "react";
import AnomalyCharts from "@/components/dashboard/AnomalyCharts";
import { useData } from "@/context/DataContext";
import { BarChart3, Clock, CheckCircle2, Layers, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { summaryStats } = useData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-cyan-400" />
            <span>Dashboard Analisis & Visualisasi Grafik</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analisis komparatif 27 Kecamatan, pola ketidakwajaran omzet, keparahan risiko, dan sebaran anomali usaha FASIH SE2026
          </p>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
            <Layers className="h-3.5 w-3.5 text-blue-400" />
            <span>Total: <strong>{summaryStats.totalRecords.toLocaleString("id-ID")}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Clock className="h-3.5 w-3.5" />
            <span>Belum: <strong>{summaryStats.totalBelumDitindaklanjuti.toLocaleString("id-ID")} ({summaryStats.persentaseBelum}%)</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Selesai: <strong>{summaryStats.totalSudahDitindaklanjuti + summaryStats.totalDenganPenjelasan} ({summaryStats.persentaseSudah}%)</strong></span>
          </div>
        </div>
      </div>

      {/* Main Charts Component */}
      <AnomalyCharts />
    </div>
  );
}
