export type TipeAnomali = "Usaha" | "Keluarga";

export type StatusTindakLanjut = 
  | "Belum Ditindaklanjuti"
  | "Sudah Ditindaklanjuti"
  | "Sudah Ditindaklanjuti (Dengan Penjelasan)"
  | "Semua";

export type StatusAssignment = string;

export interface BpsFasihRecord {
  no: number;
  fasih: string;
  fasih_edit?: string;
  fasih_reject?: string;
  kode_kab: string; // "3302"
  nama_kab: string; // "Kabupaten Banyumas"
  kode_kec: string; // e.g. "3302090"
  nama_kecamatan: string;
  kode_desa: string;
  nama_desa: string;
  kode_sls: string;
  nama_sls: string;
  alamat_lengkap: string;
  assignment: string;
  nama_usaha: string;
  nama_keluarga: string; // Pemilik / KRT
  tipe_anomali: TipeAnomali;
  kategori_deskripsi: string;
  nama_anomali: string;
  tindak_lanjut: string;
  petugas: string;
  pengunggah: string;
  link_fasih?: string;
  status_assignment: string;
  waktu_status_diambil: string;
  catatan_sistem?: string;
  jenis_entitas?: string;
  omzet?: number;
  jumlah_karyawan?: number;
}

export interface KecamatanStat {
  kode_wilayah: string;
  nama_kecamatan: string;
  total_usaha: number;
  total_anomali: number;
  anomali_usaha: number;
  anomali_keluarga: number;
  sudah_ditindaklanjuti: number;
  belum_ditindaklanjuti: number;
  dengan_penjelasan: number;
  persentase_belum: number;
  progress_penyelesaian: number;
  persentase_anomali: number;
  anomali_dominan: string;
  skor_prioritas: number; // 0 - 100
  peringkat_prioritas: number; // 1 - 27
  rekomendasi_tindak_lanjur: "Prioritas 1 (Tindak Lanjut Segera)" | "Prioritas 2 (Verifikasi Berkas & Pengawasan)" | "Prioritas 3 (Terkendali & Pemantauan)";
  breakdown_jenis: Record<string, number>;
  breakdown_tindak_lanjut: Record<string, number>;
  coordinates: [number, number]; // [lat, lng]
}

export interface FilterState {
  searchQuery: string;
  selectedKecamatan: string; // "Semua" or specific name
  selectedTipeAnomali: string; // "Semua" | "Usaha" | "Keluarga"
  selectedKategori: string; // "Semua" or specific category description
  selectedTindakLanjut: string; // "Semua" or specific status
  selectedStatusAssignment: string; // "Semua" or specific assignment status
  selectedJenisEntitas: string; // "Semua" or specific entity classification
}

export interface SummaryStats {
  totalRecords: number;
  totalAnomali: number;
  totalAnomaliUsaha: number;
  totalAnomaliKeluarga: number;
  totalSudahDitindaklanjuti: number;
  totalBelumDitindaklanjuti: number;
  totalDenganPenjelasan: number;
  persentaseBelum: number;
  persentaseSudah: number;
  topKecamatanAnomali: { nama: string; jumlah: number; belum: number; usaha: number; keluarga: number }[];
  breakdownSemuaKategori: { kategori: string; shortLabel: string; count: number; percentage: number; color: string }[];
  breakdownKategoriUsaha: { kategori: string; count: number; percentage: number }[];
  breakdownKategoriKeluarga: { kategori: string; count: number; percentage: number }[];
  breakdownTindakLanjut: { status: string; count: number; percentage: number; color: string }[];
  breakdownStatusAssignment: { status: string; count: number; percentage: number }[];
  breakdownJenisEntitas: { jenis: string; count: number; percentage: number; color: string }[];
  topPetugas: { nama: string; total: number; belum: number; sudah: number }[];
}
