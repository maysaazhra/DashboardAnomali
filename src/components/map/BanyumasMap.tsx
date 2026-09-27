"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { MapPin, Eye, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { KecamatanStat } from "@/types/anomali";
import Link from "next/link";

export default function BanyumasMap() {
  const { kecamatanStats, setFilters, filters, setActiveKecamatanForMap } = useData();
  const [selectedKec, setSelectedKec] = useState<KecamatanStat | null>(null);

  const activeKecName = selectedKec ? selectedKec.nama_kecamatan : filters.selectedKecamatan;

  const handleSelectKecamatan = (stat: KecamatanStat) => {
    setSelectedKec(stat);
    setActiveKecamatanForMap(stat.nama_kecamatan);
  };

  const handleFilterKecamatanInTable = (namaKecamatan: string) => {
    setFilters(prev => ({ ...prev, selectedKecamatan: namaKecamatan }));
  };

  // Color mapping by real pending cases & % belum
  const getStatusBadge = (stat: KecamatanStat) => {
    if (stat.belum_ditindaklanjuti >= 150 || stat.persentase_belum >= 45) {
      return { 
        bg: "bg-rose-500", 
        text: "text-rose-600 dark:text-rose-400", 
        border: "border-rose-500/40", 
        label: "Beban Belum Selesai Tinggi" 
      };
    }
    if (stat.belum_ditindaklanjuti >= 50 || stat.persentase_belum >= 25) {
      return { 
        bg: "bg-amber-500", 
        text: "text-amber-600 dark:text-amber-400", 
        border: "border-amber-500/40", 
        label: "Beban Sedang" 
      };
    }
    return { 
      bg: "bg-emerald-500", 
      text: "text-emerald-600 dark:text-emerald-400", 
      border: "border-emerald-500/40", 
      label: "Terkendali" 
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Map Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-lg dark:shadow-xl transition-colors duration-300">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <span>Peta Sebaran Anomali 27 Kecamatan Kabupaten Banyumas</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Klik pada wilayah kecamatan untuk melihat profil anomali, masalah dominan, dan progress tindak lanjut FASIH
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs bg-slate-100 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">&gt;150 Belum Ditindaklanjuti</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">50–150 Kasus</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">&lt;50 Kasus (Terkendali)</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Geographical Map View */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 shadow-lg dark:shadow-xl relative min-h-[500px] flex flex-col justify-between transition-colors duration-300">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              Peta Wilayah 27 Kecamatan BPS Banyumas
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Kabupaten Banyumas, Jawa Tengah (Kode 33.02)
            </span>
          </div>

          {/* Interactive Region Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {kecamatanStats.map((stat) => {
              const badge = getStatusBadge(stat);
              const isSelected = activeKecName === stat.nama_kecamatan;

              return (
                <button
                  key={stat.kode_wilayah}
                  onClick={() => handleSelectKecamatan(stat)}
                  className={`group relative flex flex-col justify-between rounded-xl p-3 text-left border transition-all duration-200 ${
                    isSelected
                      ? "bg-slate-100 dark:bg-slate-800 border-cyan-500 ring-2 ring-cyan-500/40 shadow-lg"
                      : "bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{stat.kode_wilayah}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${badge.bg}`} />
                  </div>

                  <div className="mt-1.5">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition">
                      {stat.nama_kecamatan}
                    </h5>
                    
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5" title={stat.anomali_dominan}>
                      {stat.anomali_dominan}
                    </p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-rose-600 dark:text-rose-400 font-bold">Belum: {stat.belum_ditindaklanjuti}</span>
                    <span className="font-mono font-extrabold text-slate-900 dark:text-white">{stat.total_anomali}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            *Menampilkan seluruh 27 Kecamatan resmi BPS Kabupaten Banyumas.
          </p>
        </div>

        {/* Kecamatan Detail Sidebar Panel */}
        <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 shadow-lg dark:shadow-xl flex flex-col justify-between transition-colors duration-300">
          {selectedKec ? (
            <div className="space-y-4">
              
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">{selectedKec.kode_wilayah}</span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${getStatusBadge(selectedKec).border} ${getStatusBadge(selectedKec).text} bg-slate-100 dark:bg-slate-800`}>
                    {getStatusBadge(selectedKec).label}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Kecamatan {selectedKec.nama_kecamatan}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">{selectedKec.rekomendasi_tindak_lanjur}</p>
              </div>

              {/* Dominant Problem & Progress Rate */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Masalah Terbanyak:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedKec.anomali_dominan}</span>
                </div>
                <div>
                  <div className="flex justify-between text-slate-500 text-[11px] mb-1">
                    <span>Progress Verifikasi Selesai:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedKec.progress_penyelesaian}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${selectedKec.progress_penyelesaian}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Breakdown Card */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Status Progres Tindak Lanjut</span>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="h-3.5 w-3.5 text-rose-500" />
                      <span>Belum Ditindaklanjuti:</span>
                    </span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      {selectedKec.belum_ditindaklanjuti} ({selectedKec.persentase_belum}%)
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Sudah Diperbaiki:</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedKec.sudah_ditindaklanjuti}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                      <span>Dengan Penjelasan:</span>
                    </span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {selectedKec.dengan_penjelasan}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button to Table */}
              <div className="pt-2">
                <Link
                  href="/data"
                  onClick={() => handleFilterKecamatanInTable(selectedKec.nama_kecamatan)}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 px-4 text-xs font-bold shadow-md transition"
                >
                  <Eye className="h-4 w-4" />
                  <span>Buka Data Kec. {selectedKec.nama_kecamatan}</span>
                </Link>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
              <MapPin className="h-12 w-12 text-slate-400 dark:text-slate-600 animate-bounce" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pilih Kecamatan pada Peta</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Klik salah satu dari 27 kotak kecamatan di sebelah kiri untuk melihat rincian anomali data.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
