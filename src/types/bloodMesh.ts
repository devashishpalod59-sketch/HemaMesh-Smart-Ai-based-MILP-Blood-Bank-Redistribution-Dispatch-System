export type BloodType = 
  | 'O-' 
  | 'O+' 
  | 'A-' 
  | 'A+' 
  | 'B-' 
  | 'B+' 
  | 'AB-' 
  | 'AB+';

export type BloodComponent = 
  | 'PLT'   // Platelets (5-day shelf life, 20-24°C continuous agitation)
  | 'PRBC'  // Packed Red Blood Cells (42-day shelf life, 1-6°C)
  | 'FFP'   // Fresh Frozen Plasma (365-day shelf life, <-18°C)
  | 'CRYO'  // Cryoprecipitate (365-day shelf life, <-18°C)
  | 'WB';   // Whole Blood (35-day shelf life, 1-6°C)

export type FacilityType = 
  | 'LEVEL_1_TRAUMA'       // High-demand regional tertiary trauma center
  | 'LEVEL_2_TRAUMA'       // Secondary trauma hospital
  | 'CENTRAL_BLOOD_DEPOT'  // Regional collection and processing hub
  | 'COMMUNITY_CLINIC'     // Low-turnover peripheral spoke (high spoilage risk)
  | 'AMBULATORY_CENTER';   // Surgical outpatient clinic

export interface InventoryCohort {
  id: string;
  bloodType: BloodType;
  component: BloodComponent;
  units: number;
  daysToExpiry: number;      // Perishable decay variable (e.g. 1-2 days is critical for PLT)
  lotNumber: string;
  unitCost: number;          // Economic salvage / procurement value ($)
}

export interface DemandRequirement {
  bloodType: BloodType;
  component: BloodComponent;
  requiredUnits: number;
  criticality: 'ROUTINE' | 'ELEVATED' | 'CRITICAL_DEFICIT' | 'CODE_RED_TRAUMA';
  burnRatePerHour: number;
}

export interface FacilityNode {
  id: string;
  name: string;
  shortName: string;
  type: FacilityType;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  phone: string;
  contactPerson: string;
  inventory: InventoryCohort[];
  demands: DemandRequirement[];
  refrigerationCapacities: {
    plateletAgitators: number; // Max PLT units
    coldStorage4C: number;     // Max PRBC/WB units
    frozenFreezer18C: number;  // Max FFP/CRYO units
  };
  status: 'OPTIMAL' | 'ELEVATED_DEMAND' | 'CRITICAL_SHORTAGE' | 'MASS_CASUALTY_SURGE';
}

export interface TransitEdge {
  fromNodeId: string;
  toNodeId: string;
  distanceKm: number;
  normalTravelMinutes: number;
  emergencyTravelMinutes: number; // Blue-light priority transit
  riskFactor: number;             // Traffic volatility (1.0 = standard)
}

export interface MILPSolverConfig {
  alphaLatencyWeight: number;     // Penalty per unit per minute transit
  betaVehicleDispatchCost: number;// Fixed activation cost per vehicle route
  gammaStockoutPenalty: number;   // Severe penalty for unsatisfied trauma demand
  deltaSpoilagePenalty: number;   // Penalty for perishable units expiring untransferred
  maxTransitTimeMinutes: number;  // Maximum permissible transit window (e.g. 90 mins for PLT)
  vehicleCapacityUnits: number;   // Units per transfer vehicle
  predictiveForecastEnabled?: boolean; // Proactive pre-event stock rebalancing
  predictiveHorizonHours?: number;     // 24, 48, 72 hours lead window
}

export type PredictiveEventId =
  | 'DIWALI_FESTIVAL'
  | 'MONSOON_DENGUE_SURGE'
  | 'HOLI_FESTIVAL_TRAUMA'
  | 'DURGA_PUJA_NAVRATRI'
  | 'KUMBH_MELA_PILGRIMAGE'
  | 'EID_HIGHWAY_SURGE'
  | 'NEW_YEAR_HIGHWAY_CORRIDOR'
  | 'SANKRANTI_HARVEST_SURGE';

export interface PredictiveEventProfile {
  id: PredictiveEventId;
  name: string;
  hindiName: string;
  seasonPeriod: string;
  historicalSpikeMultipliers: Record<BloodComponent, number>;
  donorTurnoutModifier: number; // e.g. -0.45 = 45% drop in blood donation camp walk-ins
  primaryClinicalRisk: string;
  epidemiologicalRationale: string;
  recommendedLeadHours: number;
  highRiskComponents: BloodComponent[];
  priorityFacilityTypes: FacilityType[];
}

export interface FacilityForecastVulnerability {
  nodeId: string;
  nodeName: string;
  facilityType: FacilityType;
  baselineDailyDemand: number;
  predictedDailyDemand: number;
  currentOnHandUnits: number;
  projectedNetUnits: number;
  shortfallUnits: number;
  vulnerabilityLevel: 'CRITICAL_STOCKOUT_RISK' | 'HIGH_DEFICIT_WARNING' | 'MODERATE_MONITORED' | 'RESILIENT_SURPLUS';
  criticalComponents: BloodComponent[];
  suggestedPreemptiveInflow: number;
}

export interface PredictiveForecastAnalysis {
  eventId: PredictiveEventId;
  event: PredictiveEventProfile;
  horizonHours: number;
  intensityScale: number;
  totalProjectedDeficitUnits: number;
  vulnerableFacilities: FacilityForecastVulnerability[];
  componentDemandSpikes: {
    component: BloodComponent;
    baselineUnits: number;
    predictedUnits: number;
    multiplier: number;
  }[];
  networkResilienceWithoutRebalance: number; // e.g. 42%
  networkResilienceWithRebalance: number;    // e.g. 98%
}

export interface TransferDecision {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromNodeName: string;
  toNodeName: string;
  bloodType: BloodType;
  component: BloodComponent;
  units: number;
  daysToExpiry: number;
  lotNumber: string;
  travelMinutes: number;
  distanceKm: number;
  priority: 'EMERGENCY_CODE_3' | 'URGENT' | 'STANDARD_REDISTRIBUTION';
  spoilageRiskMitigated: boolean;
  stockoutAddressed: boolean;
  isPredictiveRebalance?: boolean;
  predictiveEventId?: PredictiveEventId;
  predictiveRationale?: string;
  preemptiveBufferHours?: number;
  costBreakdown: {
    transitCost: number;
    salvageBenefit: number;
    stockoutMitigationScore: number;
  };
}

export interface OptimizationResult {
  solvedAt: string;
  solveDurationMs: number;
  objectiveValue: number;
  simplexIterations: number;
  branchAndBoundNodes: number;
  transfers: TransferDecision[];
  summary: {
    totalUnitsTransferred: number;
    criticalDeficitsResolved: number;
    spoilagePreventedUnits: number;
    activeRoutesCount: number;
    estimatedTransitLatencyMinutes: number;
    estimatedCostSavingsUsd: number;
    proactiveRebalancedUnits?: number;
    stockoutsPreemptedCount?: number;
  };
  convergenceStatus: 'OPTIMAL' | 'FEASIBLE' | 'RELAXED_OPTIMAL';
  shadowPrices: Record<string, number>; // Marginal value of an extra blood unit at node
  predictiveForecastSummary?: {
    eventId: PredictiveEventId;
    eventName: string;
    horizonHours: number;
    proactiveTransfersCount: number;
    proactiveUnitsMoved: number;
    preventedStockoutCount: number;
    resilienceImprovementPercent: number;
  };
}

export interface ActiveDispatch {
  id: string;
  transferId: string;
  fromNode: FacilityNode;
  toNode: FacilityNode;
  component: BloodComponent;
  bloodType: BloodType;
  units: number;
  vehicleId: string;
  vehicleType: 'EV_MED_AMBULANCE' | 'TEMP_CONTROLLED_VAN' | 'DRONE_AERO_RESCUE';
  dispatchedAt: string;
  estimatedArrival: string;
  progressPercent: number; // 0 - 100
  currentCoordinates: { lat: number; lng: number };
  telemetry: {
    temperatureCelsius: number; // e.g. 21.8°C for PLT, 3.4°C for PRBC
    tempStatus: 'NOMINAL' | 'WARNING' | 'EXCURSION';
    batteryOrFuelPercent: number;
    speedKmh: number;
    bearingDegrees: number;
  };
  manifestNumber: string;
  status: 'PREPARING' | 'IN_TRANSIT' | 'ARRIVED_OFFLOADING' | 'COMPLETED';
}

export interface DisasterTelemetryEvent {
  id: string;
  timestamp: string;
  headline: string;
  summary?: string;
  incidentType: 'MASS_CASUALTY_INCIDENT' | 'FREEWAY_PILEUP' | 'METRO_EXPLOSION' | 'OB_EMERGENCY' | 'CIVILIAN_SURGE';
  locationName: string;
  affectedHospitalId: string;
  affectedHospitalName: string;
  estimatedCasualties: number;
  urgentUnitsNeeded: {
    component: BloodComponent;
    bloodType: BloodType;
    units: number;
  }[];
  severity: 'LEVEL_1_CATASTROPHIC' | 'LEVEL_2_SEVERE' | 'LEVEL_3_ELEVATED';
  acknowledged: boolean;
}

export type LocationAccuracyGrade =
  | 'PINPOINT_SUB_5M'      // Dual-frequency GPS / GNSS satellite lock
  | 'EXCELLENT_SUB_15M'    // Standard high-accuracy GPS fix
  | 'GOOD_SUB_50M'         // WiFi / Cell multi-tower trilateration
  | 'COARSE_OVER_50M';     // IP / Base cell tower approximation

export type LocationProviderType =
  | 'HIGH_ACCURACY_GPS'
  | 'SATELLITE_LOCK'
  | 'GOOGLE_MAPS_GEOCODER'
  | 'WIFI_NETWORK_TRIANGULATION'
  | 'IP_GEOLOCATION'
  | 'MANUAL_VERIFIED_LANDMARK';

export interface UserLocationTrackerState {
  enabled: boolean;
  loading: boolean;
  coords: { lat: number; lng: number } | null;
  accuracyMeters: number | null;
  accuracyGrade?: LocationAccuracyGrade;
  altitude: number | null;
  altitudeAccuracy?: number | null;
  speed: number | null;
  heading: number | null;
  lastUpdated: string | null;
  error: string | null;
  resolvedAddress?: string | null;
  sublocality?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  provider?: LocationProviderType;
  isCalibrating?: boolean;
  calibrationSamplesCount?: number;
}

export interface NearbyDevice {
  id: string;
  name: string;
  type: 'MOBILE_BLOOD_BUS' | 'EMERGENCY_AMBULANCE_AMB' | 'AERO_DRONE_POD' | 'FIELD_DONOR_STATION';
  coordinates: { lat: number; lng: number };
  distanceKm: number;
  etaMinutes: number;
  status: 'AVAILABLE_ON_STANDBY' | 'PATROLLING' | 'COLLECTING_DONATIONS' | 'DISPATCHED';
  contactRadio: string;
  onboardUnits: {
    bloodType: BloodType;
    component: BloodComponent;
    units: number;
  }[];
  coldStorageTempCelsius: number;
  operatorName: string;
  batteryOrFuelPercent: number;
}

export interface EmergencyBloodRequest {
  id: string;
  requestedAt: string;
  bloodType: BloodType;
  component: BloodComponent;
  unitsNeeded: number;
  urgency: 'STAT_CODE_RED' | 'URGENT' | 'ROUTINE';
  patientNote?: string;
  originCoords?: { lat: number; lng: number };
}

export interface TraumaVitals {
  hr: number; // Heart rate bpm
  sbp: number; // Systolic BP mmHg
  dbp: number; // Diastolic BP mmHg
  map: number; // Mean Arterial Pressure mmHg
  spo2: number; // Oxygen Saturation %
  hemoglobin: number; // Hb g/dL
  lactate: number; // Blood lactate mmol/L
  baseExcess: number; // mEq/L
  gcs: number; // Glasgow Coma Scale /15
  coreTempCelsius: number;
}

export interface TraumaPatient {
  id: string;
  triageTag: 'RED_STAT' | 'YELLOW_URGENT' | 'GREEN_DELAYED' | 'BLACK_EXPECTANT';
  alias: string;
  age: number;
  gender: 'M' | 'F';
  traumaBay: string;
  mechanismOfInjury: string;
  vitals: TraumaVitals;
  shockIndex: number; // HR / SBP
  abcScore: number; // Assessment of Blood Consumption Score (0 to 4)
  tashProbabilityPercent: number; // Trauma-Associated Severe Hemorrhage probability
  hemorrhageClass: 'CLASS_I' | 'CLASS_II' | 'CLASS_III' | 'CLASS_IV';
  bloodDemands: {
    bloodType: BloodType;
    component: BloodComponent;
    requiredUnits: number;
    allocatedUnits: number;
  }[];
  mtpActivated: boolean; // Massive Transfusion Protocol (1:1:1 PRBC:FFP:PLT)
  status: 'CRITICAL_WAITING_BLOOD' | 'RESUSCITATING' | 'SURGICAL_OR_TRANSFER' | 'STABILIZED';
  scenarioType: 'FREEWAY_MCI' | 'EXPLOSION_MCI' | 'OB_HEMORRHAGE' | 'OB_EMERGENCY' | 'PLATELET_EXPIRY_CRISIS' | 'GENERAL_TRAUMA';
  timeElapsedMinutes: number;
}

export type LanguageMode = 'EN' | 'HI';

export interface VoluntaryDonor {
  id: string;
  fullName: string;
  bloodType: BloodType;
  coordinates: { lat: number; lng: number };
  distanceKm: number;
  lastDonationDaysAgo: number;
  isEligible: boolean;
  donorBadge: 'GOLD_REGULAR' | 'SILVER_NBTC' | 'BRONZE_ACTIVE';
  phoneMasked: string;
  phoneRaw: string;
  cityArea: string;
  totalDonations: number;
  availableNow: boolean;
  raktKoshId: string;
}

export interface ColdChainSensorData {
  payloadTempCelsius: number;
  targetMinTemp: number;
  targetMaxTemp: number;
  status: 'NOMINAL' | 'MARGINAL' | 'EXCURSION_BREACH';
  sealStatus: 'CRYPTOGRAPHICALLY_SEALED' | 'TAMPERED';
  batteryPercent: number;
  shockGForce: number;
  humidityPercent: number;
  lastTelemetryPing: string;
  agitatorRpm?: number; // for Platelet agitators
}

export interface GreenCorridorPass {
  passNumber: string;
  issuedAt: string;
  validUntil: string;
  patientReference: string;
  sourceHospital: string;
  destinationHospital: string;
  bloodUnitsSummary: string;
  vehicleNumber: string;
  transitLeadOfficer: string;
  policeAuthorizationId: string;
  routeCorridor: string;
  status: 'AUTHORIZED_CODE_3_ACTIVE' | 'REVOKED' | 'EXPIRED';
}

export type AlertCategory =
  | 'SHORTAGE'
  | 'EXPIRY'
  | 'TRANSFER'
  | 'COLD_CHAIN'
  | 'ROAD_CLOSURE'
  | 'SHIPMENT_DELAY'
  | 'DIGITAL_TWIN';

export type AlertSeverity = 'CRITICAL_RED' | 'WARNING_AMBER' | 'ADVISORY_CYAN';

export interface SystemAlert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  sourceNodeId?: string;
  dispatchId?: string;
  actionLabel?: string;
  acknowledged: boolean;
  metadata?: Record<string, unknown>;
}

export interface RoadClosureIncident {
  id: string;
  corridorName: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  reason:
    | 'WATERLOGGING_FLOOD'
    | 'EXPRESSWAY_ACCIDENT'
    | 'CONSTRUCTION_WORK'
    | 'VIP_SECURITY_ESCORT'
    | 'CIVIC_DEMONSTRATION';
  severity: 'FULL_BLOCKAGE' | 'PARTIAL_LANE_RESTRICTION';
  estimatedDelayMinutes: number;
  reportedAt: string;
  active: boolean;
  recommendedDetour: string;
}

export interface ShipmentDelayIncident {
  id: string;
  dispatchId: string;
  vehicleId: string;
  delayMinutes: number;
  delayReason:
    | 'TRAFFIC_CONGESTION'
    | 'ROAD_CLOSURE_DETOUR'
    | 'CHECKPOINT_INSPECTION'
    | 'VEHICLE_MECHANICAL';
  currentThermalRisk: 'LOW_NORMAL' | 'ELEVATED_MONITOR' | 'CRITICAL_EXCURSION_IMMINENT';
  passiveCoolingRemainingMinutes: number;
  suggestedAction:
    | 'AUTHORIZE_POLICE_GREEN_CORRIDOR'
    | 'DISPATCH_BACKUP_DRONE'
    | 'DIVERT_TO_SECONDARY_HUB';
}

export interface DigitalTwinScenario {
  id: string;
  title: string;
  description: string;
  incidentType: string;
  additionalDeficitUnits: number;
  affectedNodeIds: string[];
  roadClosuresCount: number;
  baselineResilience: number;
  postStabilizationResilience: number;
}
