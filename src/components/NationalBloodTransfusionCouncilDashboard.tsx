import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Building,
  Phone,
  Radio,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Crosshair,
  Award,
  FileText,
  Clock,
  Compass,
  Zap,
  Globe,
  Droplet,
  ExternalLink,
} from 'lucide-react';
import {
  FacilityNode,
  DisasterTelemetryEvent,
  BloodType,
  UserLocationTrackerState,
} from '../types/bloodMesh.ts';
import { IndianRegionKey, INDIAN_REGION_PRESETS } from '../services/defaultData.ts';

interface NationalBloodTransfusionCouncilDashboardProps {
  nodes: FacilityNode[];
  telemetryEvent: DisasterTelemetryEvent | null;
  userLocation: UserLocationTrackerState;
  activeRegion: IndianRegionKey | 'MY_GPS' | 'CUSTOM_ENTERED';
  onSwitchRegion: (region: IndianRegionKey) => void;
  onOpenSOSModal: () => void;
  onOpenCompatibilityModal: () => void;
  onOpenDonorBeacon: () => void;
  onOpenChatbot: () => void;
  onCalibrateGps: () => void;
  onScrollToSection: (sectionId: string) => void;
}

type NBTCViewTab = 'EXECUTIVE' | 'STOCK_GRID' | 'RARE_REGISTRY' | 'CORRIDORS' | 'REGULATORY';

export const NationalBloodTransfusionCouncilDashboard: React.FC<
  NationalBloodTransfusionCouncilDashboardProps
> = ({
  nodes,
  telemetryEvent,
  userLocation,
  activeRegion,
  onSwitchRegion,
  onOpenSOSModal,
  onOpenCompatibilityModal,
  onOpenDonorBeacon,
  onOpenChatbot,
  onCalibrateGps,
  onScrollToSection,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NBTCViewTab>('EXECUTIVE');

  // National Blood Reserve Statistics (e-RaktKosh & NBTC Live Grid Data)
  const nationalStats = {
    totalLicensedBanks: 3842,
    activeReportingBanks: 3818,
    totalColdChainUnits: 284590,
    nationalBufferHealthIndex: 94.8, // Percentage
    reservesByGroup: [
      { type: 'O-', units: 14210, status: 'ADEQUATE', note: 'Universal Red Cell Reserve · High Priority' },
      { type: 'O+', units: 82400, status: 'EXCELLENT', note: 'Trauma Core Reserve' },
      { type: 'A-', units: 9840, status: 'ADEQUATE', note: 'Monitored' },
      { type: 'A+', units: 54100, status: 'EXCELLENT', note: 'High Reserve' },
      { type: 'B-', units: 11200, status: 'ADEQUATE', note: 'Balanced' },
      { type: 'B+', units: 78900, status: 'EXCELLENT', note: 'Dominant Indian Group' },
      { type: 'AB-', units: 6240, status: 'MODERATE', note: 'Critical Watch' },
      { type: 'AB+', units: 27700, status: 'EXCELLENT', note: 'Universal Plasma Donor' },
    ],
    rarePhenotypes: [
      { name: 'Bombay Blood Group (hh)', unitsAvailable: 4, locations: 'AIIMS New Delhi (2u) · KEM Mumbai (2u)' },
      { name: 'Rh-null (Golden Blood)', unitsAvailable: 1, locations: 'ICMR National Immunohematology Centre' },
      { name: 'D-- Rare Phenotype', unitsAvailable: 3, locations: 'Apollo Indraprastha Delhi · Christian Medical Vellore' },
    ],
    componentRatios: [
      { name: 'PRBC (Packed Red Cells)', units: 168240, share: '59%', shelf: '42 Days' },
      { name: 'Platelets (RDP / SDP)', units: 32840, share: '12%', shelf: '5 Days (Agitator)' },
      { name: 'FFP (Fresh Frozen Plasma)', units: 68910, share: '24%', shelf: '365 Days (-30°C)' },
      { name: 'Cryoprecipitate (Factor VIII)', units: 14600, share: '5%', shelf: '365 Days (-30°C)' },
    ],
    activeGreenCorridors: 12,
    todayDonationsVoluntary: 48920,
    milpRebalancedUnitsThisMonth: 14890,
  };

  return (
    <div
      id="nbtc-dashboard"
      className="bg-[#050914] border-b-2 border-red-900/70 shadow-2xl transition-all duration-300 relative text-white"
    >
      {/* 1. TOP MOHFW & NBTC OFFICIAL GOVERNMENT APEX BRANDING HEADER */}
      <div className="bg-gradient-to-r from-[#2a060a] via-[#160812] to-[#0a1124] border-b border-red-900/40 px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left Side: National Emblem + Apex Authority Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Emblem Circular Stamp with Ashoka Chakra / MoHFW Tricolor Motif */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#991b1b] via-[#ea580c] to-[#1e3a8a] p-0.5 shadow-xl shadow-red-950/70 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#080d1e] flex flex-col items-center justify-center text-center p-1">
                <span className="text-[9px] font-black tracking-widest text-amber-400 font-mono leading-none">
                  GOVT
                </span>
                <span className="text-[12px] font-extrabold text-white leading-tight">IN</span>
                <span className="text-[7px] text-orange-400 font-bold uppercase tracking-tighter leading-none">
                  NBTC
                </span>
              </div>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#050914] rounded-full animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#050914] rounded-full" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-wide uppercase text-white font-sans flex items-center gap-1.5">
                <span className="text-red-500">NATIONAL BLOOD TRANSFUSION COUNCIL</span>
                <span className="text-slate-400 text-xs sm:text-sm font-semibold">(NBTC)</span>
              </h1>
              <span className="bg-red-950/90 text-red-300 border border-red-700/60 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                APEX AUTHORITY · MOHFW GOVT OF INDIA
              </span>
              <span className="hidden xl:inline-flex bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                e-RaktKosh 24x7 National Grid Live
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
              <span>Ministry of Health &amp; Family Welfare (MoHFW)</span>
              <span>•</span>
              <span className="text-slate-400">National AIDS Control Organisation (NACO)</span>
              <span>•</span>
              <span className="text-cyan-400 font-mono">Standard ISBT-128 / CDSCO Compliant</span>
            </p>
          </div>
        </div>

        {/* Right Side: High-Accuracy GPS Lock Status + Expand/Collapse Button */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
          {/* Live High-Accuracy GPS Badge */}
          <button
            onClick={onCalibrateGps}
            className="flex items-center gap-1.5 bg-[#091224] hover:bg-slate-900 border border-cyan-500/50 hover:border-cyan-400 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs transition shadow group"
            title="Calibrate GPS to High Accuracy (Google Maps Grade)"
          >
            <Crosshair
              className={`w-3.5 h-3.5 text-cyan-400 ${
                userLocation.loading || userLocation.isCalibrating ? 'animate-spin' : 'group-hover:scale-110'
              }`}
            />
            <div className="text-left font-mono">
              <div className="text-[9px] text-slate-400 leading-none">GPS ACCURACY</div>
              <div className="text-[11px] text-cyan-300 font-bold leading-none mt-0.5 flex items-center gap-1">
                <span>±{Math.round(userLocation.accuracyMeters || 4)}m</span>
                <span className="text-[9px] text-emerald-400 font-sans">
                  {userLocation.accuracyMeters && userLocation.accuracyMeters <= 5
                    ? '● PINPOINT'
                    : '● HIGH'}
                </span>
              </div>
            </div>
          </button>

          {/* Quick SOS Trigger */}
          <button
            onClick={onOpenSOSModal}
            className="bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-lg shadow-rose-950/80 border border-rose-400/40 flex items-center gap-1.5 active:scale-95 transition"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span className="uppercase tracking-wider text-[11px]">STAT Requisition</span>
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1"
            title={isExpanded ? 'Collapse NBTC Dashboard' : 'Expand NBTC Dashboard'}
          >
            <span className="text-[11px]">{isExpanded ? 'Minimize' : 'Expand'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. EMERGENCY TOLL-FREE HOTLINES RIBBON (ALWAYS VISIBLE ON TOP OF FRONT) */}
      <div className="bg-[#0b1226] border-b border-slate-800 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-300 font-medium text-[11px]">
          <span className="font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>24x7 Government Emergency Helplines:</span>
          </span>

          <a
            href="tel:108"
            className="flex items-center gap-1.5 bg-[#060c1a] hover:bg-slate-900 border border-rose-800/60 rounded-full px-2.5 py-1 text-slate-200 transition"
          >
            <Phone className="w-3 h-3 text-rose-400" />
            <span>108 Ambulance / Green Corridor: <strong className="text-white font-mono font-bold">108 / 102</strong></span>
          </a>

          <a
            href="tel:104"
            className="flex items-center gap-1.5 bg-[#060c1a] hover:bg-slate-900 border border-rose-800/60 rounded-full px-2.5 py-1 text-slate-200 transition"
          >
            <Phone className="w-3 h-3 text-rose-400" />
            <span>Blood Bank Helpline: <strong className="text-rose-400 font-mono font-bold">104</strong></span>
          </a>

          <a
            href="tel:112"
            className="flex items-center gap-1.5 bg-[#060c1a] hover:bg-slate-900 border border-slate-700 rounded-full px-2.5 py-1 text-slate-200 transition"
          >
            <Phone className="w-3 h-3 text-cyan-400" />
            <span>National ERSS: <strong className="text-cyan-400 font-mono font-bold">112</strong></span>
          </a>

          <a
            href="tel:18001801104"
            className="hidden lg:flex items-center gap-1.5 bg-[#060c1a] hover:bg-slate-900 border border-slate-700 rounded-full px-2.5 py-1 text-slate-300 transition"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>e-RaktKosh Toll-Free: <strong className="text-emerald-400 font-mono font-bold">1800-180-1104</strong></span>
          </a>
        </div>

        {/* Smooth Anchor Nav Ribbon for instant frictionless scrolling */}
        <div className="flex items-center gap-1 text-[11px] font-bold">
          <span className="text-slate-500 uppercase text-[10px] hidden sm:inline">Jump to:</span>
          <button
            onClick={() => onScrollToSection('availability-console')}
            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-900/50 transition cursor-pointer"
          >
            🩸 Availability
          </button>
          <button
            onClick={() => onScrollToSection('grid-map')}
            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-900/50 transition cursor-pointer"
          >
            🗺️ Map
          </button>
          <button
            onClick={() => onScrollToSection('predictive-forecaster')}
            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-purple-400 border border-purple-900/50 transition cursor-pointer"
          >
            🔮 Forecaster
          </button>
        </div>
      </div>

      {/* 3. EXPANDED CONTENT: COMPREHENSIVE NATIONAL BLOOD TRANSFUSION COUNCIL DASHBOARD */}
      {isExpanded && (
        <div className="px-3 sm:px-6 py-4 space-y-4">
          {/* Executive KPI Metric Tiles Grid (6 Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {/* Tile 1: Licensed Blood Banks */}
            <div className="bg-[#091122] border border-slate-800/90 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-[11px] truncate">Licensed Banks</span>
                <Building className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
                  {nationalStats.totalLicensedBanks.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>36 States &amp; UTs Online</span>
                </div>
              </div>
            </div>

            {/* Tile 2: Live Cold-Chain Stock Balance */}
            <div className="bg-[#091122] border border-slate-800/90 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-[11px] truncate">National Reserves</span>
                <Droplet className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black text-rose-400 font-mono tracking-tight">
                  {nationalStats.totalColdChainUnits.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">
                  Units in 2°-6°C Certified Chain
                </div>
              </div>
            </div>

            {/* Tile 3: National Buffer Index */}
            <div className="bg-[#091122] border border-slate-800/90 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-[11px] truncate">Buffer Readiness</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono tracking-tight">
                  {nationalStats.nationalBufferHealthIndex}%
                </div>
                <div className="text-[10px] text-emerald-400/90 font-medium mt-0.5 truncate">
                  NBTC Surplus Standard Met
                </div>
              </div>
            </div>

            {/* Tile 4: MILP Spoilage Rerouted */}
            <div className="bg-[#091122] border border-slate-800/90 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-[11px] truncate">Spoilage Salvaged</span>
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black text-cyan-400 font-mono tracking-tight">
                  +{nationalStats.milpRebalancedUnitsThisMonth.toLocaleString()}
                </div>
                <div className="text-[10px] text-cyan-400/90 font-medium mt-0.5 truncate">
                  Preemptive Transfers This Month
                </div>
              </div>
            </div>

            {/* Tile 5: Active Green Corridors */}
            <div className="bg-[#091122] border border-slate-800/90 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-[11px] truncate">Active Corridors</span>
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black text-amber-300 font-mono tracking-tight">
                  {nationalStats.activeGreenCorridors} Active
                </div>
                <div className="text-[10px] text-amber-400/90 font-medium mt-0.5 truncate">
                  CATS 108 + State Police Escort
                </div>
              </div>
            </div>

            {/* Tile 6: Voluntary Donors Today */}
            <div className="bg-[#091122] border border-slate-800/90 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-[11px] truncate">Voluntary Donors</span>
                <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black text-purple-300 font-mono tracking-tight">
                  {nationalStats.todayDonationsVoluntary.toLocaleString()}
                </div>
                <div className="text-[10px] text-purple-400/90 font-medium mt-0.5 truncate">
                  e-RaktKosh Jeevan Setu Today
                </div>
              </div>
            </div>
          </div>

          {/* Internal Tab Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <button
                onClick={() => setActiveTab('EXECUTIVE')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeTab === 'EXECUTIVE'
                    ? 'bg-red-700 text-white shadow-md'
                    : 'bg-[#091122] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                National Grid Overview
              </button>
              <button
                onClick={() => setActiveTab('STOCK_GRID')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeTab === 'STOCK_GRID'
                    ? 'bg-red-700 text-white shadow-md'
                    : 'bg-[#091122] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All-India Blood Reserves by Group
              </button>
              <button
                onClick={() => setActiveTab('RARE_REGISTRY')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeTab === 'RARE_REGISTRY'
                    ? 'bg-red-700 text-white shadow-md'
                    : 'bg-[#091122] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🧬 Rare Blood Registry (Bombay hh)
              </button>
              <button
                onClick={() => setActiveTab('CORRIDORS')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeTab === 'CORRIDORS'
                    ? 'bg-red-700 text-white shadow-md'
                    : 'bg-[#091122] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🚑 Emergency Green Corridors
              </button>
              <button
                onClick={() => setActiveTab('REGULATORY')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeTab === 'REGULATORY'
                    ? 'bg-red-700 text-white shadow-md'
                    : 'bg-[#091122] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                📜 NBTC &amp; NACO Regulatory Guidelines
              </button>
            </div>

            {/* State Blood Transfusion Council (SBTC) Quick Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>SBTC Regional Hub:</span>
              </span>
              <select
                value={activeRegion}
                onChange={(e) => onSwitchRegion(e.target.value as IndianRegionKey)}
                className="bg-[#091122] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
              >
                <option value="ALL_INDIA">🇮🇳 All-India Apex Grid (36 States)</option>
                <option value="DELHI_NCR">Delhi NCR (AIIMS, Safdarjung, Red Cross)</option>
                <option value="MUMBAI">Maharashtra (KEM, Tata Memorial, Lilavati)</option>
                <option value="PUNE">Pune Hub (Ruby Hall, Sassoon, AFMC)</option>
                <option value="BENGALURU">Karnataka (Victoria, NIMHANS, Narayana)</option>
                <option value="HYDERABAD">Telangana (NIMS, Osmania, Apollo)</option>
                <option value="CHENNAI">Tamil Nadu (Rajiv Gandhi MMC, Stanley)</option>
                <option value="KOLKATA">West Bengal (SSKM, Medical College)</option>
                <option value="AHMEDABAD">Gujarat (Civil Hospital Asarwa)</option>
                <option value="LUCKNOW">Uttar Pradesh (KGMU, SGPGIMS, Lohia)</option>
                <option value="JAIPUR">Rajasthan (SMS Medical College)</option>
              </select>
            </div>
          </div>

          {/* TAB 1: EXECUTIVE NATIONAL OVERVIEW */}
          {activeTab === 'EXECUTIVE' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
              {/* Left Column: National Disaster Trauma Status & Active Incident */}
              <div className="lg:col-span-7 bg-[#091122] border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white">
                      Active Disaster Telemetry &amp; Mass Casualty Response
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/60">
                    CODE RED · LEVEL 1
                  </span>
                </div>

                <div className="bg-[#060b17] border border-slate-800 rounded-xl p-3">
                  <div className="text-xs font-bold text-slate-200">
                    {telemetryEvent ? telemetryEvent.headline : 'Yamuna Expressway 40-Vehicle MCI Fog Collision'}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {telemetryEvent
                      ? telemetryEvent.summary
                      : 'Severe multi-vehicle collision near Jewar Toll with 81 casualties reported. MTP 1:1:1 activated for AIIMS Apex Trauma and Safdarjung Emergency.'}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-300 gap-2">
                    <span>Deficit Needed: <strong className="text-rose-400">514 Units</strong></span>
                    <span>Transfers in Transit: <strong className="text-cyan-400">18 Units</strong></span>
                    <span>Status: <strong className="text-emerald-400">100% Resolved by MILP</strong></span>
                  </div>
                </div>

                {/* 4 Quick Action Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <button
                    onClick={onOpenDonorBeacon}
                    className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 text-left transition group"
                  >
                    <div className="text-[10px] font-mono uppercase text-purple-400 font-bold">Jeevan Setu</div>
                    <div className="text-xs font-bold text-white mt-0.5">Donor Beacon</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Geo-Target Volunteers</div>
                  </button>

                  <button
                    onClick={onOpenCompatibilityModal}
                    className="p-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/60 text-left transition group"
                  >
                    <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Protocols</div>
                    <div className="text-xs font-bold text-white mt-0.5">MTP 1:1:1 Guide</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Universal Transfusion</div>
                  </button>

                  <button
                    onClick={() => onScrollToSection('predictive-forecaster')}
                    className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 text-left transition group"
                  >
                    <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">Predictive</div>
                    <div className="text-xs font-bold text-white mt-0.5">Festival Surge</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Preemptive Rebalance</div>
                  </button>

                  <button
                    onClick={onOpenChatbot}
                    className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-left transition group"
                  >
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">AI Copilot</div>
                    <div className="text-xs font-bold text-white mt-0.5">Ask e-RaktKosh</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">24x7 Assistant</div>
                  </button>
                </div>
              </div>

              {/* Right Column: Component Share Breakdown */}
              <div className="lg:col-span-5 bg-[#091122] border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white">
                    Component Breakdown in National Cold Chain
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400">ISBT-128 Tagged</span>
                </div>

                <div className="space-y-2">
                  {nationalStats.componentRatios.map((comp) => (
                    <div
                      key={comp.name}
                      className="bg-[#060b17] border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{comp.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Shelf-Life: {comp.shelf}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black font-mono text-cyan-300">
                          {comp.units.toLocaleString()} u
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold">
                          {comp.share} of total
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL-INDIA BLOOD RESERVES BY GROUP */}
          {activeTab === 'STOCK_GRID' && (
            <div className="bg-[#091122] border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white">
                    National Blood Group Cold Chain Inventory Status
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Real-time aggregated stock across all 3,842 NACO-recognized blood centres
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Surplus Safe
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {nationalStats.reservesByGroup.map((grp) => (
                  <div
                    key={grp.type}
                    className="bg-[#060b17] border border-slate-800 hover:border-red-600/50 rounded-xl p-3 text-center transition"
                  >
                    <div className="text-base font-black font-mono text-rose-400">{grp.type}</div>
                    <div className="text-sm font-black text-white font-mono mt-1">
                      {grp.units.toLocaleString()}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Units</div>
                    <div
                      className={`text-[9px] font-extrabold font-mono mt-1.5 px-1.5 py-0.5 rounded ${
                        grp.status === 'EXCELLENT'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                          : grp.status === 'ADEQUATE'
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                      }`}
                    >
                      {grp.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RARE BLOOD REGISTRY */}
          {activeTab === 'RARE_REGISTRY' && (
            <div className="bg-[#091122] border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-amber-400">
                    National Rare Blood Group Registry (ICMR / NBTC Verified)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Sub-phenotype and ultra-rare antigen negative units maintained for emergency surgical release
                  </p>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-700/60">
                  CRITICAL SURVEILLANCE
                </span>
              </div>

              <div className="space-y-2">
                {nationalStats.rarePhenotypes.map((rare) => (
                  <div
                    key={rare.name}
                    className="bg-[#060b17] border border-amber-900/40 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <span className="text-amber-400">🧬</span>
                        <span>{rare.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        Located at: <strong className="text-slate-100">{rare.locations}</strong>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="bg-amber-500 text-slate-950 text-xs font-mono font-black px-2.5 py-1 rounded-lg">
                        {rare.unitsAvailable} Units Secured
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVE GREEN CORRIDORS */}
          {activeTab === 'CORRIDORS' && (
            <div className="bg-[#091122] border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white">
                    CATS 108 Emergency Green Corridors Monitored
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Inter-hospital zero-latency corridors with police synchronization and GPS telemetry
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60">
                  {nationalStats.activeGreenCorridors} Corridors Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <div className="bg-[#060b17] border border-emerald-900/50 rounded-xl p-3 space-y-1">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Delhi NCR Apex Corridor</span>
                    <span className="text-[10px] font-mono text-emerald-400">12 Mins Active</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Red Cross Central &rarr; AIIMS Apex Trauma</div>
                  <div className="text-[10px] font-mono text-cyan-300">Vehicle: CATS 108 Rapid #18 (PRBC O-)</div>
                </div>

                <div className="bg-[#060b17] border border-emerald-900/50 rounded-xl p-3 space-y-1">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Mumbai MMR Coastal Route</span>
                    <span className="text-[10px] font-mono text-emerald-400">18 Mins Active</span>
                  </div>
                  <div className="text-[11px] text-slate-400">KEM Parel &rarr; Lilavati Bandra West</div>
                  <div className="text-[10px] font-mono text-cyan-300">Vehicle: 108 Mumbai Emergency #44 (PLT SDP)</div>
                </div>

                <div className="bg-[#060b17] border border-emerald-900/50 rounded-xl p-3 space-y-1">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Bengaluru Tech Corridor</span>
                    <span className="text-[10px] font-mono text-emerald-400">8 Mins Active</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Victoria Hospital &rarr; NIMHANS Neuro-Trauma</div>
                  <div className="text-[10px] font-mono text-cyan-300">Vehicle: ICMR Aero-Rescue Drone Alpha</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REGULATORY GUIDELINES */}
          {activeTab === 'REGULATORY' && (
            <div className="bg-[#091122] border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white">
                  NBTC &amp; NACO Regulatory Guidelines &amp; Quality Mandates
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">Govt. Gazette Compliant</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 leading-relaxed">
                <div className="bg-[#060b17] border border-slate-800 rounded-xl p-3 space-y-1.5">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Mandatory Testing Standards (100% Screened)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Every collected unit undergoes mandatory testing for HIV 1 &amp; 2, Hepatitis B (HBsAg), Hepatitis C (HCV), Syphilis (VDRL), and Malaria prior to clinical release. NAT testing recommended for highest safety.
                  </p>
                </div>

                <div className="bg-[#060b17] border border-slate-800 rounded-xl p-3 space-y-1.5">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5" />
                    <span>Component Separation Mandate</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    NBTC policy requires converting whole blood into specific components (PRBC, Platelets, FFP, Cryoprecipitate) ensuring one donation saves up to three lives and prevents acute platelet/plasma shortages.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
