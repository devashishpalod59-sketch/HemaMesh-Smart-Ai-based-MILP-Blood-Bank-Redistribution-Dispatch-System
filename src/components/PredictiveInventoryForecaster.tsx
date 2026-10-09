import React, { useState } from 'react';
import {
  BloodComponent,
  FacilityNode,
  PredictiveEventId,
  PredictiveEventProfile,
  PredictiveForecastAnalysis,
} from '../types/bloodMesh.ts';
import {
  INDIAN_PREDICTIVE_EVENTS,
  generatePredictiveForecast,
  getPredictiveEvent,
} from '../services/predictiveForecaster.ts';
import {
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Flame,
  CloudRain,
  Activity,
  Layers,
  RefreshCw,
  Truck,
  Building2,
  Users,
  Sliders,
} from 'lucide-react';

interface PredictiveInventoryForecasterProps {
  nodes: FacilityNode[];
  onApplyRebalancing: (
    eventId: PredictiveEventId,
    horizonHours: number,
    intensityScale: number
  ) => void;
  isSolving?: boolean;
  activeEventId?: PredictiveEventId;
  onClose?: () => void;
}

export const PredictiveInventoryForecaster: React.FC<
  PredictiveInventoryForecasterProps
> = ({
  nodes,
  onApplyRebalancing,
  isSolving = false,
  activeEventId = 'DIWALI_FESTIVAL',
  onClose,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<PredictiveEventId>(activeEventId);
  const [horizonHours, setHorizonHours] = useState<number>(48);
  const [intensityScale, setIntensityScale] = useState<number>(1.0);
  const [showAdvancedParams, setShowAdvancedParams] = useState<boolean>(false);

  // Generate live forecast analysis based on current nodes & slider params
  const forecast: PredictiveForecastAnalysis = generatePredictiveForecast(
    nodes,
    selectedEventId,
    horizonHours,
    intensityScale
  );

  const selectedEvent = forecast.event;

  const getEventIcon = (id: PredictiveEventId) => {
    switch (id) {
      case 'DIWALI_FESTIVAL':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'MONSOON_DENGUE_SURGE':
        return <CloudRain className="w-4 h-4 text-cyan-400" />;
      case 'HOLI_FESTIVAL_TRAUMA':
        return <AlertTriangle className="w-4 h-4 text-pink-400" />;
      case 'KUMBH_MELA_PILGRIMAGE':
        return <Users className="w-4 h-4 text-orange-400" />;
      case 'DURGA_PUJA_NAVRATRI':
        return <Activity className="w-4 h-4 text-yellow-400" />;
      case 'NEW_YEAR_HIGHWAY_CORRIDOR':
        return <Truck className="w-4 h-4 text-sky-400" />;
      default:
        return <Calendar className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto no-scrollbar">
      {/* Header Banner */}
      <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Predictive Inventory Forecaster
                </h2>
                <span className="text-[9px] bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 font-mono px-1.5 py-0.5 rounded">
                  MILP PROACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Epidemiological Pre-Event Rebalancing for Indian Healthcare Corridors
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdvancedParams(!showAdvancedParams)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition"
            title="Adjust Forecast Horizon & Scale"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Trigger Button */}
        <div className="mt-3">
          <button
            onClick={() => onApplyRebalancing(selectedEventId, horizonHours, intensityScale)}
            disabled={isSolving}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSolving ? 'animate-spin' : ''}`} />
            <span>
              {isSolving
                ? 'Solving Preemptive Rebalancing Arcs...'
                : `Apply Preemptive Rebalance (${forecast.totalProjectedDeficitUnits} Units Pre-positioned)`}
            </span>
          </button>
        </div>
      </div>

      {/* Advanced Horizon & Scale Controls */}
      {showAdvancedParams && (
        <div className="p-3 border-b border-slate-800 bg-slate-900/80 text-xs space-y-2.5 animate-fade-in">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>Forecast Lead Horizon</span>
            <div className="flex items-center gap-1">
              {[24, 48, 72].map((hrs) => (
                <button
                  key={hrs}
                  onClick={() => setHorizonHours(hrs)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                    horizonHours === hrs
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  T-{hrs}h
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Historical Surge Intensity Factor:</span>
              <span className="font-mono text-cyan-400">{intensityScale.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.0"
              step="0.1"
              value={intensityScale}
              onChange={(e) => setIntensityScale(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-slate-800 rounded mt-1"
            />
          </div>
        </div>
      )}

      {/* Indian Festive & Seasonal Event Selector Grid */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Select Indian Holiday Season or Local Event
        </span>

        <div className="grid grid-cols-2 gap-1.5">
          {INDIAN_PREDICTIVE_EVENTS.map((event) => {
            const isSelected = event.id === selectedEventId;
            return (
              <button
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    {getEventIcon(event.id)}
                    <span className="text-[10px] font-bold text-slate-300 truncate max-w-[110px]">
                      {event.name.split(' ')[0]}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                  )}
                </div>
                <div className="text-[9px] text-slate-400 font-hindi truncate">
                  {event.hindiName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Event Epidemiological Profile Card */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/40">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              {getEventIcon(selectedEvent.id)}
              <span>{selectedEvent.name}</span>
            </h3>
            <span className="text-[10px] text-indigo-300 block font-hindi">
              {selectedEvent.hindiName} • {selectedEvent.seasonPeriod}
            </span>
          </div>

          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60 font-bold shrink-0">
            {selectedEvent.donorTurnoutModifier * 100}% Donor Inflow
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 mb-2.5">
          {selectedEvent.epidemiologicalRationale}
        </p>

        {/* Component Surge Multipliers Badges */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Historical Demand Multiplier by Component:
          </span>
          <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
            {forecast.componentDemandSpikes.map((item) => {
              const isSevere = item.multiplier >= 2.0;
              const isModerate = item.multiplier >= 1.4;

              return (
                <div
                  key={item.component}
                  className={`p-1.5 rounded border ${
                    isSevere
                      ? 'bg-rose-950/40 border-rose-700/80 text-rose-300 font-bold'
                      : isModerate
                      ? 'bg-amber-950/40 border-amber-700/80 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="block text-[9px] text-slate-400">{item.component}</span>
                  <span className="text-xs font-bold">+{Math.round((item.multiplier - 1) * 100)}%</span>
                  <span className="text-[8px] text-slate-500 block">
                    {item.predictedUnits}u
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Network Resilience Comparison Meter */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Projected Resilience Rating
          </span>
          <span className="text-[10px] font-mono text-indigo-400">
            Lead Time: T-{horizonHours} Hours
          </span>
        </div>

        <div className="space-y-2">
          {/* Without rebalancing */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Without Proactive MILP Rebalance:</span>
              <span className="font-bold text-rose-400 font-mono">
                {forecast.networkResilienceWithoutRebalance}% (High Stockout Danger)
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-rose-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${forecast.networkResilienceWithoutRebalance}%` }}
              />
            </div>
          </div>

          {/* With Proactive MILP Rebalance */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
              <span>With Proactive MILP Pre-positioning:</span>
              <span className="font-bold text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {forecast.networkResilienceWithRebalance}% (Fully Protected)
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${forecast.networkResilienceWithRebalance}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Facility Vulnerability Breakdown List */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Facility Risk Matrix ({forecast.vulnerableFacilities.length})
          </span>
          <span className="text-[10px] text-slate-500">
            Anticipated Shortfall Ahead of Surge
          </span>
        </div>

        <div className="space-y-2">
          {forecast.vulnerableFacilities.map((vuln) => {
            const isCritical = vuln.vulnerabilityLevel === 'CRITICAL_STOCKOUT_RISK';
            const isWarning = vuln.vulnerabilityLevel === 'HIGH_DEFICIT_WARNING';
            const isSurplus = vuln.vulnerabilityLevel === 'RESILIENT_SURPLUS';

            return (
              <div
                key={vuln.nodeId}
                className={`p-2.5 rounded-xl border text-xs transition ${
                  isCritical
                    ? 'bg-rose-950/25 border-rose-700/60'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-700/50'
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 truncate max-w-[210px]">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-bold text-slate-200 truncate">{vuln.nodeName}</span>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isCritical
                        ? 'bg-rose-900 text-rose-200 border border-rose-700 animate-pulse'
                        : isWarning
                        ? 'bg-amber-900 text-amber-200 border border-amber-700'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {isCritical
                      ? 'STOCKOUT RISK'
                      : isWarning
                      ? 'DEFICIT WARNING'
                      : 'SURPLUS BUFFER'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 my-1 text-[10px] font-mono bg-slate-950/40 p-1.5 rounded border border-slate-800/60">
                  <div>
                    <span className="text-slate-500 block text-[9px]">On-Hand:</span>
                    <span className="text-slate-300 font-bold">{vuln.currentOnHandUnits}u</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Daily Burn:</span>
                    <span className="text-rose-400 font-bold">{vuln.predictedDailyDemand}u/d</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[9px]">Deficit:</span>
                    <span
                      className={`font-bold ${
                        vuln.shortfallUnits > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {vuln.shortfallUnits > 0 ? `-${vuln.shortfallUnits}u` : '+Buffer'}
                    </span>
                  </div>
                </div>

                {/* Preemptive Recommendation */}
                {vuln.suggestedPreemptiveInflow > 0 ? (
                  <div className="mt-1 flex items-center justify-between text-[10px] text-indigo-300 bg-indigo-950/30 px-2 py-1 rounded border border-indigo-800/40">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-indigo-400" />
                      <span>Pre-position {vuln.suggestedPreemptiveInflow} units before festival rush</span>
                    </span>
                    <span className="font-mono font-bold text-cyan-300">
                      {vuln.criticalComponents.join(', ')}
                    </span>
                  </div>
                ) : (
                  <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1 px-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Operational buffer secure. Available to supply regional hubs.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
