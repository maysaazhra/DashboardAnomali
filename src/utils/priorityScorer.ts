import { BpsFasihRecord, KecamatanStat, SummaryStats } from "@/types/anomali";
import { BANYUMAS_KECAMATAN_LIST } from "@/data/banyumasKecamatan";

export function classifyEntity(namaUsaha: string, namaKeluarga: string, tipeAnomali: string): string {
  const combined = `${namaUsaha || ''} ${namaKeluarga || ''}`.toLowerCase();

  if (
    combined.includes('rumah sakit') || 
    combined.includes('rs ') || 
    combined.includes('rsud') || 
    combined.includes('klinik') || 
    combined.includes('apotek') || 
    combined.includes('bidan') || 
    combined.includes('dokter') || 
    combined.includes('puskesmas') || 
    combined.includes('optik') || 
    combined.includes('laboratorium') || 
    combined.includes('fisioterapi')
  ) {
    return 'Fasilitas Kesehatan (RS/Klinik/Apotek)';
  }

  if (
    combined.includes('sekolah') || 
    combined.includes('sd ') || 
    combined.includes('sdn') || 
    combined.includes('smp') || 
    combined.includes('sma') || 
    combined.includes('smk') || 
    combined.includes('tk ') || 
    combined.includes('paud') || 
    combined.includes('madrasah') || 
    combined.includes('mi ') || 
    combined.includes('mts') || 
    combined.includes('ma ') || 
    combined.includes('universitas') || 
    combined.includes('kursus') || 
    combined.includes('bimbel')
  ) {
    return 'Pendidikan (Sekolah/Madrasah/PAUD)';
  }

  if (
    combined.includes('pondok') || 
    combined.includes('pesantren') || 
    combined.includes('yayasan') || 
    combined.includes('panti') || 
    combined.includes('masjid') || 
    combined.includes('mushola') || 
    combined.includes('gereja')
  ) {
    return 'Pondok Pesantren & Yayasan/Sosial';
  }

  if (
    combined.includes('rumah') || 
    tipeAnomali === 'Keluarga' || 
    combined.includes('keluarga') || 
    combined.includes('krt') || 
    combined.includes('kos') || 
    combined.includes('kontrakan')
  ) {
    return 'Tempat Tinggal / Usaha Rumahan';
  }

  if (
    combined.includes('toko') || 
    combined.includes('warung') || 
    combined.includes('kios') || 
    combined.includes('kelontong') || 
    combined.includes('mart') || 
    combined.includes('sembako') || 
    combined.includes('agen') || 
    combined.includes('distributor') || 
    combined.includes('pasar')
  ) {
    return 'Perdagangan & Toko/Warung';
  }

  if (
    combined.includes('pabrik') || 
    combined.includes('industri') || 
    combined.includes('konveksi') || 
    combined.includes('kerajinan') || 
    combined.includes('mebel') || 
    combined.includes('kayu') || 
    combined.includes('genteng') || 
    combined.includes('bata') || 
    combined.includes('produksi')
  ) {
    return 'Industri / Pabrik / Kerajinan';
  }

  if (
    combined.includes('bengkel') || 
    combined.includes('servis') || 
    combined.includes('laundry') || 
    combined.includes('salon') || 
    combined.includes('cukur') || 
    combined.includes('jahit') || 
    combined.includes('fotocopy') || 
    combined.includes('rental') || 
    combined.includes('cuci')
  ) {
    return 'Jasa & Bengkel/Servis';
  }

  if (
    combined.includes('warung makan') || 
    combined.includes('bakso') || 
    combined.includes('mie') || 
    combined.includes('resto') || 
    combined.includes('cafe') || 
    combined.includes('kedai') || 
    combined.includes('katering') || 
    combined.includes('soto') || 
    combined.includes('makan')
  ) {
    return 'Kuliner & Makanan/Minuman';
  }

  return 'Usaha Jasa & Niaga Lainnya';
}

export function calculateKecamatanStats(records: BpsFasihRecord[]): KecamatanStat[] {
  // Single-pass accumulator map
  const accMap = new Map<string, {
    total_usaha: number;
    total_anomali: number;
    anomali_usaha: number;
    anomali_keluarga: number;
    sudah_ditindaklanjuti: number;
    belum_ditindaklanjuti: number;
    dengan_penjelasan: number;
    breakdown_jenis: Record<string, number>;
    breakdown_tindak_lanjut: Record<string, number>;
  }>();

  // Initialize for all 27 kecamatan with lowercase keys
  BANYUMAS_KECAMATAN_LIST.forEach(k => {
    accMap.set(k.nama.toLowerCase().trim(), {
      total_usaha: 0,
      total_anomali: 0,
      anomali_usaha: 0,
      anomali_keluarga: 0,
      sudah_ditindaklanjuti: 0,
      belum_ditindaklanjuti: 0,
      dengan_penjelasan: 0,
      breakdown_jenis: {},
      breakdown_tindak_lanjut: {}
    });
  });

  // Single pass O(N)
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const kecKey = (r.nama_kecamatan || "").trim().toLowerCase();
    let entry = accMap.get(kecKey);
    if (!entry) {
      entry = {
        total_usaha: 0,
        total_anomali: 0,
        anomali_usaha: 0,
        anomali_keluarga: 0,
        sudah_ditindaklanjuti: 0,
        belum_ditindaklanjuti: 0,
        dengan_penjelasan: 0,
        breakdown_jenis: {},
        breakdown_tindak_lanjut: {}
      };
      accMap.set(kecKey, entry);
    }
    entry.total_usaha++;

    if (r.nama_anomali !== "Normal") {
      entry.total_anomali++;

      if (r.tipe_anomali === "Keluarga") {
        entry.anomali_keluarga++;
      } else {
        entry.anomali_usaha++;
      }

      const tl = r.tindak_lanjut || "";
      if (tl.includes("Penjelasan")) {
        entry.dengan_penjelasan++;
      } else if (tl.toLowerCase().includes("belum")) {
        entry.belum_ditindaklanjuti++;
      } else {
        entry.sudah_ditindaklanjuti++;
      }

      const kategoriKey = r.kategori_deskripsi || r.nama_anomali;
      entry.breakdown_jenis[kategoriKey] = (entry.breakdown_jenis[kategoriKey] || 0) + 1;
      entry.breakdown_tindak_lanjut[r.tindak_lanjut] = (entry.breakdown_tindak_lanjut[r.tindak_lanjut] || 0) + 1;
    }
  }

  const statsList: KecamatanStat[] = BANYUMAS_KECAMATAN_LIST.map(kecMaster => {
    const entry = accMap.get(kecMaster.nama.toLowerCase().trim()) || {
      total_usaha: 0,
      total_anomali: 0,
      anomali_usaha: 0,
      anomali_keluarga: 0,
      sudah_ditindaklanjuti: 0,
      belum_ditindaklanjuti: 0,
      dengan_penjelasan: 0,
      breakdown_jenis: {},
      breakdown_tindak_lanjut: {}
    };
    const total_usaha = entry.total_usaha || kecMaster.estimasiUsaha;
    const total_anomali = entry.total_anomali;
    const persentase_anomali = total_usaha > 0 ? (total_anomali / total_usaha) * 100 : 0;
    const persentase_belum = total_anomali > 0 ? (entry.belum_ditindaklanjuti / total_anomali) * 100 : 0;
    const progress_penyelesaian = total_anomali > 0 ? ((entry.sudah_ditindaklanjuti + entry.dengan_penjelasan) / total_anomali) * 100 : 0;

    // Find dominant anomaly in this kecamatan
    let anomali_dominan = "-";
    let maxCount = 0;
    Object.entries(entry.breakdown_jenis).forEach(([kat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        // Clean short name
        anomali_dominan = kat.replace(/ \(Data \d+\)/, "");
      }
    });

    const rawScore = (persentase_belum * 0.7) + (Math.min(30, entry.belum_ditindaklanjuti / 10) * 1.0);
    const skor_prioritas = Math.min(100, Math.max(5, Math.round(rawScore)));

    let rekomendasi_tindak_lanjur: KecamatanStat["rekomendasi_tindak_lanjur"] = "Prioritas 3 (Terkendali & Pemantauan)";
    if (persentase_belum >= 45 || entry.belum_ditindaklanjuti >= 150) {
      rekomendasi_tindak_lanjur = "Prioritas 1 (Tindak Lanjut Segera)";
    } else if (persentase_belum >= 25 || entry.belum_ditindaklanjuti >= 50) {
      rekomendasi_tindak_lanjur = "Prioritas 2 (Verifikasi Berkas & Pengawasan)";
    }

    return {
      kode_wilayah: kecMaster.kode,
      nama_kecamatan: kecMaster.nama,
      total_usaha,
      total_anomali,
      anomali_usaha: entry.anomali_usaha,
      anomali_keluarga: entry.anomali_keluarga,
      sudah_ditindaklanjuti: entry.sudah_ditindaklanjuti,
      belum_ditindaklanjuti: entry.belum_ditindaklanjuti,
      dengan_penjelasan: entry.dengan_penjelasan,
      persentase_belum: Number(persentase_belum.toFixed(1)),
      progress_penyelesaian: Number(progress_penyelesaian.toFixed(1)),
      persentase_anomali: Number(persentase_anomali.toFixed(1)),
      anomali_dominan,
      skor_prioritas,
      peringkat_prioritas: 0,
      rekomendasi_tindak_lanjur,
      breakdown_jenis: entry.breakdown_jenis,
      breakdown_tindak_lanjut: entry.breakdown_tindak_lanjut,
      coordinates: [kecMaster.lat, kecMaster.lng]
    };
  });

  statsList.sort((a, b) => b.belum_ditindaklanjuti - a.belum_ditindaklanjuti);
  statsList.forEach((stat, idx) => {
    stat.peringkat_prioritas = idx + 1;
  });

  return statsList;
}

export function calculateSummaryStats(records: BpsFasihRecord[]): SummaryStats {
  const totalRecords = records.length;
  let totalAnomali = 0;
  let totalAnomaliUsaha = 0;
  let totalAnomaliKeluarga = 0;
  let totalSudahDitindaklanjuti = 0;
  let totalBelumDitindaklanjuti = 0;
  let totalDenganPenjelasan = 0;

  const kecMap = new Map<string, { total: number; belum: number; usaha: number; keluarga: number }>();
  const allCatMap = new Map<string, number>();
  const usahaCatMap = new Map<string, number>();
  const keluargaCatMap = new Map<string, number>();
  const tlMap = new Map<string, number>();
  const asgMap = new Map<string, number>();
  const entitasMap = new Map<string, number>();
  const petugasMap = new Map<string, { total: number; belum: number; sudah: number }>();

  // Single pass O(N)
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const isAnomali = r.nama_anomali !== "Normal";

    if (isAnomali) {
      totalAnomali++;
      const catKey = r.kategori_deskripsi || r.nama_anomali;
      allCatMap.set(catKey, (allCatMap.get(catKey) || 0) + 1);

      if (r.tipe_anomali === "Keluarga") {
        totalAnomaliKeluarga++;
        keluargaCatMap.set(catKey, (keluargaCatMap.get(catKey) || 0) + 1);
      } else {
        totalAnomaliUsaha++;
        usahaCatMap.set(catKey, (usahaCatMap.get(catKey) || 0) + 1);
      }

      // Entitas classification
      const entitas = r.jenis_entitas || classifyEntity(r.nama_usaha, r.nama_keluarga, r.tipe_anomali);
      entitasMap.set(entitas, (entitasMap.get(entitas) || 0) + 1);

      // Kecamatan tracking
      const kec = r.nama_kecamatan || "Banyumas";
      let kecEntry = kecMap.get(kec);
      if (!kecEntry) {
        kecEntry = { total: 0, belum: 0, usaha: 0, keluarga: 0 };
        kecMap.set(kec, kecEntry);
      }
      kecEntry.total++;
      if (r.tipe_anomali === "Keluarga") kecEntry.keluarga++;
      else kecEntry.usaha++;

      // Petugas tracking
      const pet = r.petugas || "Petugas BPS";
      let petEntry = petugasMap.get(pet);
      if (!petEntry) {
        petEntry = { total: 0, belum: 0, sudah: 0 };
        petugasMap.set(pet, petEntry);
      }
      petEntry.total++;

      const tl = (r.tindak_lanjut || "").toLowerCase();
      if (tl.includes("penjelasan")) {
        totalDenganPenjelasan++;
        petEntry.sudah++;
      } else if (tl.includes("belum")) {
        totalBelumDitindaklanjuti++;
        kecEntry.belum++;
        petEntry.belum++;
      } else {
        totalSudahDitindaklanjuti++;
        petEntry.sudah++;
      }
    }

    const s = r.tindak_lanjut || "Belum Ditindaklanjuti";
    tlMap.set(s, (tlMap.get(s) || 0) + 1);

    const asg = r.status_assignment || "Assigned";
    asgMap.set(asg, (asgMap.get(asg) || 0) + 1);
  }

  const persentaseBelum = totalAnomali > 0 ? Number(((totalBelumDitindaklanjuti / totalAnomali) * 100).toFixed(1)) : 0;
  const persentaseSudah = totalAnomali > 0 ? Number((((totalSudahDitindaklanjuti + totalDenganPenjelasan) / totalAnomali) * 100).toFixed(1)) : 0;

  const topKecamatanAnomali = Array.from(kecMap.entries())
    .map(([nama, val]) => ({
      nama,
      jumlah: val.total,
      belum: val.belum,
      usaha: val.usaha,
      keluarga: val.keluarga
    }))
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, 10);

  const CAT_COLORS: Record<string, string> = {
    "Keuntungan Usaha (Data 2)": "#2563EB",
    "Perbedaan KBLI 2 Digit & SBR (Data 8)": "#EA580C",
    "Biaya Produksi Dominan (Data 1)": "#6366F1",
    "Modal Korporasi Non-Badan Usaha (Data 3)": "#9333EA",
    "Usaha Menengah/Besar Tanpa Lap. Keuangan (Data 7)": "#14B8A6",
    "Data Keuangan MBG / KRT (Data 4)": "#EC4899",
    "Usaha Menengah/Besar Tanpa Internet (Data 6)": "#F59E0B",
    "Konsistensi Aset, Pekerja & Produksi (Data 5)": "#10B981"
  };

  const ENTITAS_COLORS: Record<string, string> = {
    "Tempat Tinggal / Usaha Rumahan": "#8B5CF6",
    "Perdagangan & Toko/Warung": "#F59E0B",
    "Pendidikan (Sekolah/Madrasah/PAUD)": "#3B82F6",
    "Industri / Pabrik / Kerajinan": "#10B981",
    "Jasa & Bengkel/Servis": "#6366F1",
    "Kuliner & Makanan/Minuman": "#EC4899",
    "Fasilitas Kesehatan (RS/Klinik/Apotek)": "#EF4444",
    "Pondok Pesantren & Yayasan/Sosial": "#14B8A6",
    "Usaha Jasa & Niaga Lainnya": "#64748B"
  };

  const breakdownSemuaKategori = Array.from(allCatMap.entries())
    .map(([kategori, count]) => ({
      kategori,
      shortLabel: kategori.replace(/ \(Data \d+\)/, ""),
      count,
      percentage: totalAnomali > 0 ? Number(((count / totalAnomali) * 100).toFixed(1)) : 0,
      color: CAT_COLORS[kategori] || "#3B82F6"
    }))
    .sort((a, b) => b.count - a.count);

  const breakdownKategoriUsaha = Array.from(usahaCatMap.entries())
    .map(([kategori, count]) => ({
      kategori,
      count,
      percentage: totalAnomaliUsaha > 0 ? Number(((count / totalAnomaliUsaha) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const breakdownKategoriKeluarga = Array.from(keluargaCatMap.entries())
    .map(([kategori, count]) => ({
      kategori,
      count,
      percentage: totalAnomaliKeluarga > 0 ? Number(((count / totalAnomaliKeluarga) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const TL_COLORS: Record<string, string> = {
    "Belum Ditindaklanjuti": "#EF4444",
    "Sudah Ditindaklanjuti": "#10B981",
    "Sudah Ditindaklanjuti (Dengan Penjelasan)": "#3B82F6"
  };

  const breakdownTindakLanjut = Array.from(tlMap.entries()).map(([status, count]) => ({
    status,
    count,
    percentage: totalRecords > 0 ? Number(((count / totalRecords) * 100).toFixed(1)) : 0,
    color: TL_COLORS[status] || "#94A3B8"
  }));

  const breakdownStatusAssignment = Array.from(asgMap.entries())
    .map(([status, count]) => ({
      status,
      count,
      percentage: totalRecords > 0 ? Number(((count / totalRecords) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const breakdownJenisEntitas = Array.from(entitasMap.entries())
    .map(([jenis, count]) => ({
      jenis,
      count,
      percentage: totalAnomali > 0 ? Number(((count / totalAnomali) * 100).toFixed(1)) : 0,
      color: ENTITAS_COLORS[jenis] || "#64748B"
    }))
    .sort((a, b) => b.count - a.count);

  const topPetugas = Array.from(petugasMap.entries())
    .map(([nama, val]) => ({
      nama,
      total: val.total,
      belum: val.belum,
      sudah: val.sudah
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return {
    totalRecords,
    totalAnomali,
    totalAnomaliUsaha,
    totalAnomaliKeluarga,
    totalSudahDitindaklanjuti,
    totalBelumDitindaklanjuti,
    totalDenganPenjelasan,
    persentaseBelum,
    persentaseSudah,
    topKecamatanAnomali,
    breakdownSemuaKategori,
    breakdownKategoriUsaha,
    breakdownKategoriKeluarga,
    breakdownTindakLanjut,
    breakdownStatusAssignment,
    breakdownJenisEntitas,
    topPetugas
  };
}
