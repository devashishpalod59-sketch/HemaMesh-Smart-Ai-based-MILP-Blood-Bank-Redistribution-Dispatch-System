import React from 'react';
import { ActiveDispatch, FacilityNode } from '../types/bloodMesh.ts';
import {
  Truck,
  Wind,
  Thermometer,
  Clock,
  CheckCircle2,
  Navigation,
  Crosshair,
  ArrowRight,
  ShieldCheck,
  FileText,
  Radio,
  Battery,
} from 'lucide-react';

interface LiveDispatchTrackerProps {
  dispatches: ActiveDispatch[];
  onFocusDispatch: (dispatch: ActiveDispatch) => void;
  onOpenManifestByDispatch: (dispatch: ActiveDispatch) => void;
  onOpenGreenCorridorPass?: (dispatch: ActiveDispatch) => void;
}

export const LiveDispatchTracker: React.FC<LiveDispatchTrackerProps> = ({
  dispatches,
  onFocusDispatch,
  onOpenManifestByDispatch,
  onOpenGreenCorridorPass,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-100 select-none">
      {/* Tracker Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Live Transfer Dispatch & Handover Tracker
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Real-Time Simulated Path Traversal & Cold-Chain Telemetry
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/60 px-2 py-0.5 rounded-full font-bold">
          {dispatches.filter((d) => d.status !== 'COMPLETED').length} ACTIVE
        </span>
      </div>

      {/* Dispatches List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {dispatches.length > 0 ? (
          dispatches.map((dispatch) => {
            const isDelivered = dispatch.status === 'COMPLETED' || dispatch.progressPercent >= 100;
            const isDrone = dispatch.vehicleType === 'DRONE_AERO_RESCUE';
            const isPlatelet = dispatch.component === 'PLT';

            return (
              <div
                key={dispatch.id}
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  isDelivered
                    ? 'bg-emerald-950/20 border-emerald-700/60'
                    : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/60 shadow-lg'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg border text-white ${
                        isDelivered
                          ? 'bg-emerald-600 border-emerald-400'
                          : isDrone
                          ? 'bg-sky-600 border-sky-400'
                          : 'bg-cyan-600 border-cyan-400'
                      }`}
                    >
                      {isDelivered ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isDrone ? (
                        <Wind className="w-4 h-4 animate-spin" />
                      ) : (
                        <Truck className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">{dispatch.vehicleId}</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          [{dispatch.manifestNumber}]
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {isDelivered ? 'Handover Completed & Verified' : 'Real-time GPS Traversal Active'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isDelivered
                          ? 'bg-emerald-900 text-emerald-200 border border-emerald-600'
                          : 'bg-cyan-900 text-cyan-200 border border-cyan-600 animate-pulse'
                      }`}
                    >
                      {isDelivered ? 'DELIVERED' : 'IN TRANSIT'}
                    </span>
                  </div>
                </div>

                {/* Route Source -> Destination */}
                <div className="mt-2.5 flex items-center justify-between text-xs font-semibold bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <div className="truncate max-w-[130px] text-slate-300" title={dispatch.fromNode.name}>
                    {dispatch.fromNode.shortName}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 mx-1" />
                  <div className="truncate max-w-[130px] text-rose-300 font-bold" title={dispatch.toNode.name}>
                    {dispatch.toNode.shortName}
                  </div>
                </div>

                {/* Animated Traversal Progress Bar */}
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Path Traversal: {dispatch.progressPercent}%</span>
                    <span className="text-cyan-400 font-bold">
                      {isDelivered ? 'Hospital Handover' : `ETA: ${dispatch.estimatedArrival}`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isDelivered ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${dispatch.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Cold-Chain IoT Sensor HUD Grid */}
                <div className="mt-2.5 space-y-1.5 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/90 text-[10px] font-mono">
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1 rounded bg-slate-950/90 border border-slate-800">
                      <span className="text-slate-400 block text-[9px] flex items-center justify-center gap-0.5">
                        <Thermometer className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Payload Temp</span>
                      </span>
                      <span className={`font-black ${
                        isPlatelet
                          ? (dispatch.telemetry.temperatureCelsius >= 20 && dispatch.telemetry.temperatureCelsius <= 24 ? 'text-emerald-400' : 'text-amber-400')
                          : (dispatch.telemetry.temperatureCelsius >= 1 && dispatch.telemetry.temperatureCelsius <= 6 ? 'text-emerald-400' : 'text-rose-400')
                      }`}>
                        {dispatch.telemetry.temperatureCelsius.toFixed(1)}°C
                      </span>
                      <span className="text-[8px] text-slate-500 block">
                        {isPlatelet ? '20-24°C Agitator' : '1-6°C Cold Vault'}
                      </span>
                    </div>

                    <div className="p-1 rounded bg-slate-950/90 border border-slate-800">
                      <span className="text-slate-400 block text-[9px] flex items-center justify-center gap-0.5">
                        <Battery className="w-2.5 h-2.5 text-cyan-400" />
                        <span>Active Cooler</span>
                      </span>
                      <span className="font-bold text-cyan-400">
                        {dispatch.telemetry.batteryOrFuelPercent}% Batt
                      </span>
                      <span className="text-[8px] text-emerald-400 block">
                        Peltier Active
                      </span>
                    </div>

                    <div className="p-1 rounded bg-slate-950/90 border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">Cargo Units</span>
                      <span className="font-black text-rose-400">
                        {dispatch.units}u {dispatch.bloodType}
                      </span>
                      <span className="text-[8px] text-slate-400 block truncate">
                        {dispatch.component} ISBT-128
                      </span>
                    </div>
                  </div>

                  {/* Cold-Chain Seal & Accelerometer Telemetry Bar */}
                  <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>IoT Seal: Tamper-Proof Intact</span>
                    </span>
                    <span className="text-slate-400 font-mono">
                      Shock: 0.04G (Smooth)
                    </span>
                  </div>
                </div>

                {/* Live GPS Coordinates */}
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                  <span>
                    Lat: {dispatch.currentCoordinates.lat.toFixed(4)}°, Lng:{' '}
                    {dispatch.currentCoordinates.lng.toFixed(4)}°
                  </span>
                  <span className="text-slate-500">
                    Dispatched: {dispatch.dispatchedAt}
                  </span>
                </div>

                {/* Card Actions */}
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800 gap-1.5 flex-wrap">
                  <button
                    onClick={() => onFocusDispatch(dispatch)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 py-1"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Track on Map</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {onOpenGreenCorridorPass && (
                      <button
                        onClick={() => onOpenGreenCorridorPass(dispatch)}
                        className="text-[10px] bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 px-2 py-1 rounded-md font-bold transition flex items-center gap-1"
                        title="View Official Digital Green Corridor Transit Pass"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Green Corridor Pass</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenManifestByDispatch(dispatch)}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-md font-medium transition flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span>ISBT Manifest</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl space-y-2">
            <Truck className="w-8 h-8 mx-auto text-slate-600" />
            <p>No active courier dispatches currently in transit.</p>
            <p className="text-[11px] text-slate-600">
              Trigger an emergency reallocation or dispatch from the MILP console to track live traversal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
