"use client";

import React, { useState, useRef } from "react";
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useData } from "@/context/DataContext";
import { BpsFasihRecord } from "@/types/anomali";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
  const { loadCustomData } = useData();
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<Partial<BpsFasihRecord>[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    setErrorMsg(null);
    setFileName(file.name);
    setIsLoading(true);

    const isCsv = file.name.endsWith(".csv");
    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

    if (!isCsv && !isExcel) {
      setErrorMsg("Format file tidak didukung. Harap unggah file .CSV atau .XLSX / .XLS");
      setIsLoading(false);
      return;
    }

    if (isCsv) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          mapAndSetData(results.data as any[]);
        },
        error: (err: any) => {
          setErrorMsg(`Gagal membaca file CSV: ${err.message}`);
          setIsLoading(false);
        }
      });
    } else if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonResult = XLSX.utils.sheet_to_json(worksheet);
          mapAndSetData(jsonResult as any[]);
        } catch (err: any) {
          setErrorMsg(`Gagal memproses Excel: ${err.message}`);
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const normalizeKey = (str: string): string => {
    return str.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const getFuzzyValue = (row: any, candidateKeys: string[]): string | undefined => {
    if (!row || typeof row !== 'object') return undefined;
    
    const normalizedRow: Record<string, any> = {};
    for (const k of Object.keys(row)) {
      normalizedRow[normalizeKey(k)] = row[k];
    }

    for (const candidate of candidateKeys) {
      const normCand = normalizeKey(candidate);
      const val = normalizedRow[normCand];
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        return String(val).trim();
      }
    }
    return undefined;
  };

  const toTitleCase = (str: string): string => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const mapAndSetData = (rawData: any[]) => {
    if (!rawData || rawData.length === 0) {
      setErrorMsg("File tidak berisi data atau format tidak valid");
      setIsLoading(false);
      return;
    }

    const mapped: Partial<BpsFasihRecord>[] = [];

    rawData.forEach((row, idx) => {
      // Filter out subheader / legend rows like "(1)", "(2)", "(3)"
      const rawNo = String(row.No || row.no || "").trim();
      if (rawNo.startsWith("(") || rawNo === "(1)") return;

      const no = Number(getFuzzyValue(row, ["no", "nomor", "num", "idx"]) || idx + 1);
      const fasih = getFuzzyValue(row, ["fasih", "linkfasih", "fasihid", "kodeusaha", "assignmentid", "assignment", "id"]) || `FASH-3302-${String(idx + 1).padStart(5, "0")}`;
      const fasih_edit = getFuzzyValue(row, ["fasihedit", "linkedit"]) || "";
      const fasih_reject = getFuzzyValue(row, ["fasihrejectjadul", "fasihrejec", "fasihreject"]) || "";
      const kode_kab = getFuzzyValue(row, ["kodekabkota", "kodekabk", "kodekab", "kodekabupaten"]) || "3302";
      const nama_kab = toTitleCase(getFuzzyValue(row, ["namakabkota", "namakab", "namakabupaten", "kabupaten"]) || "Banyumas");
      const kode_kec = getFuzzyValue(row, ["kodekec", "kodewilayah", "kodekecamatan"]) || "3302010";
      
      const rawKec = getFuzzyValue(row, ["namakecamatan", "namakeca", "kecamatan", "kec"]) || "Purwokerto Timur";
      const nama_kecamatan = toTitleCase(rawKec);

      const kode_desa = getFuzzyValue(row, ["kodedesa", "kodedesakel", "kodekelurahan"]) || "";
      const nama_desa = toTitleCase(getFuzzyValue(row, ["namadesakel", "namadesa", "desa", "kelurahan"]) || "");

      const kode_sls = getFuzzyValue(row, ["kodeslssubslsnonsls", "kodeslss", "kodesls", "subsls"]) || "";
      const nama_sls = getFuzzyValue(row, ["namaslssubslsnonsls", "namasls", "sls"]) || "";
      const assignment = getFuzzyValue(row, ["assignmentid", "assignment", "id"]) || `ASG-2026-${idx + 1}`;
      
      const nama_usaha = getFuzzyValue(row, ["namausaha", "namausah", "namausahakepalakeluarga", "usaha"]) || `Usaha #${idx + 1}`;
      const nama_keluarga = getFuzzyValue(row, ["namakeluarga", "namakelu", "namapemilik", "pemilik", "krt", "namausahakepalakeluarga"]) || "Pemilik Belum Terdaftar";
      
      const nama_anomali = getFuzzyValue(row, ["daftaranomali", "namaanomali", "namaanom", "jenisanomali", "anomali", "namaanomalidata", "kategorianomali"]) || "";
      const tindak_lanjut = getFuzzyValue(row, ["tindaklanjut", "tindaklanj", "statustindaklanjut", "statustl"]) || "Belum Ditindaklanjuti";
      
      const petugas = getFuzzyValue(row, ["petugas", "idpetugas", "emailpetugas", "namapetugas", "pml", "ppl"]) || "Petugas BPS Banyumas";
      const pengunggah = getFuzzyValue(row, ["pengunggah", "pengunggal", "admin"]) || "Admin FASIH BPS";
      const link_fasih = getFuzzyValue(row, ["linkfasih", "fasih", "urlfasih"]) || `https://fasih.bps.go.id/survey/se2026/view/${fasih}`;
      const status_assignment = getFuzzyValue(row, ["statusassignment", "statusassi", "status"]) || "Assigned";
      const waktu_status_diambil = getFuzzyValue(row, ["waktustatusdiambil", "waktustatus", "tanggalpendataan", "tanggal", "waktu"]) || "2026-02-16 08:30:00";
      const alamat_lengkap = getFuzzyValue(row, ["alamatlengkap", "alamat"]) || "";
      
      const rawOmz = getFuzzyValue(row, ["totalpendapatan", "omzet", "omset", "omsetrp", "pendapatan"]);
      const omzet = rawOmz && !isNaN(Number(rawOmz)) ? Number(rawOmz) : 0;
      
      const rawKar = getFuzzyValue(row, ["jumlahartbekerja", "tkdibayar", "jumlahkaryawan", "karyawan", "tenagakerja", "pekerja"]);
      const jumlah_karyawan = rawKar && !isNaN(Number(rawKar)) ? Number(rawKar) : 0;

      mapped.push({
        no,
        fasih,
        fasih_edit,
        fasih_reject,
        kode_kab,
        nama_kab,
        kode_kec,
        nama_kecamatan,
        kode_desa,
        nama_desa,
        kode_sls,
        nama_sls,
        alamat_lengkap,
        assignment,
        nama_usaha,
        nama_keluarga,
        nama_anomali,
        tindak_lanjut,
        petugas,
        pengunggah,
        link_fasih,
        status_assignment,
        waktu_status_diambil,
        omzet,
        jumlah_karyawan
      });
    });

    if (mapped.length === 0) {
      setErrorMsg("Tidak ada data valid yang dapat dibaca dari file ini.");
      setIsLoading(false);
      return;
    }

    setParsedPreview(mapped);
    setIsLoading(false);
  };

  const handleApply = () => {
    if (parsedPreview.length > 0) {
      loadCustomData(parsedPreview);
      onClose();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const loadPublicDataset = async (filePath: string = "/raw_anomali_usaha.csv") => {
    setErrorMsg(null);
    setIsLoading(true);
    const basename = filePath.split("/").pop() || filePath;
    setFileName(basename);
    try {
      if (filePath.endsWith(".xlsx") || filePath.endsWith(".xls")) {
        const res = await fetch(filePath);
        const arrayBuffer = await res.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonResult = XLSX.utils.sheet_to_json(worksheet);
        mapAndSetData(jsonResult as any[]);
      } else {
        const response = await fetch(filePath);
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            mapAndSetData(results.data as any[]);
          },
          error: (err: any) => {
            setErrorMsg(`Gagal membaca ${basename}: ${err.message}`);
            setIsLoading(false);
          }
        });
      }
    } catch (err: any) {
      setErrorMsg(`Gagal memuat dataset: ${err.message}`);
      setIsLoading(false);
    }
  };

  const downloadSampleTemplate = () => {
    const sampleRows = [
      {
        No: 1,
        Fasih: "FASH-3302-00101",
        "Fasih Edit": "",
        "Fasih Rejec": "",
        "Kode Kab/K": "3302",
        "Nama Kab/": "Kabupaten Banyumas",
        "Kode Kec": "33.02.26",
        "Nama Keca": "Purwokerto Timur",
        "Kode Desa": "3302260001",
        "Nama Desa": "Purwokerto Lor",
        "Kode SLS/S": "SLS-001",
        "Nama SLS/": "RT 02 RW 03",
        Assignment: "ASG-2026-101",
        "Nama Usah": "Toko Kelontong Berkah",
        "Nama Kelu": "H. Slamet Widodo",
        "Nama Anom": "Ketidakwajaran Rasio Omset & Pekerja",
        "Tindak Lanj": "Perlu Ground Check",
        Petugas: "Eko Prasetyo (PML)",
        Pengunggal: "Admin FASIH BPS",
        "Link Fasih": "https://fasih.bps.go.id/survey/se2026/view/FASH-001",
        "Status Assi": "Assigned",
        "Waktu Status diambil": "2026-02-16 08:30:00"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "raw_anomali_usaha");
    XLSX.writeFile(workbook, "template_raw_anomali_usaha_BPS_FASIH.xlsx");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-slate-900 dark:text-white transition-colors duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unggah Dataset Anomali BPS FASIH</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dukungan CSV & Excel (.xlsx/.xls) Universal Multi-Format BPS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            dragActive
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/80"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            className="hidden"
          />
          
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 mb-3 border border-slate-200 dark:border-slate-700">
            <UploadCloud className="h-7 w-7" />
          </div>

          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Tarik & Lepas file dataset FASIH BPS di sini, atau <span className="text-cyan-600 dark:text-cyan-400 underline">Pilih File</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Format Otomatis: Membaca variasi nama kolom (Nama Usaha, Kecamatan, Daftar Anomali, Omzet, dll.)
          </p>
        </div>

        {/* Quick Load Buttons for Public Datasets */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Atau muat dataset dari folder public:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                loadPublicDataset("/raw_anomali_usaha_1785728664285.csv");
              }}
              className="flex items-center space-x-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:underline bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg border border-cyan-500/30 transition"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>CSV Anomali Banyumas (9.128 record)</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                loadPublicDataset("/1908 Data_Mikro_Anomali_Gabungan_3302_20260819_092048.xlsx");
              }}
              className="flex items-center space-x-1.5 text-xs text-purple-600 dark:text-purple-400 hover:underline bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 rounded-lg border border-purple-500/30 transition"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Excel Anomali Gabungan (19.454 record)</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                loadPublicDataset("/raw_anomali_usaha.csv");
              }}
              className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Sample raw_anomali_usaha (16 record)</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 flex items-center space-x-2 rounded-lg bg-rose-500/10 p-3 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* File Preview */}
        {parsedPreview.length > 0 && !isLoading && (
          <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>File &apos;{fileName}&apos; Berhasil Dibaca</span>
              </div>
              <span className="text-xs font-bold bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                {parsedPreview.length} Record Data FASIH
              </span>
            </div>

            <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 sticky top-0">
                  <tr>
                    <th className="p-2">Fasih ID</th>
                    <th className="p-2">Nama Usaha</th>
                    <th className="p-2">Kecamatan</th>
                    <th className="p-2">Nama Anomali</th>
                    <th className="p-2">Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 text-slate-800 dark:text-slate-300">
                  {parsedPreview.slice(0, 5).map((r, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-mono text-cyan-600 dark:text-cyan-400">{r.fasih}</td>
                      <td className="p-2 font-medium">{r.nama_usaha}</td>
                      <td className="p-2">{r.nama_kecamatan}</td>
                      <td className="p-2 font-semibold text-amber-600 dark:text-amber-400">{r.nama_anomali}</td>
                      <td className="p-2 text-[11px]">{r.tindak_lanjut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedPreview.length > 5 && (
              <p className="text-[11px] text-slate-500 text-right mt-1">
                ...dan {parsedPreview.length - 5} baris lainnya
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={downloadSampleTemplate}
            className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Unduh Contoh Template Excel FASIH BPS</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto rounded-lg px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              onClick={handleApply}
              disabled={parsedPreview.length === 0 || isLoading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2 text-xs font-bold shadow-md shadow-emerald-900/30 transition"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Proses Data FASIH Ke Dashboard</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
