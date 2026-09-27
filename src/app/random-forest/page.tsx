"use client";

import React from "react";
import RandomForestView from "@/components/dashboard/RandomForestView";
import { useData } from "@/context/DataContext";
import { BrainCircuit, Cpu, Sparkles, CheckCircle2, Award } from "lucide-react";
import { RANDOM_FOREST_METRICS } from "@/data/randomForestMetrics";

export default function RandomForestPage() {
  const { summaryStats } = useData();

  return (
    <div className="space-y-6">
      {/* Page Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-cyan-400" />
            <span>Model Klasifikasi Random Forest & Sains Data</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Implementasi Machine Learning Supervised Ensemble 100 Decision Trees untuk deteksi anomali data sensus BPS Banyumas
          </p>
        </div>

        {/* Quick Metrics Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Akurasi: <strong>{RANDOM_FOREST_METRICS.accuracy}%</strong></span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>F1-Score: <strong>{RANDOM_FOREST_METRICS.f1Score}%</strong></span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Pohon: <strong>100 Trees</strong></span>
          </div>
        </div>
      </div>

      {/* Main Random Forest View Component */}
      <RandomForestView />
    </div>
  );
}
