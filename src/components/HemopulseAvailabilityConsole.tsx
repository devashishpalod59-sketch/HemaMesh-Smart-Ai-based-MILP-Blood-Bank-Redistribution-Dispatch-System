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
import { resolveIndianLocationInput, geocodeIndianLocationWithGoogle, KNOWN_INDIAN_LOCATIONS } from '../services/indianGeocoding.ts';
import { generateEmergencyShareMessage } from '../services/donorRegistry.ts';
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
  Layers,
  Share2,
  HeartHandshake,
  Copy,
  Shield,
} from 'lucide-react';

interface HemopulseAvailabilityConsoleProps {
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
  onSwitchToMap: () => void;
  onOpenDonorBeacon?: (bloodType: BloodType, units: number) => void;
  onOpenGreenCorridorPass?: (hospital: FacilityNode) => void;
  lang?: 'EN' | 'HI';
}

const BLOOD_TYPES: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

const QUANTITY_OPTIONS = [1, 2, 4, 6, 8, 10];

interface ComponentCardOption {
  id: BloodComponent;
  title: string;
  subtitle: string;
  shelfLife: string;
  storage: string;
}

const COMPONENT_OPTIONS: ComponentCardOption[] = [
  {
    id: 'PLT',
    title: 'PLATELETS',
    subtitle: 'Platelet SDP / Agitator ...',
    shelfLife: '5 Days',
    storage: '20°C to 24°C (Platelet Agitator Incubator)',
  },
  {
    id: 'PRBC',
    title: 'RBC',
    subtitle: 'Packed Red Cells (PRBC)',
    shelfLife: '42 Days',
    storage: '2°C to 6°C (Refrigerated Cold Chain)',
  },
  {
    id: 'FFP',
    title: 'FFP',
    subtitle: 'Fresh Frozen Plasma (-3...',
    shelfLife: '365 Days',
    storage: '≤ -18°C (Deep Cryo Storage)',
  },
  {
    id: 'CRYO',
    title: 'CRYO',
    subtitle: 'Cryoprecipitate (Factor ...',
    shelfLife: '365 Days',
    storage: '≤ -18°C (Factor VIII / Fibrinogen)',
  },
];

export const HemopulseAvailabilityConsole: React.FC<HemopulseAvailabilityConsoleProps> = ({
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
  onSwitchToMap,
  onOpenDonorBeacon,
  onOpenGreenCorridorPass,
  lang = 'EN',
}) => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodType>('B+');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>('PLT');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(2);

  const [locationInput, setLocationInput] = useState<string>('');
  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);
  const [isSosBroadcastSent, setIsSosBroadcastSent] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  // Active component metadata
  const currentCompMeta = useMemo(() => {
    return (
      COMPONENT_OPTIONS.find((c) => c.id === selectedComponent) || COMPONENT_OPTIONS[0]
    );
  }, [selectedComponent]);

  // Handle location search submit
  const handleLocationSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!locationInput.trim()) return;

    try {
      const resolved = await geocodeIndianLocationWithGoogle(locationInput);
      if (resolved) {
        onLocationResolved(resolved.coords, resolved.name);
        setShowLocationDropdown(false);
        setLocationInput('');
        return;
      }
    } catch {
      // fallback
    }

    const fallback = resolveIndianLocationInput(locationInput);
    if (fallback) {
      onLocationResolved(fallback.coords, fallback.name);
      setShowLocationDropdown(false);
      setLocationInput('');
    } else {
      const match = KNOWN_INDIAN_LOCATIONS.find(
        (l) =>
          l.name.toLowerCase().includes(locationInput.toLowerCase()) ||
          l.city.toLowerCase().includes(locationInput.toLowerCase())
      );
      if (match) {
        onLocationResolved(match.coords, match.name);
        setShowLocationDropdown(false);
        setLocationInput('');
      }
    }
  };

  // Instant calculation of nearest blood banks (<1ms)
  const analysis = useMemo(() => {
    const list = nodes
      .map((node) => {
        const distKm = calculateDistanceKm(
          activeCoords.lat,
          activeCoords.lng,
          node.coordinates.lat,
          node.coordinates.lng
        );
        const code3Mins = Math.max(2, Math.round((distKm / 60) * 60));

        // Exact units matching requested group & component
        const exactUnits = node.inventory
          .filter(
            (inv) =>
              inv.component === selectedComponent && inv.bloodType === selectedBloodGroup
          )
          .reduce((sum, inv) => sum + inv.units, 0);

        // Compatible units in this facility
        const compatibleUnits = node.inventory
          .filter(
            (inv) =>
              inv.component === selectedComponent &&
              isBloodCompatible(inv.bloodType, selectedBloodGroup, selectedComponent)
          )
          .reduce((sum, inv) => sum + inv.units, 0);

        return {
          node,
          distKm,
          code3Mins,
          exactUnits,
          compatibleUnits,
          hasSufficient: compatibleUnits >= selectedQuantity,
        };
      })
      .sort((a, b) => {
        if (a.hasSufficient && !b.hasSufficient) return -1;
        if (!a.hasSufficient && b.hasSufficient) return 1;
        return a.distKm - b.distKm;
      });

    const nearest = list[0] || null;
    const alternatives = list.slice(1, 4);
    const totalInGrid = list.reduce((sum, x) => sum + x.compatibleUnits, 0);

    return {
      nearest,
      alternatives,
      totalInGrid,
    };
  }, [nodes, activeCoords, selectedBloodGroup, selectedComponent, selectedQuantity]);

  // Nearest ready dispatch drone or mobile unit
  const nearestStandbyVehicle = useMemo(() => {
    if (!devices || devices.length === 0) return null;
    return [...devices].sort((a, b) => {
      const distA = calculateDistanceKm(
        activeCoords.lat,
        activeCoords.lng,
        a.coordinates.lat,
        a.coordinates.lng
      );
      const distB = calculateDistanceKm(
        activeCoords.lat,
        activeCoords.lng,
        b.coordinates.lat,
        b.coordinates.lng
      );
      return distA - distB;
    })[0];
  }, [devices, activeCoords]);

  const handleSendSOS = () => {
    setIsSosBroadcastSent(true);
    onTriggerSOSBroadcast(selectedBloodGroup, selectedQuantity);
    setTimeout(() => setIsSosBroadcastSent(false), 3500);
  };

  const handleWhatsAppShare = () => {
    if (!analysis.nearest) return;
    const msg = generateEmergencyShareMessage({
      hospitalName: analysis.nearest.node.name,
      hospitalAddress: analysis.nearest.node.address,
      phone: analysis.nearest.node.phone,
      bloodType: selectedBloodGroup,
      component: selectedComponent,
      units: selectedQuantity,
      distanceKm: analysis.nearest.distKm,
      etaMins: analysis.nearest.code3Mins,
      lat: analysis.nearest.node.coordinates.lat,
      lng: analysis.nearest.node.coordinates.lng,
      lang,
    });
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopyAlert = () => {
    if (!analysis.nearest) return;
    const msg = generateEmergencyShareMessage({
      hospitalName: analysis.nearest.node.name,
      hospitalAddress: analysis.nearest.node.address,
      phone: analysis.nearest.node.phone,
      bloodType: selectedBloodGroup,
      component: selectedComponent,
      units: selectedQuantity,
      distanceKm: analysis.nearest.distKm,
      etaMins: analysis.nearest.code3Mins,
      lat: analysis.nearest.node.coordinates.lat,
      lng: analysis.nearest.node.coordinates.lng,
      lang,
    });
    navigator.clipboard.writeText(msg);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* MAIN ASK PANEL: "Ask: Is Required Blood Available? (क्या रक्त उपलब्ध है?)" */}
      <div className="bg-[#0b1328] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 text-slate-100">
        {/* Header with Title and "LOCATION LOCKED" Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>Ask: Is Required Blood Available?</span>
              <span className="text-slate-300 font-hindi font-bold">
                (क्या रक्त उपलब्ध है?)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your required blood group, component, units, and location to immediately verify stock at nearest Indian blood banks.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <div className="bg-[#041a22] border border-cyan-500/50 text-cyan-400 font-mono text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="tracking-wider">LOCATION LOCKED</span>
            </div>
          </div>
        </div>

        {/* 3-COLUMN SELECTION GRID: BLOOD GROUP | BLOOD COMPONENT | QUANTITY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Column 1: BLOOD GROUP (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-slate-200">
                <span className="text-rose-500 text-sm">🩸</span>
                <span>1. BLOOD GROUP (रक्त समूह)</span>
              </span>
              <span className="text-rose-500 font-black font-mono text-sm">
                {selectedBloodGroup}
              </span>
            </div>

            {/* 8 Blood Group Buttons in 4x2 Grid */}
            <div className="grid grid-cols-4 gap-1.5">
              {BLOOD_TYPES.map((bg) => {
                const isSelected = selectedBloodGroup === bg;
                return (
                  <button
                    key={bg}
                    onClick={() => setSelectedBloodGroup(bg)}
                    className={`py-2 px-1 rounded-xl font-mono font-extrabold text-xs transition-all duration-150 flex items-center justify-center border ${
                      isSelected
                        ? 'bg-[#ff0055] text-white border-rose-400 shadow-lg shadow-rose-900/60 ring-2 ring-rose-400/40 scale-[1.02]'
                        : 'bg-[#0d1629] hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: BLOOD COMPONENT (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-slate-200">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. BLOOD COMPONENT (घटक)</span>
              </span>
            </div>

            {/* 4 Component Cards in 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2">
              {COMPONENT_OPTIONS.map((comp) => {
                const isSelected = selectedComponent === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedComponent(comp.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all duration-150 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/50'
                        : 'bg-[#0d1629] border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`text-xs font-black uppercase tracking-tight ${
                        isSelected ? 'text-cyan-300' : 'text-slate-200'
                      }`}
                    >
                      {comp.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                      {comp.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 3: QUANTITY NEEDED (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-slate-200">
                <span>3. QUANTITY NEEDED (यूनिट)</span>
              </span>
              <span className="text-rose-500 font-black font-mono text-xs">
                {selectedQuantity} UNITS
              </span>
            </div>

            {/* Quantity Selector Buttons */}
            <div className="flex items-center gap-1 bg-[#0d1629] p-1 rounded-xl border border-slate-800">
              {QUANTITY_OPTIONS.map((q) => {
                const isSelected = selectedQuantity === q;
                return (
                  <button
                    key={q}
                    onClick={() => setSelectedQuantity(q)}
                    className={`flex-1 py-1.5 text-xs font-extrabold font-mono rounded-lg transition-all ${
                      isSelected
                        ? 'bg-[#ff0055] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {q}u
                  </button>
                );
              })}
            </div>

            {/* Shelf-Life & Storage Metadata Specs as shown in screenshot */}
            <div className="text-[10px] font-mono text-slate-400 pt-1 leading-relaxed flex flex-wrap items-center gap-x-2">
              <span>
                Shelf-Life: <strong className="text-slate-200">{currentCompMeta.shelfLife}</strong>
              </span>
              <span>•</span>
              <span className="truncate">
                Storage: <strong className="text-slate-200">{currentCompMeta.storage}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* LOCATION SEARCH & INSTANT GPS SECTION (Google Maps Grade High Accuracy) */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-300 gap-1.5">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-cyan-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Location Anchor (High Precision Blood Bank Search Radius)</span>
            </span>
            <div className="flex items-center gap-2">
              {userLocation.accuracyMeters && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>GPS Precision: ±{Math.round(userLocation.accuracyMeters)}m (Google Maps Grade)</span>
                </span>
              )}
              <span className="text-[11px] font-mono text-cyan-300 truncate max-w-[260px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>{activeLocationLabel}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search Input Form */}
            <div className="relative flex-1">
              <form onSubmit={handleLocationSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setShowLocationDropdown(e.target.value.length > 1);
                  }}
                  onFocus={() => setShowLocationDropdown(locationInput.length > 1)}
                  placeholder="Enter hospital, locality, PIN code, or coords (e.g. AIIMS Delhi, Connaught Place, 110029, 28.567, 77.210)"
                  className="w-full bg-[#070d1a] border border-slate-700/80 rounded-xl pl-9 pr-24 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
                <button
                  type="submit"
                  className="absolute right-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                >
                  Find Banks
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#091122] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-48 overflow-y-auto">
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
                          setShowLocationDropdown(false);
                          setLocationInput('');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 flex items-center justify-between border-b border-slate-900 transition"
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

            {/* High-Accuracy GPS Detection Button */}
            <button
              onClick={onUseLiveGps}
              className="flex items-center justify-center gap-1.5 bg-[#091122] hover:bg-slate-800 text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow shrink-0 group"
              title="Acquire pinpoint satellite coordinates (Google Maps grade accuracy)"
            >
              <Crosshair
                className={`w-3.5 h-3.5 text-cyan-400 ${
                  userLocation.loading || userLocation.isCalibrating ? 'animate-spin' : 'group-hover:scale-110'
                }`}
              />
              <span>Detect Live High-Accuracy GPS</span>
            </button>
          </div>
          {userLocation.resolvedAddress && (
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 truncate">
              <span className="text-cyan-400">📍 Verified Address:</span>
              <span className="text-slate-300 truncate">{userLocation.resolvedAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* IMMEDIATE STOCK VERIFICATION & SUGGESTED BLOOD BANK CARD */}
      {analysis.nearest && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0b162c] to-[#0b162c] border-2 border-emerald-500/80 shadow-2xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                <Trophy className="w-3 h-3 text-slate-950" />
                <span>#1 NEAREST SUGGESTED BLOOD BANK</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {analysis.nearest.compatibleUnits} Units {selectedBloodGroup} ({selectedComponent}) Available
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-cyan-400 font-extrabold flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" />
                {analysis.nearest.distKm} km away
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-rose-400 font-extrabold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                ~{analysis.nearest.code3Mins} mins Code 3 ETA
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                {analysis.nearest.node.name}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{analysis.nearest.node.address}</span>
              </p>
              <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-x-3">
                <span>
                  Authorized Custodian: <strong className="text-slate-200">{analysis.nearest.node.contactPerson}</strong>
                </span>
                <span>•</span>
                <span>
                  Helpline:{' '}
                  <a href={`tel:${analysis.nearest.node.phone}`} className="text-emerald-400 underline font-bold">
                    {analysis.nearest.node.phone}
                  </a>
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-mono font-bold">
                  Exact Match: {analysis.nearest.exactUnits}u | Compatible: {analysis.nearest.compatibleUnits}u
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
              {/* WhatsApp / 108 Share button */}
              <button
                onClick={handleWhatsAppShare}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/60"
                title="Share urgent blood bank details to 108 ambulance & family via WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share 108/WhatsApp</span>
              </button>

              {/* Copy Alert Text */}
              <button
                onClick={handleCopyAlert}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                title="Copy formatted emergency message"
              >
                {shareCopied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Alert</span>
                  </>
                )}
              </button>

              {/* Mobilize Voluntary Donors */}
              {onOpenDonorBeacon && (
                <button
                  onClick={() => onOpenDonorBeacon(selectedBloodGroup, selectedQuantity)}
                  className="bg-rose-950 hover:bg-rose-900 border border-rose-600/70 text-rose-200 text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                  title="Mobilize geofenced verified voluntary blood donors"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                  <span>Donor Beacon</span>
                </button>
              )}

              {/* Green Corridor Pass */}
              {onOpenGreenCorridorPass && (
                <button
                  onClick={() => onOpenGreenCorridorPass(analysis.nearest.node)}
                  className="bg-[#0b221d] hover:bg-emerald-900/60 border border-emerald-500/60 text-emerald-300 text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                  title="Generate Digital Green Corridor Transit Pass"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Green Pass</span>
                </button>
              )}

              <a
                href={`tel:${analysis.nearest.node.phone}`}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Desk</span>
              </a>

              <button
                onClick={() => {
                  onSelectNearestBank(analysis.nearest.node);
                  onSwitchToMap();
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/40 transition flex items-center justify-center gap-1.5"
              >
                <span>Direct Route on Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Alternatives */}
          {analysis.alternatives.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-400 font-semibold">Other Close Regional Centers:</span>
              {analysis.alternatives.map((alt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectNearestBank(alt.node);
                    onSwitchToMap();
                  }}
                  className="bg-[#091122] hover:bg-slate-800 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 transition"
                >
                  <span className="font-bold">{alt.node.shortName}</span>
                  <span className="text-cyan-400 font-mono">
                    ({alt.distKm}km • {alt.compatibleUnits}u)
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RAPID STANDBY COURIER & SOS ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Nearest Standby Courier / UAV Drone Pod */}
        {nearestStandbyVehicle && (
          <div className="p-3.5 rounded-xl bg-[#091122] border border-cyan-500/30 flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/40">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{nearestStandbyVehicle.name}</span>
                  <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    STANDBY
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {nearestStandbyVehicle.distanceKm} km away • ETA {nearestStandbyVehicle.etaMinutes} mins • Cold Pod {nearestStandbyVehicle.coldStorageTempCelsius.toFixed(1)}°C
                </div>
              </div>
            </div>

            <button
              onClick={() => onDispatchNearbyDevice(nearestStandbyVehicle)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition shadow shrink-0"
            >
              Dispatch STAT
            </button>
          </div>
        )}

        {/* Mass Casualty SOS Broadcast */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/60 to-[#0b1328] border border-rose-700/50 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Mass Casualty Emergency SOS</div>
              <div className="text-[10px] text-slate-400">
                Broadcast critical deficit to e-RaktKosh regional grid
              </div>
            </div>
          </div>

          <button
            onClick={handleSendSOS}
            disabled={isSosBroadcastSent}
            className="bg-[#ff0055] hover:bg-rose-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition shadow-lg shadow-rose-900/50 shrink-0 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSosBroadcastSent ? 'Dispatched!' : 'Send SOS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
