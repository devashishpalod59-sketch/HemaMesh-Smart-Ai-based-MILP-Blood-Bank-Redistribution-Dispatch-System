import React, { useState } from 'react';
import { FacilityNode, BloodType, BloodComponent } from '../types/bloodMesh.ts';
import {
  AlertOctagon,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Flame,
  Radio,
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface ShortageAndExpirySentinelProps {
  nodes: FacilityNode[];
  onTriggerMILPSolve: () => void;
  onOpenDonorBeacon: (bloodType: BloodType, units: number) => void;
  onSelectNode: (node: FacilityNode) => void;
  onNavigateToTab?: (tab: 'SOLVER' | 'TRACKER' | 'MAP') => void;
}

export const ShortageAndExpirySentinel: React.FC<ShortageAndExpirySentinelProps> = ({
  nodes,
  onTriggerMILPSolve,
  onOpenDonorBeacon,
  onSelectNode,
  onNavigateToTab,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'SHORTAGE' | 'EXPIRY'>('SHORTAGE');

  // Compute Shortages
  const criticalDeficitItems: {
    facility: FacilityNode;
    bloodType: BloodType;
    component: BloodComponent;
    requiredUnits: number;
    currentOnHand: number;
    deficit: number;
    criticality: string;
  }[] = [];

  nodes.forEach((node) => {
    node.demands.forEach((demand) => {
      const onHand = node.inventory
        .filter((inv) => inv.bloodType === demand.bloodType && inv.component === demand.component)
        .reduce((sum, inv) => sum + inv.units, 0);

      const deficit = demand.requiredUnits - onHand;
      if (deficit > 0) {
        criticalDeficitItems.push({
          facility: node,
          bloodType: demand.bloodType,
          component: demand.component,
          requiredUnits: demand.requiredUnits,
          currentOnHand: onHand,
          deficit,
          criticality: demand.criticality,
        });
      }
    });
  });

  // Compute Perishable Expiries (< 3 days for platelets, < 7 days for RBC/WB)
  const expiringBatches: {
    facility: FacilityNode;
    cohortId: string;
    bloodType: BloodType;
    component: BloodComponent;
    units: number;
    daysToExpiry: number;
    lotNumber: string;
    urgencyLevel: 'CRITICAL_HOURS' | 'EXPIRING_SOON';
  }[] = [];

  nodes.forEach((node) => {
    node.inventory.forEach((inv) => {
      const isUrgentPlatelet = inv.component === 'PLT' && inv.daysToExpiry <= 2;
      const isUrgentRbc = (inv.component === 'PRBC' || inv.component === 'WB') && inv.daysToExpiry <= 7;

      if (isUrgentPlatelet || isUrgentRbc) {
        expiringBatches.push({
          facility: node,
          cohortId: inv.id,
          bloodType: inv.bloodType,
          component: inv.component,
          units: inv.units,
          daysToExpiry: inv.daysToExpiry,
          lotNumber: inv.lotNumber,
          urgencyLevel: inv.daysToExpiry <= 1 ? 'CRITICAL_HOURS' : 'EXPIRING_SOON',
        });
      }
    });
  });

  const totalShortageUnits = criticalDeficitItems.reduce((acc, curr) => acc + curr.deficit, 0);
  const totalExpiringUnits = expiringBatches.reduce((acc, curr) => acc + curr.units, 0);

  return (
    <div className="bg-[#070e1c] border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden mb-4">
      {/* Sentinel Title Header */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#1b0811] via-[#101426] to-[#071321] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-wide uppercase">
                Inventory Sentinel: Shortage &amp; Perishable Expiry Monitor
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-700">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              e-RaktKosh Automated Surveillance · Continuous Blood Bank Quota Watch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Solve CTA */}
          <button
            onClick={onTriggerMILPSolve}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#ff0055] to-rose-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md active:scale-95 transition"
            title="Execute mathematical MILP redistribution to resolve stockouts and save expiring units"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Resolve with MILP</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            aria-label="Toggle Sentinel Details"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Pill Switcher */}
      <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('SHORTAGE')}
            className={`px-3 py-1 rounded-lg font-extrabold text-xs flex items-center gap-1.5 transition ${
              activeTab === 'SHORTAGE'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Critical Shortages</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-950 text-rose-200 border border-rose-800 font-mono">
              {totalShortageUnits} Units Deficit
            </span>
          </button>

          <button
            onClick={() => setActiveTab('EXPIRY')}
            className={`px-3 py-1 rounded-lg font-extrabold text-xs flex items-center gap-1.5 transition ${
              activeTab === 'EXPIRY'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Perishable Expiry</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-950 text-amber-200 border border-amber-800 font-mono">
              {totalExpiringUnits} Units at Risk
            </span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          {activeTab === 'SHORTAGE' ? `${criticalDeficitItems.length} Unmet Clinical Requests` : `${expiringBatches.length} Batches Near Expiration`}
        </span>
      </div>

      {/* Detailed Body */}
      {isExpanded && (
        <div className="p-3 sm:p-4">
          {activeTab === 'SHORTAGE' ? (
            <div>
              {criticalDeficitItems.length === 0 ? (
                <div className="text-center py-6 text-slate-500 flex flex-col items-center gap-1">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  <p className="text-xs font-bold text-slate-300">All Node Blood Demands Fully Satisfied</p>
                  <p className="text-[11px] text-slate-500">Zero active blood shortages detected across this corridor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {criticalDeficitItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/70 border border-rose-900/60 rounded-xl p-3 shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-rose-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            {item.bloodType} · {item.component}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-200 border border-rose-800">
                            DEFICIT: -{item.deficit}
                          </span>
                        </div>

                        <div className="mt-2 text-xs font-bold text-white truncate" title={item.facility.name}>
                          {item.facility.shortName}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>On hand: {item.currentOnHand} | Need: {item.requiredUnits}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onOpenDonorBeacon(item.bloodType, item.deficit)}
                          className="flex-1 py-1 px-2 rounded-lg text-[10px] font-extrabold bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-200 text-center transition"
                        >
                          Alert Voluntary Donors
                        </button>
                        <button
                          onClick={() => {
                            onSelectNode(item.facility);
                            onNavigateToTab?.('MAP');
                          }}
                          className="py-1 px-2.5 rounded-lg text-[10px] font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
                        >
                          Locate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {expiringBatches.length === 0 ? (
                <div className="text-center py-6 text-slate-500 flex flex-col items-center gap-1">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  <p className="text-xs font-bold text-slate-300">All Units Within Safe Shelf-Life Thresholds</p>
                  <p className="text-[11px] text-slate-500">No imminent perishable spoilage risk detected.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {expiringBatches.map((batch, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/70 border border-amber-900/60 rounded-xl p-3 shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {batch.bloodType} · {batch.component} ({batch.units} Units)
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              batch.daysToExpiry <= 1
                                ? 'bg-red-950 text-red-200 border border-red-700 animate-pulse'
                                : 'bg-amber-950 text-amber-200 border border-amber-800'
                            }`}
                          >
                            {batch.daysToExpiry === 1 ? 'EXPIRES TODAY (<24h)' : `EXPIRES IN ${batch.daysToExpiry} DAYS`}
                          </span>
                        </div>

                        <div className="mt-2 text-xs font-bold text-white truncate" title={batch.facility.name}>
                          {batch.facility.shortName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Lot: {batch.lotNumber} · Spoilage Value: ₹{(batch.units * 3200).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                        <button
                          onClick={onTriggerMILPSolve}
                          className="flex-1 py-1 px-2 rounded-lg text-[10px] font-extrabold bg-amber-950/80 hover:bg-amber-900 border border-amber-700 text-amber-200 text-center transition flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reroute to Trauma Hub</span>
                        </button>
                        <button
                          onClick={() => {
                            onSelectNode(batch.facility);
                            onNavigateToTab?.('MAP');
                          }}
                          className="py-1 px-2.5 rounded-lg text-[10px] font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
