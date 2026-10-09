import React from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Clock,
  Radio,
  Phone,
} from 'lucide-react';
import { DisasterTelemetryEvent } from '../types/bloodMesh.ts';

interface HemopulseHeaderStripProps {
  telemetryEvent: DisasterTelemetryEvent | null;
  totalDeficitNeeded?: number;
  criticalStockoutsCount?: number;
  resolutionPercent?: number;
  unitsRescued?: number;
  meanTravelMinutes?: number;
  totalCasualties?: number;
  onOpenSOSModal: () => void;
}

export const HemopulseHeaderStrip: React.FC<HemopulseHeaderStripProps> = ({
  telemetryEvent,
  totalDeficitNeeded = 514,
  criticalStockoutsCount = 6,
  resolutionPercent = 100,
  unitsRescued = 151,
  meanTravelMinutes = 12,
  totalCasualties = 81,
  onOpenSOSModal,
}) => {
  const activeIncidentName = telemetryEvent
    ? telemetryEvent.locationName || telemetryEvent.headline
    : 'Yamuna Expressway Den...';

  return (
    <div className="space-y-3 px-3 sm:px-4 pt-3 pb-2 bg-[#060b17] border-b border-slate-800/80">
      {/* 5 KPI METRICS CARDS ROW AS IN USER SCREENSHOT */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3">
        {/* Card 1: Acute Deficit Surge */}
        <div className="bg-[#0b1224] border border-slate-800/90 rounded-xl p-3 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-[11px] truncate text-slate-300">Acute Deficit Surge</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <div className="mt-1">
            <div className="text-base sm:text-lg font-black text-white font-mono tracking-tight flex items-baseline gap-1.5">
              <span>{totalDeficitNeeded}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-sans">UNITS NEEDED</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate">
              {criticalStockoutsCount} Critical Stockout Alerts
            </div>
          </div>
        </div>

        {/* Card 2: MILP Deficit Resolution */}
        <div className="bg-[#0b1224] border border-slate-800/90 rounded-xl p-3 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-[11px] truncate text-slate-300">MILP Deficit Resolution</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="mt-1">
            <div className="text-base sm:text-lg font-black text-emerald-400 font-mono tracking-tight flex items-baseline gap-1.5">
              <span>{resolutionPercent}%</span>
              <span className="text-[10px] uppercase font-bold text-emerald-400/90 font-sans">RESOLVED</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate">
              Zero Stockouts Projected
            </div>
          </div>
        </div>

        {/* Card 3: Perishable Spoilage Salvage */}
        <div className="bg-[#0b1224] border border-slate-800/90 rounded-xl p-3 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-[11px] truncate text-slate-300">Perishable Spoilage Salvage</span>
            <RefreshCw className="w-4 h-4 text-cyan-400 shrink-0" />
          </div>
          <div className="mt-1">
            <div className="text-base sm:text-lg font-black text-cyan-400 font-mono tracking-tight flex items-baseline gap-1.5">
              <span>+{unitsRescued}</span>
              <span className="text-[10px] uppercase font-bold text-cyan-400/90 font-sans">UNITS RESCUED</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate">
              5-Day Platelets Rerouted to AIIMS Apex
            </div>
          </div>
        </div>

        {/* Card 4: Mean Transit Latency */}
        <div className="bg-[#0b1224] border border-slate-800/90 rounded-xl p-3 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-[11px] truncate text-slate-300">Mean Transit Latency</span>
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <div className="mt-1">
            <div className="text-base sm:text-lg font-black text-amber-300 font-mono tracking-tight flex items-baseline gap-1.5">
              <span>{meanTravelMinutes}m</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-sans">AVG TRAVEL</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate">
              {totalDeficitNeeded} Units in Green Corridor
            </div>
          </div>
        </div>

        {/* Card 5: Telemetry Stream */}
        <div className="col-span-2 md:col-span-1 bg-[#0b1224] border border-slate-800/90 rounded-xl p-3 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-[11px] truncate text-slate-300">Telemetry Stream</span>
            <Radio className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />
          </div>
          <div className="mt-1">
            <div className="text-base sm:text-lg font-black text-white font-mono tracking-tight flex items-baseline gap-1.5">
              <span>{totalCasualties}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-sans">CASUALTIES</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate">
              {activeIncidentName}
            </div>
          </div>
        </div>
      </div>

      {/* NATIONAL BLOOD TRANSFUSION COUNCIL (NBTC) BANNER AS IN SCREENSHOT */}
      <div className="bg-gradient-to-r from-[#3e0b0e] via-[#240c14] to-[#0f172a] border border-red-900/60 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Circular Orange IN Badge */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#eb440f] text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md shadow-orange-900/50 shrink-0">
            IN
          </div>

          <div>
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white leading-tight">
              NATIONAL BLOOD TRANSFUSION COUNCIL (NBTC) · E-RAKTKOSH LIVE GRID
            </h2>
            <p className="text-[11px] text-slate-300 font-medium">
              Ministry of Health &amp; Family Welfare (MoHFW) · Government of India
            </p>
          </div>
        </div>

        {/* 3 Hotlines Pills Row */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-start md:justify-end">
          <a
            href="tel:108"
            className="flex items-center gap-1.5 bg-[#0a101f]/80 hover:bg-slate-900 border border-slate-700/70 rounded-full px-3 py-1 text-xs text-slate-200 transition"
          >
            <Phone className="w-3 h-3 text-rose-400" />
            <span>108 Ambulance: <strong className="text-white font-mono">108 / 102</strong></span>
          </a>

          <a
            href="tel:104"
            className="flex items-center gap-1.5 bg-[#0a101f]/80 hover:bg-slate-900 border border-slate-700/70 rounded-full px-3 py-1 text-xs text-slate-200 transition"
          >
            <Phone className="w-3 h-3 text-rose-400" />
            <span>Blood Bank Helpline: <strong className="text-rose-400 font-mono">104</strong></span>
          </a>

          <a
            href="tel:112"
            className="flex items-center gap-1.5 bg-[#0a101f]/80 hover:bg-slate-900 border border-slate-700/70 rounded-full px-3 py-1 text-xs text-slate-200 transition"
          >
            <Phone className="w-3 h-3 text-cyan-400" />
            <span>Emergency: <strong className="text-cyan-400 font-mono">112</strong></span>
          </a>
        </div>
      </div>
    </div>
  );
};
