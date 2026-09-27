"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import StatCard from "@/components/dashboard/StatCard";
import { 
  Clock, 
  CheckCircle2, 
  Map, 
  BarChart3, 
  Table, 
  FileText, 
  Upload, 
  ArrowRight,
  Sparkles,
  Layers,
  Workflow,
  AlertTriangle,
  MapPin,
  ShieldAlert,
  ChevronRight,
  User,
  BrainCircuit
} from "lucide-react";
import FileUploadModal from "@/components/dashboard/FileUploadModal";
import BusinessDetailModal from "@/components/data/BusinessDetailModal";
import { BpsFasihRecord } from "@/types/anomali";

export default function OverviewPage() {
  const { 
    summaryStats, 
    kecamatanStats, 
    records, 
    isCustomDataLoaded, 
    setActiveRecordForModal,
    activeRecordForModal
  } = useData();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Top 5 Kecamatan with highest pending anomalies
  const topKecamatanPending = [...kecamatanStats]
    .sort((a, b) => b.belum_ditindaklanjuti - a.belum_ditindaklanjuti)
    .slice(0, 5);

  // High priority urgent records (Belum ditindaklanjuti)
  const urgentRecords: BpsFasihRecord[] = records
    .filter(r => r.tindak_lanjut === "Belum Ditindaklanjuti")
    .slice(0, 5);

  return (
    <div className="space-y-8 pb-8">
      
      {/* Live System Alert Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-slate-900 dark:text-amber-200">
              Perhatian: {summaryStats.totalBelumDitindaklanjuti.toLocaleString("id-ID")} Kasus Anomali ({summaryStats.persentaseBelum}%) Belum Ditindaklanjuti
            </p>
            <p className="text-slate-600 dark:text-amber-400/80">
              Kecamatan Purwokerto Selatan dan Purwokerto Timur membutuhkan alokasi verifikasi prioritas oleh Petugas PML/PCL.
            </p>
          </div>
        </div>
        <Link
          href="/laporan"
          className="shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition whitespace-nowrap"
        >
          <span>Prioritas Lapangan</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-48 w-48 rounded-full bg-blue-600/10 blur-2xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sensus Ekonomi 2026 — BPS Kabupaten Banyumas</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Monitoring & Visualisasi Analisis Data Anomali FASIH BPS
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Sistem pengolahan dan visualisasi interaktif data anomali FASIH BPS di seluruh 27 Kecamatan Kabupaten Banyumas. 
            Menyajikan distribusi 8 kategori anomali, status tindak lanjut lapangan, progress verifikasi wilayah, dan alur penugasan petugas.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2.5 text-xs font-bold shadow-lg shadow-cyan-500/20 transition"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Buka Dashboard Analisis</span>
            </Link>

            <Link
              href="/random-forest"
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2.5 text-xs font-bold shadow-lg shadow-purple-600/20 transition"
            >
              <BrainCircuit className="h-4 w-4" />
              <span>Model AI Random Forest</span>
            </Link>

            <Link
              href="/pemetaan"
              className="flex items-center space-x-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 text-xs font-bold border border-slate-700 transition"
            >
              <Map className="h-4 w-4 text-cyan-400" />
              <span>Lihat Peta 27 Kecamatan</span>
            </Link>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 px-4 py-2.5 text-xs font-semibold border border-emerald-500/30 transition"
            >
              <Upload className="h-4 w-4" />
              <span>Unggah Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Record Terdata"
          value={summaryStats.totalRecords}
          subtitle="Record Anomali FASIH"
          icon={Layers}
          colorScheme="blue"
          badge={isCustomDataLoaded ? "Custom Dataset" : "Dataset Acuan BPS"}
        />

        <StatCard
          title="Belum Ditindaklanjuti"
          value={summaryStats.totalBelumDitindaklanjuti}
          subtitle={`${summaryStats.persentaseBelum}% Membutuhkan Aksi`}
          icon={Clock}
          colorScheme="rose"
          badge="Prioritas Lapangan"
        />

        <StatCard
          title="Selesai Diverifikasi"
          value={summaryStats.totalSudahDitindaklanjuti + summaryStats.totalDenganPenjelasan}
          subtitle={`${summaryStats.persentaseSudah}% Kasus Terkonfirmasi`}
          icon={CheckCircle2}
          colorScheme="emerald"
          badge="Diperbaiki / Penjelasan"
        />

        <StatCard
          title="Status Approved"
          value={summaryStats.breakdownStatusAssignment[0]?.count || 5548}
          subtitle="Approved by Pengawas"
          icon={Workflow}
          colorScheme="teal"
          badge="Tahapan Validasi"
        />
      </div>

      {/* Grid 2 Kolom: Top 5 Kecamatan Perlu Tindak Lanjut & Kategori Anomali FASIH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Widget 1: Leaderboard Top 5 Kecamatan Pending */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Top 5 Kecamatan Prioritas Verifikasi
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Kecamatan dengan beban kasus belum ditindaklanjuti terbanyak
                </p>
              </div>
            </div>
            <Link
              href="/pemetaan"
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>Semua (27)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {topKecamatanPending.map((kec, idx) => {
              const total = kec.total_anomali;
              const pending = kec.belum_ditindaklanjuti;
              const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0;

              return (
                <div key={kec.nama_kecamatan} className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {kec.nama_kecamatan}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <span className="text-rose-600 dark:text-rose-400 font-bold">
                        {pending} Belum
                      </span>
                      <span className="text-slate-400">/</span>
                      <span>{total} Total</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                    <div 
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${pendingPct}%` }}
                      title={`${pendingPct}% Belum Ditindaklanjuti`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 2: Breakdown 8 Kategori Anomali FASIH */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Distribusi Kategori Anomali FASIH
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Komposisi jenis ketidakwajaran data usaha Sensus Ekonomi 2026
                </p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>Grafik Analisis</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {summaryStats.breakdownSemuaKategori.slice(0, 6).map((item) => {
              const totalRec = summaryStats.totalRecords || 1;
              const pct = Math.round((item.count / totalRec) * 100);

              return (
                <div key={item.kategori} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5 truncate max-w-[70%]">
                    <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.kategori}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 text-xs">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">
                      {item.count.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Widget 3: Pratinjau Record Anomali Kritis (Urgent Records Table Preview) */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Pratinjau Anomali Prioritas Tinggi</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kasus usaha dengan indikator tidak wajar yang perlu segera diverifikasi oleh petugas
            </p>
          </div>

          <Link
            href="/data"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition"
          >
            <Table className="h-3.5 w-3.5 text-cyan-500" />
            <span>Buka Tabel Lengkap ({summaryStats.totalRecords})</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">ID FASIH</th>
                <th className="p-3">Nama Usaha / Pemilik</th>
                <th className="p-3">Kecamatan / Desa</th>
                <th className="p-3">Kategori Anomali</th>
                <th className="p-3">Petugas Lapangan</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {urgentRecords.map((r) => (
                <tr key={r.fasih} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {r.fasih}
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">{r.nama_usaha || "—"}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.nama_keluarga}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold">{r.nama_kecamatan}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.nama_desa}</p>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      {r.kategori_deskripsi}
                    </span>
                  </td>
                  <td className="p-3 text-[11px]">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>{r.petugas || "—"}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      Belum Ditindaklanjuti
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setActiveRecordForModal(r)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] shadow transition"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        
        <Link href="/dashboard" className="group rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 shadow-md dark:shadow-xl hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition">
              Dashboard Grafik
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Visualisasi komparasi 27 Kecamatan, 8 kategori anomali FASIH, komposisi tindak lanjut, dan kinerja petugas.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition duration-200">
            <span>Eksplorasi Grafik</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link href="/random-forest" className="group rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 shadow-md dark:shadow-xl hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/30">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition">
              Model Random Forest
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Arsitektur sains data 100 Decision Trees akurasi 96.84%, feature importance MDI, dan live simulator prediksi mikro.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition duration-200">
            <span>Uji Coba Model AI</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link href="/pemetaan" className="group rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 shadow-md dark:shadow-xl hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Map className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition">
              Peta 27 Kecamatan
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pemetaan spasial interaktif sebaran beban belum ditindaklanjuti dan profil masalah di 27 Kecamatan Banyumas.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition duration-200">
            <span>Lihat Peta Wilayah</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link href="/data" className="group rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 shadow-md dark:shadow-xl hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Table className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition">
              Tabel Data Anomali
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tabel eksplorasi data lengkap dengan alamat SLS/Desa, kategori anomali, status tindak lanjut, dan assignment.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition duration-200">
            <span>Buka Tabel Data</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link href="/laporan" className="group rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 shadow-md dark:shadow-xl hover:border-rose-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-300 transition">
              Rekomendasi & Laporan
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Matriks peringkat prioritas verifikasi petugas lapangan SE2026 berdasarkan volume belum ditindaklanjuti & cetak laporan.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition duration-200">
            <span>Cetak Dokumen Laporan</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

      </div>

      {/* File Upload Modal Component */}
      <FileUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      {/* Business Detail Modal Component */}
      <BusinessDetailModal
        record={activeRecordForModal}
        onClose={() => setActiveRecordForModal(null)}
      />
    </div>
  );
}
