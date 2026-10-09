import { TraumaPatient, TraumaVitals, BloodType, BloodComponent } from '../types/bloodMesh.ts';

// Helper to compute Shock Index (HR / SBP)
export function computeShockIndex(hr: number, sbp: number): number {
  if (sbp <= 0) return 3.0;
  return Number((hr / sbp).toFixed(2));
}

// Helper to calculate Assessment of Blood Consumption (ABC) Score (0 to 4)
// >= 2 points indicates 80%+ specificity for Massive Transfusion Protocol (MTP)
export function computeAbcScore(params: {
  isPenetrating: boolean;
  sbp: number;
  hr: number;
  fastPositive: boolean;
}): number {
  let score = 0;
  if (params.isPenetrating) score += 1;
  if (params.sbp <= 90) score += 1;
  if (params.hr >= 120) score += 1;
  if (params.fastPositive) score += 1;
  return score;
}

// Helper to categorize Hemorrhagic Shock Class (Class I to IV by ACS ATLS)
export function getHemorrhageClass(shockIndex: number, sbp: number, baseExcess: number): 'CLASS_I' | 'CLASS_II' | 'CLASS_III' | 'CLASS_IV' {
  if (shockIndex >= 1.4 || sbp < 75 || baseExcess <= -10) return 'CLASS_IV';
  if (shockIndex >= 1.0 || sbp < 90 || baseExcess <= -6) return 'CLASS_III';
  if (shockIndex >= 0.8 || baseExcess <= -2) return 'CLASS_II';
  return 'CLASS_I';
}

export const INITIAL_TRAUMA_PATIENTS: TraumaPatient[] = [
  {
    id: 'PT-MCI-01',
    alias: 'Trauma Bay 1 (John Doe, ~28M)',
    age: 28,
    gender: 'M',
    triageTag: 'RED_STAT',
    traumaBay: 'Bay 1 (Resus Pod A)',
    mechanismOfInjury: 'High-Speed Rollover MVC, Open Pelvic Fracture & Bilateral Femur Deformity',
    vitals: {
      hr: 144,
      sbp: 72,
      dbp: 44,
      map: 53,
      spo2: 91,
      hemoglobin: 5.6,
      lactate: 7.8,
      baseExcess: -12.4,
      gcs: 8,
      coreTempCelsius: 34.8,
    },
    shockIndex: 2.0,
    abcScore: 4,
    tashProbabilityPercent: 88,
    hemorrhageClass: 'CLASS_IV',
    bloodDemands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 6, allocatedUnits: 4 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 2, allocatedUnits: 1 },
      { bloodType: 'AB-', component: 'FFP', requiredUnits: 4, allocatedUnits: 3 },
    ],
    mtpActivated: true,
    status: 'CRITICAL_WAITING_BLOOD',
    scenarioType: 'FREEWAY_MCI',
    timeElapsedMinutes: 14,
  },
  {
    id: 'PT-MCI-02',
    alias: 'Trauma Bay 2 (Jane Doe, ~34F)',
    age: 34,
    gender: 'F',
    triageTag: 'RED_STAT',
    traumaBay: 'Bay 2 (Resus Pod B)',
    mechanismOfInjury: 'Blunt Thoracoabdominal Impact, Ruptured Spleen & Hemoperitoneum (FAST+)',
    vitals: {
      hr: 130,
      sbp: 84,
      dbp: 52,
      map: 63,
      spo2: 94,
      hemoglobin: 6.8,
      lactate: 5.4,
      baseExcess: -8.2,
      gcs: 12,
      coreTempCelsius: 35.5,
    },
    shockIndex: 1.55,
    abcScore: 3,
    tashProbabilityPercent: 72,
    hemorrhageClass: 'CLASS_III',
    bloodDemands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 4, allocatedUnits: 3 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 2, allocatedUnits: 2 },
      { bloodType: 'AB+', component: 'FFP', requiredUnits: 2, allocatedUnits: 2 },
    ],
    mtpActivated: true,
    status: 'RESUSCITATING',
    scenarioType: 'FREEWAY_MCI',
    timeElapsedMinutes: 22,
  },
  {
    id: 'PT-MCI-03',
    alias: 'Trauma Bay 3 (Male Driver, ~45M)',
    age: 45,
    gender: 'M',
    triageTag: 'YELLOW_URGENT',
    traumaBay: 'Bay 3 (Secondary Triage)',
    mechanismOfInjury: 'Steering Wheel Sternal Contusion, Flail Chest & Scalp Avulsion',
    vitals: {
      hr: 108,
      sbp: 102,
      dbp: 68,
      map: 79,
      spo2: 96,
      hemoglobin: 9.4,
      lactate: 3.1,
      baseExcess: -3.8,
      gcs: 14,
      coreTempCelsius: 36.4,
    },
    shockIndex: 1.06,
    abcScore: 1,
    tashProbabilityPercent: 28,
    hemorrhageClass: 'CLASS_II',
    bloodDemands: [
      { bloodType: 'O+', component: 'PRBC', requiredUnits: 2, allocatedUnits: 2 },
    ],
    mtpActivated: false,
    status: 'STABILIZED',
    scenarioType: 'FREEWAY_MCI',
    timeElapsedMinutes: 35,
  },
  {
    id: 'PT-OB-01',
    alias: 'Labor & Delivery OR 2 (Priya S., 29F)',
    age: 29,
    gender: 'F',
    triageTag: 'RED_STAT',
    traumaBay: 'Obstetric Emergency Suite',
    mechanismOfInjury: 'Catastrophic Postpartum Hemorrhage, Uterine Atony & Consumptive Coagulopathy',
    vitals: {
      hr: 152,
      sbp: 68,
      dbp: 38,
      map: 48,
      spo2: 92,
      hemoglobin: 4.9,
      lactate: 9.1,
      baseExcess: -14.2,
      gcs: 10,
      coreTempCelsius: 35.1,
    },
    shockIndex: 2.24,
    abcScore: 3,
    tashProbabilityPercent: 94,
    hemorrhageClass: 'CLASS_IV',
    bloodDemands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 6, allocatedUnits: 5 },
      { bloodType: 'AB+', component: 'CRYO', requiredUnits: 10, allocatedUnits: 10 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 3, allocatedUnits: 2 },
    ],
    mtpActivated: true,
    status: 'SURGICAL_OR_TRANSFER',
    scenarioType: 'OB_HEMORRHAGE',
    timeElapsedMinutes: 8,
  },
  {
    id: 'PT-BLAST-01',
    alias: 'Burn & Trauma ICU 4 (Industrial Worker, 38M)',
    age: 38,
    gender: 'M',
    triageTag: 'RED_STAT',
    traumaBay: 'Critical Burn Bay',
    mechanismOfInjury: 'Chemical Refinery Vapor Explosion, 45% TBSA Flash Burns & Shrapnel Blast Lacerations',
    vitals: {
      hr: 138,
      sbp: 78,
      dbp: 46,
      map: 57,
      spo2: 90,
      hemoglobin: 6.2,
      lactate: 8.4,
      baseExcess: -11.0,
      gcs: 9,
      coreTempCelsius: 34.6,
    },
    shockIndex: 1.77,
    abcScore: 4,
    tashProbabilityPercent: 86,
    hemorrhageClass: 'CLASS_IV',
    bloodDemands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 8, allocatedUnits: 6 },
      { bloodType: 'AB-', component: 'FFP', requiredUnits: 6, allocatedUnits: 4 },
      { bloodType: 'A+', component: 'PLT', requiredUnits: 4, allocatedUnits: 3 },
    ],
    mtpActivated: true,
    status: 'CRITICAL_WAITING_BLOOD',
    scenarioType: 'EXPLOSION_MCI',
    timeElapsedMinutes: 18,
  },
];

export function getScenarioPatients(scenario: 'FREEWAY_MCI' | 'EXPLOSION_MCI' | 'OB_HEMORRHAGE' | 'PLATELET_EXPIRY_CRISIS' | 'ALL'): TraumaPatient[] {
  if (scenario === 'ALL') return INITIAL_TRAUMA_PATIENTS;
  return INITIAL_TRAUMA_PATIENTS.filter((p) => p.scenarioType === scenario || p.triageTag === 'RED_STAT');
}
