import { BloodType, VoluntaryDonor } from '../types/bloodMesh.ts';
import { calculateDistanceKm } from './milpSolver.ts';
import { isBloodCompatible } from './compatibility.ts';

export const INITIAL_REGISTERED_DONORS: VoluntaryDonor[] = [
  {
    id: 'donor-dl-01',
    fullName: 'Vikramaditya Sengupta',
    bloodType: 'O-',
    coordinates: { lat: 28.5672, lng: 77.2100 }, // Ansari Nagar, AIIMS South Delhi
    distanceKm: 0.8,
    lastDonationDaysAgo: 114,
    isEligible: true,
    donorBadge: 'GOLD_REGULAR',
    phoneMasked: '+91 98112 •••••',
    phoneRaw: '+919811294821',
    cityArea: 'Ansari Nagar, South Delhi',
    totalDonations: 16,
    availableNow: true,
    raktKoshId: 'ERAKTKOSH-DL-77210-994',
  },
  {
    id: 'donor-dl-02',
    fullName: 'Ananya Sharma',
    bloodType: 'B+',
    coordinates: { lat: 28.5701, lng: 77.2065 }, // Safdarjung Enclave
    distanceKm: 1.2,
    lastDonationDaysAgo: 98,
    isEligible: true,
    donorBadge: 'GOLD_REGULAR',
    phoneMasked: '+91 98710 •••••',
    phoneRaw: '+919871052144',
    cityArea: 'Safdarjung Enclave, New Delhi',
    totalDonations: 9,
    availableNow: true,
    raktKoshId: 'ERAKTKOSH-DL-77206-382',
  },
  {
    id: 'donor-dl-03',
    fullName: 'Rajesh Meena',
    bloodType: 'O+',
    coordinates: { lat: 28.5412, lng: 77.2185 }, // Hauz Khas / IIT Delhi
    distanceKm: 3.1,
    lastDonationDaysAgo: 142,
    isEligible: true,
    donorBadge: 'SILVER_NBTC',
    phoneMasked: '+91 98991 •••••',
    phoneRaw: '+919899144320',
    cityArea: 'Hauz Khas, New Delhi',
    totalDonations: 11,
    availableNow: true,
    raktKoshId: 'ERAKTKOSH-DL-77218-109',
  },
  {
    id: 'donor-dl-04',
    fullName: 'Dr. Priya Nambiar',
    bloodType: 'A+',
    coordinates: { lat: 28.5280, lng: 77.2190 }, // Saket Max Healthcare zone
    distanceKm: 4.6,
    lastDonationDaysAgo: 105,
    isEligible: true,
    donorBadge: 'GOLD_REGULAR',
    phoneMasked: '+91 98103 •••••',
    phoneRaw: '+919810398211',
    cityArea: 'Press Enclave, Saket',
    totalDonations: 14,
    availableNow: true,
    raktKoshId: 'ERAKTKOSH-DL-77219-588',
  },
  {
    id: 'donor-dl-05',
    fullName: 'Gurpreet Singh Dhillon',
    bloodType: 'AB-',
    coordinates: { lat: 28.6289, lng: 77.2065 }, // Connaught Place / RML zone
    distanceKm: 6.8,
    lastDonationDaysAgo: 120,
    isEligible: true,
    donorBadge: 'GOLD_REGULAR',
    phoneMasked: '+91 97114 •••••',
    phoneRaw: '+919711499231',
    cityArea: 'Connaught Place / Baba Kharak Singh Marg',
    totalDonations: 19,
    availableNow: true,
    raktKoshId: 'ERAKTKOSH-DL-77206-881',
  },
  {
    id: 'donor-dl-06',
    fullName: 'Kavita Deshmukh',
    bloodType: 'A-',
    coordinates: { lat: 28.5355, lng: 77.2631 }, // Greater Kailash II
    distanceKm: 5.4,
    lastDonationDaysAgo: 135,
    isEligible: true,
    donorBadge: 'SILVER_NBTC',
    phoneMasked: '+91 99102 •••••',
    phoneRaw: '+919910278144',
    cityArea: 'Greater Kailash II, South Delhi',
    totalDonations: 8,
    availableNow: true,
    raktKoshId: 'ERAKTKOSH-DL-77263-441',
  },
  {
    id: 'donor-dl-07',
    fullName: 'Arjun Bhati',
    bloodType: 'B-',
    coordinates: { lat: 28.4744, lng: 77.4988 }, // Greater Noida / Yamuna Expressway
    distanceKm: 28.5,
    lastDonationDaysAgo: 94,
    isEligible: true,
    donorBadge: 'BRONZE_ACTIVE',
    phoneMasked: '+91 98188 •••••',
    phoneRaw: '+919818833910',
    cityArea: 'Pari Chowk, Greater Noida',
    totalDonations: 6,
    availableNow: true,
    raktKoshId: 'ERAKTKOSH-UP-77498-202',
  },
  {
    id: 'donor-dl-08',
    fullName: 'Rohit Khandelwal',
    bloodType: 'AB+',
    coordinates: { lat: 28.4595, lng: 77.0266 }, // Gurugram DLF Phase 2
    distanceKm: 22.0,
    lastDonationDaysAgo: 110,
    isEligible: true,
    donorBadge: 'GOLD_REGULAR',
    phoneMasked: '+91 99990 •••••',
    phoneRaw: '+919999012499',
    cityArea: 'DLF Cyber City, Gurugram',
    totalDonations: 15,
    availableNow: true,
    raktKoshId: 'ERAKTKOSH-HR-77026-613',
  },
];

/**
 * Filter and compute distances to voluntary donors relative to user coordinates and requested blood group
 */
export function getNearbyEligibleDonors(
  userCoords: { lat: number; lng: number },
  bloodGroup: BloodType,
  allowCompatible: boolean = true,
  maxRadiusKm: number = 50
): (VoluntaryDonor & { distanceKm: number; isExactMatch: boolean })[] {
  return INITIAL_REGISTERED_DONORS.map((donor) => {
    const dist = calculateDistanceKm(
      userCoords.lat,
      userCoords.lng,
      donor.coordinates.lat,
      donor.coordinates.lng
    );
    const isExact = donor.bloodType === bloodGroup;
    const compatible = isBloodCompatible(donor.bloodType, bloodGroup, 'WB');
    return {
      ...donor,
      distanceKm: dist,
      isExactMatch: isExact,
      isCompatible: compatible,
    };
  })
    .filter((d) => {
      if (d.distanceKm > maxRadiusKm) return false;
      if (!d.isEligible) return false;
      return allowCompatible ? d.isCompatible : d.isExactMatch;
    })
    .sort((a, b) => {
      // Prioritize exact match, then nearest distance
      if (a.isExactMatch && !b.isExactMatch) return -1;
      if (!a.isExactMatch && b.isExactMatch) return 1;
      return a.distanceKm - b.distanceKm;
    });
}

/**
 * Generate formatted WhatsApp / SMS Emergency SOS message
 */
export function generateEmergencyShareMessage(params: {
  hospitalName: string;
  hospitalAddress: string;
  phone: string;
  bloodType: BloodType;
  component: string;
  units: number;
  distanceKm: number;
  etaMins: number;
  lat: number;
  lng: number;
  lang?: 'EN' | 'HI';
}): string {
  const gMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${params.lat},${params.lng}`;

  if (params.lang === 'HI') {
    return `🚨 *e-RaktKosh आपातकालीन रक्त चेतावनी (SOS)* 🚨
━━━━━━━━━━━━━━━━━━━━━━━━
🩸 *आवश्यक रक्त*: ${params.units} यूनिट्स *${params.bloodType}* (${params.component})
🏥 *निकटतम ब्लड बैंक*: ${params.hospitalName}
📍 *पता*: ${params.hospitalAddress}
📞 *सीधा संपर्क*: ${params.phone}
⏱️ *दूरी और समय*: ${params.distanceKm} km (ग्रीन कॉरिडोर समय: ~${params.etaMins} मिनट)
🗺️ *लाइव नेविगेशन*: ${gMapsUrl}
━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *कृपया तत्काल 108/102 एम्बुलेंस को सूचित करें या ब्लड बैंक डेस्क पर संपर्क करें।*
(National Blood Transfusion Council - MoHFW India)`;
  }

  return `🚨 *e-RaktKosh STAT EMERGENCY BLOOD ALERT (SOS)* 🚨
━━━━━━━━━━━━━━━━━━━━━━━━
🩸 *Required Blood*: ${params.units} Units of *${params.bloodType}* (${params.component})
🏥 *Nearest Suggested Bank*: ${params.hospitalName}
📍 *Address*: ${params.hospitalAddress}
📞 *Emergency Desk*: ${params.phone}
⏱️ *Distance & ETA*: ${params.distanceKm} km (Code-3 Green Corridor ETA: ~${params.etaMins} mins)
🗺️ *Google Maps Live Route*: ${gMapsUrl}
━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *Flash this message to 108 Ambulance Dispatch, Emergency Trauma Attendants, and ER Doctors.*
(National Blood Transfusion Council - MoHFW Government of India)`;
}
