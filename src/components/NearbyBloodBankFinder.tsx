import React, { useState, useMemo } from 'react';
import {
  FacilityNode,
  UserLocationTrackerState,
  BloodType,
  BloodComponent,
} from '../types/bloodMesh.ts';
import { calculateDistanceKm } from '../services/milpSolver.ts';
import {
  MapPin,
  Crosshair,
  Compass,
  Gauge,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Filter,
  Flame,
  Clock,
  Phone,
  Building,
} from 'lucide-react';

interface NearbyBloodBankFinderProps {
  nodes: FacilityNode[];
  userLocation: UserLocationTrackerState;
  onSelectNode: (node: FacilityNode) => void;
  onFocusNodeOnMap: (node: FacilityNode) => void;
  onRequestTransferToNode: (node: FacilityNode) => void;
}

export const NearbyBloodBankFinder: React.FC<NearbyBloodBankFinderProps> = ({
  nodes,
  userLocation,
  onSelectNode,
  onFocusNodeOnMap,
  onRequestTransferToNode,
}) => {
  const [selectedBloodFilter, setSelectedBloodFilter] = useState<BloodType | 'ALL'>('ALL');
  const [selectedCompFilter, setSelectedCompFilter] = useState<BloodComponent | 'ALL'>('ALL');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(100);
  const [sortBy, setSortBy] = useState<'DISTANCE' | 'URGENCY' | 'STOCK'>('DISTANCE');

  // Base location for proximity calculation: user GPS if available, otherwise first hospital
  const baseCoords = useMemo(() => {
    if (userLocation.coords) {
      return userLocation.coords;
    }
    return nodes[0]?.coordinates || { lat: 28.5672, lng: 77.2100 };
  }, [userLocation.coords, nodes]);

  // Compute facility distances and inventory health
  const facilitiesWithDistance = useMemo(() => {
    return nodes.map((node) => {
      const distanceKm = calculateDistanceKm(
        baseCoords.lat,
        baseCoords.lng,
        node.coordinates.lat,
        node.coordinates.lng
      );
      const distanceMiles = Math.round(distanceKm * 0.621371 * 10) / 10;
      const drivingMins = Math.max(4, Math.round((distanceKm / 35) * 60));
      const code3Mins = Math.max(2, Math.round((distanceKm / 60) * 60));

      const totalInventory = node.inventory.reduce((sum, i) => sum + i.units, 0);
      const criticalDemands = node.demands.filter(
        (d) => d.criticality === 'CODE_RED_TRAUMA' || d.criticality === 'CRITICAL_DEFICIT'
      );
      const expiringUnits = node.inventory.filter((i) => i.daysToExpiry <= 2);

      return {
        ...node,
        distanceKm,
        distanceMiles,
        drivingMins,
        code3Mins,
        totalInventory,
        criticalDemandsCount: criticalDemands.length,
        expiringUnitsCount: expiringUnits.reduce((acc, u) => acc + u.units, 0),
      };
    });
  }, [nodes, baseCoords]);

  // Apply filters
  const filteredFacilities = useMemo(() => {
    return facilitiesWithDistance
      .filter((fac) => fac.distanceKm <= maxRadiusKm)
      .filter((fac) => {
        if (selectedBloodFilter === 'ALL') return true;
        const hasStock = fac.inventory.some((i) => i.bloodType === selectedBloodFilter && i.units > 0);
        const hasDemand = fac.demands.some((d) => d.bloodType === selectedBloodFilter);
        return hasStock || hasDemand;
      })
      .filter((fac) => {
        if (selectedCompFilter === 'ALL') return true;
        const hasStock = fac.inventory.some((i) => i.component === selectedCompFilter && i.units > 0);
        const hasDemand = fac.demands.some((d) => d.component === selectedCompFilter);
        return hasStock || hasDemand;
      })
      .sort((a, b) => {
        if (sortBy === 'DISTANCE') return a.distanceKm - b.distanceKm;
        if (sortBy === 'URGENCY') return b.criticalDemandsCount - a.criticalDemandsCount;
        return b.totalInventory - a.totalInventory;
      });
  }, [facilitiesWithDistance, maxRadiusKm, selectedBloodFilter, selectedCompFilter, sortBy]);

  // GPS Accuracy tier calculation
  const getGpsQuality = (accuracyMeters: number | null) => {
    if (!accuracyMeters) return { label: 'Estimating...', color: 'text-slate-400' };
    if (accuracyMeters <= 15) return { label: 'High Precision (±' + Math.round(accuracyMeters) + 'm)', color: 'text-emerald-400' };
    if (accuracyMeters <= 50) return { label: 'Good Precision (±' + Math.round(accuracyMeters) + 'm)', color: 'text-cyan-400' };
    return { label: 'Cell/Network Tower (±' + Math.round(accuracyMeters) + 'm)', color: 'text-amber-400' };
  };

  const gpsQuality = getGpsQuality(userLocation.accuracyMeters);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-100">
      {/* Location Tracker Card */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Crosshair className={`w-4 h-4 ${userLocation.loading ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Google Maps GPS Telemetry Tracker
              </h3>
              <p className={`text-[11px] font-mono ${gpsQuality.color}`}>{gpsQuality.label}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/50 px-2 py-0.5 rounded-full">
            REAL-TIME
          </span>
        </div>

        {userLocation.coords ? (
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Latitude / Longitude</span>
              <span className="text-slate-200 font-bold">
                {userLocation.coords.lat.toFixed(5)}°, {userLocation.coords.lng.toFixed(5)}°
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Speed / Heading</span>
              <span className="text-slate-200 font-bold">
                {userLocation.speed ? `${Math.round(userLocation.speed * 3.6)} km/h` : 'Stationary'} •{' '}
                {userLocation.heading ? `${Math.round(userLocation.heading)}°` : 'N/A'}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-dashed border-slate-800 text-[11px] text-slate-400 text-center">
            Tracking GPS signal from browser... Centering on regional medical cluster.
          </div>
        )}
      </div>

      {/* Filter and Radius Toolbar */}
      <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-900">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Nearby Search ({filteredFacilities.length} facilities)
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Radius:</span>
            <select
              value={maxRadiusKm}
              onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
              aria-label="Filter radius in kilometers"
              className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value={15}>15 km (City Central)</option>
              <option value={30}>30 km (District)</option>
              <option value={50}>50 km (Metro Corridor)</option>
              <option value={100}>100 km (Inter-city)</option>
              <option value={250}>250 km (State)</option>
              <option value={500}>500 km (Regional)</option>
              <option value={2000}>2,000 km (Pan-India)</option>
            </select>
          </div>
        </div>

        {/* Quick blood type chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
          {(['ALL', 'O-', 'O+', 'A-', 'A+', 'B+', 'AB+'] as const).map((bt) => (
            <button
              key={bt}
              onClick={() => setSelectedBloodFilter(bt)}
              className={`px-2 py-0.5 rounded font-mono font-bold transition whitespace-nowrap ${
                selectedBloodFilter === bt
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {bt === 'ALL' ? 'All Types' : bt}
            </button>
          ))}
        </div>

        {/* Component chips */}
        <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
          {(['ALL', 'PLT', 'PRBC', 'FFP', 'WB'] as const).map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedCompFilter(comp)}
              className={`px-2 py-0.5 rounded font-medium transition whitespace-nowrap ${
                selectedCompFilter === comp
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {comp === 'ALL' ? 'All Components' : comp}
            </button>
          ))}
        </div>
      </div>

      {/* Facility Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredFacilities.map((fac) => {
          const isDepot = fac.type === 'CENTRAL_BLOOD_DEPOT';
          const hasCriticalDeficit = fac.status === 'CRITICAL_SHORTAGE';
          const hasMci = fac.status === 'MASS_CASUALTY_SURGE';

          return (
            <div
              key={fac.id}
              className={`p-3 rounded-xl border transition-all duration-150 ${
                hasMci || hasCriticalDeficit
                  ? 'bg-rose-950/20 border-rose-800/60 hover:border-rose-500'
                  : isDepot
                  ? 'bg-indigo-950/20 border-indigo-800/50 hover:border-indigo-400'
                  : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <h4 className="font-bold text-xs text-white leading-tight">{fac.name}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate max-w-[210px]">{fac.address}</span>
                  </p>
                </div>

                {/* Distance Badge */}
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-cyan-400">
                    {fac.distanceKm} km
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    ({fac.distanceMiles} mi)
                  </div>
                </div>
              </div>

              {/* Transit Times & Urgent Alerts */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] bg-slate-900/60 px-2 py-1.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>~{fac.drivingMins}m normal</span>
                  </div>
                  <div className="flex items-center gap-1 text-rose-400 font-semibold">
                    <Flame className="w-3 h-3 text-rose-500" />
                    <span>{fac.code3Mins}m Code 3 Priority</span>
                  </div>
                </div>
                <div className="font-mono text-slate-300 font-bold">
                  {fac.totalInventory} Units Total
                </div>
              </div>

              {/* Critical Demands Highlights */}
              {fac.demands.length > 0 && (
                <div className="mt-2 space-y-1">
                  {fac.demands.slice(0, 2).map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[10px] bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded border border-rose-900/40"
                    >
                      <span className="font-bold">
                        NEED: {d.bloodType} {d.component} ({d.requiredUnits} Units)
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-rose-400">
                        {d.criticality.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Spoilage Alert for Spoke Clinic */}
              {fac.expiringUnitsCount > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] bg-amber-950/30 text-amber-300 px-2 py-0.5 rounded border border-amber-900/40">
                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>
                    Perishable Spoilage Risk: {fac.expiringUnitsCount} units expiring in &lt;48h
                  </span>
                </div>
              )}

              {/* Actions row */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onFocusNodeOnMap(fac)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>Emergency Route</span>
                  </button>

                  <a
                    href={`tel:${fac.phone}`}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectNode(fac)}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md font-medium transition"
                  >
                    Stock
                  </button>
                  <button
                    onClick={() => onRequestTransferToNode(fac)}
                    className="text-[11px] bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 rounded-md font-bold shadow-sm transition flex items-center gap-1"
                  >
                    <span>Rebalance</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
