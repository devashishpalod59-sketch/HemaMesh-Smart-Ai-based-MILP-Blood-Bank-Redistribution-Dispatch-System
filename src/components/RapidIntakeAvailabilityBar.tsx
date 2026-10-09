import React, { useState, useMemo } from 'react';
import {
  FacilityNode,
  BloodType,
  BloodComponent,
  UserLocationTrackerState,
} from '../types/bloodMesh.ts';
import { calculateDistanceKm } from '../services/milpSolver.ts';
import { isBloodCompatible } from '../services/compatibility.ts';
import { resolveIndianLocationInput, KNOWN_INDIAN_LOCATIONS } from '../services/indianGeocoding.ts';
import {
  Search,
  MapPin,
  Crosshair,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Phone,
  Layers,
  Sparkles,
} from 'lucide-react';

interface RapidIntakeAvailabilityBarProps {
  nodes: FacilityNode[];
  userLocation: UserLocationTrackerState;
  activeCoords: { lat: number; lng: number };
  activeLocationLabel: string;
  onLocationResolved: (coords: { lat: number; lng: number }, label: string) => void;
  onUseLiveGps: () => void;
  onSelectNearestBank: (node: FacilityNode) => void;
  onOpenSOSModal: () => void;
}

export const RapidIntakeAvailabilityBar: React.FC<RapidIntakeAvailabilityBarProps> = ({
  nodes,
  userLocation,
  activeCoords,
  activeLocationLabel,
  onLocationResolved,
  onUseLiveGps,
  onSelectNearestBank,
  onOpenSOSModal,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>('O-');
  const [component, setComponent] = useState<BloodComponent>('PRBC');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Handle location search execution
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;

    const resolved = resolveIndianLocationInput(searchInput);
    if (resolved) {
      onLocationResolved(resolved.coords, resolved.name);
      setShowLocationSuggestions(false);
      setSearchInput('');
    } else {
      // Fallback: search by query text if partial match
      const matched = KNOWN_INDIAN_LOCATIONS.find(
        (l) => l.name.toLowerCase().includes(searchInput.toLowerCase()) || l.city.toLowerCase().includes(searchInput.toLowerCase())
      );
      if (matched) {
        onLocationResolved(matched.coords, matched.name);
        setShowLocationSuggestions(false);
        setSearchInput('');
      }
    }
  };

  // Instant Stock Check Calculation
  const availabilityAnalysis = useMemo(() => {
    let totalCompatibleUnits = 0;
    let exactUnits = 0;
    let qualifyingBanks: Array<{
      node: FacilityNode;
      distKm: number;
      code3Mins: number;
      compatibleUnits: number;
    }> = [];

    for (const node of nodes) {
      const distKm = calculateDistanceKm(
        activeCoords.lat,
        activeCoords.lng,
        node.coordinates.lat,
        node.coordinates.lng
      );
      const code3Mins = Math.max(2, Math.round((distKm / 60) * 60));

      const compUnits = node.inventory
        .filter((inv) => inv.component === component && isBloodCompatible(inv.bloodType, bloodType, component))
        .reduce((sum, inv) => sum + inv.units, 0);

      const exUnits = node.inventory
        .filter((inv) => inv.component === component && inv.bloodType === bloodType)
        .reduce((sum, inv) => sum + inv.units, 0);

      totalCompatibleUnits += compUnits;
      exactUnits += exUnits;

      if (compUnits > 0) {
        qualifyingBanks.push({
          node,
          distKm,
          code3Mins,
          compatibleUnits: compUnits,
        });
      }
    }

    qualifyingBanks.sort((a, b) => a.distKm - b.distKm);

    return {
      totalCompatibleUnits,
      exactUnits,
      qualifyingBanks,
      nearestBank: qualifyingBanks[0] || null,
    };
  }, [nodes, activeCoords, bloodType, component]);

  const isInStock = availabilityAnalysis.totalCompatibleUnits > 0;

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-4 py-2.5 shadow-xl select-none z-30">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left Section: User Location Entry & Live GPS Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
          {/* User Location Search Input with Geocoding */}
          <div className="relative flex-1 min-w-[240px]">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <MapPin className="w-4 h-4 text-rose-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowLocationSuggestions(e.target.value.length > 1);
                }}
                onFocus={() => setShowLocationSuggestions(searchInput.length > 1)}
                placeholder={`Search location (e.g. Parel, AIIMS, Hinjewadi, Koramangala)`}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-20 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
              >
                Locate
              </button>
            </form>

            {/* Quick Location Autocomplete Dropdown */}
            {showLocationSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-56 overflow-y-auto">
                <div className="p-1.5 text-[10px] uppercase font-bold text-slate-500 bg-slate-900 border-b border-slate-800">
                  Select Indian Healthcare Sector
                </div>
                {KNOWN_INDIAN_LOCATIONS.filter(
                  (l) =>
                    l.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                    l.city.toLowerCase().includes(searchInput.toLowerCase()) ||
                    l.keywords.some((k) => k.includes(searchInput.toLowerCase()))
                )
                  .slice(0, 5)
                  .map((loc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onLocationResolved(loc.coords, loc.name);
                        setShowLocationSuggestions(false);
                        setSearchInput('');
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center justify-between border-b border-slate-900 transition"
                    >
                      <div>
                        <div className="font-bold text-slate-200">{loc.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {loc.city}, {loc.state}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">Select</span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Current Active Location Pill & Live GPS Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onUseLiveGps}
              className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 px-2.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
              title="Detect and use my exact live GPS coordinates"
            >
              <Crosshair className={`w-3.5 h-3.5 ${userLocation.loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">My Live GPS</span>
            </button>

            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5 max-w-[190px] truncate">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span className="truncate">{activeLocationLabel}</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Rapid Blood Component Availability Intaker */}
        <div className="flex items-center gap-2 overflow-x-auto shrink-0">
          {/* Blood Type Selector */}
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5">Group:</span>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value as BloodType)}
              aria-label="Select blood group"
              className="bg-slate-900 text-rose-400 font-mono font-bold text-xs rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
            >
              {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as const).map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>

          {/* Component Selector */}
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5">Item:</span>
            <select
              value={component}
              onChange={(e) => setComponent(e.target.value as BloodComponent)}
              aria-label="Select blood component"
              className="bg-slate-900 text-sky-400 font-bold text-xs rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
            >
              <option value="PRBC">Packed Red Cells (PRBC)</option>
              <option value="PLT">5-Day Platelets (PLT)</option>
              <option value="FFP">Fresh Frozen Plasma (FFP)</option>
              <option value="WB">Whole Blood (WB)</option>
              <option value="CRYO">Cryo (CRYO)</option>
            </select>
          </div>

          {/* Instant Availability Answer Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs shadow-md shrink-0 ${
              isInStock
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/60 text-rose-300'
            }`}
          >
            {isInStock ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  IN STOCK: <strong>{availabilityAnalysis.totalCompatibleUnits} Units</strong> ({availabilityAnalysis.qualifyingBanks.length} Banks)
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>ZERO UNITS IN SECTOR - REBALANCE NEEDED</span>
              </>
            )}
          </div>

          {/* Nearest Bank Quick-Select Action */}
          {availabilityAnalysis.nearestBank && (
            <button
              onClick={() => onSelectNearestBank(availabilityAnalysis.nearestBank.node)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>
                Nearest: {availabilityAnalysis.nearestBank.node.shortName} ({availabilityAnalysis.nearestBank.distKm}km • {availabilityAnalysis.nearestBank.code3Mins}m ETA)
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* SOS Modal Trigger */}
          <button
            onClick={onOpenSOSModal}
            className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-lg shadow-rose-900/40 transition shrink-0 whitespace-nowrap animate-pulse"
          >
            STAT SOS
          </button>
        </div>
      </div>
    </div>
  );
};
