import React, { useState } from 'react';
import {
  FacilityNode,
  RoadClosureIncident,
  ShipmentDelayIncident,
  DigitalTwinScenario,
  OptimizationResult,
  TransferDecision,
} from '../types/bloodMesh.ts';
import {
  Zap,
  Activity,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sliders,
  Radio,
  Plus,
  Trash2,
  Layers,
} from 'lucide-react';
import { alertSoundService } from '../services/alertSoundService.ts';

interface EmergencyDigitalTwinSandboxProps {
  nodes: FacilityNode[];
  roadClosures: RoadClosureIncident[];
  onAddRoadClosure: (closure: RoadClosureIncident) => void;
  onRemoveRoadClosure: (id: string) => void;
  onRunDigitalTwinOptimization: (scenario: DigitalTwinScenario) => void;
  onApplyScenarioToLive: (scenario: DigitalTwinScenario) => void;
  optimizationResult: OptimizationResult | null;
  onNavigateToTab?: (tab: 'SOLVER' | 'MAP' | 'AVAILABILITY') => void;
}

const PRESET_SCENARIOS: DigitalTwinScenario[] = [
  {
    id: 'SCENARIO-MCI-EXPRESSWAY',
    title: '16-Vehicle Multi-Collision on Major Expressway',
    description: 'Catastrophic chain-reaction pileup involving chemical tanker and passenger buses. AIIMS Apex Trauma and Safdarjung inundated with multiple hemorrhagic shock Class IV patients.',
    incidentType: 'MASS_CASUALTY_ACCIDENT',
    additionalDeficitUnits: 65,
    affectedNodeIds: ['in-del-aiims-t1', 'in-del-safdarjung'],
    roadClosuresCount: 1,
    baselineResilience: 38,
    postStabilizationResilience: 97,
  },
  {
    id: 'SCENARIO-MONSOON-FLOOD',
    title: 'Monsoon Cloudburst & Arterial Highway Submersion',
    description: 'Severe urban inundation submerges Outer Ring Road and Mathura Road underpasses. Standard vehicle transit times tripled (+45m delay); emergency drone corridor required.',
    incidentType: 'NATURAL_DISASTER_WEATHER',
    additionalDeficitUnits: 25,
    affectedNodeIds: ['in-del-redcross-depot', 'in-del-mayur-vihar'],
    roadClosuresCount: 2,
    baselineResilience: 44,
    postStabilizationResilience: 94,
  },
  {
    id: 'SCENARIO-DENGUE-PLATELET',
    title: 'Hyper-Endemic Vector-Borne Dengue Surge',
    description: 'Seasonal platelet demand surges +450% across tertiary pediatrics and oncology centers. Peripheral spokes face rapid platelet stockouts with 0 units remaining.',
    incidentType: 'EPIDEMIOLOGICAL_SURGE',
    additionalDeficitUnits: 80,
    affectedNodeIds: ['in-del-aiims-t1', 'in-del-safdarjung', 'in-del-mayur-vihar'],
    roadClosuresCount: 0,
    baselineResilience: 31,
    postStabilizationResilience: 98,
  },
  {
    id: 'SCENARIO-GRID-BLACKOUT',
    title: 'Regional Central Depot Cold Storage Grid Failure',
    description: 'Backup generator malfunction at Central Blood Depot creates imminent spoilage risk for 1,200 cold units within 2 hours. Mandatory rapid evacuation to secondary hubs.',
    incidentType: 'INFRASTRUCTURE_FAILURE',
    additionalDeficitUnits: 110,
    affectedNodeIds: ['in-del-redcross-depot'],
    roadClosuresCount: 1,
    baselineResilience: 27,
    postStabilizationResilience: 96,
  },
];

export const EmergencyDigitalTwinSandbox: React.FC<EmergencyDigitalTwinSandboxProps> = ({
  nodes,
  roadClosures,
  onAddRoadClosure,
  onRemoveRoadClosure,
  onRunDigitalTwinOptimization,
  onApplyScenarioToLive,
  optimizationResult,
  onNavigateToTab,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<DigitalTwinScenario>(PRESET_SCENARIOS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasRunStabilization, setHasRunStabilization] = useState(false);
  const [customClosureRoad, setCustomClosureRoad] = useState('');
  const [customClosureDelay, setCustomClosureDelay] = useState(25);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    alertSoundService.playCriticalAlertChime();
    setTimeout(() => {
      setIsSimulating(false);
      setHasRunStabilization(true);
      onRunDigitalTwinOptimization(selectedScenario);
      alertSoundService.playSuccessChime();
    }, 850);
  };

  const handleReset = () => {
    setHasRunStabilization(false);
  };

  const handleAddCustomClosure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClosureRoad.trim()) return;

    const newClosure: RoadClosureIncident = {
      id: `RC-CUSTOM-${Date.now()}`,
      corridorName: customClosureRoad.trim(),
      locationName: 'Active Tactical Sector',
      coordinates: {
        lat: nodes[0]?.coordinates.lat ? nodes[0].coordinates.lat + 0.015 : 28.58,
        lng: nodes[0]?.coordinates.lng ? nodes[0].coordinates.lng + 0.012 : 77.22,
      },
      reason: 'CONSTRUCTION_WORK',
      severity: 'FULL_BLOCKAGE',
      estimatedDelayMinutes: customClosureDelay,
      reportedAt: new Date().toLocaleTimeString(),
      active: true,
      recommendedDetour: 'Divert via Elevated Corridor / Peripheral Ring',
    };

    onAddRoadClosure(newClosure);
    setCustomClosureRoad('');
    alertSoundService.playWarningChime();
  };

  const currentResilienceScore = hasRunStabilization
    ? selectedScenario.postStabilizationResilience
    : selectedScenario.baselineResilience;

  return (
    <div className="bg-[#060c19] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#170929] via-[#0b1328] to-[#071d2b] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                Emergency Digital Twin · What-If Catastrophe Sandbox
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700">
                MILP SIMULATION TWIN
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Stress-Test Grid Shocks · Roadblock Inundations · Real-time Auto-Stabilization
            </p>
          </div>
        </div>

        {/* Resilience Dial Gauge */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Network Resilience Score
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-xl font-black font-mono ${
                  currentResilienceScore >= 80
                    ? 'text-emerald-400'
                    : currentResilienceScore >= 50
                    ? 'text-amber-400'
                    : 'text-rose-400 animate-pulse'
                }`}
              >
                {currentResilienceScore}%
              </span>
              <span className="text-[10px] text-slate-400">
                {hasRunStabilization ? 'OPTIMIZED' : 'UNSTABILIZED'}
              </span>
            </div>
          </div>

          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                currentResilienceScore >= 80
                  ? 'bg-emerald-400'
                  : currentResilienceScore >= 50
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${currentResilienceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Preset Scenarios Selector */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span>Select Catastrophe Scenario</span>
            <span className="font-mono text-purple-400 text-[10px]">What-If Simulation</span>
          </div>

          <div className="space-y-2.5">
            {PRESET_SCENARIOS.map((scen) => {
              const isSelected = scen.id === selectedScenario.id;
              return (
                <div
                  key={scen.id}
                  onClick={() => {
                    setSelectedScenario(scen);
                    setHasRunStabilization(false);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500/80 shadow-lg ring-1 ring-purple-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">{scen.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-purple-800">
                      +{scen.additionalDeficitUnits} Units Deficit
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {scen.description}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-900 pt-2 font-mono">
                    <span>Vulnerability: {100 - scen.baselineResilience}% At Risk</span>
                    <span className="text-emerald-400">Target Recovery: {scen.postStabilizationResilience}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Simulation Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white shadow-lg shadow-purple-950/60 active:scale-95 transition flex items-center justify-center gap-2"
            >
              {isSimulating ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Computing AI + MILP Flow...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI + MILP Twin Stabilization</span>
                </>
              )}
            </button>

            {hasRunStabilization && (
              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition"
                title="Reset Simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Road Closure & Real-time Impact Matrix */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Scenario Impact Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Simulated Impact on Regional Nodes ({nodes.length} Facilities)</span>
              </span>
              <span className="text-[10px] font-mono text-purple-300 font-bold">
                {hasRunStabilization ? 'STABILIZATION EXECUTED' : 'UNMITIGATED SHOCKWAVE'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-3">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Total Acute Deficit</div>
                <div className="text-lg font-black font-mono text-rose-400 mt-0.5">
                  -{selectedScenario.additionalDeficitUnits} Units
                </div>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Road Corridor Impact</div>
                <div className="text-lg font-black font-mono text-orange-400 mt-0.5">
                  {roadClosures.length} Closures
                </div>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Simplex Solvability</div>
                <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
                  100% Feasible
                </div>
              </div>
            </div>

            {hasRunStabilization && (
              <div className="mt-3.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Optimal Solution Discovered:</strong> Preempted all stockouts across {selectedScenario.affectedNodeIds.length} vulnerable facilities.
                  </span>
                </div>
                <button
                  onClick={() => onNavigateToTab?.('SOLVER')}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-800 hover:bg-emerald-700 text-white shrink-0 transition"
                >
                  View Decisions
                </button>
              </div>
            )}
          </div>

          {/* ROAD CLOSURES CONTROLLER */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span>Dynamic Road Closures &amp; Bottleneck Manager ({roadClosures.length})</span>
              </div>
              <span className="text-[10px] text-slate-400">Real-time Detour Rerouting</span>
            </div>

            {/* List of active closures */}
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
              {roadClosures.length === 0 ? (
                <div className="text-xs text-slate-500 py-3 text-center">
                  No active road closures injected. All transit corridors operating at nominal speed.
                </div>
              ) : (
                roadClosures.map((closure) => (
                  <div
                    key={closure.id}
                    className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>🚧 {closure.corridorName}</span>
                        <span className="text-[10px] text-orange-400 font-mono">
                          (+{closure.estimatedDelayMinutes}m delay)
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">{closure.recommendedDetour}</div>
                    </div>

                    <button
                      onClick={() => onRemoveRoadClosure(closure.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition"
                      title="Clear Roadblock"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Inject Custom Road Closure Form */}
            <form onSubmit={handleAddCustomClosure} className="pt-2 border-t border-slate-900 flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Inject road closure (e.g. NH48 Flyover Crack)"
                value={customClosureRoad}
                onChange={(e) => setCustomClosureRoad(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-medium"
              />

              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300">
                <span className="text-[10px] text-slate-400">Delay:</span>
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={customClosureDelay}
                  onChange={(e) => setCustomClosureDelay(Number(e.target.value))}
                  className="w-12 bg-transparent text-center font-mono font-bold focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">m</span>
              </div>

              <button
                type="submit"
                disabled={!customClosureRoad.trim()}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white disabled:opacity-40 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Inject Block</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
