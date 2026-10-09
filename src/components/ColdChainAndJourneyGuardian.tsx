import React, { useState } from 'react';
import {
  ActiveDispatch,
  FacilityNode,
  RoadClosureIncident,
  ShipmentDelayIncident,
} from '../types/bloodMesh.ts';
import {
  Thermometer,
  Truck,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Radio,
  Navigation,
  Crosshair,
  CheckCircle2,
  FileText,
  Battery,
  Flame,
  Snowflake,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { alertSoundService } from '../services/alertSoundService.ts';

interface ColdChainAndJourneyGuardianProps {
  dispatches: ActiveDispatch[];
  roadClosures: RoadClosureIncident[];
  onFocusDispatch: (dispatch: ActiveDispatch) => void;
  onOpenManifest: (dispatch: ActiveDispatch) => void;
  onOpenGreenCorridorPass: (dispatch: ActiveDispatch) => void;
  onSimulateTempExcursion?: (dispatchId: string) => void;
  onSimulateDelay?: (dispatchId: string) => void;
  onClearDelay?: (dispatchId: string) => void;
  onRequestDroneDivert?: (dispatch: ActiveDispatch) => void;
}

export const ColdChainAndJourneyGuardian: React.FC<ColdChainAndJourneyGuardianProps> = ({
  dispatches,
  roadClosures,
  onFocusDispatch,
  onOpenManifest,
  onOpenGreenCorridorPass,
  onSimulateTempExcursion,
  onSimulateDelay,
  onClearDelay,
  onRequestDroneDivert,
}) => {
  const [selectedDispatchId, setSelectedDispatchId] = useState<string>(
    dispatches[0]?.id || ''
  );

  const activeDispatch =
    dispatches.find((d) => d.id === selectedDispatchId) || dispatches[0];

  // Helper for cold chain compliance
  const getTempStatus = (component: string, tempCelsius: number) => {
    if (component === 'PLT') {
      if (tempCelsius < 20.0 || tempCelsius > 24.0) {
        return {
          status: 'EXCURSION',
          text: 'THERMAL EXCURSION BREACH',
          color: 'text-rose-400 bg-rose-950/80 border-rose-700',
        };
      }
      if (tempCelsius < 20.5 || tempCelsius > 23.5) {
        return {
          status: 'WARNING',
          text: 'MARGINAL TEMPERATURE',
          color: 'text-amber-400 bg-amber-950/80 border-amber-700',
        };
      }
      return {
        status: 'NOMINAL',
        text: 'PERFECT 20-24°C COLD CHAIN',
        color: 'text-emerald-400 bg-emerald-950/80 border-emerald-700',
      };
    } else {
      // PRBC or Whole Blood: 2°C - 6°C
      if (tempCelsius < 1.0 || tempCelsius > 6.0) {
        return {
          status: 'EXCURSION',
          text: 'CRITICAL TEMP EXCURSION',
          color: 'text-rose-400 bg-rose-950/80 border-rose-700',
        };
      }
      if (tempCelsius > 5.2) {
        return {
          status: 'WARNING',
          text: 'APPROACHING 6°C LIMIT',
          color: 'text-amber-400 bg-amber-950/80 border-amber-700',
        };
      }
      return {
        status: 'NOMINAL',
        text: 'NOMINAL 2-6°C CHILL CHAIN',
        color: 'text-emerald-400 bg-emerald-950/80 border-emerald-700',
      };
    }
  };

  return (
    <div className="bg-[#060d1b] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full text-slate-100">
      {/* Top Banner Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0c182f] via-[#09152b] to-[#12081f] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
            <Snowflake className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                Cold Chain Guardian &amp; Live Journey Tracker
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                IoT TELEMETRY ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Continuous 2-6°C / 20-24°C Thermal Surveillance · Milestone Waypoint Navigation
            </p>
          </div>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">In Transit:</span>
            <strong className="text-white">
              {dispatches.filter((d) => d.status !== 'COMPLETED').length}
            </strong>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-slate-400">Roadblocks:</span>
            <strong className="text-orange-400">{roadClosures.length}</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Left selector, Right comprehensive telemetry & journey */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
        {/* Left Column: Dispatches List */}
        <div className="lg:col-span-4 border-r border-slate-800/80 bg-slate-950/60 p-3 space-y-2.5 overflow-y-auto">
          <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider px-1">
            Active Blood Convoys &amp; Drones ({dispatches.length})
          </div>

          {dispatches.map((dispatch) => {
            const isSelected = dispatch.id === selectedDispatchId;
            const tempInfo = getTempStatus(
              dispatch.component,
              dispatch.telemetry.temperatureCelsius
            );
            const isCompleted = dispatch.status === 'COMPLETED';

            return (
              <div
                key={dispatch.id}
                onClick={() => setSelectedDispatchId(dispatch.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/80 shadow-lg ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                        dispatch.vehicleType === 'DRONE_AERO_RESCUE'
                          ? 'bg-sky-600 text-white'
                          : 'bg-cyan-700 text-white'
                      }`}
                    >
                      {dispatch.vehicleType === 'DRONE_AERO_RESCUE' ? (
                        <Wind className="w-4 h-4" />
                      ) : (
                        <Truck className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{dispatch.vehicleId}</span>
                        <span className="text-[10px] font-mono text-cyan-400">
                          [{dispatch.bloodType} {dispatch.component}]
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                        {dispatch.fromNode.shortName} → {dispatch.toNode.shortName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${tempInfo.color}`}
                    >
                      {dispatch.telemetry.temperatureCelsius.toFixed(1)}°C
                    </span>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                      {isCompleted ? 'DELIVERED' : dispatch.estimatedArrival}
                    </div>
                  </div>
                </div>

                {/* Mini progress bar */}
                <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                    }`}
                    style={{ width: `${dispatch.progressPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep-Dive Cold Chain & Journey Tracker */}
        {activeDispatch ? (
          <div className="lg:col-span-8 p-4 sm:p-5 space-y-4 overflow-y-auto bg-[#070e1e]">
            {/* Active Convoy Header */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    MANIFEST: {activeDispatch.manifestNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Dispatched at {activeDispatch.dispatchedAt}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                  <span>{activeDispatch.vehicleId}</span>
                  <span className="text-xs font-normal text-slate-400">
                    ({activeDispatch.units} Units of {activeDispatch.bloodType} {activeDispatch.component})
                  </span>
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onFocusDispatch(activeDispatch)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition"
                >
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pin on Map</span>
                </button>

                <button
                  onClick={() => onOpenGreenCorridorPass(activeDispatch)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 flex items-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Green Pass</span>
                </button>

                <button
                  onClick={() => onOpenManifest(activeDispatch)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 flex items-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Manifest</span>
                </button>
              </div>
            </div>

            {/* LIVE BLOOD JOURNEY TRACKER: 5-Stage Milestone Progress */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span>Live Blood Journey Timeline &amp; ETA Progress</span>
                </div>
                <span className="text-xs font-mono font-black text-cyan-400">
                  {activeDispatch.progressPercent}% TRAVERSED · ETA {activeDispatch.estimatedArrival}
                </span>
              </div>

              {/* Step Flow */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-semibold">
                {[
                  { title: '1. Packed & Cold Sealed', done: activeDispatch.progressPercent >= 10 },
                  { title: '2. Departed Hub', done: activeDispatch.progressPercent >= 25 },
                  { title: '3. Police Green Corridor', done: activeDispatch.progressPercent >= 50 },
                  { title: '4. Highway Arterial', done: activeDispatch.progressPercent >= 75 },
                  { title: '5. Trauma Reception', done: activeDispatch.progressPercent >= 100 },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border transition ${
                      step.done
                        ? 'bg-emerald-950/40 border-emerald-600/70 text-emerald-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {step.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <span className="text-[11px] leading-tight block">{step.title}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic GPS telemetry bar */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Coordinates:</div>
                  <div className="font-mono text-[11px] text-white">
                    {activeDispatch.currentCoordinates.lat.toFixed(4)}°N,{' '}
                    {activeDispatch.currentCoordinates.lng.toFixed(4)}°E
                  </div>
                </div>

                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Velocity:</div>
                  <div className="font-mono text-[11px] text-cyan-300 font-bold">
                    {activeDispatch.telemetry.speedKmh} km/h (Code-3 Priority)
                  </div>
                </div>

                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Battery / Fuel:</div>
                  <div className="font-mono text-[11px] text-emerald-300 font-bold flex items-center gap-1">
                    <Battery className="w-3 h-3 text-emerald-400" />
                    <span>{activeDispatch.telemetry.batteryOrFuelPercent}%</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Heading Bearing:</div>
                  <div className="font-mono text-[11px] text-purple-300 font-bold">
                    {activeDispatch.telemetry.bearingDegrees}° Azimuth
                  </div>
                </div>
              </div>
            </div>

            {/* COLD CHAIN GUARDIAN IOT SENSORS */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Thermometer className="w-4 h-4 text-rose-400" />
                  <span>Cold Chain Guardian IoT Sensor Telemetry</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                  NFC CIPHER-LOCKED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Temp Gauge Box */}
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Internal Payload Temp</span>
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="my-2">
                    <div className="text-2xl font-black font-mono text-white flex items-baseline gap-1">
                      <span>{activeDispatch.telemetry.temperatureCelsius.toFixed(1)}°C</span>
                      <span className="text-xs font-normal text-slate-400">
                        {activeDispatch.component === 'PLT' ? '(Target 20-24°C)' : '(Target 2-6°C)'}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold mt-1 text-emerald-400">
                      {getTempStatus(activeDispatch.component, activeDispatch.telemetry.temperatureCelsius).text}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
                    Sensor Ping: 1.8s refresh · Calibration ISO 15189
                  </div>
                </div>

                {/* Phase-Change Ice Pack Integrity */}
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Passive PCM Ice Integrity</span>
                    <Snowflake className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="my-2">
                    <div className="text-2xl font-black font-mono text-cyan-300">
                      89.4%
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      Phase-Change Gel Solid · 4h 15m Holdover
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
                    Vacuum Insulated Panel (VIP) Box
                  </div>
                </div>

                {/* Agitator & Vibration */}
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{activeDispatch.component === 'PLT' ? 'Platelet Agitator' : 'Vibration Damping'}</span>
                    <Radio className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="my-2">
                    <div className="text-2xl font-black font-mono text-purple-300">
                      {activeDispatch.component === 'PLT' ? '60 RPM' : '0.18 G'}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      {activeDispatch.component === 'PLT' ? 'Continuous Swirling Motion Active' : 'Suspension Smooth / No Hemolysis'}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
                    Tri-axial Accelerometer Nominal
                  </div>
                </div>
              </div>

              {/* Simulation Testing Buttons for Cold Chain and Delay */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Test Sentinel Response &amp; Alarms:</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSimulateTempExcursion?.(activeDispatch.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 flex items-center gap-1 transition"
                  >
                    <Flame className="w-3 h-3" />
                    <span>Inject Heat Excursion (+7.5°C)</span>
                  </button>

                  <button
                    onClick={() => onSimulateDelay?.(activeDispatch.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 flex items-center gap-1 transition"
                  >
                    <Clock className="w-3 h-3" />
                    <span>Simulate Highway Delay (+20m)</span>
                  </button>

                  <button
                    onClick={() => onClearDelay?.(activeDispatch.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 flex items-center gap-1 transition"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Reset Nominal</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ROAD CLOSURES & SHIPMENT DELAY ADVISORY */}
            {roadClosures.length > 0 && (
              <div className="bg-amber-950/30 border border-amber-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Active Road Closures in Operational Sector ({roadClosures.length})</span>
                </div>

                <div className="space-y-2">
                  {roadClosures.map((closure) => (
                    <div
                      key={closure.id}
                      className="bg-slate-950/70 p-3 rounded-lg border border-amber-900/50 flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>🚧 {closure.corridorName}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-red-950 text-red-200 border border-red-800">
                            {closure.severity.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          {closure.reason.replace(/_/g, ' ')} at {closure.locationName} · Detour penalty: +{closure.estimatedDelayMinutes} mins
                        </div>
                        <div className="text-[10px] text-cyan-400 mt-0.5">
                          Reroute recommendation: {closure.recommendedDetour}
                        </div>
                      </div>

                      <button
                        onClick={() => onRequestDroneDivert?.(activeDispatch)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-900 hover:bg-sky-800 border border-sky-600 text-white flex items-center gap-1.5 transition"
                      >
                        <Wind className="w-3.5 h-3.5" />
                        <span>Deploy Drone Relay Bypass</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 p-8 flex items-center justify-center text-slate-500">
            No active dispatch selected
          </div>
        )}
      </div>
    </div>
  );
};
