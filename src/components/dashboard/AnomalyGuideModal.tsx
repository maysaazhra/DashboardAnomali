"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  X, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Search, 
  Lightbulb, 
  AlertTriangle,
  Building2,
  Users
} from "lucide-react";

interface AnomalyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ANOMALY_GUIDE_DATA = [
  {
    id: "Data 1",
    nama: "Biaya Produksi Dominan",
    pilar: "Usaha",
    tagColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    deskripsiSingkat: "Biaya operasional atau produksi melebihi batas kewajaran rasio pendapatan usaha.",
    penyebab: "Kesalahan input satuan angka/desimal, pencatatan belanja modal (investasi alat/bangunan) yang tercampur dalam biaya operasional rutin, atau usaha sedang mengalami kerugian sementara.",
    langkahBps: "Periksa buku kas/pengeluaran rutin, pisahkan belanja investasi modal dari biaya operasional produksi harian, lalu hitung ulang rasio biaya terhadap penerimaan bruto."
  },
  {
    id: "Data 2",
    nama: "Keuntungan Usaha",
    pilar: "Usaha",
    tagColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    deskripsiSingkat: "Margin laba/keuntungan ekstrem tidak wajar (sangat tinggi atau negatif) dibanding skala usahanya.",
    penyebab: "Penerimaan belum dikurangi seluruh beban pokok (HPP), atau terjadi kesalahan konversi periode waktu (misal omzet tahunan dikurangkan biaya bulanan).",
    langkahBps: "Kroscek ulang penerimaan bruto bulanan dikalikan masa operasional dalam setahun, lalu kurangkan dengan seluruh biaya operasional riil."
  },
  {
    id: "Data 3",
    nama: "Bukan Badan Usaha Tetapi Ada Modal Korporasi",
    pilar: "Keluarga",
    tagColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    deskripsiSingkat: "Usaha perorangan/non-badan usaha namun tercatat memiliki penyertaan modal korporasi.",
    penyebab: "Responden menganggap pinjaman perbankan/kredit usaha rakyat sebagai modal korporasi, atau keliru dalam memilih bentuk badan hukum entitas.",
    langkahBps: "Periksa legalitas entitas (akta notaris/PT/CV/Koperasi). Jika merupakan usaha perorangan, hapus isian modal korporasi dan sesuaikan sumber modalnya."
  },
  {
    id: "Data 4",
    nama: "Data Keuangan MBG / KRT",
    pilar: "Keluarga",
    tagColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30",
    deskripsiSingkat: "Ketidaksesuaian pencatatan data keuangan makan bergizi gratis atau unit rumah tangga / KRT.",
    penyebab: "Tercampurnya pos pengeluaran konsumsi pribadi rumah tangga dengan belanja bahan baku unit usaha keluarga.",
    langkahBps: "Pisahkan secara tegas pembukuan konsumsi dapur rumah tangga dari pengeluaran bahan baku kegiatan usaha keluarga."
  },
  {
    id: "Data 5",
    nama: "Konsistensi Antara Aset, Pekerja & Produksi",
    pilar: "Usaha",
    tagColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    deskripsiSingkat: "Inkonsistensi antara besaran aset modal, kapasitas output fisik, dan jumlah tenaga kerja.",
    penyebab: "Aset tempat usaha sewa/milik pihak lain dihitung sebagai aset milik sendiri, atau tenaga kerja lepas harian tidak tercatat.",
    langkahBps: "Verifikasi status kepemilikan aset (milik sendiri vs sewa) dan catat jumlah pekerja riil (tetap maupun tidak tetap) beserta kapasitas produksi harian."
  },
  {
    id: "Data 6",
    nama: "Usaha Menengah & Besar Tanpa Internet",
    pilar: "Usaha",
    tagColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    deskripsiSingkat: "Usaha skala Menengah/Besar (UMB) namun tercatat tidak menggunakan internet untuk bisnis.",
    penyebab: "Pencacah hanya mengonfirmasi sambungan internet kabel (Wi-Fi), tanpa menanyakan penggunaan paket data seluler untuk WhatsApp bisnis, marketplace, atau mobile banking.",
    langkahBps: "Tanyakan apakah pengelola menggunakan ponsel pintar/paket data untuk transaksi, pemasaran digital, atau komunikasi operasional."
  },
  {
    id: "Data 7",
    nama: "Usaha Menengah & Besar Tanpa Laporan Keuangan",
    pilar: "Usaha",
    tagColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
    deskripsiSingkat: "Usaha skala Menengah/Besar (UMB) tercatat tidak memiliki laporan keuangan pembukuan resmi.",
    penyebab: "Responden enggan memperlihatkan dokumen pembukuan saat wawancara atau laporan keuangan dikelola di kantor pusat luar daerah.",
    langkahBps: "Jelaskan kerahasiaan data sensus yang dijamin UU Statistik, lalu mintakan catatan rekapitulasi penerimaan dan pengeluaran sederhana dari kasir/akunting."
  },
  {
    id: "Data 8",
    nama: "Perbedaan KBLI 2 Digit Pendataan dan SBR",
    pilar: "Usaha",
    tagColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
    deskripsiSingkat: "Perbedaan klasifikasi sektor usaha KBLI 2 digit antara lapangan dengan master data SBR BPS.",
    penyebab: "Terjadi perubahan bidang usaha utama, penambahan lini produk baru yang lebih dominan, atau salah penentuan kode 5 digit KBLI.",
    langkahBps: "Tetapkan kode KBLI berdasarkan aktivitas usaha yang menghasilkan nilai omzet/pendapatan terbesar (*dominant activity*) saat ini."
  }
];

export default function AnomalyGuideModal({ isOpen, onClose }: AnomalyGuideModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPilar, setSelectedPilar] = useState<"Semua" | "Usaha" | "Keluarga">("Semua");

  if (!isOpen) return null;

  const filteredGuides = ANOMALY_GUIDE_DATA.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.deskripsiSingkat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.penyebab.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPilar = selectedPilar === "Semua" || item.pilar === selectedPilar;
    return matchesSearch && matchesPilar;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="h-11 w-11 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Kamus & Panduan Detail 8 Jenis Anomali FASIH BPS</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Keterangan definisi, penyebab ketidakwajaran data, dan SOP tindak lanjut petugas di lapangan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari keterangan atau jenis anomali..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setSelectedPilar("Semua")}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedPilar === "Semua"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Semua (8)
            </button>
            <button
              onClick={() => setSelectedPilar("Usaha")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold transition ${
                selectedPilar === "Usaha"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Anomali Usaha (6)</span>
            </button>
            <button
              onClick={() => setSelectedPilar("Keluarga")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold transition ${
                selectedPilar === "Keluarga"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Anomali Keluarga (2)</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[60vh]">
          {filteredGuides.map((item) => (
            <div 
              key={item.id}
              className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5 space-y-3.5 transition hover:border-cyan-500/40 hover:shadow-md"
            >
              {/* Card Title & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
                    {item.id}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                    {item.nama}
                  </h4>
                </div>

                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${item.tagColor}`}>
                  Pilar {item.pilar}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {item.deskripsiSingkat}
              </p>

              {/* Grid: Penyebab & Langkah BPS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                
                {/* Penyebab */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-200 space-y-1">
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Kemungkinan Penyebab Anomali</span>
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.penyebab}
                  </p>
                </div>

                {/* SOP Langkah Tindak Lanjut BPS */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-800 dark:text-slate-200 space-y-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>SOP Tindak Lanjut Petugas BPS</span>
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.langkahBps}
                  </p>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Sumber: Pedoman Standar Validasi Data FASIH — BPS Republik Indonesia
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold transition shadow-md"
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
}
