"use client";

import React from "react";
import { X, Building2, Users, MapPin, AlertTriangle, CheckCircle2, FileCheck, ExternalLink, Calendar, UserCheck } from "lucide-react";
import { BpsFasihRecord } from "@/types/anomali";

interface BusinessDetailModalProps {
  record: BpsFasihRecord | null;
  onClose: () => void;
}

export default function BusinessDetailModal({ record, onClose }: BusinessDetailModalProps) {
  if (!record) return null;

  const isKeluarga = record.tipe_anomali === "Keluarga";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-slate-900 dark:text-white transition-colors duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
              isKeluarga 
                ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30" 
                : "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30"
            }`}>
              {isKeluarga ? <Users className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isKeluarga 
                    ? "bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30" 
                    : "bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30"
                }`}>
                  Pilar: Anomali {record.tipe_anomali}
                </span>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold truncate max-w-[200px]" title={record.fasih}>
                  {record.fasih.replace("https://fasih-sm.bps.go.id/app/assignment-detail/", "FASH-")}
                </span>
                {record.jenis_entitas && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                    {record.jenis_entitas}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{record.nama_usaha}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pemilik / KRT: <span className="font-semibold text-slate-700 dark:text-slate-300">{record.nama_keluarga}</span></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* System Anomaly Notes Box */}
        <div className="mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 space-y-1">
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <AlertTriangle className="h-4 w-4" />
            <span>Kategori Anomali FASIH BPS</span>
          </div>
          <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 pl-6">
            {record.kategori_deskripsi}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
            {record.nama_anomali}
          </p>
        </div>

        {/* Detail attributes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 mb-1">
              <MapPin className="h-3.5 w-3.5 text-cyan-500" />
              <span>Alamat SLS & Wilayah</span>
            </span>
            <p className="font-semibold text-cyan-600 dark:text-cyan-300 text-sm">Kec. {record.nama_kecamatan}</p>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">{record.nama_desa}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{record.nama_sls}</p>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 mb-1">
              <FileCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>Status Tindak Lanjut</span>
            </span>
            <p className="font-bold text-amber-600 dark:text-amber-400 text-sm">{record.tindak_lanjut}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{record.status_assignment}</p>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 mb-1">
              <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Petugas Lapangan</span>
            </span>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">{record.petugas}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Pengunggah: {record.pengunggah}</p>
          </div>

        </div>

        {/* BPS FASIH identifiers */}
        <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200 dark:border-slate-700/50 text-xs space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
            <p><span className="font-semibold text-slate-900 dark:text-slate-300">Alamat Lengkap:</span> {record.alamat_lengkap}</p>
            <p><span className="font-semibold text-slate-900 dark:text-slate-300">ID Assignment:</span> {record.assignment}</p>
            <p><span className="font-semibold text-slate-900 dark:text-slate-300">Kode Wilayah BPS:</span> {record.kode_kab}.{record.kode_kec} (Desa: {record.kode_desa})</p>
            <p className="flex items-center space-x-1"><Calendar className="h-3.5 w-3.5" /> <span>{record.waktu_status_diambil}</span></p>
          </div>

          {record.link_fasih && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-slate-500 text-[11px]">Direct Link Sistem FASIH BPS:</span>
              <a
                href={record.link_fasih}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-cyan-600 dark:text-cyan-400 hover:underline font-bold"
              >
                <span>Buka Aplikasi FASIH</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-5 py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
