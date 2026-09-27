"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { 
  Search, 
  Filter, 
  Download, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Eye, 
  ArrowUpDown,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  BookOpen,
  School,
  Hospital,
  Store,
  Factory,
  Wrench,
  Utensils,
  Home,
  HeartHandshake
} from "lucide-react";
import { BpsFasihRecord } from "@/types/anomali";
import BusinessDetailModal from "./BusinessDetailModal";
import AnomalyGuideModal from "@/components/dashboard/AnomalyGuideModal";
import * as XLSX from "xlsx";

const BANYUMAS_KECAMATAN_NAMES = [
  "Ajibarang", "Banyumas", "Baturraden", "Cilongok", "Gumelar", 
  "Jatilawang", "Kalibagor", "Karanglewas", "Kebasen", "Kedungbanteng", 
  "Kembaran", "Kemranjen", "Lumbir", "Patikraja", "Pekuncen", 
  "Purwojati", "Purwokerto Barat", "Purwokerto Selatan", "Purwokerto Timur", "Purwokerto Utara", 
  "Rawalo", "Sokaraja", "Somagede", "Sumbang", "Sumpiuh", "Tambak", "Wangon"
];

const KATEGORI_OPTIONS = [
  "Biaya Produksi Dominan (Data 1)",
  "Keuntungan Usaha (Data 2)",
  "Modal Korporasi Non-Badan Usaha (Data 3)",
  "Data Keuangan MBG / KRT (Data 4)",
  "Konsistensi Aset, Pekerja & Produksi (Data 5)",
  "Usaha Menengah/Besar Tanpa Internet (Data 6)",
  "Usaha Menengah/Besar Tanpa Lap. Keuangan (Data 7)",
  "Perbedaan KBLI 2 Digit & SBR (Data 8)"
];

const ENTITAS_OPTIONS = [
  "Pendidikan (Sekolah/Madrasah/PAUD)",
  "Fasilitas Kesehatan (RS/Klinik/Apotek)",
  "Pondok Pesantren & Yayasan/Sosial",
  "Tempat Tinggal / Usaha Rumahan",
  "Perdagangan & Toko/Warung",
  "Industri / Pabrik / Kerajinan",
  "Jasa & Bengkel/Servis",
  "Kuliner & Makanan/Minuman",
  "Usaha Jasa & Niaga Lainnya"
];

export default function DataTable() {
  const { filteredRecords, filters, setFilters, resetFilters } = useData();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof BpsFasihRecord>("no");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRecord, setSelectedRecord] = useState<BpsFasihRecord | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Sorting
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let aVal = a[sortField] || "";
    let bVal = b[sortField] || "";

    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedRecords.length);
  const paginatedRecords = sortedRecords.slice(startIndex, endIndex);

  const handleSort = (field: keyof BpsFasihRecord) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const exportToExcel = () => {
    const dataToExport = sortedRecords.map(r => ({
      No: r.no,
      Fasih_ID: r.fasih,
      Assignment_ID: r.assignment,
      Nama_Usaha: r.nama_usaha,
      Nama_Pemilik_KRT: r.nama_keluarga,
      Sektor_Fasilitas: r.jenis_entitas || "-",
      Kecamatan: r.nama_kecamatan,
      Desa: r.nama_desa,
      SLS: r.nama_sls,
      Alamat_Lengkap: r.alamat_lengkap,
      Pilar_Anomali: r.tipe_anomali,
      Kategori_Anomali: r.kategori_deskripsi,
      Nama_Anomali_Lengkap: r.nama_anomali,
      Status_Tindak_Lanjut: r.tindak_lanjut,
      Status_Assignment: r.status_assignment,
      Petugas: r.petugas,
      Pengunggah: r.pengunggah,
      Waktu_Status: r.waktu_status_diambil
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data_Anomali_FASIH_BPS");
    XLSX.writeFile(workbook, "Data_Anomali_FASIH_BPS_Banyumas_SE2026.xlsx");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter & Action Bar */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 shadow-lg dark:shadow-xl space-y-4 transition-colors duration-300">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Filter className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <span>Eksplorasi Data Anomali FASIH BPS Kabupaten Banyumas</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Menampilkan {filteredRecords.length.toLocaleString("id-ID")} entri data terverifikasi sistem FASIH
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-2 text-xs font-bold shadow-md transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>Kamus & Keterangan Anomali</span>
            </button>

            <button
              onClick={exportToExcel}
              className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold shadow-md transition"
            >
              <Download className="h-4 w-4" />
              <span>Ekspor Excel</span>
            </button>

            <button
              onClick={resetFilters}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3.5 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
              title="Reset Semua Filter"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          
          {/* Search bar */}
          <div className="sm:col-span-2">
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Pencarian Data</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama usaha, pemilik, desa, SLS, petugas..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>
          </div>

          {/* Filter Kecamatan */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Kecamatan (27)</label>
            <select
              value={filters.selectedKecamatan}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedKecamatan: e.target.value }))}
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 text-slate-900 dark:text-white font-medium focus:border-cyan-500"
            >
              <option value="Semua">Semua Kecamatan (27)</option>
              {BANYUMAS_KECAMATAN_NAMES.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Filter Jenis Fasilitas / Sektor Entitas */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Jenis Fasilitas / Sektor</label>
            <select
              value={filters.selectedJenisEntitas || "Semua"}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedJenisEntitas: e.target.value }))}
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 text-slate-900 dark:text-white font-medium focus:border-cyan-500"
            >
              <option value="Semua">Semua Sektor / Fasilitas</option>
              {ENTITAS_OPTIONS.map((ent, i) => (
                <option key={i} value={ent}>{ent}</option>
              ))}
            </select>
          </div>

          {/* Filter Kategori Anomali */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Kategori Anomali</label>
            <select
              value={filters.selectedKategori}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedKategori: e.target.value }))}
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 text-slate-900 dark:text-white font-medium focus:border-cyan-500"
            >
              <option value="Semua">Semua Kategori (Data 1–8)</option>
              {KATEGORI_OPTIONS.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Filter Tindak Lanjut */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Status Tindak Lanjut</label>
            <select
              value={filters.selectedTindakLanjut}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedTindakLanjut: e.target.value }))}
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 text-slate-900 dark:text-white font-medium focus:border-cyan-500"
            >
              <option value="Semua">Semua Status</option>
              <option value="Belum Ditindaklanjuti">Belum Ditindaklanjuti</option>
              <option value="Sudah Ditindaklanjuti">Sudah Ditindaklanjuti</option>
              <option value="Sudah Ditindaklanjuti (Dengan Penjelasan)">Sudah (Dengan Penjelasan)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-xl overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 sticky top-0 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Fasih ID / Assignment</th>
                <th 
                  className="p-3.5 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition"
                  onClick={() => handleSort("nama_usaha")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Nama Usaha & Fasilitas</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th 
                  className="p-3.5 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition"
                  onClick={() => handleSort("nama_kecamatan")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Alamat SLS / Desa / Kec</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="p-3.5">Tipe & Kategori Anomali</th>
                <th className="p-3.5 text-center">Status Tindak Lanjut</th>
                <th className="p-3.5">Petugas / Pengunggah</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-300">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((r, idx) => {
                  const isKeluarga = r.tipe_anomali === "Keluarga";

                  return (
                    <tr 
                      key={`row-${r.no}-${r.fasih || idx}`} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                      onClick={() => setSelectedRecord(r)}
                    >
                      <td className="p-3.5 font-mono">
                        <span className="text-cyan-600 dark:text-cyan-400 font-bold block truncate max-w-[140px]" title={r.fasih}>
                          {r.fasih.replace("https://fasih-sm.bps.go.id/app/assignment-detail/", "FASH-")}
                        </span>
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]" title={r.assignment}>
                          {r.assignment}
                        </p>
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{r.nama_usaha}</p>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                            {r.jenis_entitas || "Usaha"}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            KRT: <span className="font-semibold text-slate-700 dark:text-slate-300">{r.nama_keluarga}</span>
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-start space-x-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">Kec. {r.nama_kecamatan}</span>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400">{r.nama_desa}</p>
                            <p className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">{r.nama_sls}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isKeluarga
                              ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                              : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          }`}>
                            {isKeluarga ? <Users className="h-3 w-3 mr-0.5" /> : <Building2 className="h-3 w-3 mr-0.5" />}
                            <span>Anomali {r.tipe_anomali}</span>
                          </span>
                          <p className="font-semibold text-slate-900 dark:text-white text-[11px]">{r.kategori_deskripsi}</p>
                        </div>
                      </td>

                      <td className="p-3.5 text-center">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          r.tindak_lanjut.includes("Penjelasan")
                            ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                            : r.tindak_lanjut.toLowerCase().includes("belum")
                            ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                            : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                        }`}>
                          {r.tindak_lanjut.toLowerCase().includes("belum") ? <Clock className="h-3 w-3 mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                          <span>{r.tindak_lanjut}</span>
                        </span>
                      </td>

                      <td className="p-3.5">
                        <p className="font-medium text-slate-900 dark:text-white truncate max-w-[120px]" title={r.petugas}>
                          {r.petugas}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[120px]" title={r.pengunggah}>
                          Upload: {r.pengunggah}
                        </p>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(r);
                          }}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-[11px] transition"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Tidak ditemukan data anomali yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 gap-3">
          <div>
            Menampilkan{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {filteredRecords.length === 0 ? 0 : startIndex + 1}–{endIndex}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-slate-900 dark:text-white">{filteredRecords.length.toLocaleString("id-ID")}</span> Record
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
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
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button
                disabled={validCurrentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              <button
                disabled={validCurrentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="px-2 font-semibold text-slate-800 dark:text-slate-200">
                Halaman {validCurrentPage} dari {totalPages}
              </span>

              <button
                disabled={validCurrentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                disabled={validCurrentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Record Detail Modal */}
      <BusinessDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Anomaly Guide Modal */}
      <AnomalyGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}
