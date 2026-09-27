"use client";

import React from "react";
import {
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe
} from "lucide-react";

export default function Footer() {
  const officialWebsites = [
    {
      title: "BPS Kabupaten Banyumas",
      url: "https://banyumaskab.bps.go.id",
      badge: "Web Resmi"
    },
    {
      title: "Portal Utama BPS RI",
      url: "https://www.bps.go.id",
      badge: "BPS Pusat"
    },
    {
      title: "BPS Provinsi Jawa Tengah",
      url: "https://jateng.bps.go.id",
      badge: "BPS Prov"
    },
    {
      title: "Portal Sensus Ekonomi 2026",
      url: "https://se2026.bps.go.id",
      badge: "SE2026"
    },
    {
      title: "SILASTIK BPS Banyumas",
      url: "https://silastik.bps.go.id",
      badge: "Layanan Data"
    },
  ];

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-24 lg:pb-12 mt-16 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Top Section: Header Identitas Resmi & System Status */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Logos Container */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center h-12 px-3 py-1.5 rounded-xl bg-[#0f244a] border border-blue-800/60 shadow-lg">
                <img
                  src="/images/logo_bps_banyumas.png"
                  alt="BPS Kabupaten Banyumas"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="h-8 w-[1.5px] bg-slate-700 hidden sm:block" />
              <div className="flex items-center h-12 px-3 py-1.5 rounded-xl bg-white border border-slate-700 shadow-md">
                <img
                  src="/images/logo_se2026.png"
                  alt="Sensus Ekonomi 2026"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Badan Pusat Statistik Kabupaten Banyumas
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Sistem Pemutakhiran, Visualisasi Spasial & Analisis Anomali Data Usaha SE2026
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section: 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          {/* Column 1: Web & Portal Resmi (Official Links) */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Web Resmi BPS
            </h4>
            <p className="text-xs text-slate-400">
              Tautan langsung portal & publikasi statistik resmi Badan Pusat Statistik:
            </p>
            <ul className="space-y-2 text-xs">
              {officialWebsites.map((item) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="font-medium text-slate-200 group-hover:text-blue-300 truncate">
                        {item.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0 ml-2">
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono">
                        {item.badge}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Kontak Pelayanan Statistik Terpadu (PST) */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Kontak & PST Banyumas
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5 bg-slate-800/30 p-3 rounded-lg border border-slate-800/60">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Jl. Warga Bhakti No. 5</strong>, Purwokerto, Kabupaten Banyumas, Jawa Tengah 53114
                </span>
              </div>
              <div className="flex items-center space-x-2.5 bg-slate-800/30 p-3 rounded-lg border border-slate-800/60">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-slate-200">(0281) 635496</span>
              </div>
              <div className="flex items-center space-x-2.5 bg-slate-800/30 p-3 rounded-lg border border-slate-800/60">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:bps3302@bps.go.id" className="hover:text-emerald-400 underline decoration-slate-600 font-mono">
                  bps3302@bps.go.id
                </a>
              </div>
              <div className="flex items-start space-x-2.5 bg-slate-800/30 p-3 rounded-lg border border-slate-800/60">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Jam Layanan PST:</p>
                  <p className="text-slate-400">Senin - Kamis: 08.00 - 15.30 WIB</p>
                  <p className="text-slate-400">Jumat: 08.00 - 16.00 WIB</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span>© 2026 <strong>Badan Pusat Statistik Kabupaten Banyumas</strong>.</span>
            <span className="hidden sm:inline">•</span>
            <span>Hak Cipta Dilindungi Undang-Undang</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
