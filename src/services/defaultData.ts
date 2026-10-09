import { FacilityNode, NearbyDevice } from '../types/bloodMesh.ts';

export type IndianRegionKey =
  | 'DELHI_NCR'
  | 'MUMBAI'
  | 'PUNE'
  | 'BENGALURU'
  | 'HYDERABAD'
  | 'CHENNAI'
  | 'KOLKATA'
  | 'AHMEDABAD'
  | 'LUCKNOW'
  | 'JAIPUR'
  | 'ALL_INDIA';

export interface IndianRegionPreset {
  key: IndianRegionKey;
  label: string;
  state: string;
  center: { lat: number; lng: number };
  zoom: number;
  nodes: FacilityNode[];
  devices: NearbyDevice[];
}

// 1. Delhi NCR - AIIMS Apex Trauma & Red Cross Grid
const DELHI_NODES: FacilityNode[] = [
  {
    id: 'in-del-aiims-t1',
    name: 'AIIMS Jai Prakash Narayan Apex Trauma Centre',
    shortName: 'AIIMS Apex Trauma',
    type: 'LEVEL_1_TRAUMA',
    coordinates: { lat: 28.5672, lng: 77.2100 },
    address: 'Ring Road, Raj Nagar, Safdarjung Enclave, New Delhi 110029',
    phone: '+91 11 2658 8500',
    contactPerson: 'Dr. R. K. Sharma (Head of Transfusion Medicine)',
    refrigerationCapacities: { plateletAgitators: 180, coldStorage4C: 1400, frozenFreezer18C: 800 },
    status: 'CRITICAL_SHORTAGE',
    inventory: [
      { id: 'del-1', bloodType: 'O-', component: 'PRBC', units: 3, daysToExpiry: 18, lotNumber: 'IN-DL-09141', unitCost: 1850 },
      { id: 'del-2', bloodType: 'O+', component: 'PRBC', units: 16, daysToExpiry: 24, lotNumber: 'IN-DL-09142', unitCost: 1550 },
      { id: 'del-3', bloodType: 'O-', component: 'PLT', units: 1, daysToExpiry: 2, lotNumber: 'IN-DL-PL011', unitCost: 3200 },
      { id: 'del-4', bloodType: 'A+', component: 'PLT', units: 4, daysToExpiry: 4, lotNumber: 'IN-DL-PL012', unitCost: 3200 },
      { id: 'del-5', bloodType: 'AB+', component: 'FFP', units: 28, daysToExpiry: 190, lotNumber: 'IN-DL-FF008', unitCost: 800 },
      { id: 'del-6', bloodType: 'O-', component: 'WB', units: 2, daysToExpiry: 9, lotNumber: 'IN-DL-WB002', unitCost: 2100 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 20, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 5.5 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 10, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 2.8 },
      { bloodType: 'A+', component: 'PLT', requiredUnits: 6, criticality: 'CRITICAL_DEFICIT', burnRatePerHour: 1.5 },
    ],
  },
  {
    id: 'in-del-redcross-depot',
    name: 'Indian Red Cross Society National Headquarters Blood Centre',
    shortName: 'Indian Red Cross HQ',
    type: 'CENTRAL_BLOOD_DEPOT',
    coordinates: { lat: 28.6219, lng: 77.2104 },
    address: '1 Red Cross Road, Sansad Marg, New Delhi 110001',
    phone: '+91 11 2371 1551',
    contactPerson: 'Sanjay Deshmukh (Director, e-RaktKosh Regional Depot)',
    refrigerationCapacities: { plateletAgitators: 350, coldStorage4C: 3500, frozenFreezer18C: 2200 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'del-rc-1', bloodType: 'O-', component: 'PRBC', units: 42, daysToExpiry: 30, lotNumber: 'IN-DL-RC101', unitCost: 1850 },
      { id: 'del-rc-2', bloodType: 'O+', component: 'PRBC', units: 95, daysToExpiry: 32, lotNumber: 'IN-DL-RC102', unitCost: 1550 },
      { id: 'del-rc-3', bloodType: 'O-', component: 'PLT', units: 14, daysToExpiry: 4, lotNumber: 'IN-DL-RC201', unitCost: 3200 },
      { id: 'del-rc-4', bloodType: 'A+', component: 'PLT', units: 28, daysToExpiry: 3, lotNumber: 'IN-DL-RC202', unitCost: 3200 },
      { id: 'del-rc-5', bloodType: 'AB-', component: 'FFP', units: 85, daysToExpiry: 260, lotNumber: 'IN-DL-RC301', unitCost: 800 },
      { id: 'del-rc-6', bloodType: 'B+', component: 'PRBC', units: 45, daysToExpiry: 34, lotNumber: 'IN-DL-RC105', unitCost: 1550 },
    ],
    demands: [],
  },
  {
    id: 'in-del-safdarjung',
    name: 'VMMC & Safdarjung Multi-Specialty Hospital Blood Bank',
    shortName: 'Safdarjung Hospital',
    type: 'LEVEL_2_TRAUMA',
    coordinates: { lat: 28.5705, lng: 77.2078 },
    address: 'Ansari Nagar East, Ring Road, New Delhi 110029',
    phone: '+91 11 2616 5060',
    contactPerson: 'Dr. Meenakshi Sunder (Emergency Incharge)',
    refrigerationCapacities: { plateletAgitators: 60, coldStorage4C: 600, frozenFreezer18C: 350 },
    status: 'ELEVATED_DEMAND',
    inventory: [
      { id: 'del-sf-1', bloodType: 'O-', component: 'PRBC', units: 6, daysToExpiry: 14, lotNumber: 'IN-DL-SF11', unitCost: 1850 },
      { id: 'del-sf-2', bloodType: 'O+', component: 'PRBC', units: 22, daysToExpiry: 21, lotNumber: 'IN-DL-SF12', unitCost: 1550 },
      { id: 'del-sf-3', bloodType: 'A+', component: 'PLT', units: 3, daysToExpiry: 2, lotNumber: 'IN-DL-SF21', unitCost: 3200 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 8, criticality: 'CRITICAL_DEFICIT', burnRatePerHour: 2.0 },
    ],
  },
  {
    id: 'in-del-mayur-vihar',
    name: 'East Delhi Rotary Community Blood Centre',
    shortName: 'Rotary Blood Spoke',
    type: 'COMMUNITY_CLINIC',
    coordinates: { lat: 28.6082, lng: 77.2945 },
    address: 'Mayur Vihar Phase 1, Near Metro Station, Delhi 110091',
    phone: '+91 11 2275 8820',
    contactPerson: 'Anjali Nair, Lead Technologist',
    refrigerationCapacities: { plateletAgitators: 15, coldStorage4C: 90, frozenFreezer18C: 60 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'del-rot-1', bloodType: 'O-', component: 'PLT', units: 3, daysToExpiry: 1, lotNumber: 'IN-DL-ROT01', unitCost: 3200 }, // Perishable expiry
      { id: 'del-rot-2', bloodType: 'A+', component: 'PLT', units: 4, daysToExpiry: 1, lotNumber: 'IN-DL-ROT02', unitCost: 3200 }, // Perishable expiry
      { id: 'del-rot-3', bloodType: 'O-', component: 'PRBC', units: 7, daysToExpiry: 7, lotNumber: 'IN-DL-ROT03', unitCost: 1850 },
      { id: 'del-rot-4', bloodType: 'O+', component: 'PRBC', units: 14, daysToExpiry: 26, lotNumber: 'IN-DL-ROT04', unitCost: 1550 },
    ],
    demands: [],
  },
  {
    id: 'in-del-apollo',
    name: 'Indraprastha Apollo Hospital Blood Bank',
    shortName: 'Apollo Sarita Vihar',
    type: 'LEVEL_2_TRAUMA',
    coordinates: { lat: 28.5385, lng: 77.2831 },
    address: 'Delhi-Mathura Road, Sarita Vihar, New Delhi 110076',
    phone: '+91 11 2692 5858',
    contactPerson: 'Dr. Vivek Bansal',
    refrigerationCapacities: { plateletAgitators: 45, coldStorage4C: 450, frozenFreezer18C: 250 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'del-ap-1', bloodType: 'O-', component: 'PRBC', units: 12, daysToExpiry: 25, lotNumber: 'IN-DL-AP01', unitCost: 1850 },
      { id: 'del-ap-2', bloodType: 'AB+', component: 'PLT', units: 5, daysToExpiry: 3, lotNumber: 'IN-DL-AP02', unitCost: 3200 },
      { id: 'del-ap-3', bloodType: 'B+', component: 'PRBC', units: 18, daysToExpiry: 28, lotNumber: 'IN-DL-AP03', unitCost: 1550 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PLT', requiredUnits: 3, criticality: 'ELEVATED', burnRatePerHour: 0.6 },
    ],
  },
];

// 2. Mumbai - KEM, Tata Memorial & Western Suburban Medical Grid
const MUMBAI_NODES: FacilityNode[] = [
  {
    id: 'in-mum-kem-t1',
    name: 'KEM Hospital & Seth GS Medical College Blood Centre',
    shortName: 'KEM Hospital Parel',
    type: 'LEVEL_1_TRAUMA',
    coordinates: { lat: 19.0028, lng: 72.8423 },
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
    phone: '+91 22 2410 7000',
    contactPerson: 'Dr. Jayashree Sharma (HOD Transfusion Medicine)',
    refrigerationCapacities: { plateletAgitators: 150, coldStorage4C: 1200, frozenFreezer18C: 600 },
    status: 'CRITICAL_SHORTAGE',
    inventory: [
      { id: 'mum-1', bloodType: 'O-', component: 'PRBC', units: 2, daysToExpiry: 15, lotNumber: 'IN-MH-09141', unitCost: 1800 },
      { id: 'mum-2', bloodType: 'O+', component: 'PRBC', units: 18, daysToExpiry: 22, lotNumber: 'IN-MH-09142', unitCost: 1500 },
      { id: 'mum-3', bloodType: 'O-', component: 'PLT', units: 1, daysToExpiry: 2, lotNumber: 'IN-MH-PL01', unitCost: 3000 },
      { id: 'mum-4', bloodType: 'A+', component: 'PLT', units: 3, daysToExpiry: 3, lotNumber: 'IN-MH-PL02', unitCost: 3000 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 22, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 6.0 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 10, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 3.0 },
    ],
  },
  {
    id: 'in-mum-tata-depot',
    name: 'Tata Memorial Hospital & ACTREC Blood Bank',
    shortName: 'Tata Memorial Blood Bank',
    type: 'CENTRAL_BLOOD_DEPOT',
    coordinates: { lat: 19.0055, lng: 72.8435 },
    address: 'Dr. E Borges Road, Parel East, Mumbai 400012',
    phone: '+91 22 2417 7000',
    contactPerson: 'Dr. Sunil Rajadhyaksha (Transfusion Chief)',
    refrigerationCapacities: { plateletAgitators: 300, coldStorage4C: 2500, frozenFreezer18C: 1500 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'mum-tmh-1', bloodType: 'O-', component: 'PRBC', units: 35, daysToExpiry: 28, lotNumber: 'IN-MH-TMH01', unitCost: 1800 },
      { id: 'mum-tmh-2', bloodType: 'O+', component: 'PRBC', units: 80, daysToExpiry: 30, lotNumber: 'IN-MH-TMH02', unitCost: 1500 },
      { id: 'mum-tmh-3', bloodType: 'O-', component: 'PLT', units: 15, daysToExpiry: 4, lotNumber: 'IN-MH-TMH03', unitCost: 3000 },
      { id: 'mum-tmh-4', bloodType: 'A+', component: 'PLT', units: 25, daysToExpiry: 3, lotNumber: 'IN-MH-TMH04', unitCost: 3000 },
      { id: 'mum-tmh-5', bloodType: 'AB+', component: 'FFP', units: 70, daysToExpiry: 220, lotNumber: 'IN-MH-TMH05', unitCost: 800 },
    ],
    demands: [],
  },
  {
    id: 'in-mum-sion-t2',
    name: 'Lokmanya Tilak Municipal General Hospital (Sion Trauma)',
    shortName: 'Sion Hospital L2',
    type: 'LEVEL_2_TRAUMA',
    coordinates: { lat: 19.0381, lng: 72.8601 },
    address: 'Sion West, Mumbai, Maharashtra 400022',
    phone: '+91 22 2407 6381',
    contactPerson: 'Dr. Suresh Patil (Trauma Casualty)',
    refrigerationCapacities: { plateletAgitators: 40, coldStorage4C: 400, frozenFreezer18C: 200 },
    status: 'ELEVATED_DEMAND',
    inventory: [
      { id: 'mum-sn-1', bloodType: 'O-', component: 'PRBC', units: 5, daysToExpiry: 12, lotNumber: 'IN-MH-SN01', unitCost: 1800 },
      { id: 'mum-sn-2', bloodType: 'O+', component: 'PRBC', units: 15, daysToExpiry: 18, lotNumber: 'IN-MH-SN02', unitCost: 1500 },
      { id: 'mum-sn-3', bloodType: 'A+', component: 'PLT', units: 2, daysToExpiry: 1, lotNumber: 'IN-MH-SN03', unitCost: 3000 }, // Expiring!
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 8, criticality: 'CRITICAL_DEFICIT', burnRatePerHour: 2.2 },
    ],
  },
  {
    id: 'in-mum-lilavati',
    name: 'Lilavati Hospital & Research Centre Blood Centre',
    shortName: 'Lilavati Bandra',
    type: 'LEVEL_2_TRAUMA',
    coordinates: { lat: 19.0514, lng: 72.8291 },
    address: 'A-791, Bandra Reclamation, Bandra West, Mumbai 400050',
    phone: '+91 22 2675 1000',
    contactPerson: 'Kiran Mane, Blood Bank Incharge',
    refrigerationCapacities: { plateletAgitators: 35, coldStorage4C: 300, frozenFreezer18C: 180 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'mum-lv-1', bloodType: 'O-', component: 'PRBC', units: 14, daysToExpiry: 26, lotNumber: 'IN-MH-LV01', unitCost: 1800 },
      { id: 'mum-lv-2', bloodType: 'O+', component: 'PRBC', units: 30, daysToExpiry: 29, lotNumber: 'IN-MH-LV02', unitCost: 1500 },
      { id: 'mum-lv-3', bloodType: 'O-', component: 'PLT', units: 4, daysToExpiry: 3, lotNumber: 'IN-MH-LV03', unitCost: 3000 },
    ],
    demands: [],
  },
  {
    id: 'in-mum-ghatkopar-spoke',
    name: 'Samarpan Community Blood Centre',
    shortName: 'Samarpan Spoke',
    type: 'COMMUNITY_CLINIC',
    coordinates: { lat: 19.0862, lng: 72.9094 },
    address: 'LBS Marg, Ghatkopar West, Mumbai 400086',
    phone: '+91 22 2511 4422',
    contactPerson: 'Pooja Varma, Quality Manager',
    refrigerationCapacities: { plateletAgitators: 10, coldStorage4C: 60, frozenFreezer18C: 40 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'mum-sm-1', bloodType: 'O-', component: 'PLT', units: 3, daysToExpiry: 1, lotNumber: 'IN-MH-SM01', unitCost: 3000 }, // Spoilage danger
      { id: 'mum-sm-2', bloodType: 'A+', component: 'PLT', units: 4, daysToExpiry: 1, lotNumber: 'IN-MH-SM02', unitCost: 3000 },
      { id: 'mum-sm-3', bloodType: 'O+', component: 'PRBC', units: 12, daysToExpiry: 20, lotNumber: 'IN-MH-SM03', unitCost: 1500 },
    ],
    demands: [],
  },
];

// 3. Pune - Armed Forces Medical College & Ruby Hall Corridor
const PUNE_NODES: FacilityNode[] = [
  {
    id: 'in-pune-ruby-t1',
    name: 'Ruby Hall Clinic Apex Trauma & Blood Centre',
    shortName: 'Ruby Hall Apex',
    type: 'LEVEL_1_TRAUMA',
    coordinates: { lat: 18.5332, lng: 73.8768 },
    address: '40 Sassoon Road, Sangamvadi, Pune, Maharashtra 411001',
    phone: '+91 20 6645 5100',
    contactPerson: 'Dr. Snehal Mujumdar (Director Transfusion Medicine)',
    refrigerationCapacities: { plateletAgitators: 120, coldStorage4C: 900, frozenFreezer18C: 500 },
    status: 'CRITICAL_SHORTAGE',
    inventory: [
      { id: 'pn-1', bloodType: 'O-', component: 'PRBC', units: 2, daysToExpiry: 14, lotNumber: 'IN-PN-09141', unitCost: 1750 },
      { id: 'pn-2', bloodType: 'O+', component: 'PRBC', units: 14, daysToExpiry: 21, lotNumber: 'IN-PN-09142', unitCost: 1450 },
      { id: 'pn-3', bloodType: 'O-', component: 'PLT', units: 1, daysToExpiry: 2, lotNumber: 'IN-PN-PL01', unitCost: 2900 },
      { id: 'pn-4', bloodType: 'A+', component: 'PLT', units: 3, daysToExpiry: 3, lotNumber: 'IN-PN-PL02', unitCost: 2900 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 18, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 5.0 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 8, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 2.5 },
    ],
  },
  {
    id: 'in-pune-afmc-depot',
    name: 'Armed Forces Medical College (AFMC) Central Blood Bank',
    shortName: 'AFMC Blood Centre',
    type: 'CENTRAL_BLOOD_DEPOT',
    coordinates: { lat: 18.5028, lng: 73.8872 },
    address: 'Southern Command, Solapur Road, Wanowrie, Pune 411040',
    phone: '+91 20 2630 6000',
    contactPerson: 'Col. Dr. A. K. Joshi (Commanding Officer)',
    refrigerationCapacities: { plateletAgitators: 280, coldStorage4C: 2200, frozenFreezer18C: 1400 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'pn-afmc-1', bloodType: 'O-', component: 'PRBC', units: 38, daysToExpiry: 28, lotNumber: 'IN-PN-AF01', unitCost: 1750 },
      { id: 'pn-afmc-2', bloodType: 'O+', component: 'PRBC', units: 75, daysToExpiry: 32, lotNumber: 'IN-PN-AF02', unitCost: 1450 },
      { id: 'pn-afmc-3', bloodType: 'O-', component: 'PLT', units: 14, daysToExpiry: 4, lotNumber: 'IN-PN-AF03', unitCost: 2900 },
      { id: 'pn-afmc-4', bloodType: 'A+', component: 'PLT', units: 22, daysToExpiry: 3, lotNumber: 'IN-PN-AF04', unitCost: 2900 },
      { id: 'pn-afmc-5', bloodType: 'AB+', component: 'FFP', units: 65, daysToExpiry: 240, lotNumber: 'IN-PN-AF05', unitCost: 750 },
    ],
    demands: [],
  },
  {
    id: 'in-pune-sassoon-t2',
    name: 'Sassoon General Hospital & BJ Medical College',
    shortName: 'Sassoon Civil Hospital',
    type: 'LEVEL_2_TRAUMA',
    coordinates: { lat: 18.5262, lng: 73.8745 },
    address: 'Near Pune Railway Station, Sassoon Road, Pune 411001',
    phone: '+91 20 2612 8000',
    contactPerson: 'Dr. Ramesh Chavan (Casualty Officer)',
    refrigerationCapacities: { plateletAgitators: 45, coldStorage4C: 500, frozenFreezer18C: 250 },
    status: 'ELEVATED_DEMAND',
    inventory: [
      { id: 'pn-ss-1', bloodType: 'O-', component: 'PRBC', units: 6, daysToExpiry: 12, lotNumber: 'IN-PN-SS01', unitCost: 1750 },
      { id: 'pn-ss-2', bloodType: 'O+', component: 'PRBC', units: 18, daysToExpiry: 18, lotNumber: 'IN-PN-SS02', unitCost: 1450 },
      { id: 'pn-ss-3', bloodType: 'A+', component: 'PLT', units: 2, daysToExpiry: 1, lotNumber: 'IN-PN-SS03', unitCost: 2900 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 8, criticality: 'CRITICAL_DEFICIT', burnRatePerHour: 2.0 },
    ],
  },
  {
    id: 'in-pune-redcross-spoke',
    name: 'Poona Red Cross Society Blood Centre',
    shortName: 'Poona Red Cross Spoke',
    type: 'COMMUNITY_CLINIC',
    coordinates: { lat: 18.5181, lng: 73.8542 },
    address: '593 Rasta Peth, Near Apollo Theatre, Pune 411011',
    phone: '+91 20 2613 3222',
    contactPerson: 'Sunita Gaikwad, Operations Lead',
    refrigerationCapacities: { plateletAgitators: 12, coldStorage4C: 75, frozenFreezer18C: 50 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'pn-rc-1', bloodType: 'O-', component: 'PLT', units: 3, daysToExpiry: 1, lotNumber: 'IN-PN-RC01', unitCost: 2900 }, // Spoilage danger
      { id: 'pn-rc-2', bloodType: 'A+', component: 'PLT', units: 4, daysToExpiry: 1, lotNumber: 'IN-PN-RC02', unitCost: 2900 },
      { id: 'pn-rc-3', bloodType: 'O+', component: 'PRBC', units: 14, daysToExpiry: 22, lotNumber: 'IN-PN-RC03', unitCost: 1450 },
    ],
    demands: [],
  },
  {
    id: 'in-pune-mangeshkar',
    name: 'Deenanath Mangeshkar Hospital & Blood Bank',
    shortName: 'Deenanath Erandwane',
    type: 'LEVEL_2_TRAUMA',
    coordinates: { lat: 18.4984, lng: 73.8315 },
    address: 'Erandwane, Near Mhatre Bridge, Pune 411004',
    phone: '+91 20 4015 1000',
    contactPerson: 'Dr. Supriya Bhave',
    refrigerationCapacities: { plateletAgitators: 30, coldStorage4C: 350, frozenFreezer18C: 180 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'pn-dm-1', bloodType: 'O-', component: 'PRBC', units: 11, daysToExpiry: 24, lotNumber: 'IN-PN-DM01', unitCost: 1750 },
      { id: 'pn-dm-2', bloodType: 'O+', component: 'PRBC', units: 28, daysToExpiry: 28, lotNumber: 'IN-PN-DM02', unitCost: 1450 },
      { id: 'pn-dm-3', bloodType: 'O-', component: 'PLT', units: 4, daysToExpiry: 3, lotNumber: 'IN-PN-DM03', unitCost: 2900 },
    ],
    demands: [],
  },
];

// 4. Bengaluru - Victoria, NIMHANS & Narayana Health Grid
const BENGALURU_NODES: FacilityNode[] = [
  {
    id: 'in-blr-victoria-t1',
    name: 'Victoria Hospital & BMCRI Apex Trauma Care Centre',
    shortName: 'Victoria Hospital Trauma',
    type: 'LEVEL_1_TRAUMA',
    coordinates: { lat: 12.9634, lng: 77.5752 },
    address: 'Fort Road, Near City Market, Kalasipalya, Bengaluru 560002',
    phone: '+91 80 2670 1150',
    contactPerson: 'Dr. C. Shivaram (HOD Transfusion)',
    refrigerationCapacities: { plateletAgitators: 130, coldStorage4C: 1100, frozenFreezer18C: 550 },
    status: 'CRITICAL_SHORTAGE',
    inventory: [
      { id: 'blr-1', bloodType: 'O-', component: 'PRBC', units: 3, daysToExpiry: 16, lotNumber: 'IN-KA-09141', unitCost: 1800 },
      { id: 'blr-2', bloodType: 'O+', component: 'PRBC', units: 15, daysToExpiry: 23, lotNumber: 'IN-KA-09142', unitCost: 1500 },
      { id: 'blr-3', bloodType: 'O-', component: 'PLT', units: 1, daysToExpiry: 2, lotNumber: 'IN-KA-PL01', unitCost: 3100 },
      { id: 'blr-4', bloodType: 'A+', component: 'PLT', units: 3, daysToExpiry: 3, lotNumber: 'IN-KA-PL02', unitCost: 3100 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 20, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 5.2 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 9, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 2.7 },
    ],
  },
  {
    id: 'in-blr-narayana-depot',
    name: 'Narayana Health City Central Blood Transfusion Depot',
    shortName: 'Narayana Health City',
    type: 'CENTRAL_BLOOD_DEPOT',
    coordinates: { lat: 12.8252, lng: 77.6892 },
    address: '258/A, Bommasandra Industrial Area, Anekal Taluk, Bengaluru 560099',
    phone: '+91 80 7122 2222',
    contactPerson: 'Dr. Anand Kumar (Lead Transfusionist)',
    refrigerationCapacities: { plateletAgitators: 320, coldStorage4C: 2800, frozenFreezer18C: 1800 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'blr-nh-1', bloodType: 'O-', component: 'PRBC', units: 40, daysToExpiry: 29, lotNumber: 'IN-KA-NH01', unitCost: 1800 },
      { id: 'blr-nh-2', bloodType: 'O+', component: 'PRBC', units: 88, daysToExpiry: 31, lotNumber: 'IN-KA-NH02', unitCost: 1500 },
      { id: 'blr-nh-3', bloodType: 'O-', component: 'PLT', units: 16, daysToExpiry: 4, lotNumber: 'IN-KA-NH03', unitCost: 3100 },
      { id: 'blr-nh-4', bloodType: 'A+', component: 'PLT', units: 24, daysToExpiry: 3, lotNumber: 'IN-KA-NH04', unitCost: 3100 },
      { id: 'blr-nh-5', bloodType: 'AB+', component: 'FFP', units: 80, daysToExpiry: 250, lotNumber: 'IN-KA-NH05', unitCost: 800 },
    ],
    demands: [],
  },
  {
    id: 'in-blr-nimhans-t2',
    name: 'NIMHANS Neuro-Trauma Blood Bank',
    shortName: 'NIMHANS Trauma',
    type: 'LEVEL_2_TRAUMA',
    coordinates: { lat: 12.9392, lng: 77.5912 },
    address: 'Hosur Road, Lakkasandra, Bengaluru 560029',
    phone: '+91 80 2699 5000',
    contactPerson: 'Dr. V. Sudhakar (Neuro-Critical Care)',
    refrigerationCapacities: { plateletAgitators: 50, coldStorage4C: 450, frozenFreezer18C: 220 },
    status: 'ELEVATED_DEMAND',
    inventory: [
      { id: 'blr-nim-1', bloodType: 'O-', component: 'PRBC', units: 6, daysToExpiry: 13, lotNumber: 'IN-KA-NM01', unitCost: 1800 },
      { id: 'blr-nim-2', bloodType: 'O+', component: 'PRBC', units: 18, daysToExpiry: 19, lotNumber: 'IN-KA-NM02', unitCost: 1500 },
      { id: 'blr-nim-3', bloodType: 'A+', component: 'PLT', units: 2, daysToExpiry: 1, lotNumber: 'IN-KA-NM03', unitCost: 3100 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 8, criticality: 'CRITICAL_DEFICIT', burnRatePerHour: 2.1 },
    ],
  },
  {
    id: 'in-blr-rotary-spoke',
    name: 'Rotary TTK Community Blood Bank',
    shortName: 'Rotary TTK Spoke',
    type: 'COMMUNITY_CLINIC',
    coordinates: { lat: 12.9815, lng: 77.6254 },
    address: 'New Thippasandra Main Road, HAL 3rd Stage, Bengaluru 560075',
    phone: '+91 80 2528 7903',
    contactPerson: 'Latha Rao, Blood Bank Officer',
    refrigerationCapacities: { plateletAgitators: 14, coldStorage4C: 80, frozenFreezer18C: 50 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'blr-rot-1', bloodType: 'O-', component: 'PLT', units: 3, daysToExpiry: 1, lotNumber: 'IN-KA-RT01', unitCost: 3100 },
      { id: 'blr-rot-2', bloodType: 'A+', component: 'PLT', units: 4, daysToExpiry: 1, lotNumber: 'IN-KA-RT02', unitCost: 3100 },
      { id: 'blr-rot-3', bloodType: 'O+', component: 'PRBC', units: 14, daysToExpiry: 22, lotNumber: 'IN-KA-RT03', unitCost: 1500 },
    ],
    demands: [],
  },
];

// 5. Hyderabad & Telangana Grid
const HYDERABAD_NODES: FacilityNode[] = [
  {
    id: 'in-hyd-nims-t1',
    name: 'Nizam’s Institute of Medical Sciences (NIMS) Blood Centre',
    shortName: 'NIMS Apex Trauma',
    type: 'LEVEL_1_TRAUMA',
    coordinates: { lat: 17.4243, lng: 78.4529 },
    address: 'Punjagutta, Hyderabad, Telangana 500082',
    phone: '+91 40 2348 9000',
    contactPerson: 'Dr. V. Chandrasekhar, Head Transfusion Medicine',
    refrigerationCapacities: { plateletAgitators: 120, coldStorage4C: 1100, frozenFreezer18C: 600 },
    status: 'CRITICAL_SHORTAGE',
    inventory: [
      { id: 'hyd-1', bloodType: 'O-', component: 'PRBC', units: 4, daysToExpiry: 19, lotNumber: 'IN-TG-011', unitCost: 1850 },
      { id: 'hyd-2', bloodType: 'O+', component: 'PRBC', units: 28, daysToExpiry: 26, lotNumber: 'IN-TG-012', unitCost: 1550 },
      { id: 'hyd-3', bloodType: 'O-', component: 'PLT', units: 2, daysToExpiry: 2, lotNumber: 'IN-TG-PL01', unitCost: 3200 },
      { id: 'hyd-4', bloodType: 'A+', component: 'PLT', units: 5, daysToExpiry: 3, lotNumber: 'IN-TG-PL02', unitCost: 3200 },
      { id: 'hyd-5', bloodType: 'B+', component: 'PRBC', units: 32, daysToExpiry: 31, lotNumber: 'IN-TG-015', unitCost: 1550 },
      { id: 'hyd-6', bloodType: 'AB+', component: 'FFP', units: 22, daysToExpiry: 195, lotNumber: 'IN-TG-FF01', unitCost: 800 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 15, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 4.0 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 8, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 2.0 },
    ],
  },
  {
    id: 'in-hyd-osmania-t2',
    name: 'Osmania General Hospital Blood Bank',
    shortName: 'Osmania General',
    type: 'LEVEL_2_TRAUMA',
    coordinates: { lat: 17.3789, lng: 78.4735 },
    address: 'Afzal Gunj, Charminar, Hyderabad 500012',
    phone: '+91 40 2460 0121',
    contactPerson: 'Dr. G. Sunita, Deputy Medical Superintendent',
    refrigerationCapacities: { plateletAgitators: 90, coldStorage4C: 900, frozenFreezer18C: 500 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'hyd-osm-1', bloodType: 'O-', component: 'PRBC', units: 22, daysToExpiry: 28, lotNumber: 'IN-TG-OS1', unitCost: 1850 },
      { id: 'hyd-osm-2', bloodType: 'O+', component: 'PRBC', units: 64, daysToExpiry: 34, lotNumber: 'IN-TG-OS2', unitCost: 1550 },
      { id: 'hyd-osm-3', bloodType: 'O-', component: 'PLT', units: 9, daysToExpiry: 4, lotNumber: 'IN-TG-OS3', unitCost: 3200 },
      { id: 'hyd-osm-4', bloodType: 'B+', component: 'PRBC', units: 48, daysToExpiry: 29, lotNumber: 'IN-TG-OS4', unitCost: 1550 },
      { id: 'hyd-osm-5', bloodType: 'AB-', component: 'FFP', units: 35, daysToExpiry: 250, lotNumber: 'IN-TG-OS5', unitCost: 800 },
    ],
    demands: [],
  },
  {
    id: 'in-hyd-apollo-jubilee',
    name: 'Apollo Hospital Transfusion Medicine Centre Jubilee Hills',
    shortName: 'Apollo Jubilee',
    type: 'CENTRAL_BLOOD_DEPOT',
    coordinates: { lat: 17.4304, lng: 78.4110 },
    address: 'Road No. 72, Film Nagar, Jubilee Hills, Hyderabad 500033',
    phone: '+91 40 2360 7777',
    contactPerson: 'Dr. K. Srinivas, Blood Bank Officer',
    refrigerationCapacities: { plateletAgitators: 180, coldStorage4C: 2200, frozenFreezer18C: 1200 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'hyd-apl-1', bloodType: 'O-', component: 'PRBC', units: 30, daysToExpiry: 30, lotNumber: 'IN-TG-AP1', unitCost: 1850 },
      { id: 'hyd-apl-2', bloodType: 'A+', component: 'PRBC', units: 45, daysToExpiry: 32, lotNumber: 'IN-TG-AP2', unitCost: 1550 },
      { id: 'hyd-apl-3', bloodType: 'A+', component: 'PLT', units: 14, daysToExpiry: 4, lotNumber: 'IN-TG-AP3', unitCost: 3200 },
    ],
    demands: [],
  },
];

// 6. Chennai & Tamil Nadu Grid
const CHENNAI_NODES: FacilityNode[] = [
  {
    id: 'in-chn-rajivgandhi-t1',
    name: 'Rajiv Gandhi Government General Hospital (RGGGH) Blood Bank',
    shortName: 'Rajiv Gandhi GH Apex',
    type: 'LEVEL_1_TRAUMA',
    coordinates: { lat: 13.0827, lng: 80.2785 },
    address: 'EVR Periyar Salai, Park Town, Chennai, Tamil Nadu 600003',
    phone: '+91 44 2530 5000',
    contactPerson: 'Dr. S. Subhashini, Director of Blood Transfusion Services',
    refrigerationCapacities: { plateletAgitators: 150, coldStorage4C: 1600, frozenFreezer18C: 900 },
    status: 'CRITICAL_SHORTAGE',
    inventory: [
      { id: 'chn-1', bloodType: 'O-', component: 'PRBC', units: 3, daysToExpiry: 16, lotNumber: 'IN-TN-001', unitCost: 1850 },
      { id: 'chn-2', bloodType: 'O+', component: 'PRBC', units: 25, daysToExpiry: 24, lotNumber: 'IN-TN-002', unitCost: 1550 },
      { id: 'chn-3', bloodType: 'O-', component: 'PLT', units: 1, daysToExpiry: 2, lotNumber: 'IN-TN-PL1', unitCost: 3200 },
      { id: 'chn-4', bloodType: 'B+', component: 'PLT', units: 4, daysToExpiry: 3, lotNumber: 'IN-TN-PL2', unitCost: 3200 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 18, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 4.8 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 7, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 2.2 },
    ],
  },
  {
    id: 'in-chn-mmc-depot',
    name: 'Madras Medical College Central Transfusion Hub',
    shortName: 'MMC Central Hub',
    type: 'CENTRAL_BLOOD_DEPOT',
    coordinates: { lat: 13.0805, lng: 80.2745 },
    address: 'Park Town, Chennai 600001',
    phone: '+91 44 2530 5112',
    contactPerson: 'Dr. R. Kannan, Chief Transfusion Scientist',
    refrigerationCapacities: { plateletAgitators: 220, coldStorage4C: 2800, frozenFreezer18C: 1500 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'chn-mmc-1', bloodType: 'O-', component: 'PRBC', units: 38, daysToExpiry: 32, lotNumber: 'IN-TN-MC1', unitCost: 1850 },
      { id: 'chn-mmc-2', bloodType: 'O+', component: 'PRBC', units: 88, daysToExpiry: 35, lotNumber: 'IN-TN-MC2', unitCost: 1550 },
      { id: 'chn-mmc-3', bloodType: 'O-', component: 'PLT', units: 16, daysToExpiry: 4, lotNumber: 'IN-TN-MC3', unitCost: 3200 },
      { id: 'chn-mmc-4', bloodType: 'A+', component: 'PLT', units: 24, daysToExpiry: 3, lotNumber: 'IN-TN-MC4', unitCost: 3200 },
      { id: 'chn-mmc-5', bloodType: 'AB-', component: 'FFP', units: 60, daysToExpiry: 240, lotNumber: 'IN-TN-MC5', unitCost: 800 },
    ],
    demands: [],
  },
  {
    id: 'in-chn-apollo-greams',
    name: 'Apollo Hospital Blood Bank Greams Road',
    shortName: 'Apollo Greams',
    type: 'LEVEL_2_TRAUMA',
    coordinates: { lat: 13.0569, lng: 80.2520 },
    address: '21 Greams Lane, Thousand Lights, Chennai 600006',
    phone: '+91 44 2829 0200',
    contactPerson: 'Dr. M. Sangeetha, Chief Pathologist',
    refrigerationCapacities: { plateletAgitators: 80, coldStorage4C: 850, frozenFreezer18C: 450 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'chn-apg-1', bloodType: 'O-', component: 'PRBC', units: 12, daysToExpiry: 22, lotNumber: 'IN-TN-AG1', unitCost: 1850 },
      { id: 'chn-apg-2', bloodType: 'O+', component: 'PRBC', units: 34, daysToExpiry: 27, lotNumber: 'IN-TN-AG2', unitCost: 1550 },
    ],
    demands: [],
  },
];

// 7. Kolkata & West Bengal Grid
const KOLKATA_NODES: FacilityNode[] = [
  {
    id: 'in-kol-sskm-t1',
    name: 'SSKM Hospital & IPGMER Apex Trauma Blood Bank',
    shortName: 'SSKM IPGMER Apex',
    type: 'LEVEL_1_TRAUMA',
    coordinates: { lat: 22.5392, lng: 88.3425 },
    address: '244 AJC Bose Road, Bhowanipore, Kolkata, West Bengal 700020',
    phone: '+91 33 2223 1589',
    contactPerson: 'Prof. Subrata Mukherjee, Transfusion Head',
    refrigerationCapacities: { plateletAgitators: 140, coldStorage4C: 1500, frozenFreezer18C: 800 },
    status: 'CRITICAL_SHORTAGE',
    inventory: [
      { id: 'kol-1', bloodType: 'O-', component: 'PRBC', units: 2, daysToExpiry: 14, lotNumber: 'IN-WB-01', unitCost: 1850 },
      { id: 'kol-2', bloodType: 'O+', component: 'PRBC', units: 19, daysToExpiry: 22, lotNumber: 'IN-WB-02', unitCost: 1550 },
      { id: 'kol-3', bloodType: 'O-', component: 'PLT', units: 1, daysToExpiry: 2, lotNumber: 'IN-WB-PL1', unitCost: 3200 },
      { id: 'kol-4', bloodType: 'B+', component: 'PRBC', units: 26, daysToExpiry: 28, lotNumber: 'IN-WB-03', unitCost: 1550 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 20, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 5.0 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 10, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 2.5 },
    ],
  },
  {
    id: 'in-kol-cmc-depot',
    name: 'Calcutta Medical College Regional Central Blood Centre',
    shortName: 'Calcutta Med College',
    type: 'CENTRAL_BLOOD_DEPOT',
    coordinates: { lat: 22.5732, lng: 88.3622 },
    address: '88 College Street, Bowbazar, Kolkata 700073',
    phone: '+91 33 2255 1634',
    contactPerson: 'Dr. Ananya Roy, Central Depot Officer',
    refrigerationCapacities: { plateletAgitators: 200, coldStorage4C: 2600, frozenFreezer18C: 1400 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'kol-cmc-1', bloodType: 'O-', component: 'PRBC', units: 44, daysToExpiry: 31, lotNumber: 'IN-WB-MC1', unitCost: 1850 },
      { id: 'kol-cmc-2', bloodType: 'O+', component: 'PRBC', units: 92, daysToExpiry: 34, lotNumber: 'IN-WB-MC2', unitCost: 1550 },
      { id: 'kol-cmc-3', bloodType: 'O-', component: 'PLT', units: 15, daysToExpiry: 4, lotNumber: 'IN-WB-MC3', unitCost: 3200 },
      { id: 'kol-cmc-4', bloodType: 'A+', component: 'PLT', units: 22, daysToExpiry: 3, lotNumber: 'IN-WB-MC4', unitCost: 3200 },
      { id: 'kol-cmc-5', bloodType: 'AB-', component: 'FFP', units: 70, daysToExpiry: 260, lotNumber: 'IN-WB-MC5', unitCost: 800 },
    ],
    demands: [],
  },
];

// 8. Ahmedabad & Gujarat Grid
const AHMEDABAD_NODES: FacilityNode[] = [
  {
    id: 'in-ahm-civil-t1',
    name: 'Civil Hospital Asarwa Apex Trauma Blood Bank',
    shortName: 'Civil Asarwa Apex',
    type: 'LEVEL_1_TRAUMA',
    coordinates: { lat: 23.0525, lng: 72.6035 },
    address: 'Asarwa, Ahmedabad, Gujarat 380016',
    phone: '+91 79 2268 3721',
    contactPerson: 'Dr. J. P. Modi, Transfusion Incharge',
    refrigerationCapacities: { plateletAgitators: 160, coldStorage4C: 1800, frozenFreezer18C: 1000 },
    status: 'CRITICAL_SHORTAGE',
    inventory: [
      { id: 'ahm-1', bloodType: 'O-', component: 'PRBC', units: 3, daysToExpiry: 15, lotNumber: 'IN-GJ-01', unitCost: 1850 },
      { id: 'ahm-2', bloodType: 'O+', component: 'PRBC', units: 22, daysToExpiry: 25, lotNumber: 'IN-GJ-02', unitCost: 1550 },
      { id: 'ahm-3', bloodType: 'O-', component: 'PLT', units: 1, daysToExpiry: 2, lotNumber: 'IN-GJ-PL1', unitCost: 3200 },
      { id: 'ahm-4', bloodType: 'B+', component: 'PRBC', units: 35, daysToExpiry: 30, lotNumber: 'IN-GJ-03', unitCost: 1550 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 16, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 4.5 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 8, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 2.0 },
    ],
  },
  {
    id: 'in-ahm-redcross-depot',
    name: 'Indian Red Cross Society Gujarat State Blood Centre',
    shortName: 'Gujarat Red Cross HQ',
    type: 'CENTRAL_BLOOD_DEPOT',
    coordinates: { lat: 23.0315, lng: 72.5695 },
    address: 'Red Cross Bhawan, Ashram Road, Paldi, Ahmedabad 380006',
    phone: '+91 79 2657 8888',
    contactPerson: 'Dr. Prakash Patel, General Secretary',
    refrigerationCapacities: { plateletAgitators: 250, coldStorage4C: 3000, frozenFreezer18C: 1800 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'ahm-rc-1', bloodType: 'O-', component: 'PRBC', units: 48, daysToExpiry: 33, lotNumber: 'IN-GJ-RC1', unitCost: 1850 },
      { id: 'ahm-rc-2', bloodType: 'O+', component: 'PRBC', units: 110, daysToExpiry: 36, lotNumber: 'IN-GJ-RC2', unitCost: 1550 },
      { id: 'ahm-rc-3', bloodType: 'O-', component: 'PLT', units: 18, daysToExpiry: 4, lotNumber: 'IN-GJ-RC3', unitCost: 3200 },
      { id: 'ahm-rc-4', bloodType: 'A+', component: 'PLT', units: 30, daysToExpiry: 3, lotNumber: 'IN-GJ-RC4', unitCost: 3200 },
      { id: 'ahm-rc-5', bloodType: 'AB-', component: 'FFP', units: 90, daysToExpiry: 270, lotNumber: 'IN-GJ-RC5', unitCost: 800 },
    ],
    demands: [],
  },
];

// 9. Lucknow & Uttar Pradesh Grid
const LUCKNOW_NODES: FacilityNode[] = [
  {
    id: 'in-lko-kgmu-t1',
    name: 'King George’s Medical University (KGMU) Blood Bank & Trauma',
    shortName: 'KGMU Apex Trauma',
    type: 'LEVEL_1_TRAUMA',
    coordinates: { lat: 26.8682, lng: 80.9165 },
    address: 'Shah Mina Road, Chowk, Lucknow, Uttar Pradesh 226003',
    phone: '+91 522 225 7540',
    contactPerson: 'Prof. Tulika Chandra, Head Transfusion Medicine',
    refrigerationCapacities: { plateletAgitators: 180, coldStorage4C: 2000, frozenFreezer18C: 1100 },
    status: 'CRITICAL_SHORTAGE',
    inventory: [
      { id: 'lko-1', bloodType: 'O-', component: 'PRBC', units: 4, daysToExpiry: 17, lotNumber: 'IN-UP-01', unitCost: 1850 },
      { id: 'lko-2', bloodType: 'O+', component: 'PRBC', units: 26, daysToExpiry: 26, lotNumber: 'IN-UP-02', unitCost: 1550 },
      { id: 'lko-3', bloodType: 'O-', component: 'PLT', units: 2, daysToExpiry: 2, lotNumber: 'IN-UP-PL1', unitCost: 3200 },
      { id: 'lko-4', bloodType: 'B+', component: 'PRBC', units: 40, daysToExpiry: 32, lotNumber: 'IN-UP-03', unitCost: 1550 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 22, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 5.2 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 12, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 2.8 },
    ],
  },
  {
    id: 'in-lko-sgpgi-depot',
    name: 'SGPGIMS Blood Transfusion Medicine Super-Specialty Hub',
    shortName: 'SGPGIMS Transfusion',
    type: 'CENTRAL_BLOOD_DEPOT',
    coordinates: { lat: 26.7582, lng: 80.9412 },
    address: 'Raebareli Road, Lucknow 226014',
    phone: '+91 522 249 4000',
    contactPerson: 'Dr. Rajendra Chaudhary, Chair Transfusion Dept',
    refrigerationCapacities: { plateletAgitators: 220, coldStorage4C: 2800, frozenFreezer18C: 1500 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'lko-pgi-1', bloodType: 'O-', component: 'PRBC', units: 42, daysToExpiry: 32, lotNumber: 'IN-UP-PGI1', unitCost: 1850 },
      { id: 'lko-pgi-2', bloodType: 'O+', component: 'PRBC', units: 95, daysToExpiry: 35, lotNumber: 'IN-UP-PGI2', unitCost: 1550 },
      { id: 'lko-pgi-3', bloodType: 'O-', component: 'PLT', units: 14, daysToExpiry: 4, lotNumber: 'IN-UP-PGI3', unitCost: 3200 },
      { id: 'lko-pgi-4', bloodType: 'A+', component: 'PLT', units: 25, daysToExpiry: 3, lotNumber: 'IN-UP-PGI4', unitCost: 3200 },
      { id: 'lko-pgi-5', bloodType: 'AB-', component: 'FFP', units: 80, daysToExpiry: 260, lotNumber: 'IN-UP-PGI5', unitCost: 800 },
    ],
    demands: [],
  },
];

// 10. Jaipur & Rajasthan Grid
const JAIPUR_NODES: FacilityNode[] = [
  {
    id: 'in-jpr-sms-t1',
    name: 'Sawai Man Singh (SMS) Hospital Blood Centre & Trauma Apex',
    shortName: 'SMS Hospital Jaipur',
    type: 'LEVEL_1_TRAUMA',
    coordinates: { lat: 26.9082, lng: 75.8165 },
    address: 'Jawahar Lal Nehru Marg, Jaipur, Rajasthan 302004',
    phone: '+91 141 251 8224',
    contactPerson: 'Dr. Sunita Bundas, Head of Transfusion Services',
    refrigerationCapacities: { plateletAgitators: 150, coldStorage4C: 1700, frozenFreezer18C: 950 },
    status: 'CRITICAL_SHORTAGE',
    inventory: [
      { id: 'jpr-1', bloodType: 'O-', component: 'PRBC', units: 3, daysToExpiry: 16, lotNumber: 'IN-RJ-01', unitCost: 1850 },
      { id: 'jpr-2', bloodType: 'O+', component: 'PRBC', units: 24, daysToExpiry: 25, lotNumber: 'IN-RJ-02', unitCost: 1550 },
      { id: 'jpr-3', bloodType: 'O-', component: 'PLT', units: 1, daysToExpiry: 2, lotNumber: 'IN-RJ-PL1', unitCost: 3200 },
      { id: 'jpr-4', bloodType: 'B+', component: 'PRBC', units: 36, daysToExpiry: 31, lotNumber: 'IN-RJ-03', unitCost: 1550 },
    ],
    demands: [
      { bloodType: 'O-', component: 'PRBC', requiredUnits: 15, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 4.2 },
      { bloodType: 'O-', component: 'PLT', requiredUnits: 8, criticality: 'CODE_RED_TRAUMA', burnRatePerHour: 2.1 },
    ],
  },
  {
    id: 'in-jpr-sdmh-depot',
    name: 'Santokba Durlabhji Memorial Hospital (SDMH) Blood Centre',
    shortName: 'SDMH Blood Depot',
    type: 'CENTRAL_BLOOD_DEPOT',
    coordinates: { lat: 26.8925, lng: 75.8015 },
    address: 'Bhawani Singh Road, Near Rambagh Circle, Jaipur 302015',
    phone: '+91 141 256 6251',
    contactPerson: 'Dr. Alok Srivastava, Medical Director',
    refrigerationCapacities: { plateletAgitators: 120, coldStorage4C: 1400, frozenFreezer18C: 800 },
    status: 'OPTIMAL',
    inventory: [
      { id: 'jpr-sd-1', bloodType: 'O-', component: 'PRBC', units: 28, daysToExpiry: 29, lotNumber: 'IN-RJ-SD1', unitCost: 1850 },
      { id: 'jpr-sd-2', bloodType: 'O+', component: 'PRBC', units: 68, daysToExpiry: 33, lotNumber: 'IN-RJ-SD2', unitCost: 1550 },
      { id: 'jpr-sd-3', bloodType: 'O-', component: 'PLT', units: 11, daysToExpiry: 4, lotNumber: 'IN-RJ-SD3', unitCost: 3200 },
      { id: 'jpr-sd-4', bloodType: 'A+', component: 'PLT', units: 19, daysToExpiry: 3, lotNumber: 'IN-RJ-SD4', unitCost: 3200 },
      { id: 'jpr-sd-5', bloodType: 'AB-', component: 'FFP', units: 45, daysToExpiry: 230, lotNumber: 'IN-RJ-SD5', unitCost: 800 },
    ],
    demands: [],
  },
];

// 11. Pan-India All-India Apex Mesh (11 National Apex Transfusion Nodes across India)
const ALL_INDIA_APEX_NODES: FacilityNode[] = [
  DELHI_NODES[0],
  DELHI_NODES[1],
  MUMBAI_NODES[0],
  PUNE_NODES[0],
  BENGALURU_NODES[0],
  HYDERABAD_NODES[0],
  CHENNAI_NODES[0],
  KOLKATA_NODES[0],
  AHMEDABAD_NODES[0],
  LUCKNOW_NODES[0],
  JAIPUR_NODES[0],
];

// Indian Active Rapid Response Units (108 Ambulances, LifeMobile Buses, Aero Drones)
export const INDIAN_DEVICES: Record<IndianRegionKey, NearbyDevice[]> = {
  DELHI_NCR: [
    {
      id: 'in-dev-del-108',
      name: 'CATS 108 Emergency Blood Ambulance #18',
      type: 'EMERGENCY_AMBULANCE_AMB',
      coordinates: { lat: 28.5721, lng: 77.2145 },
      distanceKm: 1.2,
      etaMinutes: 3,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'CATS EMS Net 108',
      onboardUnits: [
        { bloodType: 'O-', component: 'PRBC', units: 6 },
        { bloodType: 'O+', component: 'PRBC', units: 10 },
      ],
      coldStorageTempCelsius: 3.8,
      operatorName: 'Paramedic Rajesh Verma (CATS Delhi)',
      batteryOrFuelPercent: 91,
    },
    {
      id: 'in-dev-del-drone',
      name: 'ICMR-iDrone Aero-Rescue Pod Alpha',
      type: 'AERO_DRONE_POD',
      coordinates: { lat: 28.5852, lng: 77.2215 },
      distanceKm: 1.8,
      etaMinutes: 2,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'ICMR SkyLink #09',
      onboardUnits: [
        { bloodType: 'O-', component: 'PLT', units: 2 },
        { bloodType: 'O-', component: 'PRBC', units: 4 },
      ],
      coldStorageTempCelsius: 21.8,
      operatorName: 'UAV Flight Officer Priya Nair',
      batteryOrFuelPercent: 96,
    },
    {
      id: 'in-dev-del-bus',
      name: 'Red Cross LifeMobile Bus #03',
      type: 'MOBILE_BLOOD_BUS',
      coordinates: { lat: 28.6045, lng: 77.2185 },
      distanceKm: 2.6,
      etaMinutes: 7,
      status: 'COLLECTING_DONATIONS',
      contactRadio: 'IRC Mobile Unit DL-03',
      onboardUnits: [
        { bloodType: 'O+', component: 'PRBC', units: 18 },
        { bloodType: 'A+', component: 'PRBC', units: 12 },
      ],
      coldStorageTempCelsius: 4.2,
      operatorName: 'Dr. K. S. Tyagi',
      batteryOrFuelPercent: 88,
    },
  ],
  MUMBAI: [
    {
      id: 'in-dev-mum-108',
      name: '108 MEMS Emergency Trauma Ambulance #24',
      type: 'EMERGENCY_AMBULANCE_AMB',
      coordinates: { lat: 19.0145, lng: 72.8482 },
      distanceKm: 1.3,
      etaMinutes: 4,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'MEMS Mumbai Direct Line',
      onboardUnits: [
        { bloodType: 'O-', component: 'PRBC', units: 6 },
        { bloodType: 'O-', component: 'WB', units: 3 },
      ],
      coldStorageTempCelsius: 3.9,
      operatorName: 'EMT Sachin Sawant',
      batteryOrFuelPercent: 94,
    },
    {
      id: 'in-dev-mum-bus',
      name: 'Mumbai Blood Initiative Mobile Bus #02',
      type: 'MOBILE_BLOOD_BUS',
      coordinates: { lat: 19.0225, lng: 72.8542 },
      distanceKm: 1.9,
      etaMinutes: 5,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'SBTC MH Network',
      onboardUnits: [
        { bloodType: 'O+', component: 'PRBC', units: 14 },
        { bloodType: 'B+', component: 'PRBC', units: 10 },
      ],
      coldStorageTempCelsius: 4.0,
      operatorName: 'Bio-Technician Amit Patil',
      batteryOrFuelPercent: 89,
    },
  ],
  PUNE: [
    {
      id: 'in-dev-pune-108',
      name: '108 Pune Emergency Trauma Unit #05',
      type: 'EMERGENCY_AMBULANCE_AMB',
      coordinates: { lat: 18.5215, lng: 73.8642 },
      distanceKm: 1.1,
      etaMinutes: 3,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'Pune MEMS Command',
      onboardUnits: [
        { bloodType: 'O-', component: 'PRBC', units: 5 },
        { bloodType: 'O+', component: 'PRBC', units: 12 },
      ],
      coldStorageTempCelsius: 3.7,
      operatorName: 'Paramedic Nitin Shinde',
      batteryOrFuelPercent: 92,
    },
    {
      id: 'in-dev-pune-drone',
      name: 'Pune Aero-Med Drone Rapid Pod #01',
      type: 'AERO_DRONE_POD',
      coordinates: { lat: 18.5285, lng: 73.8695 },
      distanceKm: 1.4,
      etaMinutes: 2,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'AFMC Air Corridor Alpha',
      onboardUnits: [
        { bloodType: 'O-', component: 'PLT', units: 2 },
        { bloodType: 'O-', component: 'PRBC', units: 3 },
      ],
      coldStorageTempCelsius: 21.9,
      operatorName: 'Capt. Rohini Jadhav',
      batteryOrFuelPercent: 97,
    },
  ],
  BENGALURU: [
    {
      id: 'in-dev-blr-108',
      name: 'Arogya Kavacha 108 Rapid Ambulance #14',
      type: 'EMERGENCY_AMBULANCE_AMB',
      coordinates: { lat: 12.9515, lng: 77.5812 },
      distanceKm: 1.2,
      etaMinutes: 4,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'Karnataka EMS 108',
      onboardUnits: [
        { bloodType: 'O-', component: 'PRBC', units: 6 },
        { bloodType: 'O+', component: 'PRBC', units: 10 },
      ],
      coldStorageTempCelsius: 3.8,
      operatorName: 'Paramedic Harish Gowda',
      batteryOrFuelPercent: 90,
    },
  ],
  HYDERABAD: [
    {
      id: 'in-dev-hyd-108',
      name: '108 EMRI Telangana Rapid Ambulance #07',
      type: 'EMERGENCY_AMBULANCE_AMB',
      coordinates: { lat: 17.4190, lng: 78.4480 },
      distanceKm: 1.0,
      etaMinutes: 3,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'GVK EMRI 108 Hyderabad',
      onboardUnits: [
        { bloodType: 'O-', component: 'PRBC', units: 5 },
        { bloodType: 'O+', component: 'PRBC', units: 12 },
      ],
      coldStorageTempCelsius: 3.8,
      operatorName: 'Paramedic Mallesh Reddy',
      batteryOrFuelPercent: 93,
    },
  ],
  CHENNAI: [
    {
      id: 'in-dev-chn-108',
      name: '108 TN GVK EMRI Blood Ambulance #21',
      type: 'EMERGENCY_AMBULANCE_AMB',
      coordinates: { lat: 13.0780, lng: 80.2710 },
      distanceKm: 1.1,
      etaMinutes: 3,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'Tamil Nadu 108 EMS Command',
      onboardUnits: [
        { bloodType: 'O-', component: 'PRBC', units: 6 },
        { bloodType: 'O+', component: 'PRBC', units: 11 },
      ],
      coldStorageTempCelsius: 3.7,
      operatorName: 'Paramedic K. Murugan',
      batteryOrFuelPercent: 91,
    },
  ],
  KOLKATA: [
    {
      id: 'in-dev-kol-108',
      name: '102/108 Bengal Emergency Blood Van #11',
      type: 'EMERGENCY_AMBULANCE_AMB',
      coordinates: { lat: 22.5420, lng: 88.3490 },
      distanceKm: 1.3,
      etaMinutes: 4,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'Swasthya Bhawan Net',
      onboardUnits: [
        { bloodType: 'O-', component: 'PRBC', units: 4 },
        { bloodType: 'B+', component: 'PRBC', units: 14 },
      ],
      coldStorageTempCelsius: 3.9,
      operatorName: 'Paramedic Sourav Das',
      batteryOrFuelPercent: 89,
    },
  ],
  AHMEDABAD: [
    {
      id: 'in-dev-ahm-108',
      name: '108 GVK EMRI Gujarat Trauma Mobile #33',
      type: 'EMERGENCY_AMBULANCE_AMB',
      coordinates: { lat: 23.0480, lng: 72.5990 },
      distanceKm: 1.0,
      etaMinutes: 3,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'Gujarat 108 Kathwada Hub',
      onboardUnits: [
        { bloodType: 'O-', component: 'PRBC', units: 5 },
        { bloodType: 'O+', component: 'PRBC', units: 15 },
      ],
      coldStorageTempCelsius: 3.8,
      operatorName: 'Paramedic Hiren Pandya',
      batteryOrFuelPercent: 94,
    },
  ],
  LUCKNOW: [
    {
      id: 'in-dev-lko-108',
      name: '108 UP ALS Trauma Mobile Unit #19',
      type: 'EMERGENCY_AMBULANCE_AMB',
      coordinates: { lat: 26.8620, lng: 80.9220 },
      distanceKm: 1.2,
      etaMinutes: 3,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'UP 108 ALS Command Lucknow',
      onboardUnits: [
        { bloodType: 'O-', component: 'PRBC', units: 6 },
        { bloodType: 'O+', component: 'PRBC', units: 12 },
      ],
      coldStorageTempCelsius: 3.6,
      operatorName: 'Paramedic Ajay Tripathi',
      batteryOrFuelPercent: 90,
    },
  ],
  JAIPUR: [
    {
      id: 'in-dev-jpr-108',
      name: '108 Rajasthan Arogya Ambulance #08',
      type: 'EMERGENCY_AMBULANCE_AMB',
      coordinates: { lat: 26.9020, lng: 75.8110 },
      distanceKm: 1.1,
      etaMinutes: 3,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'Jaipur 108 Emergency Net',
      onboardUnits: [
        { bloodType: 'O-', component: 'PRBC', units: 5 },
        { bloodType: 'O+', component: 'PRBC', units: 10 },
      ],
      coldStorageTempCelsius: 3.7,
      operatorName: 'Paramedic Mahendra Choudhary',
      batteryOrFuelPercent: 92,
    },
  ],
  ALL_INDIA: [
    {
      id: 'in-dev-pan-air',
      name: 'National Air-Rescue Blood Drone Wing Alpha',
      type: 'AERO_DRONE_POD',
      coordinates: { lat: 28.5852, lng: 77.2215 },
      distanceKm: 2.0,
      etaMinutes: 5,
      status: 'AVAILABLE_ON_STANDBY',
      contactRadio: 'National SkyCorridor 1910',
      onboardUnits: [
        { bloodType: 'O-', component: 'PRBC', units: 10 },
        { bloodType: 'O-', component: 'PLT', units: 4 },
      ],
      coldStorageTempCelsius: 4.0,
      operatorName: 'Wing Cmdr. R. Deshmukh',
      batteryOrFuelPercent: 98,
    },
  ],
};

export const INDIAN_REGION_PRESETS: Record<IndianRegionKey, IndianRegionPreset> = {
  DELHI_NCR: {
    key: 'DELHI_NCR',
    label: 'Delhi NCR (AIIMS Apex Grid)',
    state: 'Delhi National Capital Region',
    center: { lat: 28.5850, lng: 77.2180 },
    zoom: 13,
    nodes: DELHI_NODES,
    devices: INDIAN_DEVICES.DELHI_NCR,
  },
  MUMBAI: {
    key: 'MUMBAI',
    label: 'Mumbai (KEM & Tata Memorial Hub)',
    state: 'Maharashtra',
    center: { lat: 19.0180, lng: 72.8460 },
    zoom: 13,
    nodes: MUMBAI_NODES,
    devices: INDIAN_DEVICES.MUMBAI,
  },
  PUNE: {
    key: 'PUNE',
    label: 'Pune (Ruby Hall & AFMC Corridor)',
    state: 'Maharashtra',
    center: { lat: 18.5220, lng: 73.8680 },
    zoom: 13,
    nodes: PUNE_NODES,
    devices: INDIAN_DEVICES.PUNE,
  },
  BENGALURU: {
    key: 'BENGALURU',
    label: 'Bengaluru (Victoria & NIMHANS Grid)',
    state: 'Karnataka',
    center: { lat: 12.9550, lng: 77.5850 },
    zoom: 13,
    nodes: BENGALURU_NODES,
    devices: INDIAN_DEVICES.BENGALURU,
  },
  HYDERABAD: {
    key: 'HYDERABAD',
    label: 'Hyderabad (NIMS & Osmania Grid)',
    state: 'Telangana',
    center: { lat: 17.4100, lng: 78.4500 },
    zoom: 13,
    nodes: HYDERABAD_NODES,
    devices: INDIAN_DEVICES.HYDERABAD,
  },
  CHENNAI: {
    key: 'CHENNAI',
    label: 'Chennai (Rajiv Gandhi GH & MMC)',
    state: 'Tamil Nadu',
    center: { lat: 13.0750, lng: 80.2650 },
    zoom: 13,
    nodes: CHENNAI_NODES,
    devices: INDIAN_DEVICES.CHENNAI,
  },
  KOLKATA: {
    key: 'KOLKATA',
    label: 'Kolkata (SSKM & Calcutta Med College)',
    state: 'West Bengal',
    center: { lat: 22.5500, lng: 88.3550 },
    zoom: 13,
    nodes: KOLKATA_NODES,
    devices: INDIAN_DEVICES.KOLKATA,
  },
  AHMEDABAD: {
    key: 'AHMEDABAD',
    label: 'Ahmedabad (Civil Hospital & Red Cross)',
    state: 'Gujarat',
    center: { lat: 23.0450, lng: 72.5850 },
    zoom: 13,
    nodes: AHMEDABAD_NODES,
    devices: INDIAN_DEVICES.AHMEDABAD,
  },
  LUCKNOW: {
    key: 'LUCKNOW',
    label: 'Lucknow (KGMU & SGPGIMS Hub)',
    state: 'Uttar Pradesh',
    center: { lat: 26.8300, lng: 80.9300 },
    zoom: 13,
    nodes: LUCKNOW_NODES,
    devices: INDIAN_DEVICES.LUCKNOW,
  },
  JAIPUR: {
    key: 'JAIPUR',
    label: 'Jaipur (SMS Hospital & SDMH Grid)',
    state: 'Rajasthan',
    center: { lat: 26.8950, lng: 75.8100 },
    zoom: 13,
    nodes: JAIPUR_NODES,
    devices: INDIAN_DEVICES.JAIPUR,
  },
  ALL_INDIA: {
    key: 'ALL_INDIA',
    label: 'Pan-India National Apex Transfusion Mesh',
    state: 'Republic of India (National Grid)',
    center: { lat: 22.5000, lng: 78.9629 },
    zoom: 5,
    nodes: ALL_INDIA_APEX_NODES,
    devices: INDIAN_DEVICES.ALL_INDIA,
  },
};

export const DEFAULT_FACILITY_NODES = DELHI_NODES;
export const DEFAULT_NEARBY_DEVICES = INDIAN_DEVICES.DELHI_NCR;

/**
 * Dynamically calibrates facilities and nearby devices around the user's real GPS coordinates anywhere in India.
 */
export function generateFacilitiesAroundLocation(
  centerLat: number,
  centerLng: number
): { nodes: FacilityNode[]; devices: NearbyDevice[] } {
  const offsets = [
    { dLat: 0.012, dLng: -0.009, name: 'Apex Level 1 Trauma Center & Blood Bank', short: 'Apex L1 Trauma', type: 'LEVEL_1_TRAUMA' as const, status: 'CRITICAL_SHORTAGE' as const },
    { dLat: 0.024, dLng: 0.018, name: 'Red Cross State Central Blood Bank', short: 'Red Cross Blood Bank', type: 'CENTRAL_BLOOD_DEPOT' as const, status: 'OPTIMAL' as const },
    { dLat: -0.018, dLng: 0.022, name: 'Civil Multi-Specialty Hospital Blood Centre', short: 'Civil Hospital L2', type: 'LEVEL_2_TRAUMA' as const, status: 'ELEVATED_DEMAND' as const },
    { dLat: -0.011, dLng: -0.015, name: 'Rotary Community Blood Centre', short: 'Rotary Spoke Centre', type: 'COMMUNITY_CLINIC' as const, status: 'OPTIMAL' as const },
    { dLat: 0.035, dLng: -0.025, name: 'District Memorial Transfusion Services', short: 'District Memorial', type: 'LEVEL_2_TRAUMA' as const, status: 'OPTIMAL' as const },
    { dLat: -0.029, dLng: -0.008, name: 'LifeCare Outpatient Surgical Blood Depot', short: 'LifeCare Surgical', type: 'AMBULATORY_CENTER' as const, status: 'OPTIMAL' as const },
  ];

  const calibratedNodes: FacilityNode[] = offsets.map((off, idx) => {
    const lat = Number((centerLat + off.dLat).toFixed(5));
    const lng = Number((centerLng + off.dLng).toFixed(5));
    const baseNode = DELHI_NODES[idx % DELHI_NODES.length];
    return {
      ...baseNode,
      id: `local-fac-${idx + 1}`,
      name: off.name,
      shortName: off.short,
      type: off.type,
      status: off.status,
      coordinates: { lat, lng },
      address: `Local Proximity Sector ${idx + 1}, ~${Math.round(Math.abs(off.dLat * 111))}km Radius`,
    };
  });

  const deviceOffsets = [
    { dLat: 0.005, dLng: 0.004, name: '108 Emergency Blood Ambulance #08', type: 'EMERGENCY_AMBULANCE_AMB' as const, dist: 0.7, eta: 2 },
    { dLat: -0.004, dLng: 0.006, name: 'ICMR Aero-Rescue Drone Pod Alpha', type: 'AERO_DRONE_POD' as const, dist: 0.9, eta: 1 },
    { dLat: 0.009, dLng: -0.008, name: 'LifeMobile Blood Donation Bus #02', type: 'MOBILE_BLOOD_BUS' as const, dist: 1.3, eta: 3 },
  ];

  const calibratedDevices: NearbyDevice[] = deviceOffsets.map((dev, idx) => ({
    ...INDIAN_DEVICES.DELHI_NCR[idx % INDIAN_DEVICES.DELHI_NCR.length],
    id: `local-dev-${idx + 1}`,
    name: dev.name,
    type: dev.type,
    coordinates: {
      lat: Number((centerLat + dev.dLat).toFixed(5)),
      lng: Number((centerLng + dev.dLng).toFixed(5)),
    },
    distanceKm: dev.dist,
    etaMinutes: dev.eta,
  }));

  return { nodes: calibratedNodes, devices: calibratedDevices };
}
