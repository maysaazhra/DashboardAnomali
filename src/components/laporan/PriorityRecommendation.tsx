"use client";

import React, { useRef, useState } from "react";
import { useData } from "@/context/DataContext";
import { 
  FileText, 
  Printer, 
  Download, 
  Clock, 
  CheckCircle2, 
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  Building2
} from "lucide-react";
import * as XLSX from "xlsx";

export default function PriorityRecommendation() {
  const { kecamatanStats, summaryStats } = useData();
  const printRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.max(1, Math.ceil(kecamatanStats.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, kecamatanStats.length);
  const paginatedStats = kecamatanStats.slice(startIndex, endIndex);

  const handlePrint = () => {
    window.print();
  };

  const exportPriorityExcel = () => {
    const data = kecamatanStats.map(stat => ({
      Peringkat_Prioritas: stat.peringkat_prioritas,
      Kode_Wilayah: stat.kode_wilayah,
      Kecamatan: stat.nama_kecamatan,
      Total_Anomali: stat.total_anomali,
      Belum_Ditindaklanjuti: stat.belum_ditindaklanjuti,
      Sudah_Ditindaklanjuti: stat.sudah_ditindaklanjuti,
      Sudah_Dengan_Penjelasan: stat.dengan_penjelasan,
      Persentase_Belum_Selesai: `${stat.persentase_belum}%`,
      Progress_Penyelesaian: `${stat.progress_penyelesaian}%`,
      Masalah_Dominan: stat.anomali_dominan,
      Rekomendasi_Aksi_Petugas: stat.rekomendasi_tindak_lanjur
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap_Prioritas_BPS_FASIH");
    XLSX.writeFile(workbook, "Rekomendasi_Prioritas_Tindak_Lanjut_FASIH_Banyumas.xlsx");
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-lg dark:shadow-xl transition-colors duration-300">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Award className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            <span>Matriks Rekomendasi Prioritas Tindak Lanjut FASIH BPS</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dasar alokasi tugas verifikasi lapangan BPS Kabupaten Banyumas berdasarkan beban kasus belum selesai
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportPriorityExcel}
            className="flex items-center space-x-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
          >
            <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Ekspor Rekap Excel</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 text-xs font-bold shadow-md shadow-cyan-900/30 transition"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Dokumen Resmi / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Official Report Document Container */}
      <div ref={printRef} className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 shadow-lg dark:shadow-xl space-y-6 print:bg-white print:text-black print:p-0 print:border-none transition-colors duration-300">
        
        {/* Official Header BPS */}
        <div className="border-b border-slate-200 dark:border-slate-800 print:border-black pb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-xl bg-blue-900 flex items-center justify-center text-white font-bold text-xl print:bg-blue-900">
              BPS
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white print:text-black uppercase">
                Badan Pusat Statistik Kabupaten Banyumas (Statistics of Banyumas Regency)
              </h2>
              <p className="text-xs text-blue-700 dark:text-blue-400 print:text-blue-800 font-bold">
                TIM KERJA FASIH & SENSUS EKONOMI 2026 — LAPORAN REKAPITULASI ANOMALI DATA
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-gray-600">
                Jl. Warga Bhakti No. 5 Purwokerto 53114 • Telp (0281) 635496 • e-mail : bps3302@bps.go.id
              </p>
            </div>
          </div>
          
          <div className="text-right text-xs text-slate-500 dark:text-slate-400 print:text-gray-700 hidden sm:block">
            <p className="font-mono">Dokumen Ref: SE2026-FASH-BMY</p>
            <p>Tanggal Cetak: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>

        {/* Executive Summary Narrative Text */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 print:bg-gray-100 p-4 border border-slate-200 dark:border-slate-700 print:border-gray-300 text-xs leading-relaxed space-y-2 text-slate-700 dark:text-slate-300 print:text-gray-900">
          <h4 className="font-bold text-slate-900 dark:text-white print:text-black text-sm uppercase tracking-wide flex items-center space-x-2">
            <FileText className="h-4 w-4 text-cyan-600 dark:text-cyan-400 print:text-blue-800" />
            <span>Ringkasan Eksekutif Rekapitulasi Data Anomali FASIH BPS</span>
          </h4>
          <p>
            Berdasarkan hasil pemantauan sistem FASIH BPS Kabupaten Banyumas, tercatat total sebanyak{" "}
            <strong>{summaryStats.totalRecords.toLocaleString("id-ID")} record</strong> anomali di seluruh 27 Kecamatan.
          </p>
          <p>
            Dari keseluruhan anomali terdata, sebanyak <strong>{summaryStats.totalBelumDitindaklanjuti.toLocaleString("id-ID")} kasus ({summaryStats.persentaseBelum}%)</strong> berstatus <em>Belum Ditindaklanjuti</em> dan membutuhkan verifikasi lapangan,{" "}
            <strong>{summaryStats.totalSudahDitindaklanjuti.toLocaleString("id-ID")} kasus</strong> telah selesai diperbaiki, dan{" "}
            <strong>{summaryStats.totalDenganPenjelasan.toLocaleString("id-ID")} kasus</strong> telah ditindaklanjuti dengan penjelasan sesuai kondisi lapangan.
          </p>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl bg-cyan-500/10 print:bg-gray-50 border border-cyan-500/30 p-4">
            <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400 print:text-black font-bold">
              <span>TOTAL ANOMALI</span>
              <Layers className="h-5 w-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white print:text-black mt-2 font-mono">
              {summaryStats.totalRecords.toLocaleString("id-ID")}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-gray-600 mt-1">27 Kecamatan Banyumas</p>
          </div>

          <div className="rounded-xl bg-rose-500/10 print:bg-rose-50 border border-rose-500/30 p-4">
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 print:text-rose-800 font-bold">
              <span>BELUM DITINDAKLANJUTI</span>
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white print:text-black mt-2 font-mono">
              {summaryStats.totalBelumDitindaklanjuti.toLocaleString("id-ID")}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-gray-600 mt-1">{summaryStats.persentaseBelum}% butuh aksi lapangan</p>
          </div>

          <div className="rounded-xl bg-emerald-500/10 print:bg-emerald-50 border border-emerald-500/30 p-4">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 print:text-emerald-800 font-bold">
              <span>SUDAH DIPERBAIKI</span>
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white print:text-black mt-2 font-mono">
              {summaryStats.totalSudahDitindaklanjuti.toLocaleString("id-ID")}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-gray-600 mt-1">Data valid & diperbaiki</p>
          </div>

          <div className="rounded-xl bg-blue-500/10 print:bg-blue-50 border border-blue-500/30 p-4">
            <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 print:text-blue-800 font-bold">
              <span>DENGAN PENJELASAN</span>
              <Building2 className="h-5 w-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white print:text-black mt-2 font-mono">
              {summaryStats.totalDenganPenjelasan.toLocaleString("id-ID")}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-gray-600 mt-1">Sesuai kondisi riil</p>
          </div>
        </div>

        {/* Priority Ranking Table (27 Kecamatan) */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white print:text-black uppercase tracking-wider mb-3">
            Tabel Rekapitulasi 27 Kecamatan di Kabupaten Banyumas
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 print:border-black">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 print:bg-gray-200 text-slate-700 dark:text-slate-200 print:text-black uppercase font-bold">
                <tr>
                  <th className="p-2.5 text-center">Peringkat</th>
                  <th className="p-2.5">Kode</th>
                  <th className="p-2.5">Kecamatan</th>
                  <th className="p-2.5 text-center">Belum Selesai</th>
                  <th className="p-2.5 text-center">Sudah Diperbaiki</th>
                  <th className="p-2.5 text-center">Dengan Penjelasan</th>
                  <th className="p-2.5 text-center">Progres Selesai</th>
                  <th className="p-2.5">Masalah Dominan</th>
                  <th className="p-2.5 text-center">Total Kasus</th>
                  <th className="p-2.5">Status Prioritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-gray-300 text-slate-800 dark:text-slate-300 print:text-black">
                {(typeof window !== "undefined" && window.matchMedia("print").matches ? kecamatanStats : paginatedStats).map((stat) => {
                  const isP1 = stat.rekomendasi_tindak_lanjur.includes("Prioritas 1");
                  const isP2 = stat.rekomendasi_tindak_lanjur.includes("Prioritas 2");

                  return (
                    <tr key={stat.kode_wilayah} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 print:hover:bg-transparent">
                      <td className="p-2.5 text-center font-bold font-mono">#{stat.peringkat_prioritas}</td>
                      <td className="p-2.5 font-mono text-cyan-600 dark:text-cyan-400 print:text-black">{stat.kode_wilayah}</td>
                      <td className="p-2.5 font-bold text-slate-900 dark:text-white print:text-black">{stat.nama_kecamatan}</td>
                      <td className="p-2.5 text-center font-mono font-bold text-rose-600 dark:text-rose-400 print:text-black">
                        {stat.belum_ditindaklanjuti} ({stat.persentase_belum}%)
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 print:text-black">
                        {stat.sudah_ditindaklanjuti}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-blue-600 dark:text-blue-400 print:text-black">
                        {stat.dengan_penjelasan}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold">
                        {stat.progress_penyelesaian}%
                      </td>
                      <td className="p-2.5 font-medium">
                        {stat.anomali_dominan}
                      </td>
                      <td className="p-2.5 text-center font-mono font-black">{stat.total_anomali}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                          isP1
                            ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 print:text-rose-900 border border-rose-500/30"
                            : isP2
                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 print:text-amber-900 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 print:text-emerald-900 border border-emerald-500/30"
                        }`}>
                          {stat.rekomendasi_tindak_lanjur}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="print:hidden flex flex-col sm:flex-row items-center justify-between p-3.5 mt-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 gap-3">
            <div>
              Menampilkan{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {startIndex + 1}–{endIndex}
              </span>{" "}
              dari{" "}
              <span className="font-bold text-slate-900 dark:text-white">{kecamatanStats.length}</span> Kecamatan
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-slate-500">Baris:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1 px-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-cyan-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={27}>27 (Semua)</option>
                </select>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  disabled={validPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition"
                  title="Halaman Pertama"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>

                <button
                  disabled={validPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center space-x-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === validPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-[28px] h-7 rounded-lg text-xs font-semibold transition ${
                          isActive
                            ? "bg-cyan-600 text-white shadow-sm"
                            : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={validPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition"
                  title="Halaman Berikutnya"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  disabled={validPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition"
                  title="Halaman Terakhir"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Official Signatures section for print */}
        <div className="hidden print:flex justify-between pt-12 text-xs text-black">
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold">Pembimbing Magang BPS Kab. Banyumas</p>
            <div className="h-16" />
            <p className="font-bold underline">(...................................................)</p>
            <p>NIP. 1978..........................</p>
          </div>
          <div>
            <p>Purwokerto, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
            <p className="font-bold">Petugas / Tim Analis Data SE2026</p>
            <div className="h-16" />
            <p className="font-bold underline">(...................................................)</p>
            <p>Tim Pemutakhiran SE2026</p>
          </div>
        </div>

      </div>

    </div>
  );
}
