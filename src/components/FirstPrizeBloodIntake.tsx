import React, { useState, useMemo } from 'react';
import {
  FacilityNode,
  BloodType,
  BloodComponent,
  UserLocationTrackerState,
  NearbyDevice,
} from '../types/bloodMesh.ts';
import { calculateDistanceKm } from '../services/milpSolver.ts';
import { isBloodCompatible, getComponentShelfLifeSpec } from '../services/compatibility.ts';
import { resolveIndianLocationInput, KNOWN_INDIAN_LOCATIONS } from '../services/indianGeocoding.ts';
import {
  Search,
  MapPin,
  Crosshair,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Phone,
  Radio,
  Zap,
  Sparkles,
  Trophy,
  Navigation,
  ShieldCheck,
  Send,
  Droplets,
  Clock,
} from 'lucide-react';

interface FirstPrizeBloodIntakeProps {
  nodes: FacilityNode[];
  devices: NearbyDevice[];
  userLocation: UserLocationTrackerState;
  activeCoords: { lat: number; lng: number };
  activeLocationLabel: string;
  onLocationResolved: (coords: { lat: number; lng: number }, label: string) => void;
  onUseLiveGps: () => void;
  onSelectNearestBank: (node: FacilityNode) => void;
  onDispatchNearbyDevice: (device: NearbyDevice) => void;
  onTriggerSOSBroadcast: (bloodType: BloodType, units: number) => void;
}

const BLOOD_TYPES: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const FirstPrizeBloodIntake: React.FC<FirstPrizeBloodIntakeProps> = ({
  nodes,
  devices,
  userLocation,
  activeCoords,
  activeLocationLabel,
  onLocationResolved,
  onUseLiveGps,
  onSelectNearestBank,
  onDispatchNearbyDevice,
  onTriggerSOSBroadcast,
}) => {
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType>('O-');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>('PRBC');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [locationInput, setLocationInput] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isBroadcastSent, setIsBroadcastSent] = useState<boolean>(false);

  // Instant location search submit
  const handleLocationSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!locationInput.trim()) return;

    const resolved = resolveIndianLocationInput(locationInput);
    if (resolved) {
      onLocationResolved(resolved.coords, resolved.name);
      setShowDropdown(false);
      setLocationInput('');
    } else {
      const match = KNOWN_INDIAN_LOCATIONS.find(
        (l) =>
          l.name.toLowerCase().includes(locationInput.toLowerCase()) ||
          l.city.toLowerCase().includes(locationInput.toLowerCase())
      );
      if (match) {
        onLocationResolved(match.coords, match.name);
        setShowDropdown(false);
        setLocationInput('');
      }
    }
  };

  // Instant calculation of nearest compatible blood banks (<5ms)
  const results = useMemo(() => {
    const list = nodes
      .map((node) => {
        const distanceKm = calculateDistanceKm(
          activeCoords.lat,
          activeCoords.lng,
          node.coordinates.lat,
          node.coordinates.lng
        );
        const code3Mins = Math.max(2, Math.round((distanceKm / 60) * 60));

        // Compatible units in inventory
        const compatibleUnits = node.inventory
          .filter(
            (inv) =>
              inv.component === selectedComponent &&
              isBloodCompatible(inv.bloodType, selectedBloodType, selectedComponent)
          )
          .reduce((sum, inv) => sum + inv.units, 0);

        const exactUnits = node.inventory
          .filter(
            (inv) =>
              inv.component === selectedComponent && inv.bloodType === selectedBloodType
          )
          .reduce((sum, inv) => sum + inv.units, 0);

        return {
          node,
          distanceKm,
          code3Mins,
          compatibleUnits,
          exactUnits,
          hasEnough: compatibleUnits >= unitsNeeded,
        };
      })
      .sort((a, b) => {
        if (a.hasEnough && !b.hasEnough) return -1;
        if (!a.hasEnough && b.hasEnough) return 1;
        return a.distanceKm - b.distanceKm;
      });

    return {
      nearestBest: list[0] || null,
      runnersUp: list.slice(1, 4),
      totalAvailableInNetwork: list.reduce((acc, curr) => acc + curr.compatibleUnits, 0),
    };
  }, [nodes, activeCoords, selectedBloodType, selectedComponent, unitsNeeded]);

  const nearest = results.nearestBest;

  // Nearest device
  const nearestDevice = useMemo(() => {
    if (!devices || devices.length === 0) return null;
    return [...devices].sort((a, b) => {
      const distA = calculateDistanceKm(activeCoords.lat, activeCoords.lng, a.coordinates.lat, a.coordinates.lng);
      const distB = calculateDistanceKm(activeCoords.lat, activeCoords.lng, b.coordinates.lat, b.coordinates.lng);
      return distA - distB;
    })[0];
  }, [devices, activeCoords]);

  const handleBroadcast = () => {
    setIsBroadcastSent(true);
    onTriggerSOSBroadcast(selectedBloodType, unitsNeeded);
    setTimeout(() => setIsBroadcastSent(false), 3000);
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 sm:p-5 text-slate-100 select-none space-y-4">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/50">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>STAT Blood Bank Locator</span>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>Apex Model</span>
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-slate-400">
              Instant stock verification & nearest blood bank routing in &lt;50ms
            </p>
          </div>
        </div>

        {/* Live Status Tag */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-600/60 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>e-RaktKosh Live API</span>
        </div>
      </div>

      {/* STEP 1: Fast Blood Group Chips Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-rose-400">
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Select Required Blood Group</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {selectedBloodType === 'O-' ? '⚡ Universal Red Cell Donor' : selectedBloodType === 'AB+' ? '⚡ Universal Plasma Donor' : 'Standard Compatibility'}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {BLOOD_TYPES.map((bt) => {
            const isSelected = selectedBloodType === bt;
            return (
              <button
                key={bt}
                onClick={() => setSelectedBloodType(bt)}
                className={`py-2 px-1 rounded-xl font-mono font-extrabold text-sm transition-all duration-150 flex flex-col items-center justify-center border ${
                  isSelected
                    ? 'bg-gradient-to-b from-rose-600 to-red-700 text-white border-white shadow-lg shadow-rose-900/60 scale-105 ring-2 ring-rose-400/50'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-600'
                }`}
              >
                <span>{bt}</span>
                <span className="text-[9px] font-normal opacity-70">
                  {bt.includes('-') ? 'Rh Neg' : 'Rh Pos'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: Location Intake Bar (Custom Search + GPS) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-cyan-400">
            <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
            <span>Enter Location or Detect GPS</span>
          </span>
          <span className="text-[11px] font-mono text-cyan-300 truncate max-w-[200px]">
            📍 {activeLocationLabel}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Text Search Field */}
          <div className="relative flex-1">
            <form onSubmit={handleLocationSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setShowDropdown(e.target.value.length > 1);
                }}
                onFocus={() => setShowDropdown(locationInput.length > 1)}
                placeholder="Type location, hospital, city or pincode (e.g., Pune, AIIMS, Parel)"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-24 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-md"
              >
                Find Banks
              </button>
            </form>

            {/* Quick Autocomplete Suggestions Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-52 overflow-y-auto">
                {KNOWN_INDIAN_LOCATIONS.filter(
                  (l) =>
                    l.name.toLowerCase().includes(locationInput.toLowerCase()) ||
                    l.city.toLowerCase().includes(locationInput.toLowerCase()) ||
                    l.keywords.some((k) => k.includes(locationInput.toLowerCase()))
                )
                  .slice(0, 5)
                  .map((loc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onLocationResolved(loc.coords, loc.name);
                        setShowDropdown(false);
                        setLocationInput('');
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-slate-800 flex items-center justify-between border-b border-slate-900 transition"
                    >
                      <div>
                        <div className="font-bold text-slate-200">{loc.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {loc.city}, {loc.state}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                        Select
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Quick GPS Button */}
          <button
            onClick={onUseLiveGps}
            className="flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 px-3 py-2.5 rounded-xl text-xs font-bold transition shadow-md shrink-0"
            title="Auto-detect current GPS coordinates"
          >
            <Crosshair className={`w-4 h-4 ${userLocation.loading ? 'animate-spin' : ''}`} />
            <span>Use My Live GPS</span>
          </button>
        </div>
      </div>

      {/* STEP 3: Instant Suggestion Result Card (#1 Nearest Blood Bank) */}
      {nearest && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-950 to-slate-950 border-2 border-emerald-500/70 shadow-2xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                <Trophy className="w-3 h-3 text-slate-950" />
                <span>#1 NEAREST SUGGESTED BLOOD BANK</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {nearest.compatibleUnits} Units {selectedBloodType} In Stock
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-cyan-400 font-extrabold flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" />
                {nearest.distanceKm} km away
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-rose-400 font-extrabold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                ~{nearest.code3Mins} mins Code 3 ETA
              </span>
            </div>
          </div>

          {/* Facility Name & Address */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-white leading-tight">
                {nearest.node.name}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{nearest.node.address}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Authorized Custodian: <strong className="text-slate-200">{nearest.node.contactPerson}</strong> • Helpline:{' '}
                <a href={`tel:${nearest.node.phone}`} className="text-emerald-400 underline font-bold">
                  {nearest.node.phone}
                </a>
              </p>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <a
                href={`tel:${nearest.node.phone}`}
                className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Desk</span>
              </a>

              <button
                onClick={() => onSelectNearestBank(nearest.node)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/40 transition flex items-center justify-center gap-1.5"
              >
                <span>Direct Route on Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Runner-up Alternatives */}
          {results.runnersUp.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-400 font-semibold">Other Close Alternatives:</span>
              {results.runnersUp.map((alt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectNearestBank(alt.node)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-1 rounded-lg text-slate-300 hover:text-white flex items-center gap-1 transition"
                >
                  <span className="font-bold">{alt.node.shortName}</span>
                  <span className="text-cyan-400 font-mono">({alt.distanceKm}km • {alt.compatibleUnits}u)</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Immediate Nearby Mobile Unit / Ambulance Card & SOS Broadcast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Rapid Mobile Unit / Drone */}
        {nearestDevice && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/40">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{nearestDevice.name}</span>
                  <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    STANDBY
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {nearestDevice.distanceKm} km away • ETA {nearestDevice.etaMinutes} mins • Temp {nearestDevice.coldStorageTempCelsius.toFixed(1)}°C
                </div>
              </div>
            </div>

            <button
              onClick={() => onDispatchNearbyDevice(nearestDevice)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] px-3 py-2 rounded-xl transition shadow shrink-0"
            >
              Dispatch STAT
            </button>
          </div>
        )}

        {/* Instant Regional SOS Broadcast Button */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/60 to-slate-950 border border-rose-700/40 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Mass Casualty Emergency SOS</div>
              <div className="text-[10px] text-slate-400">
                Alerts all regional banks & 108 trauma grid
              </div>
            </div>
          </div>

          <button
            onClick={handleBroadcast}
            disabled={isBroadcastSent}
            className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[11px] px-3 py-2 rounded-xl transition shadow-lg shadow-rose-900/50 shrink-0 flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            <span>{isBroadcastSent ? 'Alert Dispatched!' : 'Send SOS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
