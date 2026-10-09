import React, { useState, useEffect } from 'react';
import { TraumaPatient, BloodType, BloodComponent } from '../types/bloodMesh.ts';
import {
  HeartPulse,
  Activity,
  AlertOctagon,
  Flame,
  ShieldAlert,
  Thermometer,
  Droplets,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  Zap,
  Filter,
  Users,
} from 'lucide-react';

interface TraumaPatientVitalsDashboardProps {
  patients: TraumaPatient[];
  onTriggerBedsideRelease: (patientId: string) => void;
  onDispatchDroneToPatient: (patientId: string) => void;
  onPrioritizePatientInMILP: (patient: TraumaPatient) => void;
  activeScenarioName: string;
}

export const TraumaPatientVitalsDashboard: React.FC<TraumaPatientVitalsDashboardProps> = ({
  patients,
  onTriggerBedsideRelease,
  onDispatchDroneToPatient,
  onPrioritizePatientInMILP,
  activeScenarioName,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'RED_STAT' | 'MTP_ACTIVE'>('ALL');
  const [ecgTick, setEcgTick] = useState(0);

  // Simulated live cardiac ECG ticker animation
  useEffect(() => {
    const interval = setInterval(() => {
      setEcgTick((prev) => (prev + 1) % 100);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const filteredPatients = patients.filter((p) => {
    if (selectedFilter === 'RED_STAT') return p.triageTag === 'RED_STAT';
    if (selectedFilter === 'MTP_ACTIVE') return p.mtpActivated;
    return true;
  });

  // Calculate high-level clinical emergency statistics
  const stats = {
    totalCasualties: patients.length,
    redStatCount: patients.filter((p) => p.triageTag === 'RED_STAT').length,
    mtpActiveCount: patients.filter((p) => p.mtpActivated).length,
    totalBloodRequested: patients.reduce(
      (sum, p) => sum + p.bloodDemands.reduce((dSum, d) => dSum + d.requiredUnits, 0),
      0
    ),
    totalBloodAllocated: patients.reduce(
      (sum, p) => sum + p.bloodDemands.reduce((dSum, d) => dSum + d.allocatedUnits, 0),
      0
    ),
    averageShockIndex: (
      patients.reduce((sum, p) => sum + p.shockIndex, 0) / Math.max(1, patients.length)
    ).toFixed(2),
  };

  const fulfillmentPercent = Math.round(
    (stats.totalBloodAllocated / Math.max(1, stats.totalBloodRequested)) * 100
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-100 select-none overflow-hidden">
      {/* Top Header & Surge Incident Banner */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/40 shadow-lg shadow-rose-900/30">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Trauma Vitals & Urgency Triage Console
                </h3>
                <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-700/60 px-2 py-0.5 rounded-full font-bold">
                  ACS ATLS CLASS IV
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Active Incident: <strong className="text-amber-400">{activeScenarioName}</strong>
              </p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                selectedFilter === 'ALL'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({patients.length})
            </button>
            <button
              onClick={() => setSelectedFilter('RED_STAT')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                selectedFilter === 'RED_STAT'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              STAT Red ({stats.redStatCount})
            </button>
            <button
              onClick={() => setSelectedFilter('MTP_ACTIVE')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                selectedFilter === 'MTP_ACTIVE'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MTP (1:1:1)
            </button>
          </div>
        </div>

        {/* Clinical KPI Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-mono">
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <span className="text-[9px] uppercase text-slate-500 block font-bold">Shock Index (Mean)</span>
            <span
              className={`text-sm font-extrabold ${
                parseFloat(stats.averageShockIndex) > 1.3 ? 'text-rose-400 animate-pulse' : 'text-amber-400'
              }`}
            >
              {stats.averageShockIndex}
            </span>
          </div>

          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <span className="text-[9px] uppercase text-slate-500 block font-bold">MTP Transfusion</span>
            <span className="text-sm font-extrabold text-amber-300">
              {stats.mtpActiveCount} Active
            </span>
          </div>

          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <span className="text-[9px] uppercase text-slate-500 block font-bold">Blood Units Demand</span>
            <span className="text-sm font-extrabold text-cyan-400">
              {stats.totalBloodRequested} Units
            </span>
          </div>

          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <span className="text-[9px] uppercase text-slate-500 block font-bold">Mesh Allocation</span>
            <span className="text-sm font-extrabold text-emerald-400">
              {stats.totalBloodAllocated}u ({fulfillmentPercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Patient Cards List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5">
        {filteredPatients.map((patient) => {
          const isClassIV = patient.hemorrhageClass === 'CLASS_IV';
          const isWaitingBlood = patient.status === 'CRITICAL_WAITING_BLOOD';

          return (
            <div
              key={patient.id}
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                isClassIV
                  ? 'bg-rose-950/25 border-rose-700/80 shadow-xl shadow-rose-950/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Patient Header: Alias, Bay, Triage Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        patient.triageTag === 'RED_STAT'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {patient.triageTag === 'RED_STAT' ? 'STAT IMMEDIATE' : 'URGENT'}
                    </span>
                    <h4 className="font-extrabold text-xs text-white tracking-tight">
                      {patient.alias}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({patient.age}y / {patient.gender})
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-1 font-sans">
                    <strong className="text-slate-100">{patient.traumaBay}:</strong> {patient.mechanismOfInjury}
                  </p>
                </div>

                {/* Hemorrhage Shock Class Pill */}
                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded border ${
                      isClassIV
                        ? 'bg-rose-900/60 text-rose-300 border-rose-600'
                        : 'bg-amber-900/60 text-amber-300 border-amber-600'
                    }`}
                  >
                    {patient.hemorrhageClass.replace(/_/g, ' ')}
                  </span>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {patient.timeElapsedMinutes}m in bay
                  </div>
                </div>
              </div>

              {/* Vitals Telemetry Monitors Grid */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-[10px] font-mono bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="p-1 rounded bg-slate-950/90">
                  <span className="text-slate-500 block text-[9px] uppercase">Heart Rate</span>
                  <span
                    className={`font-extrabold text-xs flex items-center justify-center gap-1 ${
                      patient.vitals.hr >= 130 ? 'text-rose-400' : 'text-amber-300'
                    }`}
                  >
                    <Activity className="w-3 h-3 animate-pulse" />
                    <span>{patient.vitals.hr} bpm</span>
                  </span>
                </div>

                <div className="p-1 rounded bg-slate-950/90">
                  <span className="text-slate-500 block text-[9px] uppercase">Blood Pressure</span>
                  <span
                    className={`font-extrabold text-xs ${
                      patient.vitals.sbp < 80 ? 'text-rose-400' : 'text-slate-200'
                    }`}
                  >
                    {patient.vitals.sbp}/{patient.vitals.dbp} (MAP {patient.vitals.map})
                  </span>
                </div>

                <div className="p-1 rounded bg-slate-950/90">
                  <span className="text-slate-500 block text-[9px] uppercase">Shock Index (HR/SBP)</span>
                  <span
                    className={`font-extrabold text-xs ${
                      patient.shockIndex > 1.3 ? 'text-rose-400 font-bold' : 'text-amber-400'
                    }`}
                  >
                    {patient.shockIndex} ({patient.shockIndex > 1.3 ? 'CRITICAL' : 'ELEVATED'})
                  </span>
                </div>

                <div className="p-1 rounded bg-slate-950/90">
                  <span className="text-slate-500 block text-[9px] uppercase">ABC Score / TASH</span>
                  <span className="font-extrabold text-xs text-amber-300">
                    {patient.abcScore}/4 ({patient.tashProbabilityPercent}%)
                  </span>
                </div>
              </div>

              {/* Arterial Biomarkers & Hypothermia Alert */}
              <div className="mt-2 flex flex-wrap items-center justify-between text-[10px] font-mono bg-slate-900/40 px-2.5 py-1.5 rounded-lg border border-slate-800/80 text-slate-300">
                <div className="flex items-center gap-3">
                  <span>
                    Hb: <strong className={patient.vitals.hemoglobin < 7 ? 'text-rose-400' : 'text-slate-200'}>{patient.vitals.hemoglobin} g/dL</strong>
                  </span>
                  <span>
                    Lactate: <strong className={patient.vitals.lactate > 4 ? 'text-rose-400' : 'text-slate-200'}>{patient.vitals.lactate} mmol/L</strong>
                  </span>
                  <span>
                    Base Excess: <strong className="text-rose-400">{patient.vitals.baseExcess}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-amber-400">
                  <Thermometer className="w-3 h-3" />
                  <span>Temp: {patient.vitals.coreTempCelsius}°C</span>
                  {patient.vitals.coreTempCelsius < 35.5 && (
                    <span className="text-[9px] bg-rose-950 text-rose-300 px-1 py-0.2 rounded font-bold">
                      Hypothermia
                    </span>
                  )}
                </div>
              </div>

              {/* Blood Demands & Transfusion Allocation Matrix */}
              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-rose-500" />
                    <span>Blood Units Prescribed & Mesh Allocation:</span>
                  </span>
                  {patient.mtpActivated && (
                    <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/80">
                      MTP 1:1:1 BALANCED
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {patient.bloodDemands.map((demand, dIdx) => {
                    const isFulfilled = demand.allocatedUnits >= demand.requiredUnits;

                    return (
                      <div
                        key={dIdx}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-2 ${
                          isFulfilled
                            ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                            : 'bg-rose-950/40 border-rose-700/60 text-rose-200'
                        }`}
                      >
                        <span className="font-bold">
                          {demand.bloodType} {demand.component}
                        </span>
                        <span className="text-slate-400 font-sans">
                          {demand.allocatedUnits}/{demand.requiredUnits} Units
                        </span>
                        {isFulfilled ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <span className="text-[9px] text-rose-400 font-bold">DEFICIT</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bedside Action Toolbar */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onPrioritizePatientInMILP(patient)}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1"
                    title="Give highest priority penalty in the MILP Redistribution solver"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Prioritize in MILP</span>
                  </button>

                  <button
                    onClick={() => onDispatchDroneToPatient(patient.id)}
                    className="text-[11px] bg-cyan-900/60 hover:bg-cyan-800 border border-cyan-600 text-cyan-200 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1"
                    title="Direct UAV Drone blood pod release to trauma bay"
                  >
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Fast Drone STAT</span>
                  </button>
                </div>

                <button
                  onClick={() => onTriggerBedsideRelease(patient.id)}
                  className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3.5 py-1.5 rounded-lg transition shadow-md flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Release to Bedside</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
