"use client";

import React from "react";
import DataTable from "@/components/data/DataTable";
import { Table } from "lucide-react";

export default function DataPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <Table className="h-6 w-6 text-amber-400" />
            <span>Tabel Data Anomali Data Usaha SE2026</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen & eksplorasi rincian record data usaha terdeteksi anomali di Kabupaten Banyumas
          </p>
        </div>
      </div>

      <DataTable />
    </div>
  );
}
