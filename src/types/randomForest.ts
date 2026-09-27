export interface FeatureImportance {
  feature: string;
  weight: number;
  description: string;
}

export interface ConfusionMatrixData {
  labels: string[];
  matrix: number[][];
}

export interface ModelMetrics {
  modelName: string;
  datasetSource: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  outOfBagScore: number;
  treeDepth: number;
  nEstimators: number;
  criterion: string;
  trainingSamples: number;
  testingSamples: number;
  featureImportance: FeatureImportance[];
  confusionMatrix: ConfusionMatrixData;
}

export interface SimulationInput {
  nama: string;
  kecamatan: string;
  desa: string;
  pendapatan: number;
  pengeluaran: number;
  dayaListrik: number;
  tagihanListrik: number;
  jmlArt: number;
  jmlDisabilitas: number;
  jmlArtBekerja: number;
  luasLantai: number;
  totalAset: number;
  memilikiAc: boolean;
  memilikiLaptop: boolean;
  memilikiKulkas: boolean;
}

export interface SimulationResult {
  isAnomaly: boolean;
  anomalyType: string;
  rfScore: number;
  severity: "Tinggi" | "Sedang" | "Rendah";
  confidence: number;
  decisionTreePath: string[];
  recommendation: string;
  triggeredRules: string[];
}

export interface PresetScenario {
  id: string;
  label: string;
  description: string;
  data: SimulationInput;
}
