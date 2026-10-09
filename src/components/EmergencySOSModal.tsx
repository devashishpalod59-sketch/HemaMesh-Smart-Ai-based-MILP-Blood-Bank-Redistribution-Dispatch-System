import React, { useState, useMemo } from 'react';
import {
  FacilityNode,
  NearbyDevice,
  BloodType,
  BloodComponent,
  EmergencyBloodRequest,
} from '../types/bloodMesh.ts';
import { calculateDistanceKm } from '../services/milpSolver.ts';
import { isBloodCompatible } from '../services/compatibility.ts';
import {
  AlertOctagon,
  Flame,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  Phone,
  Radio,
  Truck,
  Wind,
  Navigation,
  ShieldAlert,
  ArrowRight,
  Battery,
  Thermometer,
  Sparkles,
} from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: FacilityNode[];
  devices: NearbyDevice[];
  userCoords: { lat: number; lng: number } | null;
  onSelectNearestBloodBank: (node: FacilityNode) => void;
  onDispatchNearbyDevice: (device: NearbyDevice) => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  nodes,
  devices,
  userCoords,
  onSelectNearestBloodBank,
  onDispatchNearbyDevice,
}) => {
  const [bloodType, setBloodType] = useState<BloodType>('O-');
  const [component, setComponent] = useState<BloodComponent>('PRBC');
  const [units, setUnits] = useState<number>(3);
  const [urgency, setUrgency] = useState<'STAT_CODE_RED' | 'URGENT' | 'ROUTINE'>('STAT_CODE_RED');
  const [notes, setNotes] = useState<string>('Incoming severe hypovolemic trauma / resuscitation required');
  const [requestedDispatched, setRequestedDispatched] = useState(false);

  const baseCoords = useMemo(() => {
    return userCoords || nodes[0]?.coordinates || { lat: 28.5672, lng: 77.2100 };
  }, [userCoords, nodes]);

  // Rank blood banks by compatible stock availability and proximity
  const rankedBloodBanks = useMemo(() => {
    return nodes
      .map((node) => {
        const distKm = calculateDistanceKm(
          baseCoords.lat,
          baseCoords.lng,
          node.coordinates.lat,
          node.coordinates.lng
        );
        const code3Mins = Math.max(2, Math.round((distKm / 60) * 60));

        // Find available units that are clinically compatible
        const compatibleStock = node.inventory
          .filter((inv) => inv.component === component && isBloodCompatible(inv.bloodType, bloodType, component))
          .reduce((sum, inv) => sum + inv.units, 0);

        const exactStock = node.inventory
          .filter((inv) => inv.component === component && inv.bloodType === bloodType)
          .reduce((sum, inv) => sum + inv.units, 0);

        const satisfiesDemand = compatibleStock >= units;

        return {
          ...node,
          distKm,
          code3Mins,
          compatibleStock,
          exactStock,
          satisfiesDemand,
        };
      })
      .sort((a, b) => {
        // Prioritize facilities with sufficient stock, then nearest distance
        if (a.satisfiesDemand && !b.satisfiesDemand) return -1;
        if (!a.satisfiesDemand && b.satisfiesDemand) return 1;
        return a.distKm - b.distKm;
      });
  }, [nodes, baseCoords, bloodType, component, units]);

  const nearestRecommendedBank = rankedBloodBanks[0];

  // Rank nearby devices by proximity
  const rankedDevices = useMemo(() => {
    return devices
      .map((dev) => {
        const distKm = calculateDistanceKm(
          baseCoords.lat,
          baseCoords.lng,
          dev.coordinates.lat,
          dev.coordinates.lng
        );
        const etaMins = Math.max(1, Math.round((distKm / 50) * 60));

        const hasCompatibleOnboard = dev.onboardUnits.some(
          (u) => u.component === component && isBloodCompatible(u.bloodType, bloodType, component)
        );

        return {
          ...dev,
          distanceKm: distKm,
          etaMinutes: etaMins,
          hasCompatibleOnboard,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [devices, baseCoords, bloodType, component]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden shadow-rose-950/30">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  STAT Blood Emergency & Instant Device Locator
                </h2>
                <span className="text-[10px] font-mono font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">
                  CODE RED PROTOCOL
                </span>
              </div>
              <p className="text-xs text-rose-300/80">
                Instantly matches nearest available blood bank and dispatches immediate mobile units
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close emergency SOS modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Request Configurator */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3 shadow-inner">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>1. Enter Blood Transfusion Requirement</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Blood Type Selector */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Recipient Blood Group
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value as BloodType)}
                  aria-label="Recipient blood group"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-rose-300 font-mono font-bold text-sm focus:outline-none focus:border-rose-500"
                >
                  {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as const).map((bt) => (
                    <option key={bt} value={bt}>
                      {bt} {bt === 'O-' ? '(Universal PRBC)' : bt === 'AB+' ? '(Universal Plasma)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Component Selector */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Component Type
                </label>
                <select
                  value={component}
                  onChange={(e) => setComponent(e.target.value as BloodComponent)}
                  aria-label="Blood component type"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sky-300 font-bold text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="PRBC">Packed Red Cells (PRBC)</option>
                  <option value="PLT">5-Day Platelets (PLT)</option>
                  <option value="FFP">Fresh Frozen Plasma (FFP)</option>
                  <option value="WB">Whole Blood (WB)</option>
                  <option value="CRYO">Cryoprecipitate (CRYO)</option>
                </select>
              </div>

              {/* Units Needed */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Required Units
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={units}
                    onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    aria-label="Required blood units"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold text-sm text-center focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-xs text-slate-400 font-medium">Units</span>
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Triage Priority
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as typeof urgency)}
                  aria-label="Triage emergency priority"
                  className="w-full bg-slate-900 border border-rose-700/80 text-rose-300 rounded-lg px-2.5 py-1.5 font-bold text-xs focus:outline-none"
                >
                  <option value="STAT_CODE_RED">STAT Code Red (Immediate)</option>
                  <option value="URGENT">Urgent (Within 45 mins)</option>
                  <option value="ROUTINE">Routine Resupply</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Top Recommendation: Immediate Nearest Blood Bank */}
          {nearestRecommendedBank && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>2. Nearest Suggested Blood Bank (Optimally Stocked)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Target: {units} Units {bloodType} {component}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
                      RANK #1 OPTIMAL
                    </span>
                    <h3 className="font-extrabold text-sm text-white">
                      {nearestRecommendedBank.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{nearestRecommendedBank.address}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" />
                      {nearestRecommendedBank.distKm} km away
                    </span>
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      ~{nearestRecommendedBank.code3Mins} mins Code 3 ETA
                    </span>
                    <span className="text-emerald-400 font-bold">
                      Stock: {nearestRecommendedBank.compatibleStock} compatible units available
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => {
                      onSelectNearestBloodBank(nearestRecommendedBank);
                      onClose();
                    }}
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Plot Emergency Route & Reserve</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`tel:${nearestRecommendedBank.phone}`}
                    className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs px-3 py-2 rounded-xl transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Blood Desk ({nearestRecommendedBank.phone})</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 3. Immediate Nearby Mobile Devices & Field Units */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>3. Immediate Nearby Mobile Devices & Field Units</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Within immediate 2.5 km perimeter
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rankedDevices.map((device) => {
                const isDrone = device.type === 'AERO_DRONE_POD';
                const isAmbulance = device.type === 'EMERGENCY_AMBULANCE_AMB';
                const isBus = device.type === 'MOBILE_BLOOD_BUS';

                return (
                  <div
                    key={device.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 shrink-0">
                          {isDrone ? (
                            <Wind className="w-4 h-4" />
                          ) : (
                            <Truck className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white">{device.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {device.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-cyan-400">
                          {device.distanceKm} km away
                        </div>
                        <div className="text-[10px] font-mono font-bold text-rose-400">
                          ETA: {device.etaMinutes} mins
                        </div>
                      </div>
                    </div>

                    {/* Onboard Units Chips */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono">
                      <span className="text-slate-500">Onboard:</span>
                      {device.onboardUnits.map((u, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-bold"
                        >
                          {u.units}u {u.bloodType} {u.component}
                        </span>
                      ))}
                    </div>

                    {/* Telemetry info */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Thermometer className="w-3 h-3" />
                          {device.coldStorageTempCelsius.toFixed(1)}°C
                        </span>
                        <span className="flex items-center gap-1 text-cyan-400">
                          <Battery className="w-3 h-3" />
                          {device.batteryOrFuelPercent}%
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onDispatchNearbyDevice(device);
                          setRequestedDispatched(true);
                          setTimeout(() => {
                            setRequestedDispatched(false);
                            onClose();
                          }, 1200);
                        }}
                        className="text-[11px] bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-2.5 py-1 rounded-md transition shadow-sm"
                      >
                        {requestedDispatched ? 'Dispatched!' : 'Dispatch STAT'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Priority Emergency Network connected to 911 / EMS Dispatch</span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-1.5 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
