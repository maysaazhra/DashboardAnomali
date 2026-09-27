"use client";

import React, { useState, useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid
} from "recharts";
import { useData } from "@/context/DataContext";
import { 
  Building2, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  FileSpreadsheet,
  FileCheck2,
  BookOpen,
  School,
  Hospital,
  Store,
  Factory,
  Wrench,
  Utensils,
  Home,
  HeartHandshake,
  Briefcase
} from "lucide-react";
import * as XLSX from "xlsx";
import AnomalyGuideModal from "@/components/dashboard/AnomalyGuideModal";

export default function AnomalyCharts() {
  const { summaryStats, kecamatanStats, theme } = useData();

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Filter tab for "Registri Kecamatan" using exact CSV status categories
  const [selectedStatusTab, setSelectedStatusTab] = useState<
    "Semua" | "Belum Ditindaklanjuti" | "Sudah Ditindaklanjuti" | "Sudah Ditindaklanjuti (Dengan Penjelasan)"
  >("Semua");

  const [kecamatanPage, setKecamatanPage] = useState(1);
  const [kecamatanPageSize, setKecamatanPageSize] = useState(10);

  // Reset page when filter changes
  React.useEffect(() => {
    setKecamatanPage(1);
  }, [selectedStatusTab]);

  const isDark = theme === "dark";
  const axisColor = isDark ? "#94A3B8" : "#475569";
  const gridColor = isDark ? "#334155" : "#E2E8F0";

  // Filtered and Sorted Kecamatan Stats according to the selected tab
  const filteredRegistriKecamatan = useMemo(() => {
    if (selectedStatusTab === "Belum Ditindaklanjuti") {
      return [...kecamatanStats]
        .filter(s => s.belum_ditindaklanjuti > 0)
        .sort((a, b) => b.belum_ditindaklanjuti - a.belum_ditindaklanjuti);
    }
    if (selectedStatusTab === "Sudah Ditindaklanjuti") {
      return [...kecamatanStats]
        .filter(s => s.sudah_ditindaklanjuti > 0)
        .sort((a, b) => b.sudah_ditindaklanjuti - a.sudah_ditindaklanjuti);
    }
    if (selectedStatusTab === "Sudah Ditindaklanjuti (Dengan Penjelasan)") {
      return [...kecamatanStats]
        .filter(s => s.dengan_penjelasan > 0)
        .sort((a, b) => b.dengan_penjelasan - a.dengan_penjelasan);
    }
    return kecamatanStats;
  }, [kecamatanStats, selectedStatusTab]);

  // Pagination for Registri Kecamatan Table
  const totalKecPages = Math.max(1, Math.ceil(filteredRegistriKecamatan.length / kecamatanPageSize));
  const validKecPage = Math.min(kecamatanPage, totalKecPages);
  const startKecIndex = (validKecPage - 1) * kecamatanPageSize;
  const endKecIndex = Math.min(startKecIndex + kecamatanPageSize, filteredRegistriKecamatan.length);
  const paginatedRegistriKecamatan = filteredRegistriKecamatan.slice(startKecIndex, endKecIndex);

  // 1. Data Horizontal Bar Chart: Jumlah Anomali Per Kecamatan (Solid Single Color Blue)
  const kecamatanSortedByVolume = useMemo(() => {
    return [...kecamatanStats]
      .sort((a, b) => a.total_anomali - b.total_anomali)
      .map(k => ({
        name: k.nama_kecamatan.toUpperCase(),
        total: k.total_anomali,
        belum: k.belum_ditindaklanjuti,
        sudah: k.sudah_ditindaklanjuti,
        penjelasan: k.dengan_penjelasan,
        usaha: k.anomali_usaha,
        keluarga: k.anomali_keluarga,
        pctBelum: k.persentase_belum
      }));
  }, [kecamatanStats]);

  const exportKecamatanExcel = () => {
    const data = kecamatanStats.map(stat => ({
      "Kode Wilayah": stat.kode_wilayah,
      "Kecamatan": stat.nama_kecamatan,
      "Total Anomali": stat.total_anomali,
      "Belum Ditindaklanjuti": stat.belum_ditindaklanjuti,
      "Sudah Ditindaklanjuti": stat.sudah_ditindaklanjuti,
      "Sudah Ditindaklanjuti (Dengan Penjelasan)": stat.dengan_penjelasan,
      "Persentase Belum": `${stat.persentase_belum}%`,
      "Anomali Usaha": stat.anomali_usaha,
      "Anomali Keluarga": stat.anomali_keluarga
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap_27_Kecamatan");
    XLSX.writeFile(workbook, "Rekap_27_Kecamatan_FASIH_Banyumas.xlsx");
  };

  const pctUsaha = summaryStats.totalAnomali > 0 
    ? Number(((summaryStats.totalAnomaliUsaha / summaryStats.totalAnomali) * 100).toFixed(1)) 
    : 0;
  const pctKeluarga = summaryStats.totalAnomali > 0 
    ? Number(((summaryStats.totalAnomaliKeluarga / summaryStats.totalAnomali) * 100).toFixed(1)) 
    : 0;

  // Icon mapping for entity types
  const getEntityIcon = (jenis: string) => {
    if (jenis.includes("Sekolah") || jenis.includes("Pendidikan")) return <School className="h-4 w-4 text-blue-500" />;
    if (jenis.includes("Kesehatan") || jenis.includes("RS") || jenis.includes("Klinik")) return <Hospital className="h-4 w-4 text-rose-500" />;
    if (jenis.includes("Pondok") || jenis.includes("Yayasan")) return <HeartHandshake className="h-4 w-4 text-teal-500" />;
    if (jenis.includes("Toko") || jenis.includes("Perdagangan") || jenis.includes("Warung")) return <Store className="h-4 w-4 text-amber-500" />;
    if (jenis.includes("Industri") || jenis.includes("Pabrik")) return <Factory className="h-4 w-4 text-emerald-500" />;
    if (jenis.includes("Bengkel") || jenis.includes("Jasa")) return <Wrench className="h-4 w-4 text-indigo-500" />;
    if (jenis.includes("Kuliner") || jenis.includes("Makanan")) return <Utensils className="h-4 w-4 text-pink-500" />;
    if (jenis.includes("Tempat Tinggal") || jenis.includes("Rumahan")) return <Home className="h-4 w-4 text-purple-500" />;
    return <Briefcase className="h-4 w-4 text-slate-500" />;
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: REGISTRI KECAMATAN */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl transition-colors duration-300 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              DETAIL DATA
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Registri Kecamatan
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Nomor mengikuti Kode Kecamatan resmi BPS. Menampilkan seluruh 27 Kecamatan di Kabupaten Banyumas berdasarkan status tindak lanjut riil.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 text-xs font-bold shadow-md transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>Kamus & Keterangan Anomali</span>
            </button>

            <button
              onClick={exportKecamatanExcel}
              className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold shadow-md transition"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Ekspor Rekap Excel</span>
            </button>
          </div>
        </div>

        {/* Filter Bar (100% Real Data Status Names) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={() => setSelectedStatusTab("Semua")}
            className={`rounded-full px-4 py-2 font-bold transition duration-200 ${
              selectedStatusTab === "Semua"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Semua Kecamatan (27)
          </button>

          <button
            onClick={() => setSelectedStatusTab("Belum Ditindaklanjuti")}
            className={`flex items-center space-x-1.5 rounded-full px-4 py-2 font-semibold transition duration-200 ${
              selectedStatusTab === "Belum Ditindaklanjuti"
                ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Belum Ditindaklanjuti ({summaryStats.totalBelumDitindaklanjuti.toLocaleString("id-ID")})</span>
          </button>

          <button
            onClick={() => setSelectedStatusTab("Sudah Ditindaklanjuti")}
            className={`flex items-center space-x-1.5 rounded-full px-4 py-2 font-semibold transition duration-200 ${
              selectedStatusTab === "Sudah Ditindaklanjuti"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Sudah Ditindaklanjuti ({summaryStats.totalSudahDitindaklanjuti.toLocaleString("id-ID")})</span>
          </button>

          <button
            onClick={() => setSelectedStatusTab("Sudah Ditindaklanjuti (Dengan Penjelasan)")}
            className={`flex items-center space-x-1.5 rounded-full px-4 py-2 font-semibold transition duration-200 ${
              selectedStatusTab === "Sudah Ditindaklanjuti (Dengan Penjelasan)"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
            <span>Sudah Ditindaklanjuti (Dengan Penjelasan) ({summaryStats.totalDenganPenjelasan.toLocaleString("id-ID")})</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 max-h-[460px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-cyan-900 dark:text-cyan-300 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="py-3.5 px-4">KODE KEC</th>
                <th className="py-3.5 px-4">KECAMATAN</th>
                <th className="py-3.5 px-4 text-center">BELUM DITINDAKLANJUTI</th>
                <th className="py-3.5 px-4 text-center">SUDAH DITINDAKLANJUTI</th>
                <th className="py-3.5 px-4 text-center">DENGAN PENJELASAN</th>
                <th className="py-3.5 px-4 text-right">TOTAL ANOMALI</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-semibold">
              {paginatedRegistriKecamatan.length > 0 ? (
                paginatedRegistriKecamatan.map((stat) => {
                  const formattedKodeKec = `3302${stat.kode_wilayah.replace(/\./g, "").slice(-3)}`;

                  return (
                    <tr key={stat.kode_wilayah} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-4 px-4 font-mono font-medium text-slate-500 dark:text-slate-400">
                        {formattedKodeKec}
                      </td>

                      <td className="py-4 px-4 font-black tracking-wide text-slate-900 dark:text-white uppercase">
                        {stat.nama_kecamatan}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                          {stat.belum_ditindaklanjuti.toLocaleString("id-ID")} kasus ({stat.persentase_belum}%)
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {stat.sudah_ditindaklanjuti.toLocaleString("id-ID")} kasus
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          {stat.dengan_penjelasan.toLocaleString("id-ID")} kasus
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right font-black font-mono text-slate-900 dark:text-white text-sm">
                        {stat.total_anomali.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Tidak ada data kecamatan yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-600 dark:text-slate-400 gap-3">
          <div>
            Menampilkan{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {filteredRegistriKecamatan.length === 0 ? 0 : startKecIndex + 1}–{endKecIndex}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-slate-900 dark:text-white">{filteredRegistriKecamatan.length}</span> Kecamatan
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">Baris:</span>
              <select
                value={kecamatanPageSize}
                onChange={(e) => {
                  setKecamatanPageSize(Number(e.target.value));
                  setKecamatanPage(1);
                }}
                className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1 px-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-cyan-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={27}>27 (Semua Kecamatan)</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button
                disabled={validKecPage === 1}
                onClick={() => setKecamatanPage(1)}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              <button
                disabled={validKecPage === 1}
                onClick={() => setKecamatanPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center space-x-1 px-1">
                {Array.from({ length: totalKecPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = pageNum === validKecPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setKecamatanPage(pageNum)}
                      className={`min-w-[28px] h-7 rounded-lg text-xs font-semibold transition ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={validKecPage === totalKecPages}
                onClick={() => setKecamatanPage(p => Math.min(totalKecPages, p + 1))}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                disabled={validKecPage === totalKecPages}
                onClick={() => setKecamatanPage(totalKecPages)}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2: JUMLAH ANOMALI PER KECAMATAN (SOLID SINGLE BLUE COLOR) & PILAR INFORMASI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (lg:col-span-7): Jumlah Anomali Per Kecamatan (Solid Blue Bars) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl transition-colors duration-300 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Jumlah anomali per kecamatan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Diurutkan dari volume terendah ke tertinggi (27 Kecamatan)
            </p>

            {/* Horizontal Bar Chart dengan Solid Blue Bar */}
            <div className="h-[760px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={kecamatanSortedByVolume}
                  margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                  barCategoryGap={6}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} vertical={true} />
                  <XAxis 
                    type="number" 
                    stroke={axisColor} 
                    fontSize={11} 
                    tickLine={true}
                    tickFormatter={(val: number) => val.toLocaleString('en-US')}
                    domain={[0, (dataMax: number) => Math.max(1400, Math.ceil((dataMax + 100) / 200) * 200)]}
                    ticks={[0, 200, 400, 600, 800, 1000, 1200, 1400]}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke={axisColor} 
                    fontSize={10} 
                    tickLine={false}
                    interval={0}
                    width={140}
                    tick={({ x, y, payload }: any) => (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={-10}
                          y={3.5}
                          textAnchor="end"
                          fill={isDark ? "#CBD5E1" : "#475569"}
                          fontSize={9.5}
                          fontWeight={600}
                          letterSpacing="0.02em"
                        >
                          {payload.value}
                        </text>
                      </g>
                    )}
                  />
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 shadow-xl text-xs text-slate-900 dark:text-white space-y-1.5 min-w-[220px]">
                            <p className="font-extrabold text-sm text-slate-900 dark:text-white">{data.name}</p>
                            <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                              Total Anomali: <span className="font-mono">{data.total.toLocaleString("id-ID")}</span> Record
                            </p>
                            <div className="pt-1.5 space-y-1 border-t border-slate-100 dark:border-slate-700 text-[11px]">
                              <p className="text-rose-600 dark:text-rose-400 font-semibold flex justify-between">
                                <span>Belum Ditindaklanjuti:</span>
                                <span className="font-mono font-bold">{data.belum.toLocaleString("id-ID")} ({data.pctBelum}%)</span>
                              </p>
                              <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex justify-between">
                                <span>Sudah Ditindaklanjuti:</span>
                                <span className="font-mono font-bold">{data.sudah.toLocaleString("id-ID")}</span>
                              </p>
                              <p className="text-blue-600 dark:text-blue-400 font-semibold flex justify-between">
                                <span>Dengan Penjelasan:</span>
                                <span className="font-mono font-bold">{data.penjelasan.toLocaleString("id-ID")}</span>
                              </p>
                              <p className="text-slate-500 dark:text-slate-400 flex justify-between">
                                <span>Rincian Pilar:</span>
                                <span>{data.usaha} Usaha / {data.keluarga} Kel</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="total" 
                    name="Jumlah Anomali"
                    fill="#2563EB" 
                    radius={[0, 6, 6, 0]} 
                    barSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (lg:col-span-5): 3 Kartu Analisis (Usaha vs Keluarga, 8 Kategori, Status) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Card 1: CUKUP 1 Visualisasi Komparasi Anomali Usaha vs Keluarga */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-6 shadow-xl transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Komparasi Anomali Usaha vs Keluarga
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Proporsi ketidakwajaran tingkat usaha dan rumah tangga
                </p>
              </div>
            </div>

            {/* Visual Combined Progress Bar */}
            <div className="space-y-4">
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden flex">
                <div 
                  className="bg-blue-600 h-full transition-all duration-500"
                  style={{ width: `${pctUsaha}%` }}
                  title={`Anomali Usaha: ${pctUsaha}%`}
                />
                <div 
                  className="bg-purple-600 h-full transition-all duration-500"
                  style={{ width: `${pctKeluarga}%` }}
                  title={`Anomali Keluarga: ${pctKeluarga}%`}
                />
              </div>

              {/* Two Detail Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold mb-1">
                    <Building2 className="h-4 w-4" />
                    <span>Anomali Usaha</span>
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
                    {summaryStats.totalAnomaliUsaha.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 font-bold mt-0.5">
                    {pctUsaha}% dari Total Anomali
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-1.5 text-purple-600 dark:text-purple-400 text-xs font-bold mb-1">
                    <Users className="h-4 w-4" />
                    <span>Anomali Keluarga</span>
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
                    {summaryStats.totalAnomaliKeluarga.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300 font-bold mt-0.5">
                    {pctKeluarga}% dari Total Anomali
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Rincian 8 Kategori Anomali FASIH BPS */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-6 shadow-xl transition-colors duration-300 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  8 Kategori Anomali FASIH BPS
                </h3>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-bold flex items-center space-x-1"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Keterangan Detail</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">
                Total seluruh kecamatan ({summaryStats.totalAnomali.toLocaleString("id-ID")} kasus)
              </p>

              <div className="space-y-2">
                {summaryStats.breakdownSemuaKategori.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]" title={item.kategori}>
                        {item.kategori}
                      </span>
                      <span className="font-mono font-black text-slate-900 dark:text-white text-[11px]">
                        {item.count.toLocaleString("id-ID")} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.max(2, item.percentage)}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Status Progres Tindak Lanjut */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-6 shadow-xl transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <FileCheck2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span>Status Tindak Lanjut</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">
              Komposisi penyelesaian verifikasi di lapangan
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <span className="font-semibold text-rose-700 dark:text-rose-300">Belum Ditindaklanjuti</span>
                <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-sm">
                  {summaryStats.totalBelumDitindaklanjuti.toLocaleString("id-ID")} ({summaryStats.persentaseBelum}%)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">Sudah Ditindaklanjuti</span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  {summaryStats.totalSudahDitindaklanjuti.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <span className="font-semibold text-blue-700 dark:text-blue-300">Dengan Penjelasan</span>
                <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                  {summaryStats.totalDenganPenjelasan.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 3: KLASIFIKASI SEBARAN FASILITAS & JENIS ENTITAS (RUMAH SAKIT, SEKOLAH, PONDOK, WARUNG, DLL.) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl transition-colors duration-300 space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            KLASIFIKASI SEKTOR & FASILITAS TERDATA
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Sebaran Jenis Fasilitas & Entitas Usaha / Lembaga
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Komposisi anomali data berdasarkan sektor kegiatan, fasilitas publik (Pendidikan, Kesehatan, Pondok/Yayasan), perdagangan, dan rumah tangga di Banyumas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-2">
          {summaryStats.breakdownJenisEntitas.map((item, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 hover:border-cyan-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                    {getEntityIcon(item.jenis)}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]" title={item.jenis}>
                    {item.jenis}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {item.percentage}%
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                  {item.count.toLocaleString("id-ID")}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Record Kasus
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.max(3, item.percentage)}%`,
                    backgroundColor: item.color 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Modal */}
      <AnomalyGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}
