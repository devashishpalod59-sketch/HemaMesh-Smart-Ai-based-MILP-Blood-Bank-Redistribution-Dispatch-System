import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  FacilityNode,
  ActiveDispatch,
  UserLocationTrackerState,
  TransferDecision,
  NearbyDevice,
  RoadClosureIncident,
} from '../types/bloodMesh.ts';
import { IndianRegionKey } from '../services/defaultData.ts';
import { resolveIndianLocationInput, geocodeIndianLocationWithGoogle } from '../services/indianGeocoding.ts';
import {
  Navigation,
  Crosshair,
  ShieldAlert,
  Building2,
  Truck,
  Wind,
  Thermometer,
  Layers,
  Sparkles,
  Phone,
  Radio,
  CheckCircle2,
  Route,
  Zap,
  Search,
  Globe2,
  AlertTriangle,
} from 'lucide-react';

interface MapContainerProps {
  apiKey: string;
  nodes: FacilityNode[];
  selectedNode: FacilityNode | null;
  onSelectNode: (node: FacilityNode | null) => void;
  activeDispatches: ActiveDispatch[];
  nearbyDevices: NearbyDevice[];
  userLocation: UserLocationTrackerState;
  onCenterUserLocation: () => void;
  recentTransfers: TransferDecision[];
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  emergencyRouteTarget: FacilityNode | null;
  onSwitchRegion?: (region: IndianRegionKey) => void;
  currentRegion?: IndianRegionKey | 'MY_GPS' | 'CUSTOM_ENTERED';
  onResolveCustomLocation?: (coords: { lat: number; lng: number }, label: string) => void;
  roadClosures?: RoadClosureIncident[];
  selectedDispatch?: ActiveDispatch | null;
  onSelectDispatch?: (dispatch: ActiveDispatch | null) => void;
}

// Controller component to smoothly pan/zoom map programmatically
function MapCameraController({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);
  return null;
}

// Draws the emergency direct route line between origin and nearest blood bank
function EmergencyRouteOverlay({
  origin,
  destination,
}: {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}) {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !mapsLib) return;

    // Clean up previous line
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const routePath = [
      new mapsLib.LatLng(origin.lat, origin.lng),
      new mapsLib.LatLng(destination.lat, destination.lng),
    ];

    polylineRef.current = new mapsLib.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#06b6d4', // Bright cyan
      strokeOpacity: 0.9,
      strokeWeight: 5,
      map,
    });

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, mapsLib, origin, destination]);

  return null;
}

// Draws the iconic Google Maps accuracy blue halo circle matching accuracy in meters
function UserLocationAccuracyHalo({
  center,
  radiusMeters,
}: {
  center: { lat: number; lng: number } | null;
  radiusMeters: number;
}) {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const circleRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !mapsLib || !center) return;

    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    circleRef.current = new mapsLib.Circle({
      strokeColor: '#38bdf8',
      strokeOpacity: 0.65,
      strokeWeight: 1.5,
      fillColor: '#0284c7',
      fillOpacity: 0.15,
      map,
      center,
      radius: Math.max(5, radiusMeters),
      clickable: false,
      zIndex: 55,
    });

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
    };
  }, [map, mapsLib, center, radiusMeters]);

  return null;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  apiKey,
  nodes,
  selectedNode,
  onSelectNode,
  activeDispatches,
  nearbyDevices,
  userLocation,
  onCenterUserLocation,
  recentTransfers,
  mapCenter,
  mapZoom,
  emergencyRouteTarget,
  onSwitchRegion,
  currentRegion,
  onResolveCustomLocation,
  roadClosures = [],
  selectedDispatch = null,
  onSelectDispatch,
}) => {
  const [activeDispatchHover, setActiveDispatchHover] = useState<ActiveDispatch | null>(null);
  const [activeDeviceHover, setActiveDeviceHover] = useState<NearbyDevice | null>(null);
  const [selectedRoadClosure, setSelectedRoadClosure] = useState<RoadClosureIncident | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [searchError, setSearchError] = useState(false);

  const handleMapSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearchQuery.trim()) return;
    try {
      const resolved = await geocodeIndianLocationWithGoogle(mapSearchQuery);
      if (resolved && onResolveCustomLocation) {
        setSearchError(false);
        onResolveCustomLocation(resolved.coords, resolved.name);
        setMapSearchQuery('');
      } else {
        setSearchError(true);
        setTimeout(() => setSearchError(false), 2500);
      }
    } catch {
      const fallback = resolveIndianLocationInput(mapSearchQuery);
      if (fallback && onResolveCustomLocation) {
        setSearchError(false);
        onResolveCustomLocation(fallback.coords, fallback.name);
        setMapSearchQuery('');
      } else {
        setSearchError(true);
        setTimeout(() => setSearchError(false), 2500);
      }
    }
  };

  // Determine node pin styling based on clinical operational state
  const getNodeVisuals = (node: FacilityNode) => {
    switch (node.status) {
      case 'MASS_CASUALTY_SURGE':
      case 'CRITICAL_SHORTAGE':
        return {
          bg: 'bg-rose-600',
          ring: 'ring-rose-400 ring-4 animate-pulse',
          border: 'border-white',
          badgeText: 'CRITICAL NEED',
          iconColor: 'text-white',
        };
      case 'ELEVATED_DEMAND':
        return {
          bg: 'bg-amber-500',
          ring: 'ring-amber-300 ring-2',
          border: 'border-white',
          badgeText: 'ELEVATED',
          iconColor: 'text-white',
        };
      case 'OPTIMAL':
      default:
        return {
          bg: node.type === 'CENTRAL_BLOOD_DEPOT' ? 'bg-indigo-600' : 'bg-emerald-600',
          ring: node.type === 'CENTRAL_BLOOD_DEPOT' ? 'ring-indigo-300 ring-2' : 'ring-emerald-300 ring-2',
          border: 'border-white',
          badgeText: node.type === 'CENTRAL_BLOOD_DEPOT' ? 'CENTRAL HUB' : 'ADEQUATE',
          iconColor: 'text-white',
        };
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] bg-slate-950 overflow-hidden select-none">
      <APIProvider apiKey={apiKey} region="IN" language="en">
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={mapCenter}
          defaultZoom={mapZoom}
          mapTypeId={mapType}
          disableDefaultUI={false}
          gestureHandling="greedy"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          <MapCameraController center={mapCenter} zoom={mapZoom} />

          {/* Emergency Direct Route Line */}
          {emergencyRouteTarget && userLocation.coords && (
            <EmergencyRouteOverlay
              origin={userLocation.coords}
              destination={emergencyRouteTarget.coordinates}
            />
          )}

          {/* Active Convoy / Drone Transit Route Line */}
          {(selectedDispatch || activeDispatchHover) && (
            <EmergencyRouteOverlay
              origin={(selectedDispatch || activeDispatchHover)!.fromNode.coordinates}
              destination={(selectedDispatch || activeDispatchHover)!.toNode.coordinates}
            />
          )}

          {/* User Live GPS Marker & Google Maps Accuracy Circle */}
          {userLocation.coords && (
            <>
              <UserLocationAccuracyHalo
                center={userLocation.coords}
                radiusMeters={userLocation.accuracyMeters || 12}
              />
              <AdvancedMarker
                position={userLocation.coords}
                zIndex={60}
                title={`Your Live GPS Location (Accuracy: ±${Math.round(userLocation.accuracyMeters || 4)}m) - ${userLocation.resolvedAddress || ''}`}
              >
                <div className="relative flex flex-col items-center justify-center">
                  {/* Google Maps Style Heading Cone Beam if heading available */}
                  {userLocation.heading !== null && userLocation.heading !== undefined && (
                    <div
                      className="absolute -top-6 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-cyan-400/40 pointer-events-none"
                      style={{
                        transform: `rotate(${userLocation.heading}deg)`,
                        transformOrigin: '50% 100%',
                      }}
                    />
                  )}
                  <div className="absolute w-12 h-12 rounded-full bg-cyan-500/25 animate-ping" />
                  <div className="relative w-5 h-5 rounded-full bg-cyan-500 border-2 border-white shadow-xl flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="bg-slate-950/95 text-cyan-300 text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full border border-cyan-400/80 shadow-2xl mt-1 whitespace-nowrap flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>GPS ±{Math.round(userLocation.accuracyMeters || 4)}m</span>
                  </div>
                </div>
              </AdvancedMarker>
            </>
          )}

          {/* Hospital & Central Blood Bank Markers */}
          {nodes.map((node) => {
            const visual = getNodeVisuals(node);
            const isSelected = selectedNode?.id === node.id;
            const isEmergencyTarget = emergencyRouteTarget?.id === node.id;
            const totalStock = node.inventory.reduce((sum, i) => sum + i.units, 0);

            return (
              <AdvancedMarker
                key={node.id}
                position={node.coordinates}
                onClick={() => onSelectNode(node)}
                zIndex={isEmergencyTarget ? 50 : isSelected ? 45 : 30}
                title={`${node.name} (${node.status})`}
              >
                <div
                  className={`group relative flex flex-col items-center cursor-pointer transform transition-all duration-200 ${
                    isEmergencyTarget
                      ? 'scale-125 -translate-y-2'
                      : isSelected
                      ? 'scale-115 -translate-y-1'
                      : 'hover:scale-105'
                  }`}
                >
                  {/* Top Badge */}
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-white shadow-xl -mb-1 z-10 border ${
                      isEmergencyTarget
                        ? 'bg-rose-600 border-white ring-2 ring-rose-400 animate-pulse'
                        : 'bg-slate-900/95 border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        node.status === 'CRITICAL_SHORTAGE' || node.status === 'MASS_CASUALTY_SURGE'
                          ? 'bg-rose-400 animate-ping'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span className="truncate max-w-[120px] font-sans">{node.shortName}</span>
                    <span className="font-mono text-[10px] text-slate-300 font-bold ml-0.5">
                      [{totalStock}u]
                    </span>
                  </div>

                  {/* Marker Pin Bubble */}
                  <div
                    className={`relative w-10 h-10 rounded-full ${visual.bg} ${visual.ring} border-2 ${visual.border} shadow-2xl flex items-center justify-center text-white`}
                  >
                    {node.type === 'CENTRAL_BLOOD_DEPOT' ? (
                      <Layers className="w-5 h-5 text-white" />
                    ) : (
                      <Building2 className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Downward triangle arrow */}
                  <div
                    className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${
                      node.status === 'CRITICAL_SHORTAGE' || node.status === 'MASS_CASUALTY_SURGE'
                        ? 'border-t-rose-600'
                        : node.type === 'CENTRAL_BLOOD_DEPOT'
                        ? 'border-t-indigo-600'
                        : 'border-t-emerald-600'
                    } -mt-0.5`}
                  />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Immediate Nearby Devices (108 Ambulances, LifeMobile Buses, Aero Drones) */}
          {nearbyDevices.map((dev) => {
            const isDrone = dev.type === 'AERO_DRONE_POD';
            const isAmbulance = dev.type === 'EMERGENCY_AMBULANCE_AMB';

            return (
              <AdvancedMarker
                key={dev.id}
                position={dev.coordinates}
                onClick={() => setActiveDeviceHover(dev)}
                zIndex={35}
                title={`${dev.name}: ${dev.distanceKm} km away`}
              >
                <div className="relative flex flex-col items-center cursor-pointer group">
                  <div className="bg-slate-900/95 text-cyan-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-cyan-500/50 shadow-lg -mb-1 z-10 whitespace-nowrap">
                    {dev.name.split(' ')[0]} • {dev.etaMinutes}m
                  </div>

                  <div className="w-8 h-8 rounded-full bg-cyan-600 border-2 border-white shadow-xl flex items-center justify-center text-white ring-2 ring-cyan-400">
                    {isDrone ? (
                      <Wind className="w-4 h-4 animate-spin" />
                    ) : (
                      <Truck className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Active Dispatch Vehicles in Transit */}
          {activeDispatches.map((dispatch) => (
            <AdvancedMarker
              key={dispatch.id}
              position={dispatch.currentCoordinates}
              onClick={() => setActiveDispatchHover(dispatch)}
              zIndex={40}
              title={`Cold-Chain Transit ${dispatch.vehicleId}: ${dispatch.units} units`}
            >
              <div className="relative flex flex-col items-center cursor-pointer group">
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow -mb-1 z-10">
                  <Thermometer className="w-2.5 h-2.5" />
                  <span>{dispatch.telemetry.temperatureCelsius.toFixed(1)}°C</span>
                  <span>{dispatch.bloodType}</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-sky-600 border-2 border-white shadow-xl flex items-center justify-center text-white ring-2 ring-sky-400">
                  <Truck className="w-3.5 h-3.5" />
                </div>
              </div>
            </AdvancedMarker>
          ))}

          {/* Active Road Closures & Traffic Obstructions (Google Maps Grade) */}
          {roadClosures.map((closure) => (
            <AdvancedMarker
              key={closure.id}
              position={closure.coordinates}
              onClick={() => setSelectedRoadClosure(closure)}
              zIndex={45}
              title={`Road Closure: ${closure.corridorName} (+${closure.estimatedDelayMinutes}m delay)`}
            >
              <div className="relative flex flex-col items-center cursor-pointer group">
                <div className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500 shadow mb-1">
                  +{closure.estimatedDelayMinutes}m
                </div>
                <div className="w-7 h-7 rounded-full bg-orange-600 border-2 border-white shadow-xl flex items-center justify-center text-white ring-2 ring-orange-400 animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
            </AdvancedMarker>
          ))}

          {/* Selected Road Closure Info Window */}
          {selectedRoadClosure && (
            <InfoWindow
              position={selectedRoadClosure.coordinates}
              onCloseClick={() => setSelectedRoadClosure(null)}
              headerContent={
                <div className="flex items-center gap-2 pr-2">
                  <span className="font-extrabold text-amber-900 text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                    <span>{selectedRoadClosure.corridorName}</span>
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                    {selectedRoadClosure.severity.replace(/_/g, ' ')}
                  </span>
                </div>
              }
            >
              <div className="text-slate-800 text-xs p-1 space-y-1.5 max-w-xs">
                <div className="font-semibold text-slate-700">
                  Cause: {selectedRoadClosure.reason.replace(/_/g, ' ')} at {selectedRoadClosure.locationName}
                </div>
                <div className="text-rose-600 font-bold font-mono">
                  Transit Penalty: +{selectedRoadClosure.estimatedDelayMinutes} minutes delay
                </div>
                <div className="text-[11px] text-slate-600 border-t border-slate-200 pt-1">
                  <strong>Recommended Detour:</strong> {selectedRoadClosure.recommendedDetour}
                </div>
              </div>
            </InfoWindow>
          )}

          {/* Selected Node Info Window */}
          {selectedNode && (
            <InfoWindow
              position={selectedNode.coordinates}
              onCloseClick={() => onSelectNode(null)}
              headerContent={
                <div className="flex items-center justify-between gap-2 pr-2">
                  <span className="font-extrabold text-slate-900 text-xs">
                    {selectedNode.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      selectedNode.status === 'CRITICAL_SHORTAGE'
                        ? 'bg-rose-100 text-rose-800'
                        : selectedNode.status === 'ELEVATED_DEMAND'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedNode.status.replace(/_/g, ' ')}
                  </span>
                </div>
              }
            >
              <div className="text-slate-800 text-xs max-w-sm p-1 space-y-2">
                <div className="text-[11px] text-slate-600">
                  {selectedNode.address} <br />
                  <span className="font-semibold text-slate-800">Helpline:</span>{' '}
                  <a href={`tel:${selectedNode.phone}`} className="text-rose-600 underline font-bold">
                    {selectedNode.phone}
                  </a>{' '}
                  • {selectedNode.contactPerson}
                </div>

                {/* Stock Overview */}
                <div className="border-t border-slate-200 pt-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    Live Stock Inventory (e-RaktKosh Verified)
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mt-1 text-[11px]">
                    {selectedNode.inventory.slice(0, 6).map((inv) => (
                      <div
                        key={inv.id}
                        className={`p-1.5 rounded border ${
                          inv.daysToExpiry <= 2
                            ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="font-bold flex justify-between">
                          <span>{inv.bloodType} {inv.component}</span>
                          <span className="text-rose-700">{inv.units}u</span>
                        </div>
                        <div className="text-[9px] text-slate-500 flex justify-between">
                          <span>Exp:</span>
                          <span className={inv.daysToExpiry <= 2 ? 'font-bold text-amber-700' : ''}>
                            {inv.daysToExpiry}d
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500">
                    ISBT-128 Protocol Active
                  </span>
                  <a
                    href={`tel:${selectedNode.phone}`}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Blood Desk</span>
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}

          {/* Hover Device Info Window */}
          {activeDeviceHover && (
            <InfoWindow
              position={activeDeviceHover.coordinates}
              onCloseClick={() => setActiveDeviceHover(null)}
              headerContent={
                <span className="font-bold text-slate-900 text-xs">
                  {activeDeviceHover.name} (Direct EMS Device)
                </span>
              }
            >
              <div className="text-slate-800 text-xs p-1 space-y-1">
                <div className="text-[11px] text-slate-600">
                  Status: <strong>{activeDeviceHover.status.replace(/_/g, ' ')}</strong> • Radio:{' '}
                  {activeDeviceHover.contactRadio}
                </div>
                <div className="font-mono text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200">
                  Core Temp: {activeDeviceHover.coldStorageTempCelsius.toFixed(1)}°C • Distance:{' '}
                  {activeDeviceHover.distanceKm} km • ETA: {activeDeviceHover.etaMinutes} mins
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Floating Operational Map Controls & All-India Corridor Navigator */}
      <div className="absolute top-3 left-3 right-16 sm:right-auto z-10 flex flex-col gap-2 pointer-events-auto max-w-full">
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer switcher */}
          <div className="bg-slate-950/90 backdrop-blur border border-slate-700 rounded-lg p-1 shadow-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 rounded font-bold transition ${
                mapType === 'roadmap'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Clear Vector Map
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded font-bold transition ${
                mapType === 'satellite'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite View
            </button>
          </div>

          {/* Quick Search Bar Directly on Map */}
          {onResolveCustomLocation && (
            <form onSubmit={handleMapSearchSubmit} className="flex items-center">
              <div className="relative flex items-center bg-slate-950/90 backdrop-blur border border-slate-700 focus-within:border-cyan-400 rounded-lg shadow-xl px-2.5 py-1 text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  value={mapSearchQuery}
                  onChange={(e) => setMapSearchQuery(e.target.value)}
                  placeholder="Jump to city, PIN or hospital in India..."
                  className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-36 sm:w-56 text-[11px]"
                />
                <button
                  type="submit"
                  className="ml-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold px-2 py-0.5 rounded transition"
                >
                  Locate
                </button>
              </div>
              {searchError && (
                <span className="text-[10px] text-rose-400 ml-1.5 font-bold animate-pulse">
                  Location not found
                </span>
              )}
            </form>
          )}

          {/* Emergency Route Indicator */}
          {emergencyRouteTarget && (
            <div className="bg-cyan-950/95 border border-cyan-400 text-cyan-200 text-xs font-mono font-bold px-3 py-1 rounded-lg shadow-xl flex items-center gap-1.5 animate-pulse">
              <Route className="w-3.5 h-3.5 text-cyan-400" />
              <span>DIRECT CORRIDOR &rarr; {emergencyRouteTarget.shortName}</span>
            </div>
          )}
        </div>

        {/* All-India Corridor Quick Jump Bar */}
        {onSwitchRegion && (
          <div className="bg-slate-950/90 backdrop-blur border border-slate-800 rounded-lg p-1 shadow-xl flex items-center gap-1 overflow-x-auto text-[10px] font-bold max-w-[90vw] sm:max-w-2xl no-scrollbar">
            <span className="text-slate-500 uppercase px-1.5 tracking-wider font-mono shrink-0 flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-cyan-400" />
              <span>India Hubs:</span>
            </span>
            <button
              onClick={() => onSwitchRegion('ALL_INDIA')}
              className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                currentRegion === 'ALL_INDIA'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                  : 'text-cyan-400 hover:text-white bg-slate-900/80 border border-cyan-800/50'
              }`}
            >
              🇮🇳 All-India Overview
            </button>
            <button
              onClick={() => onSwitchRegion('DELHI_NCR')}
              className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                currentRegion === 'DELHI_NCR' ? 'bg-[#ff0055] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Delhi
            </button>
            <button
              onClick={() => onSwitchRegion('MUMBAI')}
              className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                currentRegion === 'MUMBAI' ? 'bg-[#ff0055] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Mumbai
            </button>
            <button
              onClick={() => onSwitchRegion('PUNE')}
              className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                currentRegion === 'PUNE' ? 'bg-[#ff0055] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Pune
            </button>
            <button
              onClick={() => onSwitchRegion('BENGALURU')}
              className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                currentRegion === 'BENGALURU' ? 'bg-[#ff0055] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Bengaluru
            </button>
            <button
              onClick={() => onSwitchRegion('HYDERABAD')}
              className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                currentRegion === 'HYDERABAD' ? 'bg-[#ff0055] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Hyderabad
            </button>
            <button
              onClick={() => onSwitchRegion('CHENNAI')}
              className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                currentRegion === 'CHENNAI' ? 'bg-[#ff0055] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Chennai
            </button>
            <button
              onClick={() => onSwitchRegion('KOLKATA')}
              className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                currentRegion === 'KOLKATA' ? 'bg-[#ff0055] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Kolkata
            </button>
            <button
              onClick={() => onSwitchRegion('AHMEDABAD')}
              className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                currentRegion === 'AHMEDABAD' ? 'bg-[#ff0055] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Ahmedabad
            </button>
            <button
              onClick={() => onSwitchRegion('LUCKNOW')}
              className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                currentRegion === 'LUCKNOW' ? 'bg-[#ff0055] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Lucknow
            </button>
            <button
              onClick={() => onSwitchRegion('JAIPUR')}
              className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                currentRegion === 'JAIPUR' ? 'bg-[#ff0055] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Jaipur
            </button>
          </div>
        )}
      </div>

      {/* GPS Location Tracker Pinpoint Button */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={onCenterUserLocation}
          title="Center on my accurate GPS location in India"
          className="bg-slate-950/90 hover:bg-slate-800 backdrop-blur border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-cyan-300 p-2.5 rounded-xl shadow-2xl transition flex items-center gap-2 text-xs font-bold"
        >
          <Crosshair className={`w-4 h-4 ${userLocation.loading ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
          <span className="hidden sm:inline">My Live Location (India)</span>
        </button>
      </div>

      {/* Live Map Telemetry HUD in Bottom-Left */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:block">
        <div className="bg-slate-950/90 backdrop-blur border border-slate-800 rounded-xl px-3.5 py-2 text-[11px] text-slate-400 font-mono space-y-0.5 shadow-2xl">
          <div className="flex items-center gap-2 text-slate-100 font-sans font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Indian Blood Banking Network & e-RaktKosh Mesh Active</span>
          </div>
          <div>Hospitals & Depots: {nodes.length} nodes • Devices: {nearbyDevices.length} mobile units</div>
          {userLocation.coords && (
            <div className="text-cyan-400 font-semibold">
              Live GPS: {userLocation.coords.lat.toFixed(4)}° N, {userLocation.coords.lng.toFixed(4)}° E (±{Math.round(userLocation.accuracyMeters || 10)}m)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
