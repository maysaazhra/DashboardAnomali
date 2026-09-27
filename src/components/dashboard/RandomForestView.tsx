"use client";

import React, { useState } from "react";
import {
  BrainCircuit,
  Sparkles,
  Award,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Flame,
  RefreshCw,
  GitFork,
  HelpCircle,
  Cpu,
  Layers,
  ShieldCheck,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Search,
  Check
} from "lucide-react";
import { SimulationInput, SimulationResult } from "@/types/randomForest";
import { RANDOM_FOREST_METRICS, PRESET_SCENARIOS } from "@/data/randomForestMetrics";
import { predictWithRandomForest, formatNumber, formatRupiah } from "@/utils/randomForestEngine";

export default function RandomForestView() {
  const metrics = RANDOM_FOREST_METRICS;

  // Simulator Form State with default initial values
  const [formData, setFormData] = useState<SimulationInput>(PRESET_SCENARIOS[0].data);
  const [activePresetId, setActivePresetId] = useState<string>("anomali-rasio");
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<SimulationResult | null>(() =>
    predictWithRandomForest(PRESET_SCENARIOS[0].data)
  );

  const handleInputChange = (field: keyof SimulationInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);

    setTimeout(() => {
      const res = predictWithRandomForest(formData);
      setPredictionResult(res);
      setIsPredicting(false);
    }, 350);
  };

  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_SCENARIOS.find((p) => p.id === presetId);
    if (found) {
      setActivePresetId(found.id);
      setFormData(found.data);
      setPredictionResult(predictWithRandomForest(found.data));
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* SECTION 1: Top Architecture & Metrics Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 h-48 w-48 rounded-full bg-blue-600/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Model Metadata */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
              <BrainCircuit className="h-4 w-4 text-cyan-400" />
              <span>Random Forest Supervised Ensemble Classifier</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Arsitektur & Evaluasi Model Sains Data
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Model klasifikasi anomali berbasis <strong>100 Decision Trees</strong> yang dilatih menggunakan kriteria pembagian <em>Gini Impurity & Entropy Split</em> pada <strong>15.563 data mikro</strong> Sensus Ekonomi BPS Banyumas, serta diuji independen pada <strong>3.891 sampel validasi</strong>.
            </p>

            {/* Hyperparameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm">
                <span className="block text-[11px] text-slate-400">Estimator Pohon</span>
                <span className="text-sm font-mono font-bold text-cyan-300">100 Trees</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm">
                <span className="block text-[11px] text-slate-400">Maks Kedalaman</span>
                <span className="text-sm font-mono font-bold text-cyan-300">Max Depth = 12</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm">
                <span className="block text-[11px] text-slate-400">Kriteria Split</span>
                <span className="text-sm font-mono font-bold text-cyan-300">Gini / Entropy</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm">
                <span className="block text-[11px] text-slate-400">Validasi Silang</span>
                <span className="text-sm font-mono font-bold text-cyan-300">10-Fold CV</span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Performance Metrics */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Metrik Evaluasi Data Uji (Testing Set)
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                  N = 3.891
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Accuracy */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 shadow-inner">
                  <span className="text-2xl font-black font-mono text-cyan-400">
                    {metrics.accuracy}%
                  </span>
                  <span className="block text-xs font-semibold text-slate-300 mt-0.5">
                    Akurasi Keseluruhan
                  </span>
                  <span className="text-[10px] text-slate-400">Tingkat ketepatan klasifikasi</span>
                </div>

                {/* Precision */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 shadow-inner">
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    {metrics.precision}%
                  </span>
                  <span className="block text-xs font-semibold text-slate-300 mt-0.5">
                    Precision
                  </span>
                  <span className="text-[10px] text-slate-400">Ketepatan deteksi anomali</span>
                </div>

                {/* Recall */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-500/30 shadow-inner">
                  <span className="text-2xl font-black font-mono text-blue-400">
                    {metrics.recall}%
                  </span>
                  <span className="block text-xs font-semibold text-slate-300 mt-0.5">
                    Recall / Sensitivitas
                  </span>
                  <span className="text-[10px] text-slate-400">Cakupan kasus tertangkap</span>
                </div>

                {/* F1-Score */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 shadow-inner">
                  <span className="text-2xl font-black font-mono text-amber-400">
                    {metrics.f1Score}%
                  </span>
                  <span className="block text-xs font-semibold text-slate-300 mt-0.5">
                    F1-Score
                  </span>
                  <span className="text-[10px] text-slate-400">Harmoni Precision & Recall</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Out-of-Bag (OOB) Score: <strong className="text-slate-200">{metrics.outOfBagScore}%</strong></span>
                <span>Dataset: <strong className="text-slate-200">1908 FASIH Banyumas</strong></span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: Feature Importance & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Feature Importance Column */}
        <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-cyan-500" />
                <span>Analisis Bobot Variabel (Feature Importance)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kontribusi relatif setiap variabel survei terhadap pohon keputusan klasifikasi
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              MDI Gini
            </span>
          </div>

          <div className="space-y-4 mt-5">
            {metrics.featureImportance.map((fi, idx) => (
              <div key={fi.feature} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center justify-center h-4 w-4 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-300">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {fi.feature}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {fi.weight}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${fi.weight * 2.8}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6 leading-tight">
                  {fi.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Confusion Matrix Column */}
        <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span>Confusion Matrix Validasi Model</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluasi silang antara label data aktual vs hasil prediksi Random Forest
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              3.891 Sampel Uji
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5 text-left font-bold text-slate-600 dark:text-slate-400">
                    Aktual \ Prediksi
                  </th>
                  <th className="p-2.5 font-bold">Valid Normal</th>
                  <th className="p-2.5 font-bold">Finansial</th>
                  <th className="p-2.5 font-bold">Disabilitas</th>
                  <th className="p-2.5 font-bold">Listrik/Aset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {metrics.confusionMatrix.matrix.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-2.5 text-left font-semibold bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {metrics.confusionMatrix.labels[rIdx]}
                    </td>
                    {row.map((val, cIdx) => {
                      const isDiagonal = rIdx === cIdx;
                      return (
                        <td
                          key={cIdx}
                          className={`p-2.5 font-mono ${
                            isDiagonal
                              ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30"
                              : "text-slate-400 dark:text-slate-500 text-[11px]"
                          }`}
                        >
                          <div>{formatNumber(val)}</div>
                          {isDiagonal && (
                            <span className="inline-block text-[9px] font-sans font-bold text-emerald-600 dark:text-emerald-400">
                              Benar
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Matrix Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500 shrink-0" />
                <span>Diagonal Sel: Klasifikasi Tepat (True Positives)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-400 shrink-0" />
                <span>Non-Diagonal: Kesalahan Klasifikasi (Type I / II Error &lt; 4%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 3: Live Interactive Inference Simulator */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        
        {/* Simulator Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Live Simulator Inferensi Random Forest
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Uji coba model secara langsung dengan menginputkan data mikro sensus baru untuk melihat evaluasi pohon keputusan ensemble
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
              Pilih Preset:
            </span>
            {PRESET_SCENARIOS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          
          {/* Left Form (7 Cols) */}
          <form onSubmit={handleRunSimulation} className="lg:col-span-7 space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nama Usaha / Responden Kepala Rumah Tangga:
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => handleInputChange("nama", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Kecamatan di Banyumas:
                </label>
                <select
                  value={formData.kecamatan}
                  onChange={(e) => handleInputChange("kecamatan", e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="PURWOKERTO TIMUR">PURWOKERTO TIMUR</option>
                  <option value="PURWOKERTO SELATAN">PURWOKERTO SELATAN</option>
                  <option value="PURWOKERTO UTARA">PURWOKERTO UTARA</option>
                  <option value="PURWOKERTO BARAT">PURWOKERTO BARAT</option>
                  <option value="CILONGOK">CILONGOK</option>
                  <option value="BANYUMAS">BANYUMAS</option>
                  <option value="AJIBARANG">AJIBARANG</option>
                  <option value="WANGON">WANGON</option>
                  <option value="SUMBANG">SUMBANG</option>
                  <option value="SOKARAJA">SOKARAJA</option>
                  <option value="PATIKRAJA">PATIKRAJA</option>
                  <option value="GUMELAR">GUMELAR</option>
                  <option value="KEMRANJEN">KEMRANJEN</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Desa / Kelurahan:
                </label>
                <input
                  type="text"
                  value={formData.desa}
                  onChange={(e) => handleInputChange("desa", e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Total Omzet / Pendapatan (Rp/Bln):
                </label>
                <input
                  type="number"
                  value={formData.pendapatan}
                  onChange={(e) => handleInputChange("pendapatan", Number(e.target.value))}
                  min={0}
                  step={50000}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-slate-500">{formatRupiah(formData.pendapatan)}</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Total Pengeluaran (Rp/Bln):
                </label>
                <input
                  type="number"
                  value={formData.pengeluaran}
                  onChange={(e) => handleInputChange("pengeluaran", Number(e.target.value))}
                  min={0}
                  step={50000}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-slate-500">{formatRupiah(formData.pengeluaran)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Daya Listrik Terpasang (VA):
                </label>
                <select
                  value={formData.dayaListrik}
                  onChange={(e) => handleInputChange("dayaListrik", Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value={450}>450 VA (Subsidi)</option>
                  <option value={900}>900 VA</option>
                  <option value={1300}>1.300 VA</option>
                  <option value={2200}>2.200 VA</option>
                  <option value={3500}>3.500 VA</option>
                  <option value={5500}>5.500 VA</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tagihan Listrik PLN (Rp/Bln):
                </label>
                <input
                  type="number"
                  value={formData.tagihanListrik}
                  onChange={(e) => handleInputChange("tagihanListrik", Number(e.target.value))}
                  min={0}
                  step={10000}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-slate-500">{formatRupiah(formData.tagihanListrik)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Jumlah ART:
                </label>
                <input
                  type="number"
                  value={formData.jmlArt}
                  onChange={(e) => handleInputChange("jmlArt", Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ART Disabilitas:
                </label>
                <input
                  type="number"
                  value={formData.jmlDisabilitas}
                  onChange={(e) => handleInputChange("jmlDisabilitas", Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ART Bekerja:
                </label>
                <input
                  type="number"
                  value={formData.jmlArtBekerja}
                  onChange={(e) => handleInputChange("jmlArtBekerja", Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Checkboxes Aset */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fasilitas Elektronik & Kepemilikan Aset:
              </label>
              <div className="flex flex-wrap gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.memilikiAc}
                    onChange={(e) => handleInputChange("memilikiAc", e.target.checked)}
                    className="h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>Memiliki AC Pendingin</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.memilikiLaptop}
                    onChange={(e) => handleInputChange("memilikiLaptop", e.target.checked)}
                    className="h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>Memiliki Laptop / Komputer</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.memilikiKulkas}
                    onChange={(e) => handleInputChange("memilikiKulkas", e.target.checked)}
                    className="h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>Memiliki Kulkas / Freezer</span>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isPredicting}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/25 transition duration-200 disabled:opacity-50"
            >
              {isPredicting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Mengevaluasi 100 Decision Trees...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Jalankan Prediksi Random Forest</span>
                </>
              )}
            </button>

          </form>

          {/* Right Result Column (5 Cols) */}
          <div className="lg:col-span-5">
            {predictionResult && (
              <div
                className={`rounded-2xl p-6 border transition-all duration-300 space-y-5 ${
                  predictionResult.isAnomaly
                    ? "bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30 dark:border-rose-500/40"
                    : "bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30 dark:border-emerald-500/40"
                }`}
              >
                {/* Result Status Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div
                    className={`inline-flex items-center space-x-1.5 font-black text-sm tracking-wide ${
                      predictionResult.isAnomaly
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {predictionResult.isAnomaly ? (
                      <>
                        <Flame className="h-5 w-5 animate-pulse text-rose-500" />
                        <span>TERDETEKSI ANOMALI</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <span>DATA VALID (NORMAL)</span>
                      </>
                    )}
                  </div>

                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">
                    Confidence: {(predictionResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Anomaly Category Title */}
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {predictionResult.anomalyType}
                  </h4>
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      RF Anomaly Score:
                    </span>
                    <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                      {predictionResult.rfScore} / 100
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      Tingkat Urgensi:
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 mt-0.5 rounded-lg text-xs font-bold ${
                        predictionResult.severity === "Tinggi"
                          ? "bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                          : predictionResult.severity === "Sedang"
                          ? "bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          : "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                      }`}
                    >
                      {predictionResult.severity}
                    </span>
                  </div>
                </div>

                {/* Triggered Rules & Decision Path (Explainable AI) */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <GitFork className="h-4 w-4 text-cyan-500" />
                    <span>Jalur Keputusan Pohon Ensemble (Explainable AI):</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pl-1">
                    {predictionResult.decisionTreePath.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5" />
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendation */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800 dark:text-amber-200">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span>SOP Rekomendasi Petugas Lapangan BPS:</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-amber-300/90">
                    {predictionResult.recommendation}
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
