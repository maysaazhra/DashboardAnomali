"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { BpsFasihRecord, FilterState, KecamatanStat, SummaryStats } from "@/types/anomali";
import { INITIAL_BUSINESS_DATA } from "@/data/sampleDataset";
import { calculateKecamatanStats, calculateSummaryStats } from "@/utils/priorityScorer";
import { detectBpsAnomalies } from "@/utils/anomalyDetector";

export type ThemeMode = "dark" | "light";

interface DataContextType {
  records: BpsFasihRecord[];
  filteredRecords: BpsFasihRecord[];
  kecamatanStats: KecamatanStat[];
  summaryStats: SummaryStats;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  loadCustomData: (newRawRecords: Partial<BpsFasihRecord>[]) => void;
  resetToDefaultData: () => void;
  isCustomDataLoaded: boolean;
  activeKecamatanForMap: string | null;
  setActiveKecamatanForMap: (namaKecamatan: string | null) => void;
  activeRecordForModal: BpsFasihRecord | null;
  setActiveRecordForModal: (record: BpsFasihRecord | null) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialFilterState: FilterState = {
  searchQuery: "",
  selectedKecamatan: "Semua",
  selectedTipeAnomali: "Semua",
  selectedKategori: "Semua",
  selectedTindakLanjut: "Semua",
  selectedStatusAssignment: "Semua",
  selectedJenisEntitas: "Semua"
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<BpsFasihRecord[]>(INITIAL_BUSINESS_DATA);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isCustomDataLoaded, setIsCustomDataLoaded] = useState(false);
  const [activeKecamatanForMap, setActiveKecamatanForMap] = useState<string | null>(null);
  const [activeRecordForModal, setActiveRecordForModal] = useState<BpsFasihRecord | null>(null);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  // Sync theme with document class and localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("bps_se2026_theme") as ThemeMode | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    applyThemeToDOM(initialTheme);
  }, []);

  const applyThemeToDOM = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyThemeToDOM(newTheme);
    localStorage.setItem("bps_se2026_theme", newTheme);
  };

  // Compute Kecamatan Stats & Summary Stats
  const kecamatanStats = useMemo(() => calculateKecamatanStats(records), [records]);
  const summaryStats = useMemo(() => calculateSummaryStats(records), [records]);

  // Filtered records logic
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Search query (Nama usaha, pemilik, id, desa, sls, petugas)
      if (filters.searchQuery.trim() !== "") {
        const q = filters.searchQuery.toLowerCase();
        const matchSearch =
          r.nama_usaha.toLowerCase().includes(q) ||
          r.nama_keluarga.toLowerCase().includes(q) ||
          r.fasih.toLowerCase().includes(q) ||
          r.nama_kecamatan.toLowerCase().includes(q) ||
          r.nama_desa.toLowerCase().includes(q) ||
          r.nama_sls.toLowerCase().includes(q) ||
          r.petugas.toLowerCase().includes(q) ||
          r.pengunggah.toLowerCase().includes(q) ||
          r.kategori_deskripsi.toLowerCase().includes(q) ||
          r.jenis_entitas?.toLowerCase().includes(q) ||
          r.catatan_sistem?.toLowerCase().includes(q);
        if (!matchSearch) return false;
      }

      // Filter Kecamatan
      if (filters.selectedKecamatan !== "Semua" && r.nama_kecamatan !== filters.selectedKecamatan) {
        return false;
      }

      // Filter Tipe Anomali (Usaha / Keluarga)
      if (filters.selectedTipeAnomali !== "Semua" && r.tipe_anomali !== filters.selectedTipeAnomali) {
        return false;
      }

      // Filter Kategori Deskriptif
      if (filters.selectedKategori !== "Semua" && r.kategori_deskripsi !== filters.selectedKategori) {
        return false;
      }

      // Filter Tindak Lanjut
      if (filters.selectedTindakLanjut !== "Semua" && r.tindak_lanjut !== filters.selectedTindakLanjut) {
        return false;
      }

      // Filter Status Assignment
      if (filters.selectedStatusAssignment !== "Semua" && r.status_assignment !== filters.selectedStatusAssignment) {
        return false;
      }

      // Filter Jenis Entitas / Fasilitas
      if (filters.selectedJenisEntitas !== "Semua" && r.jenis_entitas !== filters.selectedJenisEntitas) {
        return false;
      }

      return true;
    });
  }, [records, filters]);

  const resetFilters = () => {
    setFilters(initialFilterState);
    setActiveKecamatanForMap(null);
  };

  const loadCustomData = (newRawRecords: Partial<BpsFasihRecord>[]) => {
    const processed = detectBpsAnomalies(newRawRecords);
    setRecords(processed);
    setIsCustomDataLoaded(true);
    resetFilters();
  };

  const resetToDefaultData = () => {
    setRecords(INITIAL_BUSINESS_DATA);
    setIsCustomDataLoaded(false);
    resetFilters();
  };

  return (
    <DataContext.Provider
      value={{
        records,
        filteredRecords,
        kecamatanStats,
        summaryStats,
        filters,
        setFilters,
        resetFilters,
        loadCustomData,
        resetToDefaultData,
        isCustomDataLoaded,
        activeKecamatanForMap,
        setActiveKecamatanForMap,
        activeRecordForModal,
        setActiveRecordForModal,
        theme,
        toggleTheme
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
