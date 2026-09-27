import { BpsFasihRecord, TipeAnomali } from "@/types/anomali";

export function detectBpsAnomalies(records: Partial<BpsFasihRecord>[]): BpsFasihRecord[] {
  const total = records.length;
  const result: BpsFasihRecord[] = new Array(total);

  for (let index = 0; index < total; index++) {
    const r = records[index];
    const no = r.no || index + 1;
    const fasih = r.fasih || `FASH-3302-${String(index + 1).padStart(5, "0")}`;
    const fasih_edit = r.fasih_edit || "";
    const fasih_reject = r.fasih_reject || "";
    const kode_kab = r.kode_kab || "3302";
    const nama_kab = r.nama_kab || "Kabupaten Banyumas";
    const nama_kecamatan = r.nama_kecamatan || "Purwokerto Timur";
    const kode_kec = r.kode_kec || "3302010";
    const kode_desa = r.kode_desa || `33022600${(index % 10) + 1}`;
    const nama_desa = r.nama_desa || `Desa ${nama_kecamatan} ${((index % 5) + 1)}`;
    const kode_sls = r.kode_sls || `SLS-00${(index % 8) + 1}`;
    const nama_sls = r.nama_sls || `RT 0${(index % 5) + 1} RW 0${(index % 3) + 1}`;
    const assignment = r.assignment || `ASG-2026-${String(index + 101)}`;
    const nama_usaha = r.nama_usaha || "Usaha Tanpa Nama";
    const nama_keluarga = r.nama_keluarga || "Pemilik Belum Terdaftar";
    const petugas = r.petugas || "Petugas BPS Banyumas";
    const pengunggah = r.pengunggah || "Admin FASIH BPS";
    const link_fasih = r.link_fasih || `https://fasih.bps.go.id/survey/se2026/view/${fasih}`;
    const status_assignment = r.status_assignment || (index % 3 === 0 ? "EDITED BY Admin Kabupaten" : "Assigned");
    const waktu_status_diambil = r.waktu_status_diambil || "2026-02-16 08:30:00";

    const alamat_lengkap = r.alamat_lengkap || (nama_sls && nama_desa 
      ? `${nama_sls}, ${nama_desa}, Kec. ${nama_kecamatan}, Kab. Banyumas` 
      : `${nama_desa || 'Desa'}, Kec. ${nama_kecamatan}, Kab. Banyumas`);

    let rawAnomali = r.nama_anomali;
    if (!rawAnomali || rawAnomali === "Normal" || rawAnomali.trim() === "") {
      const omz = r.omzet ?? 0;
      const kar = r.jumlah_karyawan ?? 0;

      if (omz === 0 && kar > 0) {
        rawAnomali = "Jumlah Anomali Data 5 (Konsistensi Aset, Pekerja & Produksi) omset Rp 0 tetapi memiliki tenaga kerja";
      } else if (omz > 100000000 && kar === 0) {
        rawAnomali = "Jumlah Anomali Data 5 (Konsistensi Aset, Pekerja & Produksi) omset tinggi tanpa tenaga kerja";
      } else if (omz === 0 && kar === 0) {
        rawAnomali = "Jumlah Anomali Data 4 (Data Keuangan MBG / KRT) omset dan tenaga kerja Rp 0";
      } else if (omz > 0 && omz < 1000000 && kar >= 10) {
        rawAnomali = "Jumlah Anomali Data 2 (Keuntungan Usaha) ketidakwajaran rasio omset dan tenaga kerja";
      } else if (omz >= 1000000000) {
        rawAnomali = "Jumlah Anomali Data 7 (laporan keuangan) usaha menengah/besar tanpa laporan keuangan";
      } else {
        const defaultAnomalies = [
          "Jumlah Anomali Data 1 (Biaya Produksi Dominan) belum ditindaklanjuti",
          "Jumlah Anomali Data 2 (Keuntungan Usaha) belum ditindaklanjuti",
          "Jumlah Anomali Data 3 (modal korporasi) belum ditindaklanjuti",
          "Jumlah Anomali Data 4 (Data Keuangan MBG / KRT) belum ditindaklanjuti",
          "Jumlah Anomali Data 5 (Konsistensi Aset, Pekerja & Produksi) belum ditindaklanjuti",
          "Jumlah Anomali Data 6 (internet) usaha menengah/besar tanpa internet",
          "Jumlah Anomali Data 7 (laporan keuangan) usaha menengah/besar tanpa laporan keuangan",
          "Jumlah Anomali Data 8 (KBLI) perbedaan KBLI 2 digit dengan SBR"
        ];
        rawAnomali = defaultAnomalies[index % defaultAnomalies.length];
      }
    }
    
    // Classify Usaha vs Keluarga
    let tipe_anomali: TipeAnomali = "Usaha";
    let kategori_deskripsi = "Biaya Produksi Dominan (Data 1)";
    const rawAnomaliLower = rawAnomali.toLowerCase();

    if (
      rawAnomaliLower.includes("data 3") || 
      rawAnomaliLower.includes("keluarga 3") || 
      rawAnomaliLower.includes("modal korporasi") || 
      rawAnomaliLower.includes("disabilitas")
    ) {
      tipe_anomali = "Keluarga";
      kategori_deskripsi = "Modal Korporasi Non-Badan Usaha (Data 3)";
    } else if (
      rawAnomaliLower.includes("data 4") || 
      rawAnomaliLower.includes("keluarga 4") || 
      rawAnomaliLower.includes("mbg")
    ) {
      tipe_anomali = "Keluarga";
      kategori_deskripsi = "Data Keuangan MBG / KRT (Data 4)";
    } else if (
      rawAnomaliLower.includes("data 1") || 
      rawAnomaliLower.includes("anomali 1") || 
      rawAnomaliLower.includes("biaya produksi")
    ) {
      tipe_anomali = "Usaha";
      kategori_deskripsi = "Biaya Produksi Dominan (Data 1)";
    } else if (
      rawAnomaliLower.includes("data 2") || 
      rawAnomaliLower.includes("anomali 2") || 
      rawAnomaliLower.includes("keuntungan usaha")
    ) {
      tipe_anomali = "Usaha";
      kategori_deskripsi = "Keuntungan Usaha (Data 2)";
    } else if (
      rawAnomaliLower.includes("data 5") || 
      rawAnomaliLower.includes("anomali 5") || 
      rawAnomaliLower.includes("konsistensi")
    ) {
      tipe_anomali = "Usaha";
      kategori_deskripsi = "Konsistensi Aset, Pekerja & Produksi (Data 5)";
    } else if (
      rawAnomaliLower.includes("data 6") || 
      rawAnomaliLower.includes("anomali 6") || 
      rawAnomaliLower.includes("internet")
    ) {
      tipe_anomali = "Usaha";
      kategori_deskripsi = "Usaha Menengah/Besar Tanpa Internet (Data 6)";
    } else if (
      rawAnomaliLower.includes("data 7") || 
      rawAnomaliLower.includes("anomali 7") || 
      rawAnomaliLower.includes("laporan keuangan")
    ) {
      tipe_anomali = "Usaha";
      kategori_deskripsi = "Usaha Menengah/Besar Tanpa Lap. Keuangan (Data 7)";
    } else if (
      rawAnomaliLower.includes("data 8") || 
      rawAnomaliLower.includes("anomali 8") || 
      rawAnomaliLower.includes("kbli") || 
      rawAnomaliLower.includes("sbr")
    ) {
      tipe_anomali = "Usaha";
      kategori_deskripsi = "Perbedaan KBLI 2 Digit & SBR (Data 8)";
    } else if (rawAnomaliLower.includes("keluarga")) {
      tipe_anomali = "Keluarga";
      kategori_deskripsi = "Modal Korporasi Non-Badan Usaha (Data 3)";
    }

    let tindak_lanjut = r.tindak_lanjut || "Belum Ditindaklanjuti";
    const tlLower = tindak_lanjut.toLowerCase();
    if (tlLower.includes("penjelasan") || tlLower.includes("sesuai kondisi")) {
      tindak_lanjut = "Sudah Ditindaklanjuti (Dengan Penjelasan)";
    } else if (tlLower.includes("belum")) {
      tindak_lanjut = "Belum Ditindaklanjuti";
    } else if (tlLower.includes("sudah") || tlLower.includes("selesai") || tlLower.includes("approved")) {
      tindak_lanjut = "Sudah Ditindaklanjuti";
    }

    result[index] = {
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
      tipe_anomali,
      kategori_deskripsi,
      nama_anomali: rawAnomali,
      tindak_lanjut,
      petugas,
      pengunggah,
      link_fasih,
      status_assignment,
      waktu_status_diambil,
      catatan_sistem: r.catatan_sistem || `Data FASIH BPS [${tipe_anomali}]: ${kategori_deskripsi}`
    };
  }

  return result;
}
