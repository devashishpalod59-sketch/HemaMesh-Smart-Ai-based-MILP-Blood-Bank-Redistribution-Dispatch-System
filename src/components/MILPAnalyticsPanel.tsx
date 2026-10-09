import React, { useState } from 'react';
import {
  OptimizationResult,
  TransferDecision,
  MILPSolverConfig,
  FacilityNode,
  PredictiveEventId,
} from '../types/bloodMesh.ts';
import {
  Cpu,
  TrendingDown,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Leaf,
  Sliders,
  DollarSign,
  FileText,
  Activity,
  Layers,
  Calendar,
  Sparkle,
  Truck,
} from 'lucide-react';
import { PredictiveInventoryForecaster } from './PredictiveInventoryForecaster.tsx';

interface MILPAnalyticsPanelProps {
  optimizationResult: OptimizationResult | null;
  solverConfig: MILPSolverConfig;
  onUpdateConfig: (config: MILPSolverConfig) => void;
  onRunOptimization: () => void;
  onApplyPredictiveRebalance?: (
    eventId: PredictiveEventId,
    horizonHours: number,
    intensityScale: number
  ) => void;
  isSolving: boolean;
  onOpenManifest: (transfer: TransferDecision) => void;
  onDispatchTransfer: (transfer: TransferDecision) => void;
  nodes: FacilityNode[];
}

export const MILPAnalyticsPanel: React.FC<MILPAnalyticsPanelProps> = ({
  optimizationResult,
  solverConfig,
  onUpdateConfig,
  onRunOptimization,
  onApplyPredictiveRebalance,
  isSolving,
  onOpenManifest,
  onDispatchTransfer,
  nodes,
}) => {
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [panelTab, setPanelTab] = useState<'MANIFESTS' | 'FORECASTER'>('MANIFESTS');

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-100">
      {/* Top Header & Solver Trigger */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Cpu className={`w-4 h-4 ${isSolving ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                MILP Redistribution Mesh Engine
              </h2>
              <p className="text-[11px] text-slate-400">
                Mixed-Integer Multi-Commodity Perishable Optimizer
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            aria-label="Toggle MILP solver parameter configuration"
            className={`p-1.5 rounded-lg border transition ${
              showConfigDrawer
                ? 'bg-slate-800 border-cyan-500 text-cyan-400'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs: MANIFESTS vs FORECASTER */}
        <div className="grid grid-cols-2 gap-1.5 mb-2.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setPanelTab('MANIFESTS')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              panelTab === 'MANIFESTS'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Manifests ({optimizationResult?.transfers.length || 0})</span>
          </button>

          <button
            onClick={() => setPanelTab('FORECASTER')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              panelTab === 'FORECASTER'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm ring-1 ring-indigo-400/50'
                : 'text-indigo-400 hover:text-indigo-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Event Forecaster</span>
          </button>
        </div>

        {/* Solver Launch Button (visible on MANIFESTS tab) */}
        {panelTab === 'MANIFESTS' && (
          <button
            onClick={onRunOptimization}
            disabled={isSolving}
            className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-2 px-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSolving ? 'Solving MILP Branch & Bound...' : 'Recompute Global Redistribution'}</span>
          </button>
        )}
      </div>

      {/* Solver Hyperparameter Configuration Drawer */}
      {showConfigDrawer && (
        <div className="p-4 border-b border-slate-800 bg-slate-950/90 text-xs space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
            <span>Objective Weights & Constraints</span>
            <button
              onClick={() =>
                onUpdateConfig({
                  alphaLatencyWeight: 1.8,
                  betaVehicleDispatchCost: 120,
                  gammaStockoutPenalty: 950,
                  deltaSpoilagePenalty: 480,
                  maxTransitTimeMinutes: 90,
                  vehicleCapacityUnits: 60,
                })
              }
              className="text-cyan-400 hover:underline text-[10px]"
            >
              Reset Defaults
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Alpha (Transit Latency Penalty):</span>
                <span className="font-mono text-cyan-400">{solverConfig.alphaLatencyWeight}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={solverConfig.alphaLatencyWeight}
                onChange={(e) =>
                  onUpdateConfig({ ...solverConfig, alphaLatencyWeight: parseFloat(e.target.value) })
                }
                aria-label="Alpha: Transit latency penalty weight"
                className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Gamma (Lethal Stockout Penalty):</span>
                <span className="font-mono text-rose-400">${solverConfig.gammaStockoutPenalty}</span>
              </div>
              <input
                type="range"
                min="300"
                max="2500"
                step="50"
                value={solverConfig.gammaStockoutPenalty}
                onChange={(e) =>
                  onUpdateConfig({ ...solverConfig, gammaStockoutPenalty: parseFloat(e.target.value) })
                }
                aria-label="Gamma: Lethal stockout penalty"
                className="w-full accent-rose-500 h-1 bg-slate-800 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Delta (Spoilage Waste Penalty):</span>
                <span className="font-mono text-amber-400">${solverConfig.deltaSpoilagePenalty}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1200"
                step="20"
                value={solverConfig.deltaSpoilagePenalty}
                onChange={(e) =>
                  onUpdateConfig({ ...solverConfig, deltaSpoilagePenalty: parseFloat(e.target.value) })
                }
                aria-label="Delta: Spoilage waste penalty"
                className="w-full accent-amber-500 h-1 bg-slate-800 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Max Transit Threshold (mins):</span>
                <span className="font-mono text-slate-200">{solverConfig.maxTransitTimeMinutes} min</span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                step="5"
                value={solverConfig.maxTransitTimeMinutes}
                onChange={(e) =>
                  onUpdateConfig({
                    ...solverConfig,
                    maxTransitTimeMinutes: parseInt(e.target.value, 10),
                  })
                }
                aria-label="Max transit time threshold in minutes"
                className="w-full accent-slate-400 h-1 bg-slate-800 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* RENDER CONTENT BASED ON SELECTED TAB */}
      {panelTab === 'FORECASTER' ? (
        <PredictiveInventoryForecaster
          nodes={nodes}
          isSolving={isSolving}
          onApplyRebalancing={(eventId, horizonHours, intensityScale) => {
            if (onApplyPredictiveRebalance) {
              onApplyPredictiveRebalance(eventId, horizonHours, intensityScale);
              setPanelTab('MANIFESTS'); // Switch back to view resulting manifests
            }
          }}
        />
      ) : (
        <>
          {/* Predictive Rebalancing Active Banner */}
          {optimizationResult?.predictiveForecastSummary && (
            <div className="p-3 bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border-b border-indigo-700/50">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 animate-pulse" />
                  <span>
                    Preemptive Rebalance Active: {optimizationResult.predictiveForecastSummary.eventName}
                  </span>
                </div>
                <span className="bg-indigo-900/80 text-indigo-200 font-mono text-[10px] px-2 py-0.5 rounded font-bold border border-indigo-700/80">
                  T-{optimizationResult.predictiveForecastSummary.horizonHours}h Window
                </span>
              </div>
              <p className="text-[10px] text-slate-300 mt-1">
                <strong>{optimizationResult.predictiveForecastSummary.proactiveUnitsMoved} Units</strong> proactively pre-positioned across {optimizationResult.predictiveForecastSummary.proactiveTransfersCount} corridors before traffic/donation slump.
              </p>
            </div>
          )}

          {/* Solver Convergence Metrics KPI Grid */}
          {optimizationResult && (
            <div className="p-3 border-b border-slate-800 bg-slate-950/40">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase">Objective Z*</span>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {optimizationResult.objectiveValue}
                  </span>
                </div>

                <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase">Solve Time</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {optimizationResult.solveDurationMs} ms
                  </span>
                </div>

                <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase">B&B Nodes</span>
                  <span className="font-mono text-xs font-bold text-slate-200">
                    {optimizationResult.branchAndBoundNodes}
                  </span>
                </div>
              </div>

              {/* Impact Stats */}
              <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 bg-emerald-950/30 border border-emerald-800/40 px-2 py-1.5 rounded-lg text-emerald-300">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    <strong>{optimizationResult.summary.spoilagePreventedUnits} Units</strong> Saved from Spoilage
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-rose-950/30 border border-rose-800/40 px-2 py-1.5 rounded-lg text-rose-300">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>
                    <strong>{optimizationResult.summary.criticalDeficitsResolved} Units</strong> Deficit Mitigated
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Transfer Decisions Manifest List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Optimal Transfer Manifests ({optimizationResult?.transfers.length || 0})
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                STATUS: CONVERGED
              </span>
            </div>

            {optimizationResult && optimizationResult.transfers.length > 0 ? (
              optimizationResult.transfers.map((tx) => {
                const isCode3 = tx.priority === 'EMERGENCY_CODE_3';
                const isPredictive = tx.isPredictiveRebalance;

                return (
                  <div
                    key={tx.id}
                    className={`p-3 rounded-xl border transition-all duration-150 ${
                      isPredictive
                        ? 'bg-indigo-950/25 border-indigo-700/60 hover:border-indigo-400'
                        : isCode3
                        ? 'bg-rose-950/25 border-rose-700/60 hover:border-rose-500'
                        : 'bg-slate-800/40 border-slate-700/70 hover:border-slate-500'
                    }`}
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isPredictive
                              ? 'bg-indigo-900 text-indigo-200 border border-indigo-700'
                              : isCode3
                              ? 'bg-rose-900 text-rose-200 border border-rose-700 animate-pulse'
                              : 'bg-sky-900 text-sky-200 border border-sky-700'
                          }`}
                        >
                          {isPredictive
                            ? 'PREEMPTIVE REBALANCE'
                            : tx.priority.replace(/_/g, ' ')}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{tx.id}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-cyan-400">
                          {tx.units} Units
                        </span>
                      </div>
                    </div>

                    {/* Nodes route flow */}
                    <div className="mt-2 flex items-center justify-between text-xs font-medium">
                      <div className="truncate max-w-[130px] text-slate-300" title={tx.fromNodeName}>
                        {tx.fromNodeName}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 mx-1" />
                      <div
                        className="truncate max-w-[130px] text-rose-300 font-bold"
                        title={tx.toNodeName}
                      >
                        {tx.toNodeName}
                      </div>
                    </div>

                    {/* Biological product tags & expiry */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="bg-slate-900 px-2 py-0.5 rounded text-rose-400 font-mono font-bold border border-slate-700">
                        {tx.bloodType} {tx.component}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono ${
                          tx.daysToExpiry <= 2
                            ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold'
                            : 'bg-slate-900 text-slate-400 border border-slate-700'
                        }`}
                      >
                        Expiry: {tx.daysToExpiry}d remaining
                      </span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded text-slate-400 font-mono border border-slate-700 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{tx.travelMinutes} mins ({tx.distanceKm} km)</span>
                      </span>
                    </div>

                    {/* Predictive Rationale */}
                    {isPredictive && tx.predictiveRationale && (
                      <div className="mt-2 text-[10px] bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 px-2 py-1 rounded flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{tx.predictiveRationale}</span>
                      </div>
                    )}

                    {/* Spoilage Salvage Alert */}
                    {tx.spoilageRiskMitigated && (
                      <div className="mt-2 text-[10px] bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 px-2 py-1 rounded flex items-center justify-between">
                        <span>⚡ Perishable Spoilage Preempted: Reallocated to Active Hub</span>
                        <span className="font-mono font-bold">+${tx.costBreakdown.salvageBenefit}</span>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => onOpenManifest(tx)}
                        className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span>Manifest</span>
                      </button>
                      <button
                        onClick={() => onDispatchTransfer(tx)}
                        className="text-[11px] bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded-md font-bold shadow-sm transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Dispatch Courier</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl space-y-2">
                <Activity className="w-6 h-6 mx-auto text-slate-600" />
                <p>No active deficits detected in the regional network.</p>
                <p className="text-[11px] text-slate-600">
                  Switch to the <strong className="text-indigo-400">Event Forecaster</strong> tab to simulate festival surges and run preemptive stock rebalancing.
                </p>
              </div>
            )}
          </div>

          {/* Primal-Dual Shadow Price Breakdown */}
          {optimizationResult && (
            <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px]">
              <div className="flex items-center justify-between mb-1.5 text-slate-400 font-semibold text-[10px] uppercase">
                <span>Marginal Node Shadow Prices (λ*)</span>
                <span className="font-mono text-cyan-400">$/Unit Utility</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                {nodes.slice(0, 4).map((node) => (
                  <div
                    key={node.id}
                    className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded border border-slate-800 truncate"
                  >
                    <span className="truncate text-slate-400 max-w-[95px]">{node.shortName}</span>
                    <span
                      className={`font-bold ${
                        (optimizationResult.shadowPrices[node.id] || 0) > 400
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      ${optimizationResult.shadowPrices[node.id] || 80}/u
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

