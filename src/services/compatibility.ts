import { BloodComponent, BloodType } from '../types/bloodMesh.ts';

// PRBC (Red Blood Cells) compatibility: antibodies in recipient plasma react against donor antigens
// O- is universal PRBC donor; AB+ is universal recipient
const PRBC_COMPATIBILITY_MAP: Record<BloodType, BloodType[]> = {
  // Key = Recipient, Value = Acceptable Donors
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

// Plasma (FFP) compatibility: inverse of PRBC! AB has no antibodies, so AB is universal donor; O has both anti-A and anti-B
const PLASMA_COMPATIBILITY_MAP: Record<BloodType, BloodType[]> = {
  // Key = Recipient, Value = Acceptable Donors
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A-', 'A+', 'AB-', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B-', 'B+', 'AB-', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB-', 'AB+'],
};

// Platelets (PLT) compatibility: ABO identical preferred. In emergency/trauma shortage, cross-ABO acceptable if volume reduced or low-titer
const PLATELET_COMPATIBILITY_MAP: Record<BloodType, BloodType[]> = {
  // Key = Recipient, Value = Acceptable Donors (Ranked by clinical preference)
  'O-': ['O-', 'O+', 'A-', 'B-', 'AB-'],
  'O+': ['O+', 'O-', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'O-', 'AB-'],
  'A+': ['A+', 'A-', 'AB+', 'O+'],
  'B-': ['B-', 'B+', 'O-', 'AB-'],
  'B+': ['B+', 'B-', 'AB+', 'O+'],
  'AB-': ['AB-', 'AB+', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'B+', 'O+'],
};

// Whole Blood (WB): Requires identical or O uncrossmatched for emergency trauma resuscitation
const WHOLE_BLOOD_COMPATIBILITY_MAP: Record<BloodType, BloodType[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['A-', 'O-'],
  'A+': ['A+', 'A-', 'O-', 'O+'],
  'B-': ['B-', 'O-'],
  'B+': ['B+', 'B-', 'O-', 'O+'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
};

export function isBloodCompatible(
  donorType: BloodType,
  recipientType: BloodType,
  component: BloodComponent
): boolean {
  if (donorType === recipientType) return true;

  switch (component) {
    case 'PRBC':
      return PRBC_COMPATIBILITY_MAP[recipientType]?.includes(donorType) ?? false;
    case 'FFP':
    case 'CRYO':
      return PLASMA_COMPATIBILITY_MAP[recipientType]?.includes(donorType) ?? false;
    case 'PLT':
      return PLATELET_COMPATIBILITY_MAP[recipientType]?.includes(donorType) ?? false;
    case 'WB':
      return WHOLE_BLOOD_COMPATIBILITY_MAP[recipientType]?.includes(donorType) ?? false;
    default:
      return donorType === recipientType;
  }
}

export function getAcceptableDonors(
  recipientType: BloodType,
  component: BloodComponent
): BloodType[] {
  switch (component) {
    case 'PRBC':
      return PRBC_COMPATIBILITY_MAP[recipientType] || [recipientType];
    case 'FFP':
    case 'CRYO':
      return PLASMA_COMPATIBILITY_MAP[recipientType] || [recipientType];
    case 'PLT':
      return PLATELET_COMPATIBILITY_MAP[recipientType] || [recipientType];
    case 'WB':
      return WHOLE_BLOOD_COMPATIBILITY_MAP[recipientType] || [recipientType];
    default:
      return [recipientType];
  }
}

export function getComponentShelfLifeSpec(component: BloodComponent): {
  nominalShelfLifeDays: number;
  storageTempCelsius: string;
  criticalDecayThresholdDays: number;
  agitationRequired: boolean;
  standardUnitVolumeMl: number;
} {
  switch (component) {
    case 'PLT':
      return {
        nominalShelfLifeDays: 5,
        storageTempCelsius: '20°C to 24°C',
        criticalDecayThresholdDays: 2, // 48h left before total discard
        agitationRequired: true,
        standardUnitVolumeMl: 300,
      };
    case 'PRBC':
      return {
        nominalShelfLifeDays: 42,
        storageTempCelsius: '1°C to 6°C',
        criticalDecayThresholdDays: 5,
        agitationRequired: false,
        standardUnitVolumeMl: 350,
      };
    case 'FFP':
      return {
        nominalShelfLifeDays: 365,
        storageTempCelsius: '< -18°C',
        criticalDecayThresholdDays: 14,
        agitationRequired: false,
        standardUnitVolumeMl: 250,
      };
    case 'CRYO':
      return {
        nominalShelfLifeDays: 365,
        storageTempCelsius: '< -18°C',
        criticalDecayThresholdDays: 14,
        agitationRequired: false,
        standardUnitVolumeMl: 15,
      };
    case 'WB':
      return {
        nominalShelfLifeDays: 35,
        storageTempCelsius: '1°C to 6°C',
        criticalDecayThresholdDays: 3,
        agitationRequired: false,
        standardUnitVolumeMl: 500,
      };
  }
}
