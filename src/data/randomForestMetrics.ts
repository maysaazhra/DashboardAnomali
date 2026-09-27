import { ModelMetrics, PresetScenario } from "@/types/randomForest";

export const RANDOM_FOREST_METRICS: ModelMetrics = {
  modelName: "Random Forest Ensemble Classifier (100 Decision Trees)",
  datasetSource: "BPS Kabupaten Banyumas (Kode Satker 3302) — 19.454 Data Mikro Sensus",
  accuracy: 96.84,
  precision: 95.72,
  recall: 96.15,
  f1Score: 95.93,
  outOfBagScore: 94.8,
  treeDepth: 12,
  nEstimators: 100,
  criterion: "Gini Impurity & Entropy Split",
  trainingSamples: 15563,
  testingSamples: 3891,
  featureImportance: [
    {
      feature: "Rasio Pengeluaran / Pendapatan",
      weight: 34.2,
      description: "Perbandingan total belanja rumah tangga / operasional terhadap omzet riil"
    },
    {
      feature: "Beban Listrik per Bulan vs Skala Usaha",
      weight: 22.5,
      description: "Kesesuaian biaya tagihan listrik PLN dengan kapasitas daya terpasang & omzet"
    },
    {
      feature: "Total Aset & Fasilitas Elektronik",
      weight: 15.8,
      description: "Estimasi nilai aset total, kepemilikan AC, kulkas, laptop terhadap profil usaha"
    },
    {
      feature: "Kondisi Demografi ART & Disabilitas",
      weight: 12.4,
      description: "Proporsi seluruh anggota keluarga menyandang disabilitas (keluarga non-tunggal)"
    },
    {
      feature: "Selisih Pendapatan vs Pengeluaran Riil",
      weight: 8.7,
      description: "Defisit atau surplus bulanan usaha/keluarga yang menyimpang dari tren wilayah"
    },
    {
      feature: "Kesesuaian Kode KBLI & Laporan Keuangan",
      weight: 6.4,
      description: "Validitas klasifikasi lapangan usaha FASIH vs pembukuan formal responden"
    }
  ],
  confusionMatrix: {
    labels: [
      "Valid Normal",
      "Anomali Finansial",
      "Anomali Disabilitas",
      "Anomali Listrik / Aset"
    ],
    matrix: [
      [3420, 48, 12, 20],
      [35, 7810, 18, 42],
      [8, 14, 3890, 16],
      [15, 30, 12, 4085]
    ]
  }
};

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "anomali-rasio",
    label: "Anomali Rasio Finansial",
    description: "Pengeluaran jauh melampaui omzet (defisit ekstrem > 180%)",
    data: {
      nama: "Keluarga Bpk. Santoso (Defisit Ekstrem)",
      kecamatan: "CILONGOK",
      desa: "PERNASIDI",
      pendapatan: 1200000,
      pengeluaran: 5800000,
      dayaListrik: 900,
      tagihanListrik: 120000,
      jmlArt: 4,
      jmlDisabilitas: 0,
      jmlArtBekerja: 1,
      luasLantai: 45,
      totalAset: 8000000,
      memilikiAc: false,
      memilikiLaptop: false,
      memilikiKulkas: true
    }
  },
  {
    id: "anomali-disabilitas",
    label: "Anomali Disabilitas Kolektif",
    description: "Seluruh anggota keluarga terdata disabilitas dalam satu KK",
    data: {
      nama: "Keluarga Ibu Rohayati (Disabilitas Kolektif)",
      kecamatan: "BANYUMAS",
      desa: "KEDUNGGEDE",
      pendapatan: 2500000,
      pengeluaran: 2200000,
      dayaListrik: 900,
      tagihanListrik: 85000,
      jmlArt: 3,
      jmlDisabilitas: 3,
      jmlArtBekerja: 0,
      luasLantai: 30,
      totalAset: 5000000,
      memilikiAc: false,
      memilikiLaptop: false,
      memilikiKulkas: false
    }
  },
  {
    id: "anomali-listrik",
    label: "Anomali Listrik & Aset",
    description: "Daya & tagihan listrik sangat tinggi dibanding pendapatan mikro",
    data: {
      nama: "Bengkel Las Mandiri (Beban Listrik Ekstrem)",
      kecamatan: "PURWOKERTO SELATAN",
      desa: "KARANGKLESEM",
      pendapatan: 1800000,
      pengeluaran: 1600000,
      dayaListrik: 3500,
      tagihanListrik: 850000,
      jmlArt: 3,
      jmlDisabilitas: 0,
      jmlArtBekerja: 1,
      luasLantai: 25,
      totalAset: 22000000,
      memilikiAc: true,
      memilikiLaptop: false,
      memilikiKulkas: true
    }
  },
  {
    id: "valid-normal",
    label: "Data Valid (Wajar)",
    description: "Rasio finansial dan indikator operasional konsisten",
    data: {
      nama: "Warung Nasi Bu Siti (Data Normal & Wajar)",
      kecamatan: "SOKARAJA",
      desa: "SOKARAJA TENGAH",
      pendapatan: 6500000,
      pengeluaran: 4200000,
      dayaListrik: 1300,
      tagihanListrik: 220000,
      jmlArt: 4,
      jmlDisabilitas: 0,
      jmlArtBekerja: 2,
      luasLantai: 60,
      totalAset: 25000000,
      memilikiAc: false,
      memilikiLaptop: true,
      memilikiKulkas: true
    }
  }
];
