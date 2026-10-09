import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FacilityNode,
  ActiveDispatch,
  OptimizationResult,
  TransferDecision,
  MILPSolverConfig,
  UserLocationTrackerState,
  DisasterTelemetryEvent,
  NearbyDevice,
  BloodType,
  BloodComponent,
  PredictiveEventId,
  RoadClosureIncident,
  SystemAlert,
  DigitalTwinScenario,
} from './types/bloodMesh.ts';
import {
  DEFAULT_FACILITY_NODES,
  INDIAN_REGION_PRESETS,
  IndianRegionKey,
  generateFacilitiesAroundLocation,
} from './services/defaultData.ts';
import {
  solveMILPBloodMesh,
  DEFAULT_SOLVER_CONFIG,
  PredictiveSolverOptions,
} from './services/milpSolver.ts';
import { telemetryEngine } from './services/telemetryStream.ts';
import { MapContainer } from './components/MapContainer.tsx';
import { MILPAnalyticsPanel } from './components/MILPAnalyticsPanel.tsx';
import { NearbyBloodBankFinder } from './components/NearbyBloodBankFinder.tsx';
import { DisasterTelemetryBar } from './components/DisasterTelemetryBar.tsx';
import { TransferManifestModal } from './components/TransferManifestModal.tsx';
import { CompatibilityMatrixModal } from './components/CompatibilityMatrixModal.tsx';
import { EmergencySOSModal } from './components/EmergencySOSModal.tsx';
import { RapidIntakeAvailabilityBar } from './components/RapidIntakeAvailabilityBar.tsx';
import { LiveDispatchTracker } from './components/LiveDispatchTracker.tsx';
import { FirstPrizeBloodIntake } from './components/FirstPrizeBloodIntake.tsx';
import { TraumaPatientVitalsDashboard } from './components/TraumaPatientVitalsDashboard.tsx';
import { HemopulseHeaderStrip } from './components/HemopulseHeaderStrip.tsx';
import { HemopulseAvailabilityConsole } from './components/HemopulseAvailabilityConsole.tsx';
import { NationalBloodTransfusionCouncilDashboard } from './components/NationalBloodTransfusionCouncilDashboard.tsx';
import { PredictiveInventoryForecaster } from './components/PredictiveInventoryForecaster.tsx';
import { DonorBeaconModal } from './components/DonorBeaconModal.tsx';
import { GreenCorridorPassModal } from './components/GreenCorridorPassModal.tsx';
import { HemopulseAIChatbot } from './components/HemopulseAIChatbot.tsx';
import { AlertsAndNotificationsCenter } from './components/AlertsAndNotificationsCenter.tsx';
import { ShortageAndExpirySentinel } from './components/ShortageAndExpirySentinel.tsx';
import { ColdChainAndJourneyGuardian } from './components/ColdChainAndJourneyGuardian.tsx';
import { EmergencyDigitalTwinSandbox } from './components/EmergencyDigitalTwinSandbox.tsx';
import { alertSoundService } from './services/alertSoundService.ts';
import { INITIAL_TRAUMA_PATIENTS, getScenarioPatients } from './services/traumaPatientData.ts';
import { TraumaPatient } from './types/bloodMesh.ts';
import {
  acquireHighAccuracyLocation,
  reverseGeocodeGoogleMapsGrade,
  evaluateAccuracyGrade,
  fetchIpFallbackLocation,
} from './services/highAccuracyLocationService.ts';
import {
  Activity,
  ShieldCheck,
  HeartPulse,
  Crosshair,
  Flame,
  AlertOctagon,
  Phone,
  Radio,
  MapPin,
  Sparkles,
  Truck,
  Compass,
  Bot,
  Globe2,
  ArrowUp,
  Bell,
  Volume2,
  VolumeX,
  AlertTriangle,
  Snowflake,
  Zap,
  Layers,
  Clock,
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyDM45BtR-UcSEt4kx0Y-XuZjWVVgHKN79Y';

export default function App() {
  // Google Maps Quota Exceeded Defense State (Required by GMP Skill)
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Indian Region & Custom Entered Location State
  const [currentRegion, setCurrentRegion] = useState<IndianRegionKey | 'MY_GPS' | 'CUSTOM_ENTERED'>('DELHI_NCR');
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lng: number }>(
    INDIAN_REGION_PRESETS.DELHI_NCR.center
  );
  const [activeLocationLabel, setActiveLocationLabel] = useState<string>('Delhi NCR (AIIMS Apex)');

  // Network Nodes & Nearby Devices State
  const [nodes, setNodes] = useState<FacilityNode[]>(INDIAN_REGION_PRESETS.DELHI_NCR.nodes);
  const [nearbyDevices, setNearbyDevices] = useState<NearbyDevice[]>(INDIAN_REGION_PRESETS.DELHI_NCR.devices);

  // Operational Solver State
  const [solverConfig, setSolverConfig] = useState<MILPSolverConfig>(DEFAULT_SOLVER_CONFIG);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [selectedNode, setSelectedNode] = useState<FacilityNode | null>(null);
  const [manifestModalTransfer, setManifestModalTransfer] = useState<TransferDecision | null>(null);
  const [isCompatibilityOpen, setIsCompatibilityOpen] = useState(false);
  const [isEmergencySOSOpen, setIsEmergencySOSOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'AVAILABILITY' | 'MAP' | 'SOLVER' | 'TWIN' | 'COLD_CHAIN' | 'TELEMETRY' | 'TRACKER' | 'VITALS'
  >('AVAILABILITY');
  const [traumaPatients, setTraumaPatients] = useState<TraumaPatient[]>(INITIAL_TRAUMA_PATIENTS);
  const [activeScenarioTitle, setActiveScenarioTitle] = useState<string>(
    '16-Vehicle Multi-Collision on Major Expressway'
  );

  // Central Alerts Hub & Sound Synthesis State
  const [isAlertsCenterOpen, setIsAlertsCenterOpen] = useState(false);

  // Active Road Closures State (Google Maps Grade)
  const [roadClosures, setRoadClosures] = useState<RoadClosureIncident[]>([
    {
      id: 'RC-DEL-1',
      corridorName: 'Outer Ring Road (Chirag Delhi Underpass)',
      locationName: 'Chirag Delhi Junction, South Delhi',
      coordinates: { lat: 28.5385, lng: 77.2285 },
      reason: 'WATERLOGGING_FLOOD',
      severity: 'FULL_BLOCKAGE',
      estimatedDelayMinutes: 22,
      reportedAt: '12 mins ago',
      active: true,
      recommendedDetour: 'Divert via Mehrauli-Badarpur (MB) Road or BRT Corridor',
    },
    {
      id: 'RC-DEL-2',
      corridorName: 'Delhi-Gurugram Expressway (NH-48 Sirhaul)',
      locationName: 'Sirhaul Border Tollway Plaza',
      coordinates: { lat: 28.5028, lng: 77.0872 },
      reason: 'EXPRESSWAY_ACCIDENT',
      severity: 'PARTIAL_LANE_RESTRICTION',
      estimatedDelayMinutes: 18,
      reportedAt: '25 mins ago',
      active: true,
      recommendedDetour: 'Divert via Mehrauli-Gurgaon Road (MG Road) Metro Line',
    },
  ]);

  // Real-Time Enterprise System Alerts Queue
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: 'ALT-1',
      category: 'SHORTAGE',
      severity: 'CRITICAL_RED',
      title: 'Severe O- Negative Red Blood Cell Shortage',
      message: 'AIIMS Apex Trauma Center has only 3 units of O- PRBC remaining against ongoing trauma burn rate of 5.5 units/hr.',
      timestamp: 'Just now',
      sourceNodeId: 'in-del-aiims-t1',
      actionLabel: 'STAT MILP Rebalance',
      acknowledged: false,
    },
    {
      id: 'ALT-2',
      category: 'EXPIRY',
      severity: 'WARNING_AMBER',
      title: 'Perishable Platelet Units Expiring in <24 Hours',
      message: 'East Delhi Rotary Blood Spoke has 3 units of O- and 4 units of A+ platelets reaching day 5 shelf life. Transfer recommended to prevent spoilage.',
      timestamp: '4 mins ago',
      sourceNodeId: 'in-del-mayur-vihar',
      actionLabel: 'Reroute to AIIMS',
      acknowledged: false,
    },
    {
      id: 'ALT-3',
      category: 'COLD_CHAIN',
      severity: 'WARNING_AMBER',
      title: 'Cold Chain Guardian: Transit Van #18 Marginal Temp',
      message: 'CATS 108 Rapid Ambulance #18 reporting internal box temp 3.8°C (within 2-6°C range, PCM ice pack 91% solid).',
      timestamp: '6 mins ago',
      dispatchId: 'DSP-INIT-1',
      actionLabel: 'View IoT Telemetry',
      acknowledged: false,
    },
    {
      id: 'ALT-4',
      category: 'ROAD_CLOSURE',
      severity: 'WARNING_AMBER',
      title: 'Road Closure: Outer Ring Road Flooding Detected',
      message: 'Traffic police report waterlogging at Chirag Delhi underpass. Delay estimated at +22 mins; Green Corridor reroute active.',
      timestamp: '12 mins ago',
      actionLabel: 'View Detour Route',
      acknowledged: false,
    },
    {
      id: 'ALT-5',
      category: 'SHIPMENT_DELAY',
      severity: 'WARNING_AMBER',
      title: 'Shipment Latency on NH-48 Corridor (+18 mins)',
      message: 'Expressway multi-vehicle collision creating bottleneck. Passive cooling endurance safe for 3h 40m.',
      timestamp: '15 mins ago',
      actionLabel: 'Authorize Police Escort',
      acknowledged: false,
    },
  ]);

  // Advanced Unique Features State: Donor Beacon, Green Corridor Pass, Bilingual Mode, AI Copilot
  const [isDonorBeaconOpen, setIsDonorBeaconOpen] = useState(false);
  const [donorBeaconGroup, setDonorBeaconGroup] = useState<BloodType>('B+');
  const [donorBeaconUnits, setDonorBeaconUnits] = useState(2);
  const [isGreenPassOpen, setIsGreenPassOpen] = useState(false);
  const [selectedGreenPassHospital, setSelectedGreenPassHospital] = useState<FacilityNode | null>(null);
  const [selectedGreenPassDispatch, setSelectedGreenPassDispatch] = useState<ActiveDispatch | null>(null);
  const [languageMode, setLanguageMode] = useState<'EN' | 'HI'>('EN');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleOpenDonorBeacon = (group: BloodType, units: number) => {
    setDonorBeaconGroup(group);
    setDonorBeaconUnits(units);
    setIsDonorBeaconOpen(true);
  };

  const handleOpenGreenCorridorForHospital = (hospital: FacilityNode) => {
    setSelectedGreenPassHospital(hospital);
    setSelectedGreenPassDispatch(null);
    setIsGreenPassOpen(true);
  };

  const handleOpenGreenCorridorForDispatch = (dispatch: ActiveDispatch) => {
    setSelectedGreenPassDispatch(dispatch);
    setSelectedGreenPassHospital(null);
    setIsGreenPassOpen(true);
  };

  // Emergency Direct Route Target
  const [emergencyRouteTarget, setEmergencyRouteTarget] = useState<FacilityNode | null>(null);
  const [isFastIntakeVisible, setIsFastIntakeVisible] = useState(true);

  // Map Camera State
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    INDIAN_REGION_PRESETS.DELHI_NCR.center
  );
  const [mapZoom, setMapZoom] = useState<number>(INDIAN_REGION_PRESETS.DELHI_NCR.zoom);

  // Real-time Active Dispatch Vehicles
  const [activeDispatches, setActiveDispatches] = useState<ActiveDispatch[]>([
    {
      id: 'DSP-INIT-1',
      transferId: 'TX-INIT-901',
      fromNode: INDIAN_REGION_PRESETS.DELHI_NCR.nodes[1], // Red Cross Central
      toNode: INDIAN_REGION_PRESETS.DELHI_NCR.nodes[0],   // AIIMS Apex Trauma
      component: 'PRBC',
      bloodType: 'O-',
      units: 6,
      vehicleId: 'CATS 108 Rapid Ambulance #18',
      vehicleType: 'EV_MED_AMBULANCE',
      dispatchedAt: new Date(Date.now() - 360000).toLocaleTimeString(),
      estimatedArrival: '+4 mins',
      progressPercent: 45,
      currentCoordinates: { lat: 28.5945, lng: 77.2102 },
      telemetry: {
        temperatureCelsius: 3.8,
        tempStatus: 'NOMINAL',
        batteryOrFuelPercent: 91,
        speedKmh: 64,
        bearingDegrees: 180,
      },
      manifestNumber: 'MNF-IN-DL-4029',
      status: 'IN_TRANSIT',
    },
    {
      id: 'DSP-INIT-2',
      transferId: 'TX-INIT-902',
      fromNode: INDIAN_REGION_PRESETS.DELHI_NCR.nodes[3], // Rotary Spoke
      toNode: INDIAN_REGION_PRESETS.DELHI_NCR.nodes[0],   // AIIMS Apex Trauma
      component: 'PLT',
      bloodType: 'O-',
      units: 3,
      vehicleId: 'ICMR Aero-Rescue Drone Alpha',
      vehicleType: 'DRONE_AERO_RESCUE',
      dispatchedAt: new Date(Date.now() - 180000).toLocaleTimeString(),
      estimatedArrival: '+2 mins',
      progressPercent: 70,
      currentCoordinates: { lat: 28.5877, lng: 77.2522 },
      telemetry: {
        temperatureCelsius: 22.1,
        tempStatus: 'NOMINAL',
        batteryOrFuelPercent: 96,
        speedKmh: 75,
        bearingDegrees: 240,
      },
      manifestNumber: 'MNF-IN-DL-9912',
      status: 'IN_TRANSIT',
    },
  ]);

  // Telemetry Engine State
  const [telemetryEvent, setTelemetryEvent] = useState<DisasterTelemetryEvent | null>(null);
  const [isTelemetryConnected, setIsTelemetryConnected] = useState(true);

  // High Accuracy GPS Location Tracker (Google Maps Grade)
  const [userLocation, setUserLocation] = useState<UserLocationTrackerState>({
    enabled: false,
    loading: true,
    coords: null,
    accuracyMeters: null,
    accuracyGrade: 'COARSE_OVER_50M',
    altitude: null,
    speed: null,
    heading: null,
    lastUpdated: null,
    error: null,
    resolvedAddress: null,
    isCalibrating: false,
  });

  // Smooth scroll to top state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleWindowScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  const handleScrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSmoothScrollToSection = (sectionId: string) => {
    if (activeTab !== 'AVAILABILITY') {
      setActiveTab('AVAILABILITY');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Central Alerts Actions
  const handleAcknowledgeAlert = (id: string) => {
    setSystemAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleAcknowledgeAll = () => {
    setSystemAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
    alertSoundService.playSuccessChime();
  };

  const handleAlertActionTrigger = (alert: SystemAlert) => {
    setIsAlertsCenterOpen(false);
    if (alert.category === 'SHORTAGE') {
      runMILPOptimization();
      setActiveTab('SOLVER');
    } else if (alert.category === 'EXPIRY') {
      runMILPOptimization();
      setActiveTab('SOLVER');
    } else if (alert.category === 'COLD_CHAIN' || alert.category === 'SHIPMENT_DELAY') {
      setActiveTab('COLD_CHAIN');
    } else if (alert.category === 'ROAD_CLOSURE') {
      setActiveTab('MAP');
    } else if (alert.category === 'DIGITAL_TWIN') {
      setActiveTab('TWIN');
    }
  };

  const handleSimulateSurgeAlert = () => {
    const newAlert: SystemAlert = {
      id: `ALT-SURGE-${Date.now()}`,
      category: 'SHORTAGE',
      severity: 'CRITICAL_RED',
      title: 'Emergency Trauma Depletion Alert: 8 Units Needed',
      message: 'Surge casualty intake at Emergency Ward. Immediate O- and B+ transfusions requested by ICU Lead.',
      timestamp: 'Just now',
      actionLabel: 'Auto-Solve via MILP',
      acknowledged: false,
    };
    setSystemAlerts((prev) => [newAlert, ...prev]);
    alertSoundService.playCriticalAlertChime();
  };

  const handleAddRoadClosure = (closure: RoadClosureIncident) => {
    setRoadClosures((prev) => [closure, ...prev]);
    const newAlert: SystemAlert = {
      id: `ALT-RC-${Date.now()}`,
      category: 'ROAD_CLOSURE',
      severity: 'WARNING_AMBER',
      title: `Road Closure Injected: ${closure.corridorName}`,
      message: `${closure.reason.replace(/_/g, ' ')}. Expected transit penalty: +${closure.estimatedDelayMinutes} mins. Detour: ${closure.recommendedDetour}`,
      timestamp: 'Just now',
      actionLabel: 'View on Map',
      acknowledged: false,
    };
    setSystemAlerts((prev) => [newAlert, ...prev]);
  };

  const handleRemoveRoadClosure = (id: string) => {
    setRoadClosures((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSimulateTempExcursion = (dispatchId: string) => {
    setActiveDispatches((prev) =>
      prev.map((d) =>
        d.id === dispatchId
          ? {
              ...d,
              telemetry: {
                ...d.telemetry,
                temperatureCelsius: 7.8,
                tempStatus: 'EXCURSION',
              },
            }
          : d
      )
    );
    const newAlert: SystemAlert = {
      id: `ALT-EXCURSION-${Date.now()}`,
      category: 'COLD_CHAIN',
      severity: 'CRITICAL_RED',
      title: 'CRITICAL COLD CHAIN EXCURSION BREACH: 7.8°C',
      message: `Active convoy ${dispatchId} exceeded 6°C whole blood upper threshold! Emergency dry-ice recharge protocol advised.`,
      timestamp: 'Just now',
      dispatchId,
      actionLabel: 'Deploy Emergency Cooling',
      acknowledged: false,
    };
    setSystemAlerts((prev) => [newAlert, ...prev]);
    alertSoundService.playCriticalAlertChime();
  };

  const handleSimulateDelay = (dispatchId: string) => {
    setActiveDispatches((prev) =>
      prev.map((d) =>
        d.id === dispatchId
          ? {
              ...d,
              estimatedArrival: '+24 mins (DELAYED)',
              telemetry: {
                ...d.telemetry,
                speedKmh: 14,
              },
            }
          : d
      )
    );
    const newAlert: SystemAlert = {
      id: `ALT-DELAY-${Date.now()}`,
      category: 'SHIPMENT_DELAY',
      severity: 'WARNING_AMBER',
      title: 'Shipment Transit Congestion (+24 mins)',
      message: `Highway bottleneck detected for ${dispatchId}. Passive cold-box holdover safe for 3h 15m.`,
      timestamp: 'Just now',
      dispatchId,
      actionLabel: 'Request Green Police Escort',
      acknowledged: false,
    };
    setSystemAlerts((prev) => [newAlert, ...prev]);
    alertSoundService.playWarningChime();
  };

  const handleClearDelay = (dispatchId: string) => {
    setActiveDispatches((prev) =>
      prev.map((d) =>
        d.id === dispatchId
          ? {
              ...d,
              estimatedArrival: '+3 mins',
              telemetry: {
                ...d.telemetry,
                speedKmh: 65,
                temperatureCelsius: d.component === 'PLT' ? 22.0 : 3.5,
                tempStatus: 'NOMINAL',
              },
            }
          : d
      )
    );
    alertSoundService.playSuccessChime();
  };

  const handleRunDigitalTwinOptimization = (scenario: DigitalTwinScenario) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (scenario.affectedNodeIds.includes(n.id)) {
          return {
            ...n,
            status: 'MASS_CASUALTY_SURGE',
            demands: [
              ...n.demands,
              {
                bloodType: 'O-',
                component: 'PRBC',
                requiredUnits: Math.ceil(scenario.additionalDeficitUnits / scenario.affectedNodeIds.length),
                criticality: 'CODE_RED_TRAUMA',
                burnRatePerHour: 6.0,
              },
            ],
          };
        }
        return n;
      })
    );
    runMILPOptimization();
  };

  // Google Maps Grade High-Accuracy Calibration
  const handleCalibrateHighAccuracyGps = useCallback(async () => {
    setUserLocation((prev) => ({ ...prev, loading: true, isCalibrating: true }));
    try {
      const highAcc = await acquireHighAccuracyLocation();
      setUserLocation(highAcc);
      if (highAcc.coords) {
        setActiveCoords(highAcc.coords);
        const label = highAcc.resolvedAddress || `Live GPS (±${Math.round(highAcc.accuracyMeters || 4)}m)`;
        setActiveLocationLabel(label);
        const calibrated = generateFacilitiesAroundLocation(highAcc.coords.lat, highAcc.coords.lng);
        setNodes(calibrated.nodes);
        setNearbyDevices(calibrated.devices);
        setMapCenter(highAcc.coords);
        setMapZoom(14);
      }
    } catch (err: any) {
      setUserLocation((prev) => ({
        ...prev,
        loading: false,
        isCalibrating: false,
        error: err.message,
      }));
    }
  }, []);

  // Initial High-Accuracy GPS Lock & Continuous Watcher
  useEffect(() => {
    let watchId: number | null = null;

    // Trigger high-accuracy multi-burst lock on mount
    acquireHighAccuracyLocation()
      .then((loc) => {
        setUserLocation(loc);
      })
      .catch((err) => {
        // Fallback gracefully
        fetchIpFallbackLocation(err.message).then((fallback) => {
          setUserLocation(fallback);
        });
      });

    // Continuous GNSS watcher for real-time motion and heading updates
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, accuracy, altitude, altitudeAccuracy, speed, heading } = position.coords;
          const coords = { lat: latitude, lng: longitude };
          const grade = evaluateAccuracyGrade(accuracy);

          setUserLocation((prev) => ({
            ...prev,
            enabled: true,
            loading: false,
            coords,
            accuracyMeters: accuracy,
            accuracyGrade: grade,
            altitude,
            altitudeAccuracy,
            speed,
            heading,
            lastUpdated: new Date().toLocaleTimeString(),
            error: null,
          }));
        },
        (err) => {
          setUserLocation((prev) => ({
            ...prev,
            loading: false,
            error: err.message,
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    }

    return () => {
      if (watchId !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Handle User Typing / Entering Any Location (Address, City, Locality)
  const handleLocationResolved = (coords: { lat: number; lng: number }, label: string) => {
    setCurrentRegion('CUSTOM_ENTERED');
    setActiveCoords(coords);
    setActiveLocationLabel(label);
    setEmergencyRouteTarget(null);

    // Calibrate hospital network around this user-entered location
    const calibrated = generateFacilitiesAroundLocation(coords.lat, coords.lng);
    setNodes(calibrated.nodes);
    setNearbyDevices(calibrated.devices);
    setMapCenter(coords);
    setMapZoom(14);
  };

  // Handle Region Switching Preset
  const handleSwitchRegion = (regionKey: IndianRegionKey | 'MY_GPS') => {
    setCurrentRegion(regionKey);
    setEmergencyRouteTarget(null);

    if (regionKey === 'MY_GPS') {
      if (userLocation.coords) {
        setActiveCoords(userLocation.coords);
        const label = userLocation.resolvedAddress || `My Live GPS Location (±${Math.round(userLocation.accuracyMeters || 4)}m)`;
        setActiveLocationLabel(label);
        const calibrated = generateFacilitiesAroundLocation(
          userLocation.coords.lat,
          userLocation.coords.lng
        );
        setNodes(calibrated.nodes);
        setNearbyDevices(calibrated.devices);
        setMapCenter(userLocation.coords);
        setMapZoom(14);
      } else {
        handleCalibrateHighAccuracyGps();
      }
    } else {
      const preset = INDIAN_REGION_PRESETS[regionKey];
      setActiveCoords(preset.center);
      setActiveLocationLabel(preset.label);
      setNodes(preset.nodes);
      setNearbyDevices(preset.devices);
      setMapCenter(preset.center);
      setMapZoom(preset.zoom);
    }
  };

  // Predictive Inventory Forecaster State
  const [predictiveOptions, setPredictiveOptions] = useState<PredictiveSolverOptions>({
    enabled: true,
    eventId: 'DIWALI_FESTIVAL',
    horizonHours: 48,
    intensityScale: 1.0,
  });

  // Run MILP Optimizer
  const runMILPOptimization = useCallback(
    (customPredictive?: PredictiveSolverOptions) => {
      setIsSolving(true);
      setTimeout(() => {
        const activePred =
          customPredictive !== undefined ? customPredictive : predictiveOptions;
        const res = solveMILPBloodMesh(nodes, solverConfig, activePred);
        setOptimizationResult(res);
        setIsSolving(false);
      }, 120);
    },
    [nodes, solverConfig, predictiveOptions]
  );

  const handleApplyPredictiveRebalance = (
    eventId: PredictiveEventId,
    horizonHours: number,
    intensityScale: number
  ) => {
    const updatedOptions: PredictiveSolverOptions = {
      enabled: true,
      eventId,
      horizonHours,
      intensityScale,
    };
    setPredictiveOptions(updatedOptions);
    runMILPOptimization(updatedOptions);
  };

  // Re-run solve when nodes change
  useEffect(() => {
    runMILPOptimization();
  }, [nodes, runMILPOptimization]);

  // Subscribe to simulated WebSocket disaster telemetry
  useEffect(() => {
    const unsubscribe = telemetryEngine.subscribe((event) => {
      setTelemetryEvent(event);

      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.id === event.affectedHospitalId || prevNodes[0]?.id === n.id) {
            const newDemands = [...n.demands];
            for (const item of event.urgentUnitsNeeded) {
              const existingIdx = newDemands.findIndex(
                (d) => d.bloodType === item.bloodType && d.component === item.component
              );
              if (existingIdx >= 0) {
                newDemands[existingIdx] = {
                  ...newDemands[existingIdx],
                  requiredUnits: newDemands[existingIdx].requiredUnits + item.units,
                  criticality: 'CODE_RED_TRAUMA',
                };
              } else {
                newDemands.push({
                  bloodType: item.bloodType,
                  component: item.component,
                  requiredUnits: item.units,
                  criticality: 'CODE_RED_TRAUMA',
                  burnRatePerHour: 4.5,
                });
              }
            }
            return {
              ...n,
              status: 'MASS_CASUALTY_SURGE',
              demands: newDemands,
            };
          }
          return n;
        })
      );
    });

    return () => unsubscribe();
  }, []);

  // Trigger manual trauma surge scenario
  const handleTriggerScenario = (
    type: 'FREEWAY_MCI' | 'EXPLOSION_MCI' | 'OB_HEMORRHAGE' | 'PLATELET_EXPIRY_CRISIS'
  ) => {
    const event = telemetryEngine.triggerPresetScenario(type);
    setTelemetryEvent(event);
    setActiveScenarioTitle(event.headline);
    setTraumaPatients(getScenarioPatients(type));
    setActiveTab('VITALS');
    setTimeout(() => {
      runMILPOptimization();
    }, 250);
  };

  // Bedside Transfusion Release Action
  const handleTriggerBedsideRelease = (patientId: string) => {
    setTraumaPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'RESUSCITATING',
            bloodDemands: p.bloodDemands.map((d) => ({
              ...d,
              allocatedUnits: d.requiredUnits,
            })),
          };
        }
        return p;
      })
    );
  };

  // Dispatch Drone Directly to Patient Trauma Bay
  const handleDispatchDroneToPatient = (patientId: string) => {
    const droneDevice = nearbyDevices.find((d) => d.type === 'AERO_DRONE_POD') || nearbyDevices[0];
    if (droneDevice) {
      handleDispatchNearbyDevice(droneDevice);
    }
  };

  // Prioritize Patient in Regional MILP Solver
  const handlePrioritizePatientInMILP = (patient: TraumaPatient) => {
    setNodes((prevNodes) =>
      prevNodes.map((n) => {
        if (n.id === nodes[0].id) {
          const updatedDemands = [...n.demands];
          for (const d of patient.bloodDemands) {
            const idx = updatedDemands.findIndex(
              (x) => x.bloodType === d.bloodType && x.component === d.component
            );
            if (idx >= 0) {
              updatedDemands[idx].criticality = 'CODE_RED_TRAUMA';
              updatedDemands[idx].requiredUnits += d.requiredUnits;
            } else {
              updatedDemands.push({
                bloodType: d.bloodType,
                component: d.component,
                requiredUnits: d.requiredUnits,
                criticality: 'CODE_RED_TRAUMA',
                burnRatePerHour: 6.0,
              });
            }
          }
          return { ...n, status: 'MASS_CASUALTY_SURGE', demands: updatedDemands };
        }
        return n;
      })
    );
    setActiveTab('SOLVER');
    runMILPOptimization();
  };

  // Dispatch a courier vehicle based on an MILP transfer decision
  const handleDispatchTransfer = (transfer: TransferDecision) => {
    const fromNode = nodes.find((n) => n.id === transfer.fromNodeId);
    const toNode = nodes.find((n) => n.id === transfer.toNodeId);
    if (!fromNode || !toNode) return;

    const isPlatelet = transfer.component === 'PLT';
    const isCode3 = transfer.priority === 'EMERGENCY_CODE_3';
    const vehicleId = isCode3
      ? `108-EMS-Ambulance #${Math.floor(Math.random() * 80 + 10)}`
      : isPlatelet
      ? `ICMR Aero-Rescue Drone Delta-${Math.floor(Math.random() * 50 + 10)}`
      : `Cold-Transit Van #${Math.floor(Math.random() * 90 + 10)}`;

    const newDispatch: ActiveDispatch = {
      id: `DSP-${Date.now().toString(36).toUpperCase()}`,
      transferId: transfer.id,
      fromNode,
      toNode,
      component: transfer.component,
      bloodType: transfer.bloodType,
      units: transfer.units,
      vehicleId,
      vehicleType: isCode3
        ? 'EV_MED_AMBULANCE'
        : isPlatelet
        ? 'DRONE_AERO_RESCUE'
        : 'TEMP_CONTROLLED_VAN',
      dispatchedAt: new Date().toLocaleTimeString(),
      estimatedArrival: `+${transfer.travelMinutes} mins`,
      progressPercent: 5,
      currentCoordinates: {
        lat: fromNode.coordinates.lat,
        lng: fromNode.coordinates.lng,
      },
      telemetry: {
        temperatureCelsius: isPlatelet ? 21.8 : 3.6,
        tempStatus: 'NOMINAL',
        batteryOrFuelPercent: 94,
        speedKmh: isCode3 ? 65 : 45,
        bearingDegrees: 45,
      },
      manifestNumber: `MNF-IN-${transfer.id.replace('TX-', '')}`,
      status: 'IN_TRANSIT',
    };

    setActiveDispatches((prev) => [newDispatch, ...prev.slice(0, 9)]);
    setActiveTab('TRACKER');
  };

  // Dispatch an immediate nearby device to user's location
  const handleDispatchNearbyDevice = (device: NearbyDevice) => {
    const destinationNode = selectedNode || nodes[0];
    const isPlatelet = device.onboardUnits.some((u) => u.component === 'PLT');

    const newDispatch: ActiveDispatch = {
      id: `DSP-DEV-${Date.now().toString(36).toUpperCase()}`,
      transferId: `DEV-${device.id}`,
      fromNode: {
        ...destinationNode,
        id: device.id,
        name: device.name,
        shortName: device.name.split(' ')[0],
        coordinates: device.coordinates,
      },
      toNode: destinationNode,
      component: isPlatelet ? 'PLT' : 'PRBC',
      bloodType: 'O-',
      units: 4,
      vehicleId: device.name,
      vehicleType:
        device.type === 'AERO_DRONE_POD'
          ? 'DRONE_AERO_RESCUE'
          : device.type === 'EMERGENCY_AMBULANCE_AMB'
          ? 'EV_MED_AMBULANCE'
          : 'TEMP_CONTROLLED_VAN',
      dispatchedAt: new Date().toLocaleTimeString(),
      estimatedArrival: `+${device.etaMinutes} mins`,
      progressPercent: 10,
      currentCoordinates: device.coordinates,
      telemetry: {
        temperatureCelsius: device.coldStorageTempCelsius,
        tempStatus: 'NOMINAL',
        batteryOrFuelPercent: device.batteryOrFuelPercent,
        speedKmh: 55,
        bearingDegrees: 90,
      },
      manifestNumber: `STAT-EMS-${Date.now().toString().slice(-4)}`,
      status: 'IN_TRANSIT',
    };

    setActiveDispatches((prev) => [newDispatch, ...prev.slice(0, 9)]);
    setActiveTab('TRACKER');
  };

  // Real-time Path Traversal Simulation: Moves couriers until marked DELIVERED
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDispatches((prev) =>
        prev.map((d) => {
          if (d.status === 'COMPLETED' || d.progressPercent >= 100) {
            return {
              ...d,
              progressPercent: 100,
              status: 'COMPLETED',
              currentCoordinates: d.toNode.coordinates,
            };
          }

          const nextProgress = Math.min(100, d.progressPercent + 6);
          const ratio = nextProgress / 100;

          const lat =
            d.fromNode.coordinates.lat +
            (d.toNode.coordinates.lat - d.fromNode.coordinates.lat) * ratio;
          const lng =
            d.fromNode.coordinates.lng +
            (d.toNode.coordinates.lng - d.fromNode.coordinates.lng) * ratio;

          const tempBase = d.component === 'PLT' ? 22.0 : 3.5;
          const tempWobble = (Math.random() - 0.5) * 0.2;

          return {
            ...d,
            progressPercent: nextProgress,
            currentCoordinates: { lat, lng },
            status: (nextProgress >= 100 ? 'COMPLETED' : 'IN_TRANSIT') as
              | 'COMPLETED'
              | 'IN_TRANSIT',
            telemetry: {
              ...d.telemetry,
              temperatureCelsius: Number((tempBase + tempWobble).toFixed(1)),
            },
          };
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Center on user GPS coordinates (Google Maps Grade)
  const handleCenterUserLocation = () => {
    if (userLocation.coords) {
      setActiveCoords(userLocation.coords);
      const label = userLocation.resolvedAddress || `My Live GPS Location (±${Math.round(userLocation.accuracyMeters || 4)}m)`;
      setActiveLocationLabel(label);
      setMapCenter(userLocation.coords);
      setMapZoom(15);
    } else {
      handleCalibrateHighAccuracyGps();
    }
  };

  // Focus courier on map from tracker list
  const handleFocusDispatchOnMap = (dispatch: ActiveDispatch) => {
    setMapCenter(dispatch.currentCoordinates);
    setMapZoom(15);
  };

  // Open Manifest modal from active dispatch
  const handleOpenManifestByDispatch = (dispatch: ActiveDispatch) => {
    const syntheticTransfer: TransferDecision = {
      id: dispatch.transferId,
      fromNodeId: dispatch.fromNode.id,
      toNodeId: dispatch.toNode.id,
      fromNodeName: dispatch.fromNode.name,
      toNodeName: dispatch.toNode.name,
      bloodType: dispatch.bloodType,
      component: dispatch.component,
      units: dispatch.units,
      daysToExpiry: 3,
      lotNumber: `IN-${dispatch.manifestNumber}`,
      travelMinutes: 15,
      distanceKm: 8.5,
      priority: 'EMERGENCY_CODE_3',
      spoilageRiskMitigated: true,
      stockoutAddressed: true,
      costBreakdown: { transitCost: 120, salvageBenefit: 2800, stockoutMitigationScore: 95 },
    };
    setManifestModalTransfer(syntheticTransfer);
  };

  // Select nearest blood bank from SOS dialog or rapid bar
  const handleSelectNearestBloodBank = (node: FacilityNode) => {
    setSelectedNode(node);
    setEmergencyRouteTarget(node);
    setMapCenter(node.coordinates);
    setMapZoom(14);
  };

  // Focus specific node on map
  const handleFocusNode = (node: FacilityNode) => {
    setSelectedNode(node);
    setEmergencyRouteTarget(node);
    setMapCenter(node.coordinates);
    setMapZoom(14);
  };

  // Request transfer targeting a facility
  const handleRequestTransferToNode = (node: FacilityNode) => {
    setSelectedNode(node);
    setEmergencyRouteTarget(node);
    setActiveTab('SOLVER');
    runMILPOptimization();
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Tier 2 Quota Defense Sticky Banner (Mandatory for Demo Key as specified in Google Maps skill) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Mission-Critical Operations Top Navigation Bar matching user screenshot */}
      <header className="h-14 bg-[#070b16] border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between shrink-0 z-40">
        {/* Brand Logo Box */}
        <div className="flex items-center gap-3">
          <div className="border border-white/20 bg-slate-900/90 px-3 py-1.5 rounded-lg text-white font-black text-xs sm:text-sm tracking-wide shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff0055] animate-pulse" />
            <span className="text-white font-extrabold tracking-tight">HEMOPULSE · e-RaktKosh India</span>
          </div>
        </div>

        {/* Center Primary Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('AVAILABILITY')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeTab === 'AVAILABILITY'
                ? 'text-white font-extrabold border-b-2 border-[#ff0055]'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            Availability
          </button>
          <button
            onClick={() => setActiveTab('MAP')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeTab === 'MAP'
                ? 'text-white font-extrabold border-b-2 border-[#ff0055]'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            Mesh Map
          </button>
          <button
            onClick={() => setActiveTab('SOLVER')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeTab === 'SOLVER'
                ? 'text-white font-extrabold border-b-2 border-[#ff0055]'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            MILP Solver
          </button>
          <button
            onClick={() => setActiveTab('TWIN')}
            className={`transition-all pb-1 whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'TWIN'
                ? 'text-purple-300 font-extrabold border-b-2 border-purple-500'
                : 'text-purple-300/80 hover:text-white font-medium'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>Digital Twin</span>
          </button>
          <button
            onClick={() => setActiveTab('COLD_CHAIN')}
            className={`transition-all pb-1 whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'COLD_CHAIN'
                ? 'text-cyan-300 font-extrabold border-b-2 border-cyan-400'
                : 'text-cyan-300/80 hover:text-white font-medium'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cold Chain &amp; Journey</span>
          </button>
          <button
            onClick={() => setActiveTab('TELEMETRY')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeTab === 'TELEMETRY'
                ? 'text-white font-extrabold border-b-2 border-[#ff0055]'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab('TRACKER')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeTab === 'TRACKER'
                ? 'text-white font-extrabold border-b-2 border-[#ff0055]'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            Manifests
          </button>
          <button
            onClick={() => setActiveTab('VITALS')}
            className={`transition-all pb-1 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'VITALS'
                ? 'text-white font-extrabold border-b-2 border-[#ff0055]'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            <span>Vitals</span>
            <span className="text-[9px] bg-rose-950 text-rose-300 font-mono font-extrabold px-1.5 py-0.2 rounded-full border border-rose-800">
              {traumaPatients.filter((p) => p.triageTag === 'RED_STAT').length}
            </span>
          </button>
        </nav>

        {/* Right Sector & Action Tools */}
        <div className="flex items-center gap-2">
          {/* Central Alerts Hub Button */}
          <button
            onClick={() => setIsAlertsCenterOpen(true)}
            className="relative flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-700 font-bold transition shadow cursor-pointer active:scale-95"
            title="Open Central Alerts & Notifications Hub"
          >
            <Bell className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Alerts</span>
            {systemAlerts.filter((a) => !a.acknowledged).length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black bg-rose-600 text-white animate-pulse">
                {systemAlerts.filter((a) => !a.acknowledged).length}
              </span>
            )}
          </button>

          {/* All-India Corridor Selector Dropdown */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#091122] px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={currentRegion}
              onChange={(e) => handleSwitchRegion(e.target.value as IndianRegionKey | 'MY_GPS')}
              className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
              aria-label="Select Indian Healthcare Corridor"
            >
              <option value="ALL_INDIA" className="bg-slate-900 text-cyan-300">🇮🇳 Pan-India Overview</option>
              <option value="DELHI_NCR" className="bg-slate-900 text-white">Delhi NCR (AIIMS Apex)</option>
              <option value="MUMBAI" className="bg-slate-900 text-white">Mumbai (KEM Hub)</option>
              <option value="PUNE" className="bg-slate-900 text-white">Pune (Ruby Hall)</option>
              <option value="BENGALURU" className="bg-slate-900 text-white">Bengaluru (Victoria / NIMHANS)</option>
              <option value="HYDERABAD" className="bg-slate-900 text-white">Hyderabad (NIMS / Osmania)</option>
              <option value="CHENNAI" className="bg-slate-900 text-white">Chennai (Rajiv Gandhi GH)</option>
              <option value="KOLKATA" className="bg-slate-900 text-white">Kolkata (SSKM / IPGMER)</option>
              <option value="AHMEDABAD" className="bg-slate-900 text-white">Ahmedabad (Civil Asarwa)</option>
              <option value="LUCKNOW" className="bg-slate-900 text-white">Lucknow (KGMU / SGPGIMS)</option>
              <option value="JAIPUR" className="bg-slate-900 text-white">Jaipur (SMS Hospital)</option>
              <option value="MY_GPS" className="bg-slate-900 text-cyan-400">🎯 My Live GPS (India)</option>
            </select>
          </div>

          {/* AI Copilot Button */}
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-700 via-indigo-600 to-rose-600 hover:from-purple-600 hover:to-rose-500 text-white px-3 py-1.5 rounded-xl font-extrabold shadow-lg shadow-purple-950/60 transition border border-purple-400/40 active:scale-95 animate-pulse"
            title="Open e-RaktKosh AI Copilot"
          >
            <Bot className="w-3.5 h-3.5 text-purple-200" />
            <span className="hidden sm:inline">AI Copilot</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </button>

          {/* Glowing STAT SOS Button */}
          <button
            onClick={() => setIsEmergencySOSOpen(true)}
            className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white px-3 py-1.5 rounded-xl font-extrabold shadow-lg shadow-rose-900/40 transition ring-2 ring-rose-400/50 animate-pulse"
          >
            <AlertOctagon className="w-4 h-4" />
            <span className="hidden sm:inline">SOS Request</span>
            <span className="sm:hidden">SOS</span>
          </button>

          {/* Bilingual Language Switcher */}
          <button
            onClick={() => setLanguageMode((prev) => (prev === 'EN' ? 'HI' : 'EN'))}
            className="flex items-center gap-1 text-xs bg-[#0b1428] hover:bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-700 font-bold transition shadow"
            title="Toggle Hindi / English Emergency Guidance"
          >
            <span className="text-sm">{languageMode === 'EN' ? '🇮🇳' : '🇬🇧'}</span>
            <span className="font-mono text-[11px]">{languageMode === 'EN' ? 'हिंदी' : 'ENG'}</span>
          </button>

          {/* Compatibility Protocol button */}
          <button
            onClick={() => setIsCompatibilityOpen(true)}
            className="hidden md:flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 font-semibold transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Protocols</span>
          </button>
        </div>
      </header>

      {/* Mobile Nav Tabs Bar */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto bg-[#070b16] px-3 py-1.5 border-b border-slate-800 text-xs shrink-0">
        <button
          onClick={() => setActiveTab('AVAILABILITY')}
          className={`px-2.5 py-1 rounded font-bold whitespace-nowrap transition ${
            activeTab === 'AVAILABILITY' ? 'bg-[#ff0055] text-white' : 'text-slate-400'
          }`}
        >
          Check Availability
        </button>
        <button
          onClick={() => setActiveTab('MAP')}
          className={`px-2.5 py-1 rounded font-bold whitespace-nowrap transition ${
            activeTab === 'MAP' ? 'bg-[#ff0055] text-white' : 'text-slate-400'
          }`}
        >
          Mesh Map
        </button>
        <button
          onClick={() => setActiveTab('SOLVER')}
          className={`px-2.5 py-1 rounded font-bold whitespace-nowrap transition ${
            activeTab === 'SOLVER' ? 'bg-[#ff0055] text-white' : 'text-slate-400'
          }`}
        >
          MILP Solver
        </button>
        <button
          onClick={() => setActiveTab('TWIN')}
          className={`px-2.5 py-1 rounded font-bold whitespace-nowrap transition ${
            activeTab === 'TWIN' ? 'bg-purple-600 text-white' : 'text-purple-300'
          }`}
        >
          Digital Twin
        </button>
        <button
          onClick={() => setActiveTab('COLD_CHAIN')}
          className={`px-2.5 py-1 rounded font-bold whitespace-nowrap transition ${
            activeTab === 'COLD_CHAIN' ? 'bg-cyan-600 text-white' : 'text-cyan-300'
          }`}
        >
          Cold Chain &amp; Journey
        </button>
        <button
          onClick={() => setActiveTab('TELEMETRY')}
          className={`px-2.5 py-1 rounded font-bold whitespace-nowrap transition ${
            activeTab === 'TELEMETRY' ? 'bg-[#ff0055] text-white' : 'text-slate-400'
          }`}
        >
          Telemetry
        </button>
        <button
          onClick={() => setActiveTab('TRACKER')}
          className={`px-2.5 py-1 rounded font-bold whitespace-nowrap transition ${
            activeTab === 'TRACKER' ? 'bg-[#ff0055] text-white' : 'text-slate-400'
          }`}
        >
          Manifests
        </button>
        <button
          onClick={() => setActiveTab('VITALS')}
          className={`px-2.5 py-1 rounded font-bold whitespace-nowrap transition ${
            activeTab === 'VITALS' ? 'bg-[#ff0055] text-white' : 'text-slate-400'
          }`}
        >
          Vitals
        </button>
      </div>

      {/* MAIN VIEW CONTENT CONTAINER (Smooth Scrollable) */}
      <div className="flex-1 relative flex flex-col bg-[#060b17] overflow-hidden">
        {/* VIEW 1: CHECK BLOOD AVAILABILITY (Hero console + Full smooth scroll dashboard) */}
        {activeTab === 'AVAILABILITY' && (
          <div
            ref={scrollContainerRef}
            onScroll={(e) => setShowScrollTop(e.currentTarget.scrollTop > 200)}
            className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 space-y-6 scroll-smooth"
          >
            <div className="max-w-7xl mx-auto space-y-6">
              {/* 1. NATIONAL BLOOD TRANSFUSION COUNCIL (NBTC) DASHBOARD (On top of front) */}
              <div id="nbtc-top-dashboard" className="scroll-mt-2">
                <NationalBloodTransfusionCouncilDashboard
                  nodes={nodes}
                  telemetryEvent={telemetryEvent}
                  userLocation={userLocation}
                  activeRegion={currentRegion}
                  onSwitchRegion={handleSwitchRegion}
                  onOpenSOSModal={() => setIsEmergencySOSOpen(true)}
                  onOpenCompatibilityModal={() => setIsCompatibilityOpen(true)}
                  onOpenDonorBeacon={() => handleOpenDonorBeacon('O-', 4)}
                  onOpenChatbot={() => setIsChatbotOpen(true)}
                  onCalibrateGps={handleCalibrateHighAccuracyGps}
                  onScrollToSection={handleSmoothScrollToSection}
                />
              </div>

              {/* KPI METRIC CARDS & NBTC GOVERNMENT BANNER STRIP */}
              <HemopulseHeaderStrip
                telemetryEvent={telemetryEvent}
                totalDeficitNeeded={514}
                criticalStockoutsCount={6}
                resolutionPercent={100}
                unitsRescued={151}
                meanTravelMinutes={12}
                totalCasualties={81}
                onOpenSOSModal={() => setIsEmergencySOSOpen(true)}
              />

              {/* 13-FEATURE ENTERPRISE MISSION CONTROL BAR */}
              <div className="bg-[#0b1428] border border-slate-800 rounded-2xl p-3 shadow-2xl">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055] animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      13 Enterprise Transfusion Modules · Zero-Latency Command Hub
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold hidden sm:inline">
                    ALL SYSTEMS VERIFIED &amp; ONLINE
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                  {[
                    {
                      label: 'Shortage Alert',
                      icon: '🚨',
                      onClick: () => handleSmoothScrollToSection('sentinel-alerts'),
                      badge: 'CRITICAL',
                      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
                    },
                    {
                      label: 'Expiry Alert',
                      icon: '⏳',
                      onClick: () => handleSmoothScrollToSection('sentinel-alerts'),
                      badge: 'SALVAGE',
                      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
                    },
                    {
                      label: 'Transfer Recs',
                      icon: '🔄',
                      onClick: () => {
                        runMILPOptimization();
                        setActiveTab('SOLVER');
                      },
                      badge: 'MILP',
                      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
                    },
                    {
                      label: 'Emergency Route',
                      icon: '🛣️',
                      onClick: () => handleSmoothScrollToSection('grid-map'),
                      badge: 'MAPS',
                      badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
                    },
                    {
                      label: 'Network Grid',
                      icon: '🇮🇳',
                      onClick: () => handleScrollToTop(),
                      badge: 'NBTC',
                      badgeColor: 'bg-orange-950 text-orange-300 border-orange-800',
                    },
                    {
                      label: 'Predictive Demand AI',
                      icon: '🧠',
                      onClick: () => handleSmoothScrollToSection('predictive-forecaster'),
                      badge: 'GEMINI',
                      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
                    },
                    {
                      label: 'Cold Chain Guardian',
                      icon: '❄️',
                      onClick: () => setActiveTab('COLD_CHAIN'),
                      badge: '2-6°C',
                      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
                    },
                    {
                      label: 'Live Journey Tracker',
                      icon: '🛰️',
                      onClick: () => setActiveTab('COLD_CHAIN'),
                      badge: 'GPS LIVE',
                      badgeColor: 'bg-sky-950 text-sky-300 border-sky-800',
                    },
                    {
                      label: 'Alerts & Hub',
                      icon: '🔔',
                      onClick: () => setIsAlertsCenterOpen(true),
                      badge: `${systemAlerts.filter((a) => !a.acknowledged).length}`,
                      badgeColor: 'bg-rose-600 text-white border-rose-500',
                    },
                    {
                      label: 'AI + MILP Forecasting',
                      icon: '⚡',
                      onClick: () => handleSmoothScrollToSection('predictive-forecaster'),
                      badge: 'OPTIMAL',
                      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
                    },
                    {
                      label: 'Digital Twin Sandbox',
                      icon: '🌐',
                      onClick: () => setActiveTab('TWIN'),
                      badge: 'WHAT-IF',
                      badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
                    },
                    {
                      label: 'Road Closures',
                      icon: '🚧',
                      onClick: () => {
                        setActiveTab('TWIN');
                      },
                      badge: `${roadClosures.length}`,
                      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
                    },
                    {
                      label: 'Shipment Delay',
                      icon: '⏱️',
                      onClick: () => setActiveTab('COLD_CHAIN'),
                      badge: 'LATENCY',
                      badgeColor: 'bg-yellow-950 text-yellow-300 border-yellow-800',
                    },
                  ].map((feat, idx) => (
                    <button
                      key={idx}
                      onClick={feat.onClick}
                      className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/60 text-slate-200 hover:text-white transition whitespace-nowrap flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer shadow-sm active:scale-95"
                    >
                      <span className="text-sm">{feat.icon}</span>
                      <span>{feat.label}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${feat.badgeColor}`}
                      >
                        {feat.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION: SHORTAGE & EXPIRY SENTINEL */}
              <div id="sentinel-alerts" className="scroll-mt-4">
                <ShortageAndExpirySentinel
                  nodes={nodes}
                  onTriggerMILPSolve={() => {
                    runMILPOptimization();
                    setActiveTab('SOLVER');
                  }}
                  onOpenDonorBeacon={(group, units) => handleOpenDonorBeacon(group, units)}
                  onSelectNode={(node) => {
                    setSelectedNode(node);
                    setEmergencyRouteTarget(node);
                    setMapCenter(node.coordinates);
                  }}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                />
              </div>

              {/* Section A: Ask: Is Required Blood Available? Console + Live Map Preview */}
              <div id="availability-console" className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start scroll-mt-4">
                {/* Left Column: Ask: Is Required Blood Available? Console */}
                <div className="xl:col-span-8">
                  <HemopulseAvailabilityConsole
                    nodes={nodes}
                    devices={nearbyDevices}
                    userLocation={userLocation}
                    activeCoords={activeCoords}
                    activeLocationLabel={activeLocationLabel}
                    onLocationResolved={handleLocationResolved}
                    onUseLiveGps={() => handleSwitchRegion('MY_GPS')}
                    onSelectNearestBank={handleSelectNearestBloodBank}
                    onDispatchNearbyDevice={handleDispatchNearbyDevice}
                    onTriggerSOSBroadcast={() => handleTriggerScenario('FREEWAY_MCI')}
                    onSwitchToMap={() => handleSmoothScrollToSection('grid-map')}
                    onOpenDonorBeacon={handleOpenDonorBeacon}
                    onOpenGreenCorridorPass={handleOpenGreenCorridorForHospital}
                    lang={languageMode}
                  />
                </div>

                {/* Right Column: Embedded Live Map Preview */}
                <div className="xl:col-span-4 bg-[#0b1328] border border-slate-800 rounded-2xl p-3 shadow-2xl flex flex-col h-[580px]">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-wider text-white">
                        Live Grid Map Preview
                      </span>
                    </div>
                    <button
                      onClick={() => handleSmoothScrollToSection('grid-map')}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold bg-[#070e1c] border border-cyan-500/40 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      Full Interactive Map ↓
                    </button>
                  </div>

                  <div className="flex-1 rounded-xl overflow-hidden relative border border-slate-800/80">
                    <MapContainer
                      apiKey={GOOGLE_MAPS_API_KEY}
                      nodes={nodes}
                      selectedNode={selectedNode}
                      onSelectNode={setSelectedNode}
                      activeDispatches={activeDispatches}
                      nearbyDevices={nearbyDevices}
                      userLocation={userLocation}
                      onCenterUserLocation={handleCenterUserLocation}
                      recentTransfers={optimizationResult?.transfers || []}
                      mapCenter={mapCenter}
                      mapZoom={mapZoom}
                      emergencyRouteTarget={emergencyRouteTarget}
                      onSwitchRegion={handleSwitchRegion}
                      currentRegion={currentRegion}
                      onResolveCustomLocation={handleLocationResolved}
                    />
                  </div>
                </div>
              </div>

              {/* Section B: Interactive Regional Mesh Map & Proximity Finder */}
              <div id="grid-map" className="bg-[#080e1e] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl scroll-mt-4">
                <div className="bg-[#0d1629] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white">
                      All-India Regional Mesh Map &amp; Proximity Finder
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400">
                    GPS Accuracy: ±{Math.round(userLocation.accuracyMeters || 4)}m (Satellite Fixed)
                  </span>
                </div>
                <div className="flex flex-col lg:flex-row h-[580px]">
                  <div className="flex-1 h-full relative">
                    <MapContainer
                      apiKey={GOOGLE_MAPS_API_KEY}
                      nodes={nodes}
                      selectedNode={selectedNode}
                      onSelectNode={setSelectedNode}
                      activeDispatches={activeDispatches}
                      nearbyDevices={nearbyDevices}
                      userLocation={userLocation}
                      onCenterUserLocation={handleCenterUserLocation}
                      recentTransfers={optimizationResult?.transfers || []}
                      mapCenter={mapCenter}
                      mapZoom={mapZoom}
                      emergencyRouteTarget={emergencyRouteTarget}
                      onSwitchRegion={handleSwitchRegion}
                      currentRegion={currentRegion}
                      onResolveCustomLocation={handleLocationResolved}
                    />
                  </div>
                  <div className="w-full lg:w-[380px] xl:w-[430px] h-full shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800 overflow-y-auto">
                    <NearbyBloodBankFinder
                      nodes={nodes}
                      userLocation={userLocation}
                      onSelectNode={setSelectedNode}
                      onFocusNodeOnMap={handleFocusNode}
                      onRequestTransferToNode={handleRequestTransferToNode}
                    />
                  </div>
                </div>
              </div>

              {/* Section C: Predictive Inventory Forecaster (Indian Festival & Seasonal Surges) */}
              <div id="predictive-forecaster" className="scroll-mt-4">
                <PredictiveInventoryForecaster
                  nodes={nodes}
                  activeEventId={predictiveOptions.eventId || 'DIWALI_FESTIVAL'}
                  onApplyRebalancing={handleApplyPredictiveRebalance}
                  isSolving={isSolving}
                />
              </div>

              {/* Section D: Live Active Vehicle Dispatches & Cold Chain Telemetry */}
              <div id="active-dispatches" className="bg-[#080e1e] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4 scroll-mt-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white">
                      Live Cold-Chain Vehicle Fleet &amp; Inter-Hospital Transits
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    {activeDispatches.length} Units in Motion
                  </span>
                </div>
                <LiveDispatchTracker
                  dispatches={activeDispatches}
                  onFocusDispatch={handleFocusDispatchOnMap}
                  onOpenManifestByDispatch={handleOpenManifestByDispatch}
                  onOpenGreenCorridorPass={handleOpenGreenCorridorForDispatch}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: REGIONAL MESH MAP (Interactive Google Maps with Radar) */}
        {activeTab === 'MAP' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            <div className="flex-1 h-full relative">
              <MapContainer
                apiKey={GOOGLE_MAPS_API_KEY}
                nodes={nodes}
                selectedNode={selectedNode}
                onSelectNode={setSelectedNode}
                activeDispatches={activeDispatches}
                nearbyDevices={nearbyDevices}
                userLocation={userLocation}
                onCenterUserLocation={handleCenterUserLocation}
                recentTransfers={optimizationResult?.transfers || []}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
                emergencyRouteTarget={emergencyRouteTarget}
                onSwitchRegion={handleSwitchRegion}
                currentRegion={currentRegion}
                onResolveCustomLocation={handleLocationResolved}
              />
            </div>

            <div className="w-full lg:w-[420px] xl:w-[460px] h-full shrink-0 z-20 border-l border-slate-800">
              <NearbyBloodBankFinder
                nodes={nodes}
                userLocation={userLocation}
                onSelectNode={setSelectedNode}
                onFocusNodeOnMap={handleFocusNode}
                onRequestTransferToNode={handleRequestTransferToNode}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: MILP OPTIMIZER */}
        {activeTab === 'SOLVER' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            <div className="w-full lg:w-[420px] xl:w-[460px] h-full shrink-0 z-20">
              <MILPAnalyticsPanel
                optimizationResult={optimizationResult}
                solverConfig={solverConfig}
                onUpdateConfig={setSolverConfig}
                onRunOptimization={runMILPOptimization}
                onApplyPredictiveRebalance={handleApplyPredictiveRebalance}
                isSolving={isSolving}
                onOpenManifest={(tx) => setManifestModalTransfer(tx)}
                onDispatchTransfer={handleDispatchTransfer}
                nodes={nodes}
              />
            </div>

            <div className="flex-1 h-full relative">
              <MapContainer
                apiKey={GOOGLE_MAPS_API_KEY}
                nodes={nodes}
                selectedNode={selectedNode}
                onSelectNode={setSelectedNode}
                activeDispatches={activeDispatches}
                nearbyDevices={nearbyDevices}
                userLocation={userLocation}
                onCenterUserLocation={handleCenterUserLocation}
                recentTransfers={optimizationResult?.transfers || []}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
                emergencyRouteTarget={emergencyRouteTarget}
                onSwitchRegion={handleSwitchRegion}
                currentRegion={currentRegion}
                onResolveCustomLocation={handleLocationResolved}
                roadClosures={roadClosures}
              />
            </div>
          </div>
        )}

        {/* VIEW: EMERGENCY DIGITAL TWIN SANDBOX (Catastrophe Stress-Testing & Resilience) */}
        {activeTab === 'TWIN' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-3 sm:p-5">
            <div className="max-w-7xl mx-auto w-full">
              <EmergencyDigitalTwinSandbox
                nodes={nodes}
                roadClosures={roadClosures}
                onAddRoadClosure={handleAddRoadClosure}
                onRemoveRoadClosure={handleRemoveRoadClosure}
                onRunDigitalTwinOptimization={handleRunDigitalTwinOptimization}
                onApplyScenarioToLive={handleTriggerScenario as any}
                optimizationResult={optimizationResult}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            </div>
          </div>
        )}

        {/* VIEW: COLD CHAIN GUARDIAN & LIVE BLOOD JOURNEY TRACKER */}
        {activeTab === 'COLD_CHAIN' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-3 sm:p-5">
            <div className="max-w-7xl mx-auto w-full h-full min-h-[640px]">
              <ColdChainAndJourneyGuardian
                dispatches={activeDispatches}
                roadClosures={roadClosures}
                onFocusDispatch={handleFocusDispatchOnMap}
                onOpenManifest={handleOpenManifestByDispatch}
                onOpenGreenCorridorPass={handleOpenGreenCorridorForDispatch}
                onSimulateTempExcursion={handleSimulateTempExcursion}
                onSimulateDelay={handleSimulateDelay}
                onClearDelay={handleClearDelay}
                onRequestDroneDivert={handleOpenGreenCorridorForDispatch}
              />
            </div>
          </div>
        )}

        {/* VIEW 4: DISASTER TELEMETRY */}
        {activeTab === 'TELEMETRY' && (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div className="p-3 bg-[#0b1328] border-b border-slate-800">
              <DisasterTelemetryBar
                currentEvent={telemetryEvent}
                isConnected={isTelemetryConnected}
                onToggleConnection={() => {
                  const status = telemetryEngine.toggleConnection();
                  setIsTelemetryConnected(status);
                }}
                onTriggerScenario={handleTriggerScenario}
              />
            </div>
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
              <div className="flex-1 h-full relative">
                <MapContainer
                  apiKey={GOOGLE_MAPS_API_KEY}
                  nodes={nodes}
                  selectedNode={selectedNode}
                  onSelectNode={setSelectedNode}
                  activeDispatches={activeDispatches}
                  nearbyDevices={nearbyDevices}
                  userLocation={userLocation}
                  onCenterUserLocation={handleCenterUserLocation}
                  recentTransfers={optimizationResult?.transfers || []}
                  mapCenter={mapCenter}
                  mapZoom={mapZoom}
                  emergencyRouteTarget={emergencyRouteTarget}
                />
              </div>
              <div className="w-full lg:w-[420px] h-full shrink-0 z-20 border-l border-slate-800">
                <TraumaPatientVitalsDashboard
                  patients={traumaPatients}
                  onTriggerBedsideRelease={handleTriggerBedsideRelease}
                  onDispatchDroneToPatient={handleDispatchDroneToPatient}
                  onPrioritizePatientInMILP={handlePrioritizePatientInMILP}
                  activeScenarioName={activeScenarioTitle}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: TRANSFER MANIFESTS & LIVE TRACKING */}
        {activeTab === 'TRACKER' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            <div className="flex-1 h-full relative">
              <MapContainer
                apiKey={GOOGLE_MAPS_API_KEY}
                nodes={nodes}
                selectedNode={selectedNode}
                onSelectNode={setSelectedNode}
                activeDispatches={activeDispatches}
                nearbyDevices={nearbyDevices}
                userLocation={userLocation}
                onCenterUserLocation={handleCenterUserLocation}
                recentTransfers={optimizationResult?.transfers || []}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
                emergencyRouteTarget={emergencyRouteTarget}
              />
            </div>
            <div className="w-full lg:w-[420px] xl:w-[460px] h-full shrink-0 z-20 border-l border-slate-800">
              <LiveDispatchTracker
                dispatches={activeDispatches}
                onFocusDispatch={handleFocusDispatchOnMap}
                onOpenManifestByDispatch={handleOpenManifestByDispatch}
                onOpenGreenCorridorPass={handleOpenGreenCorridorForDispatch}
              />
            </div>
          </div>
        )}

        {/* VIEW 6: PATIENT VITALS & MTP CONSOLE */}
        {activeTab === 'VITALS' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            <div className="flex-1 h-full overflow-y-auto">
              <TraumaPatientVitalsDashboard
                patients={traumaPatients}
                onTriggerBedsideRelease={handleTriggerBedsideRelease}
                onDispatchDroneToPatient={handleDispatchDroneToPatient}
                onPrioritizePatientInMILP={handlePrioritizePatientInMILP}
                activeScenarioName={activeScenarioTitle}
              />
            </div>
            <div className="w-full lg:w-[400px] xl:w-[450px] h-full shrink-0 z-20 border-l border-slate-800">
              <MapContainer
                apiKey={GOOGLE_MAPS_API_KEY}
                nodes={nodes}
                selectedNode={selectedNode}
                onSelectNode={setSelectedNode}
                activeDispatches={activeDispatches}
                nearbyDevices={nearbyDevices}
                userLocation={userLocation}
                onCenterUserLocation={handleCenterUserLocation}
                recentTransfers={optimizationResult?.transfers || []}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
                emergencyRouteTarget={emergencyRouteTarget}
                onSwitchRegion={handleSwitchRegion}
                currentRegion={currentRegion}
                onResolveCustomLocation={handleLocationResolved}
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Smooth Scroll-To-Top Button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          title="Smooth scroll to top (NBTC National Dashboard)"
          className="fixed bottom-20 right-5 z-40 bg-slate-900/95 hover:bg-slate-800 text-cyan-400 p-3 rounded-2xl border border-cyan-500/50 shadow-2xl transition-all duration-200 active:scale-90 hover:scale-110 flex items-center justify-center cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 text-cyan-400" />
        </button>
      )}

      {/* Floating Quick AI Copilot Trigger Button (Always visible) */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        title="Ask HEMOPULSE AI Copilot (e-RaktKosh Intelligence)"
        className="fixed bottom-5 right-5 z-40 bg-gradient-to-r from-purple-700 via-indigo-600 to-rose-600 hover:from-purple-600 hover:to-rose-500 text-white px-4 py-3 rounded-2xl shadow-2xl shadow-purple-950/80 border border-purple-400/40 flex items-center gap-2.5 font-extrabold text-xs group active:scale-95 transition-all animate-bounce"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-ping" />
        </div>
        <span className="hidden sm:inline font-sans tracking-wide">Ask e-RaktKosh AI</span>
      </button>

      {/* HEMOPULSE Emergency AI Copilot Modal / Drawer */}
      <HemopulseAIChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        context={{
          activeRegion: currentRegion,
          activeCoords,
          activeLocationLabel,
          totalFacilitiesCount: nodes.length,
          criticalDemandsCount: nodes.flatMap((n) => n.demands).length,
          activeDispatchesCount: activeDispatches.length,
        }}
        languageMode={languageMode}
      />

      {/* Geofenced Voluntary Blood Donor Emergency Connect (Jeevan-Setu Donor Beacon) */}
      <DonorBeaconModal
        isOpen={isDonorBeaconOpen}
        onClose={() => setIsDonorBeaconOpen(false)}
        userCoords={activeCoords}
        bloodGroup={donorBeaconGroup}
        requiredUnits={donorBeaconUnits}
        nearestHospitalName={selectedNode?.name || nodes[0]?.name}
      />

      {/* Digital Green Corridor Emergency Transit Pass Modal */}
      <GreenCorridorPassModal
        isOpen={isGreenPassOpen}
        onClose={() => setIsGreenPassOpen(false)}
        dispatch={selectedGreenPassDispatch}
        fromHospital={selectedGreenPassHospital || selectedGreenPassDispatch?.fromNode || nodes[0]}
        toHospital={selectedGreenPassDispatch?.toNode || nodes[1]}
      />

      {/* Emergency STAT SOS Blood Request Modal */}
      <EmergencySOSModal
        isOpen={isEmergencySOSOpen}
        onClose={() => setIsEmergencySOSOpen(false)}
        nodes={nodes}
        devices={nearbyDevices}
        userCoords={activeCoords}
        onSelectNearestBloodBank={handleSelectNearestBloodBank}
        onDispatchNearbyDevice={handleDispatchNearbyDevice}
      />

      {/* Transfer Manifest Modal (Chain of Custody ISBT-128) */}
      {manifestModalTransfer && (
        <TransferManifestModal
          transfer={manifestModalTransfer}
          fromNode={nodes.find((n) => n.id === manifestModalTransfer.fromNodeId) || null}
          toNode={nodes.find((n) => n.id === manifestModalTransfer.toNodeId) || null}
          onClose={() => setManifestModalTransfer(null)}
        />
      )}

      {/* Clinical Transfusion Compatibility Modal */}
      <CompatibilityMatrixModal
        isOpen={isCompatibilityOpen}
        onClose={() => setIsCompatibilityOpen(false)}
      />

      {/* Central Alerts & Notifications Hub Modal */}
      <AlertsAndNotificationsCenter
        isOpen={isAlertsCenterOpen}
        onClose={() => setIsAlertsCenterOpen(false)}
        alerts={systemAlerts}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onAcknowledgeAll={handleAcknowledgeAll}
        onActionTrigger={handleAlertActionTrigger}
        onSimulateSurgeAlert={handleSimulateSurgeAlert}
        roadClosuresCount={roadClosures.length}
        activeDelaysCount={systemAlerts.filter((a) => a.category === 'SHIPMENT_DELAY').length}
      />

      {/* Floating AI Copilot Quick Launcher Button */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-5 right-5 z-40 group flex items-center gap-2.5 bg-gradient-to-r from-purple-700 via-indigo-600 to-rose-600 hover:from-purple-600 hover:to-rose-500 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-2xl shadow-purple-950/80 border border-purple-400/50 hover:border-purple-300 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open e-RaktKosh Emergency AI Copilot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-purple-200 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-wide flex items-center gap-1">
              AI Copilot
              <span className="text-[10px] text-purple-200 font-mono bg-purple-950/80 px-1 py-0.2 rounded border border-purple-500/40">24/7</span>
            </span>
            <span className="text-[10px] text-purple-200 font-medium">Ask any blood inquiry</span>
          </div>
        </button>
      )}

      {/* HEMOPULSE Emergency AI Copilot Dialog */}
      <HemopulseAIChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        context={{
          activeRegion: currentRegion,
          activeCoords,
          activeLocationLabel,
          totalFacilitiesCount: nodes.length,
          criticalDemandsCount: nodes.reduce(
            (acc, n) =>
              acc +
              n.demands.filter(
                (d) =>
                  d.criticality === 'CODE_RED_TRAUMA' ||
                  d.criticality === 'CRITICAL_DEFICIT'
              ).length,
            0
          ),
          activeDispatchesCount: activeDispatches.length,
        }}
        languageMode={languageMode}
      />
    </div>
  );
}
