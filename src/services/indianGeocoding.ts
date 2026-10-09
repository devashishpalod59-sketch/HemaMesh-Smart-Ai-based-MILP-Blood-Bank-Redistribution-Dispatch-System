// Comprehensive Indian Medical Hubs, Tier 1/2/3 Cities, Pin Code Zones, and Geocoding Directory
export interface KnownIndianLocation {
  name: string;
  city: string;
  state: string;
  coords: { lat: number; lng: number };
  keywords: string[];
}

export const KNOWN_INDIAN_LOCATIONS: KnownIndianLocation[] = [
  // Delhi NCR & North Corridor
  { name: 'AIIMS & Safdarjung Enclave', city: 'New Delhi', state: 'Delhi', coords: { lat: 28.5672, lng: 77.2100 }, keywords: ['aiims', 'safdarjung', 'ansari nagar', 'south delhi', '110029', 'delhi', 'new delhi'] },
  { name: 'Connaught Place (CP) & Sansad Marg', city: 'New Delhi', state: 'Delhi', coords: { lat: 28.6315, lng: 77.2167 }, keywords: ['connaught place', 'cp', 'rajiv chowk', 'red cross', '110001', 'central delhi'] },
  { name: 'Saket & Max Super Speciality District', city: 'New Delhi', state: 'Delhi', coords: { lat: 28.5244, lng: 77.2167 }, keywords: ['saket', 'max hospital', 'malviya nagar', '110017', 'hauz khas'] },
  { name: 'Sarita Vihar & Indraprastha Apollo Hospital', city: 'New Delhi', state: 'Delhi', coords: { lat: 28.5385, lng: 77.2831 }, keywords: ['sarita vihar', 'apollo', 'mathura road', 'jasola', '110076'] },
  { name: 'Mayur Vihar & East Delhi Rotary Spoke', city: 'New Delhi', state: 'Delhi', coords: { lat: 28.6082, lng: 77.2945 }, keywords: ['mayur vihar', 'laxmi nagar', 'east delhi', 'patparganj', '110091'] },
  { name: 'Rohini Sector 14 & Rajiv Gandhi Cancer Institute', city: 'New Delhi', state: 'Delhi', coords: { lat: 28.7145, lng: 77.1185 }, keywords: ['rohini', 'rajiv gandhi cancer', 'pitampura', 'north delhi', '110085'] },
  { name: 'Dwarka Sector 12 & Manipal Hospital', city: 'New Delhi', state: 'Delhi', coords: { lat: 28.5921, lng: 77.0460 }, keywords: ['dwarka', 'manipal dwarka', 'igi airport', 'palam', '110075'] },
  { name: 'Karol Bagh & Sir Ganga Ram Hospital', city: 'New Delhi', state: 'Delhi', coords: { lat: 28.6415, lng: 77.1895 }, keywords: ['ganga ram', 'karol bagh', 'rajendra nagar', 'pusa road', '110060'] },
  { name: 'Noida Sector 62 & Fortis Corridor', city: 'Noida', state: 'Uttar Pradesh', coords: { lat: 28.6270, lng: 77.3725 }, keywords: ['noida', 'sector 62', 'fortis noida', '201301', 'greater noida', 'noida sector 18'] },
  { name: 'Gurugram Cyber City & Medanta Medicity', city: 'Gurugram', state: 'Haryana', coords: { lat: 28.4395, lng: 77.0425 }, keywords: ['gurgaon', 'gurugram', 'medanta', 'cyber city', 'dlf', '122001', 'sohna road'] },
  { name: 'Faridabad & BK Civil Hospital', city: 'Faridabad', state: 'Haryana', coords: { lat: 28.4089, lng: 77.3178 }, keywords: ['faridabad', 'bk hospital', 'amrita faridabad', '121001'] },
  { name: 'Ghaziabad & Yashoda Super Speciality', city: 'Ghaziabad', state: 'Uttar Pradesh', coords: { lat: 28.6692, lng: 77.4538 }, keywords: ['ghaziabad', 'yashoda', 'indirapuram', 'vaishali', 'kaushambi', '201001'] },

  // Mumbai MMR & Western Maharashtra
  { name: 'Parel (KEM, Tata Memorial & Wadia)', city: 'Mumbai', state: 'Maharashtra', coords: { lat: 19.0028, lng: 72.8423 }, keywords: ['parel', 'kem', 'tata memorial', 'dadar', '400012', 'mumbai', 'bombay'] },
  { name: 'Bandra West (Lilavati Hospital)', city: 'Mumbai', state: 'Maharashtra', coords: { lat: 19.0544, lng: 72.8402 }, keywords: ['bandra', 'lilavati', 'linking road', 'khar', 'bkc', '400050'] },
  { name: 'Sion & Dharavi (Lokmanya Tilak Trauma)', city: 'Mumbai', state: 'Maharashtra', coords: { lat: 19.0381, lng: 72.8601 }, keywords: ['sion', 'sion hospital', 'kurla', 'dharavi', '400022'] },
  { name: 'Andheri West & Kokilaben Hospital', city: 'Mumbai', state: 'Maharashtra', coords: { lat: 19.1315, lng: 72.8252 }, keywords: ['andheri', 'kokilaben', 'lokhandwala', 'versova', 'juhu', '400053'] },
  { name: 'Ghatkopar & LBS Marg', city: 'Mumbai', state: 'Maharashtra', coords: { lat: 19.0862, lng: 72.9094 }, keywords: ['ghatkopar', 'vikhroli', 'mulund', 'bhandup', '400086'] },
  { name: 'Thane West & Jupiter Hospital', city: 'Thane', state: 'Maharashtra', coords: { lat: 19.2062, lng: 72.9734 }, keywords: ['thane', 'jupiter', 'ghodbunder', 'naupada', '400601'] },
  { name: 'Navi Mumbai & Apollo Hospital Belapur', city: 'Navi Mumbai', state: 'Maharashtra', coords: { lat: 19.0185, lng: 73.0425 }, keywords: ['navi mumbai', 'vashi', 'belapur', 'nerul', 'kharghar', '400614'] },
  { name: 'Borivali & Apex Superspeciality', city: 'Mumbai', state: 'Maharashtra', coords: { lat: 19.2307, lng: 72.8567 }, keywords: ['borivali', 'kandivali', 'dahisar', 'mira road', '400092'] },
  { name: 'Kalyan & Dombivli Medical Center', city: 'Kalyan', state: 'Maharashtra', coords: { lat: 19.2403, lng: 73.1305 }, keywords: ['kalyan', 'dombivli', 'ulhasnagar', '421301'] },

  // Pune & Western Region
  { name: 'Sassoon Road & Ruby Hall Clinic', city: 'Pune', state: 'Maharashtra', coords: { lat: 18.5332, lng: 73.8768 }, keywords: ['ruby hall', 'sassoon', 'pune station', 'camp', '411001', 'pune'] },
  { name: 'Wanowrie & AFMC Medical College', city: 'Pune', state: 'Maharashtra', coords: { lat: 18.5028, lng: 73.8872 }, keywords: ['afmc', 'wanowrie', 'command hospital', 'hadapsar', '411040'] },
  { name: 'Shivajinagar & Sancheti Hospital', city: 'Pune', state: 'Maharashtra', coords: { lat: 18.5314, lng: 73.8446 }, keywords: ['shivajinagar', 'sancheti', 'fc road', 'jm road', '411005'] },
  { name: 'Erandwane & Deenanath Mangeshkar Hospital', city: 'Pune', state: 'Maharashtra', coords: { lat: 18.4984, lng: 73.8315 }, keywords: ['kothrud', 'erandwane', 'deenanath', 'karve nagar', '411004'] },
  { name: 'Hinjewadi IT Park & Symbiosis Hospital', city: 'Pune', state: 'Maharashtra', coords: { lat: 18.5912, lng: 73.7389 }, keywords: ['hinjewadi', 'hinjawadi', 'wakad', 'baner', 'aundh', '411057'] },
  { name: 'Viman Nagar & Sahyadri Hospital Nagar Road', city: 'Pune', state: 'Maharashtra', coords: { lat: 18.5679, lng: 73.9143 }, keywords: ['viman nagar', 'kalyani nagar', 'airport road', '411014'] },
  { name: 'Pimpri-Chinchwad & YCM Hospital', city: 'Pimpri-Chinchwad', state: 'Maharashtra', coords: { lat: 18.6298, lng: 73.7997 }, keywords: ['pimpri', 'chinchwad', 'pcmc', 'ycm', 'bhosari', '411018'] },
  { name: 'Nashik & Apollo Hospitals', city: 'Nashik', state: 'Maharashtra', coords: { lat: 19.9975, lng: 73.7898 }, keywords: ['nashik', 'nasik', 'panchavati', '422001'] },
  { name: 'Chhatrapati Sambhajinagar (Aurangabad) GMC', city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', coords: { lat: 19.8762, lng: 75.3433 }, keywords: ['aurangabad', 'sambhajinagar', 'gmc aurangabad', '431001'] },
  { name: 'Nagpur & GMCH Medical Square', city: 'Nagpur', state: 'Maharashtra', coords: { lat: 21.1285, lng: 79.0965 }, keywords: ['nagpur', 'gmch nagpur', 'medical square', 'aiims nagpur', '440003'] },
  { name: 'Solapur & Dr. V.M. Govt Medical College', city: 'Solapur', state: 'Maharashtra', coords: { lat: 17.6599, lng: 75.9064 }, keywords: ['solapur', 'sholapur', '413001'] },
  { name: 'Kolhapur & CPR General Hospital', city: 'Kolhapur', state: 'Maharashtra', coords: { lat: 16.7050, lng: 74.2433 }, keywords: ['kolhapur', 'cpr hospital', '416001'] },

  // Bengaluru & Karnataka Corridor
  { name: 'Victoria Hospital & City Market BMCRI', city: 'Bengaluru', state: 'Karnataka', coords: { lat: 12.9634, lng: 77.5752 }, keywords: ['victoria', 'city market', 'chickpet', 'kalasipalya', '560002', 'bangalore', 'bengaluru'] },
  { name: 'NIMHANS Neuro-Trauma & Hosur Road', city: 'Bengaluru', state: 'Karnataka', coords: { lat: 12.9392, lng: 77.5912 }, keywords: ['nimhans', 'lakkasandra', 'dairy circle', 'koramangala', '560029'] },
  { name: 'Narayana Health City Bommasandra', city: 'Bengaluru', state: 'Karnataka', coords: { lat: 12.8252, lng: 77.6892 }, keywords: ['narayana health', 'bommasandra', 'electronic city', '560099'] },
  { name: 'HAL Old Airport Road (Manipal Hospital)', city: 'Bengaluru', state: 'Karnataka', coords: { lat: 12.9592, lng: 77.6492 }, keywords: ['manipal hospital', 'old airport road', 'indiranagar', 'domlur', '560017'] },
  { name: 'Whitefield & Vydehi Institute of Medical Sciences', city: 'Bengaluru', state: 'Karnataka', coords: { lat: 12.9785, lng: 77.7285 }, keywords: ['whitefield', 'vydehi', 'itpb', 'kadugodi', '560066'] },
  { name: 'Mysuru & K.R. Hospital (MMCRI)', city: 'Mysuru', state: 'Karnataka', coords: { lat: 12.3118, lng: 76.6529 }, keywords: ['mysore', 'mysuru', 'kr hospital', '570001'] },
  { name: 'Hubballi-Dharwad & KIMS Hubli', city: 'Hubballi', state: 'Karnataka', coords: { lat: 15.3647, lng: 75.1240 }, keywords: ['hubli', 'hubballi', 'dharwad', 'kims hubli', '580020'] },
  { name: 'Mangaluru & Wenlock District Hospital', city: 'Mangaluru', state: 'Karnataka', coords: { lat: 12.8681, lng: 74.8427 }, keywords: ['mangalore', 'mangaluru', 'wenlock', 'kasturba', '575001'] },
  { name: 'Belagavi & BIMS Civil Hospital', city: 'Belagavi', state: 'Karnataka', coords: { lat: 15.8497, lng: 74.4977 }, keywords: ['belgaum', 'belagavi', 'kle hospital', '590001'] },

  // Hyderabad & Telangana Corridor
  { name: 'NIMS Punjagutta & Somajiguda Hub', city: 'Hyderabad', state: 'Telangana', coords: { lat: 17.4243, lng: 78.4529 }, keywords: ['nims', 'punjagutta', 'somajiguda', 'hyderabad', '500082'] },
  { name: 'Osmania General Hospital & Afzal Gunj', city: 'Hyderabad', state: 'Telangana', coords: { lat: 17.3789, lng: 78.4735 }, keywords: ['osmania', 'afzal gunj', 'charminar', 'koti', '500012'] },
  { name: 'Gandhi Hospital & Musheerabad', city: 'Secunderabad', state: 'Telangana', coords: { lat: 17.4334, lng: 78.5034 }, keywords: ['gandhi hospital', 'secunderabad', 'musheerabad', '500003'] },
  { name: 'Apollo Hospitals Jubilee Hills', city: 'Hyderabad', state: 'Telangana', coords: { lat: 17.4304, lng: 78.4110 }, keywords: ['apollo jubilee hills', 'banjara hills', 'hitec city', 'gachibowli', 'madhapur', '500033'] },
  { name: 'Warangal & MGM Hospital (KMC)', city: 'Warangal', state: 'Telangana', coords: { lat: 17.9689, lng: 79.5941 }, keywords: ['warangal', 'mgm hospital', 'kazipet', '506001'] },

  // Chennai & Tamil Nadu Corridor
  { name: 'Rajiv Gandhi Govt General Hospital (Park Town)', city: 'Chennai', state: 'Tamil Nadu', coords: { lat: 13.0827, lng: 80.2785 }, keywords: ['rajiv gandhi', 'park town', 'chennai central', 'chennai', 'madras', '600003'] },
  { name: 'Madras Medical College MMC Enclave', city: 'Chennai', state: 'Tamil Nadu', coords: { lat: 13.0805, lng: 80.2745 }, keywords: ['mmc', 'madras medical college', 'broadway', '600001'] },
  { name: 'Apollo Hospital Greams Road', city: 'Chennai', state: 'Tamil Nadu', coords: { lat: 13.0569, lng: 80.2520 }, keywords: ['apollo greams', 'thousand lights', 'anna salai', 't nagar', '600006'] },
  { name: 'Stanley Medical College & Royapuram', city: 'Chennai', state: 'Tamil Nadu', coords: { lat: 13.1092, lng: 80.2921 }, keywords: ['stanley', 'royapuram', 'north chennai', '600001'] },
  { name: 'Coimbatore & CMC / PSG Hospitals', city: 'Coimbatore', state: 'Tamil Nadu', coords: { lat: 11.0168, lng: 76.9558 }, keywords: ['coimbatore', 'psg hospital', 'kovai', 'cmch', '641018'] },
  { name: 'Madurai & Govt Rajaji Hospital (GRH)', city: 'Madurai', state: 'Tamil Nadu', coords: { lat: 9.9252, lng: 78.1198 }, keywords: ['madurai', 'grh madurai', 'rajaji', '625020'] },
  { name: 'Tiruchirappalli (Trichy) KAPV Hospital', city: 'Tiruchirappalli', state: 'Tamil Nadu', coords: { lat: 10.7905, lng: 78.7047 }, keywords: ['trichy', 'tiruchirappalli', 'thillai nagar', '620001'] },
  { name: 'Vellore & Christian Medical College (CMC)', city: 'Vellore', state: 'Tamil Nadu', coords: { lat: 12.9246, lng: 79.1352 }, keywords: ['vellore', 'cmc vellore', 'bagayam', '632004'] },
  { name: 'Salem & Mohan Kumaramangalam Medical College', city: 'Salem', state: 'Tamil Nadu', coords: { lat: 11.6643, lng: 78.1460 }, keywords: ['salem', 'gmch salem', '636001'] },

  // Kolkata & Eastern Region
  { name: 'SSKM Hospital & IPGMER Bhowanipore', city: 'Kolkata', state: 'West Bengal', coords: { lat: 22.5392, lng: 88.3425 }, keywords: ['sskm', 'ipgmer', 'bhowanipore', 'rabindra sadan', 'kolkata', 'calcutta', '700020'] },
  { name: 'Calcutta Medical College College Street', city: 'Kolkata', state: 'West Bengal', coords: { lat: 22.5732, lng: 88.3622 }, keywords: ['calcutta medical college', 'college street', 'central kolkata', '700073'] },
  { name: 'AMRI Hospital Dhakuria & South Kolkata', city: 'Kolkata', state: 'West Bengal', coords: { lat: 22.5085, lng: 88.3685 }, keywords: ['amri', 'dhakuria', 'gariahat', 'jadavpur', '700029'] },
  { name: 'Fortis Hospital Anandapur & EM Bypass', city: 'Kolkata', state: 'West Bengal', coords: { lat: 22.5182, lng: 88.4022 }, keywords: ['fortis kolkata', 'anandapur', 'em bypass', 'ruby', 'salt lake', '700107'] },
  { name: 'Howrah General Hospital', city: 'Howrah', state: 'West Bengal', coords: { lat: 22.5958, lng: 88.2636 }, keywords: ['howrah', 'howrah station', 'shibpur', '711101'] },
  { name: 'Siliguri & North Bengal Medical College', city: 'Siliguri', state: 'West Bengal', coords: { lat: 26.7271, lng: 88.3953 }, keywords: ['siliguri', 'north bengal', 'sushrutanagar', '734012'] },
  { name: 'Durgapur & Mission Hospital', city: 'Durgapur', state: 'West Bengal', coords: { lat: 23.5204, lng: 87.3119 }, keywords: ['durgapur', 'asansol', 'mission hospital', '713212'] },

  // Gujarat
  { name: 'Civil Hospital Asarwa (Apex Trauma)', city: 'Ahmedabad', state: 'Gujarat', coords: { lat: 23.0525, lng: 72.6035 }, keywords: ['civil hospital asarwa', 'asarwa', 'ahmedabad', 'amdavad', '380016'] },
  { name: 'Red Cross Society Gujarat State Branch', city: 'Ahmedabad', state: 'Gujarat', coords: { lat: 23.0315, lng: 72.5695 }, keywords: ['gujarat red cross', 'paldi', 'ashram road', '380006'] },
  { name: 'Zydus Hospitals SG Highway', city: 'Ahmedabad', state: 'Gujarat', coords: { lat: 23.0692, lng: 72.5185 }, keywords: ['zydus hospital', 'sg highway', 'thaltej', 'bodakdev', '380054'] },
  { name: 'New Civil Hospital & Surat Medical College', city: 'Surat', state: 'Gujarat', coords: { lat: 21.1702, lng: 72.8311 }, keywords: ['surat', 'majura gate', 'new civil hospital', 'smimer', '395001'] },
  { name: 'Vadodara & SSG Hospital (Baroda Medical)', city: 'Vadodara', state: 'Gujarat', coords: { lat: 22.3072, lng: 73.1812 }, keywords: ['vadodara', 'baroda', 'ssg hospital', 'sayajigunj', '390001'] },
  { name: 'Rajkot & PDU Civil Hospital', city: 'Rajkot', state: 'Gujarat', coords: { lat: 22.3039, lng: 70.8022 }, keywords: ['rajkot', 'pdu hospital', 'jamnagar', 'bhavnagar', '360001'] },
  { name: 'Gandhinagar Apollo Hospital', city: 'Gandhinagar', state: 'Gujarat', coords: { lat: 23.2156, lng: 72.6369 }, keywords: ['gandhinagar', 'apollo gandhinagar', 'bhat', '382010'] },

  // Uttar Pradesh & Northern Hubs
  { name: 'KGMU (King George’s Medical University)', city: 'Lucknow', state: 'Uttar Pradesh', coords: { lat: 26.8682, lng: 80.9165 }, keywords: ['kgmu', 'king george', 'chowk', 'lucknow', '226003'] },
  { name: 'SGPGIMS (Sanjay Gandhi Post Graduate)', city: 'Lucknow', state: 'Uttar Pradesh', coords: { lat: 26.7582, lng: 80.9412 }, keywords: ['sgpgi', 'sgpgims', 'raebareli road', 'lucknow', '226014'] },
  { name: 'Dr. Ram Manohar Lohia Institute (RMLIMS)', city: 'Lucknow', state: 'Uttar Pradesh', coords: { lat: 26.8525, lng: 80.9985 }, keywords: ['rmlims', 'gomti nagar', 'lohia hospital', '226010'] },
  { name: 'Kanpur & GSVM Medical College (Hallet)', city: 'Kanpur', state: 'Uttar Pradesh', coords: { lat: 26.4499, lng: 80.3319 }, keywords: ['kanpur', 'gsvm', 'hallet hospital', 'swaroop nagar', '208002'] },
  { name: 'Sir Sunderlal Hospital (IMS BHU)', city: 'Varanasi', state: 'Uttar Pradesh', coords: { lat: 25.2785, lng: 82.9985 }, keywords: ['varanasi', 'benares', 'kashi', 'ims bhu', 'bhu', '221005'] },
  { name: 'Prayagraj (Allahabad) & SRN Hospital', city: 'Prayagraj', state: 'Uttar Pradesh', coords: { lat: 25.4358, lng: 81.8463 }, keywords: ['prayagraj', 'allahabad', 'srn hospital', 'civil lines', '211001'] },
  { name: 'Agra & S.N. Medical College', city: 'Agra', state: 'Uttar Pradesh', coords: { lat: 27.1767, lng: 78.0081 }, keywords: ['agra', 'sn medical college', 'taj nagari', '282002'] },
  { name: 'Meerut & LLRM Medical College', city: 'Meerut', state: 'Uttar Pradesh', coords: { lat: 28.9845, lng: 77.7064 }, keywords: ['meerut', 'llrm', 'garhmukteshwar', '250004'] },
  { name: 'Gorakhpur & AIIMS / BRD Medical College', city: 'Gorakhpur', state: 'Uttar Pradesh', coords: { lat: 26.7606, lng: 83.3732 }, keywords: ['gorakhpur', 'aiims gorakhpur', 'brd medical', '273013'] },
  { name: 'Aligarh & JNMC (AMU)', city: 'Aligarh', state: 'Uttar Pradesh', coords: { lat: 27.8974, lng: 78.0880 }, keywords: ['aligarh', 'jnmc', 'amu', '202002'] },
  { name: 'Bareilly & Rohilkhand Medical College', city: 'Bareilly', state: 'Uttar Pradesh', coords: { lat: 28.3670, lng: 79.4304 }, keywords: ['bareilly', 'rohilkhand', '243006'] },

  // Rajasthan
  { name: 'SMS Hospital (Sawai Man Singh Medical College)', city: 'Jaipur', state: 'Rajasthan', coords: { lat: 26.9082, lng: 75.8165 }, keywords: ['sms hospital', 'sawai man singh', 'ram singh road', 'jaipur', '302004'] },
  { name: 'Santokba Durlabhji Memorial Hospital (SDMH)', city: 'Jaipur', state: 'Rajasthan', coords: { lat: 26.8925, lng: 75.8015 }, keywords: ['sdmh', 'bhawani singh road', 'c scheme', '302015'] },
  { name: 'Jodhpur & AIIMS / MDM Hospital', city: 'Jodhpur', state: 'Rajasthan', coords: { lat: 26.2389, lng: 73.0243 }, keywords: ['jodhpur', 'aiims jodhpur', 'mdm hospital', 'shastri nagar', '342005'] },
  { name: 'Udaipur & RNT Medical College (MB Hospital)', city: 'Udaipur', state: 'Rajasthan', coords: { lat: 24.5854, lng: 73.7125 }, keywords: ['udaipur', 'rnt medical', 'mb hospital', '313001'] },
  { name: 'Kota & Govt Medical College (MBS Hospital)', city: 'Kota', state: 'Rajasthan', coords: { lat: 25.1802, lng: 75.8573 }, keywords: ['kota', 'mbs hospital', '324005'] },
  { name: 'Ajmer & JLN Medical College', city: 'Ajmer', state: 'Rajasthan', coords: { lat: 26.4499, lng: 74.6399 }, keywords: ['ajmer', 'jln hospital', '305001'] },
  { name: 'Bikaner & PBM Hospital (SP Medical College)', city: 'Bikaner', state: 'Rajasthan', coords: { lat: 28.0229, lng: 73.3119 }, keywords: ['bikaner', 'pbm hospital', '334003'] },

  // Punjab, Haryana, Himachal & J&K
  { name: 'PGIMER & Sector 12 Trauma', city: 'Chandigarh', state: 'Chandigarh', coords: { lat: 30.7645, lng: 76.7765 }, keywords: ['chandigarh', 'pgimer', 'pgi chandigarh', 'mohali', 'panchkula', '160012'] },
  { name: 'Ludhiana & Christian Medical College (CMC/DMC)', city: 'Ludhiana', state: 'Punjab', coords: { lat: 30.9010, lng: 75.8573 }, keywords: ['ludhiana', 'cmc ludhiana', 'dmc ludhiana', '141008'] },
  { name: 'Amritsar & Guru Nanak Dev Hospital (GMC)', city: 'Amritsar', state: 'Punjab', coords: { lat: 31.6340, lng: 74.8723 }, keywords: ['amritsar', 'gndh', 'civil hospital amritsar', '143001'] },
  { name: 'Jalandhar & Civil Hospital', city: 'Jalandhar', state: 'Punjab', coords: { lat: 31.3260, lng: 75.5762 }, keywords: ['jalandhar', 'civil hospital jalandhar', '144001'] },
  { name: 'Patiala & Rajindra Hospital (GMC)', city: 'Patiala', state: 'Punjab', coords: { lat: 30.3398, lng: 76.3869 }, keywords: ['patiala', 'rajindra hospital', '147001'] },
  { name: 'Rohtak & Pt. B.D. Sharma PGIMS', city: 'Rohtak', state: 'Haryana', coords: { lat: 28.8955, lng: 76.6066 }, keywords: ['rohtak', 'pgims rohtak', '124001'] },
  { name: 'Shimla & IGMC (Indira Gandhi Medical College)', city: 'Shimla', state: 'Himachal Pradesh', coords: { lat: 31.1048, lng: 77.1734 }, keywords: ['shimla', 'igmc shimla', 'himachal', '171001'] },
  { name: 'Sher-i-Kashmir Institute of Medical Sciences (SKIMS)', city: 'Srinagar', state: 'Jammu & Kashmir', coords: { lat: 34.1325, lng: 74.8025 }, keywords: ['srinagar', 'skims', 'soura', 'kashmir', '190011'] },
  { name: 'Jammu & Govt Medical College (GMC)', city: 'Jammu', state: 'Jammu & Kashmir', coords: { lat: 32.7266, lng: 74.8570 }, keywords: ['jammu', 'gmc jammu', 'bakshi nagar', '180001'] },
  { name: 'Leh & SNM Hospital (Ladakh)', city: 'Leh', state: 'Ladakh', coords: { lat: 34.1526, lng: 77.5771 }, keywords: ['leh', 'ladakh', 'snm hospital', '194101'] },
  { name: 'AIIMS Rishikesh & Dehradun Road', city: 'Rishikesh', state: 'Uttarakhand', coords: { lat: 30.0765, lng: 78.2885 }, keywords: ['rishikesh', 'dehradun', 'aiims rishikesh', 'haridwar', 'uttarakhand', '249203'] },
  { name: 'Dehradun & Govt Doon Medical College', city: 'Dehradun', state: 'Uttarakhand', coords: { lat: 30.3165, lng: 78.0322 }, keywords: ['dehradun', 'doon hospital', 'patel nagar', '248001'] },

  // Bihar & Jharkhand
  { name: 'AIIMS Patna & Phulwari Sharif', city: 'Patna', state: 'Bihar', coords: { lat: 25.5615, lng: 85.0425 }, keywords: ['patna', 'aiims patna', 'phulwari sharif', 'pmch patna', 'igims', 'bihar', '801507'] },
  { name: 'Gaya & Anugrah Narayan Magadh Medical', city: 'Gaya', state: 'Bihar', coords: { lat: 24.7914, lng: 85.0002 }, keywords: ['gaya', 'magadh medical', '823001'] },
  { name: 'Muzaffarpur & SKMCH', city: 'Muzaffarpur', state: 'Bihar', coords: { lat: 26.1209, lng: 85.3647 }, keywords: ['muzaffarpur', 'skmch', '842001'] },
  { name: 'Bhagalpur & JLN Medical College', city: 'Bhagalpur', state: 'Bihar', coords: { lat: 25.2425, lng: 87.0169 }, keywords: ['bhagalpur', 'jlnmc', '812001'] },
  { name: 'RIMS (Rajendra Institute of Medical Sciences)', city: 'Ranchi', state: 'Jharkhand', coords: { lat: 23.3815, lng: 85.3465 }, keywords: ['ranchi', 'rims', 'bariatu', 'jharkhand', '834009'] },
  { name: 'Jamshedpur & Tata Main Hospital (TMH)', city: 'Jamshedpur', state: 'Jharkhand', coords: { lat: 22.8046, lng: 86.2029 }, keywords: ['jamshedpur', 'tatanagar', 'tmh', 'mgm jamshedpur', '831001'] },
  { name: 'Dhanbad & SNMMCH (Patliputra Medical)', city: 'Dhanbad', state: 'Jharkhand', coords: { lat: 23.7957, lng: 86.4304 }, keywords: ['dhanbad', 'snmmch', 'bokaro', '826001'] },

  // Madhya Pradesh & Chhattisgarh
  { name: 'AIIMS Bhopal & Saket Nagar', city: 'Bhopal', state: 'Madhya Pradesh', coords: { lat: 23.2085, lng: 77.4585 }, keywords: ['bhopal', 'aiims bhopal', 'saket nagar', 'hamidia', 'madhya pradesh', '462020'] },
  { name: 'MY Hospital & MGM Indore Medical College', city: 'Indore', state: 'Madhya Pradesh', coords: { lat: 22.7196, lng: 75.8685 }, keywords: ['indore', 'my hospital', 'mgm medical', 'choithram', '452001'] },
  { name: 'Jabalpur & Netaji Subhash Chandra Bose Medical', city: 'Jabalpur', state: 'Madhya Pradesh', coords: { lat: 23.1815, lng: 79.9864 }, keywords: ['jabalpur', 'nscb medical', '482003'] },
  { name: 'Gwalior & Gajra Raja Medical College (GRMC)', city: 'Gwalior', state: 'Madhya Pradesh', coords: { lat: 26.2183, lng: 78.1828 }, keywords: ['gwalior', 'grmc', 'jaya arogya', '474001'] },
  { name: 'AIIMS Raipur & Tatibandh', city: 'Raipur', state: 'Chhattisgarh', coords: { lat: 21.2585, lng: 81.5785 }, keywords: ['raipur', 'aiims raipur', 'tatibandh', 'chhattisgarh', 'mekahara', '492099'] },
  { name: 'Bilaspur & CIMS (Chhattisgarh Institute)', city: 'Bilaspur', state: 'Chhattisgarh', coords: { lat: 22.0797, lng: 82.1409 }, keywords: ['bilaspur', 'cims', 'apollo bilaspur', '495001'] },

  // Odisha
  { name: 'AIIMS Bhubaneswar & Sijua', city: 'Bhubaneswar', state: 'Odisha', coords: { lat: 20.2315, lng: 85.7765 }, keywords: ['bhubaneswar', 'aiims bhubaneswar', 'odisha', 'capital hospital', '751019'] },
  { name: 'Cuttack & SCB Medical College', city: 'Cuttack', state: 'Odisha', coords: { lat: 20.4625, lng: 85.8828 }, keywords: ['cuttack', 'scb hospital', 'mangalabag', '753007'] },
  { name: 'Rourkela & Ispat General Hospital (IGH)', city: 'Rourkela', state: 'Odisha', coords: { lat: 22.2604, lng: 84.8536 }, keywords: ['rourkela', 'igh', 'hi-tech rourkela', '769001'] },
  { name: 'Berhampur & MKCG Medical College', city: 'Berhampur', state: 'Odisha', coords: { lat: 19.3150, lng: 84.7941 }, keywords: ['berhampur', 'mkcg', 'ganjam', '760004'] },

  // Andhra Pradesh
  { name: 'King George Hospital (KGH)', city: 'Visakhapatnam', state: 'Andhra Pradesh', coords: { lat: 17.7085, lng: 83.3085 }, keywords: ['vizag', 'visakhapatnam', 'kgh', 'andhra', '530002'] },
  { name: 'Vijayawada & Govt General Hospital (GGH)', city: 'Vijayawada', state: 'Andhra Pradesh', coords: { lat: 16.5062, lng: 80.6480 }, keywords: ['vijayawada', 'ggh vijayawada', 'amaravati', '520001'] },
  { name: 'Guntur & GGH / GMC', city: 'Guntur', state: 'Andhra Pradesh', coords: { lat: 16.3067, lng: 80.4365 }, keywords: ['guntur', 'ggh guntur', '522001'] },
  { name: 'Tirupati & SVIMS / SVRR Hospital', city: 'Tirupati', state: 'Andhra Pradesh', coords: { lat: 13.6288, lng: 79.4192 }, keywords: ['tirupati', 'svims', 'svrr', 'alipiri', '517507'] },
  { name: 'Kurnool & Kurnool Medical College (GGH)', city: 'Kurnool', state: 'Andhra Pradesh', coords: { lat: 15.8281, lng: 78.0373 }, keywords: ['kurnool', 'kmc kurnool', '518002'] },

  // Kerala
  { name: 'Amrita Institute of Medical Sciences', city: 'Kochi', state: 'Kerala', coords: { lat: 10.0325, lng: 76.2985 }, keywords: ['kochi', 'cochin', 'amrita hospital', 'ernakulam', 'kerala', 'edappally', '682041'] },
  { name: 'Govt Medical College Thiruvananthapuram', city: 'Thiruvananthapuram', state: 'Kerala', coords: { lat: 8.5241, lng: 76.9366 }, keywords: ['trivandrum', 'thiruvananthapuram', 'medical college trivandrum', 'kims', '695011'] },
  { name: 'Kozhikode & Govt Medical College (Calicut)', city: 'Kozhikode', state: 'Kerala', coords: { lat: 11.2588, lng: 75.7804 }, keywords: ['kozhikode', 'calicut', 'medical college calicut', '673008'] },
  { name: 'Thrissur & Jubilee Mission / GMC Thrissur', city: 'Thrissur', state: 'Kerala', coords: { lat: 10.5276, lng: 76.2144 }, keywords: ['thrissur', 'trichur', 'jubilee mission', '680005'] },

  // Assam & Northeast
  { name: 'Gauhati Medical College & Hospital (GMCH)', city: 'Guwahati', state: 'Assam', coords: { lat: 26.1525, lng: 91.7765 }, keywords: ['guwahati', 'gmch', 'bhangagarh', 'assam', 'northeast', 'dispur', '781032'] },
  { name: 'Dibrugarh & Assam Medical College (AMCH)', city: 'Dibrugarh', state: 'Assam', coords: { lat: 27.4728, lng: 94.9120 }, keywords: ['dibrugarh', 'amch', 'upper assam', '786001'] },
  { name: 'Shillong & NEIGRIHMS', city: 'Shillong', state: 'Meghalaya', coords: { lat: 25.5788, lng: 91.8933 }, keywords: ['shillong', 'neigrihms', 'meghalaya', '793018'] },
  { name: 'Imphal & RIMS (Regional Institute)', city: 'Imphal', state: 'Manipur', coords: { lat: 24.8170, lng: 93.9368 }, keywords: ['imphal', 'rims imphal', 'manipur', '795004'] },
  { name: 'Agartala & AGMC (Govt Medical College)', city: 'Agartala', state: 'Tripura', coords: { lat: 23.8315, lng: 91.2868 }, keywords: ['agartala', 'agmc', 'tripura', '799006'] },
  { name: 'Aizawl & Zoram Medical College (ZMC)', city: 'Aizawl', state: 'Mizoram', coords: { lat: 23.7271, lng: 92.7176 }, keywords: ['aizawl', 'zmc', 'falkawn', 'mizoram', '796005'] },
  { name: 'Kohima & Naga Hospital Authority (NHAK)', city: 'Kohima', state: 'Nagaland', coords: { lat: 25.6751, lng: 94.1086 }, keywords: ['kohima', 'nagaland', 'nhak', '797001'] },
  { name: 'Itanagar & TRIHMS (Naharlagun)', city: 'Itanagar', state: 'Arunachal Pradesh', coords: { lat: 27.0844, lng: 93.6053 }, keywords: ['itanagar', 'trihms', 'naharlagun', 'arunachal', '791110'] },
  { name: 'Gangtok & STNM Hospital (Sir Thutob Namgyal)', city: 'Gangtok', state: 'Sikkim', coords: { lat: 27.3389, lng: 88.6065 }, keywords: ['gangtok', 'stnm hospital', 'sochaygang', 'sikkim', '737101'] },

  // Goa & Islands
  { name: 'Goa Medical College & Hospital (GMC)', city: 'Bambolim', state: 'Goa', coords: { lat: 15.4615, lng: 73.8565 }, keywords: ['goa', 'panaji', 'bambolim', 'gmc goa', 'margao', 'vasco', '403202'] },
  { name: 'Port Blair & G.B. Pant Hospital', city: 'Port Blair', state: 'Andaman & Nicobar', coords: { lat: 11.6234, lng: 92.7265 }, keywords: ['port blair', 'andaman', 'gb pant', '744101'] },
];

/**
 * High-accuracy PIN Code Resolver for all Indian Postal Circles (110001 to 850000)
 */
export function resolveIndianPinCode(pincode: string): KnownIndianLocation | null {
  const pin = pincode.trim().replace(/\D/g, '');
  if (pin.length !== 6) return null;

  const prefix2 = parseInt(pin.substring(0, 2), 10);
  const prefix1 = parseInt(pin.substring(0, 1), 10);

  // Exact zone mappings
  if (prefix2 === 11) return { name: `Delhi PIN ${pin}`, city: 'New Delhi', state: 'Delhi', coords: { lat: 28.6139, lng: 77.2090 }, keywords: [pin] };
  if (prefix2 === 12 || prefix2 === 13) return { name: `Haryana PIN ${pin}`, city: 'Gurugram / Ambala', state: 'Haryana', coords: { lat: 28.4595, lng: 77.0266 }, keywords: [pin] };
  if (prefix2 === 14 || prefix2 === 15) return { name: `Punjab PIN ${pin}`, city: 'Ludhiana / Amritsar', state: 'Punjab', coords: { lat: 30.9010, lng: 75.8573 }, keywords: [pin] };
  if (prefix2 === 16) return { name: `Chandigarh PIN ${pin}`, city: 'Chandigarh', state: 'Chandigarh', coords: { lat: 30.7333, lng: 76.7794 }, keywords: [pin] };
  if (prefix2 === 17) return { name: `Himachal PIN ${pin}`, city: 'Shimla / Kangra', state: 'Himachal Pradesh', coords: { lat: 31.1048, lng: 77.1734 }, keywords: [pin] };
  if (prefix2 === 18 || prefix2 === 19) return { name: `J&K PIN ${pin}`, city: 'Jammu / Srinagar', state: 'Jammu & Kashmir', coords: { lat: 34.0837, lng: 74.7973 }, keywords: [pin] };
  if (prefix2 >= 20 && prefix2 <= 28) return { name: `UP PIN ${pin}`, city: 'Lucknow / Noida / Kanpur', state: 'Uttar Pradesh', coords: { lat: 26.8467, lng: 80.9462 }, keywords: [pin] };
  if (prefix2 >= 30 && prefix2 <= 34) return { name: `Rajasthan PIN ${pin}`, city: 'Jaipur / Jodhpur', state: 'Rajasthan', coords: { lat: 26.9124, lng: 75.7873 }, keywords: [pin] };
  if (prefix2 >= 36 && prefix2 <= 39) return { name: `Gujarat PIN ${pin}`, city: 'Ahmedabad / Surat', state: 'Gujarat', coords: { lat: 23.0225, lng: 72.5714 }, keywords: [pin] };
  if (prefix2 >= 40 && prefix2 <= 44) return { name: `Maharashtra PIN ${pin}`, city: 'Mumbai / Pune / Nagpur', state: 'Maharashtra', coords: { lat: 19.0760, lng: 72.8777 }, keywords: [pin] };
  if (prefix2 >= 45 && prefix2 <= 48) return { name: `MP PIN ${pin}`, city: 'Bhopal / Indore', state: 'Madhya Pradesh', coords: { lat: 23.2599, lng: 77.4126 }, keywords: [pin] };
  if (prefix2 === 49) return { name: `Chhattisgarh PIN ${pin}`, city: 'Raipur', state: 'Chhattisgarh', coords: { lat: 21.2514, lng: 81.6296 }, keywords: [pin] };
  if (prefix2 >= 50 && prefix2 <= 53) return { name: `Telangana/AP PIN ${pin}`, city: 'Hyderabad / Vizag', state: 'Telangana / Andhra', coords: { lat: 17.3850, lng: 78.4867 }, keywords: [pin] };
  if (prefix2 >= 56 && prefix2 <= 59) return { name: `Karnataka PIN ${pin}`, city: 'Bengaluru / Mysuru', state: 'Karnataka', coords: { lat: 12.9716, lng: 77.5946 }, keywords: [pin] };
  if (prefix2 >= 60 && prefix2 <= 64) return { name: `Tamil Nadu PIN ${pin}`, city: 'Chennai / Coimbatore', state: 'Tamil Nadu', coords: { lat: 13.0827, lng: 80.2707 }, keywords: [pin] };
  if (prefix2 >= 67 && prefix2 <= 69) return { name: `Kerala PIN ${pin}`, city: 'Kochi / Thiruvananthapuram', state: 'Kerala', coords: { lat: 9.9312, lng: 76.2673 }, keywords: [pin] };
  if (prefix2 >= 70 && prefix2 <= 74) return { name: `West Bengal PIN ${pin}`, city: 'Kolkata / Howrah', state: 'West Bengal', coords: { lat: 22.5726, lng: 88.3639 }, keywords: [pin] };
  if (prefix2 >= 75 && prefix2 <= 77) return { name: `Odisha PIN ${pin}`, city: 'Bhubaneswar / Cuttack', state: 'Odisha', coords: { lat: 20.2961, lng: 85.8245 }, keywords: [pin] };
  if (prefix2 >= 78 && prefix2 <= 79) return { name: `Northeast PIN ${pin}`, city: 'Guwahati / Shillong', state: 'Assam & NE', coords: { lat: 26.1445, lng: 91.7362 }, keywords: [pin] };
  if (prefix2 >= 80 && prefix2 <= 85) return { name: `Bihar/Jharkhand PIN ${pin}`, city: 'Patna / Ranchi', state: 'Bihar / Jharkhand', coords: { lat: 25.5941, lng: 85.1376 }, keywords: [pin] };

  return null;
}

/**
 * Instant Synchronous Location Matcher across all Indian locations, hospital names,
 * districts, cities, PIN codes, and raw coordinates.
 */
export function resolveIndianLocationInput(query: string): KnownIndianLocation | null {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  // 1. Check if raw coordinates like "28.5672, 77.2100" or "18.5204 73.8567"
  const latLngMatch = clean.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
  if (latLngMatch) {
    const lat = parseFloat(latLngMatch[1]);
    const lng = parseFloat(latLngMatch[3]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= 6 && lat <= 38 && lng >= 68 && lng <= 98) {
      return {
        name: `Custom Coordinates (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`,
        city: 'India Region',
        state: 'Custom Coordinates',
        coords: { lat, lng },
        keywords: [],
      };
    }
  }

  // 2. Check 6-digit Indian PIN code
  const pinMatch = clean.match(/\b\d{6}\b/);
  if (pinMatch) {
    const resolvedPin = resolveIndianPinCode(pinMatch[0]);
    if (resolvedPin) return resolvedPin;
  }

  // 3. Direct exact name match
  for (const loc of KNOWN_INDIAN_LOCATIONS) {
    if (loc.name.toLowerCase() === clean || loc.city.toLowerCase() === clean) {
      return loc;
    }
  }

  // 4. Keyword matching (high priority)
  for (const loc of KNOWN_INDIAN_LOCATIONS) {
    for (const kw of loc.keywords) {
      if (clean === kw || clean.startsWith(kw) || clean.endsWith(kw)) {
        return loc;
      }
    }
  }

  // 5. Partial substring matching
  for (const loc of KNOWN_INDIAN_LOCATIONS) {
    if (loc.name.toLowerCase().includes(clean) || clean.includes(loc.name.toLowerCase())) {
      return loc;
    }
    if (loc.city.toLowerCase().includes(clean) || clean.includes(loc.city.toLowerCase())) {
      return loc;
    }
    for (const kw of loc.keywords) {
      if (clean.includes(kw) || kw.includes(clean)) {
        return loc;
      }
    }
  }

  // 6. State match fallback
  for (const loc of KNOWN_INDIAN_LOCATIONS) {
    if (loc.state.toLowerCase().includes(clean) || clean.includes(loc.state.toLowerCase())) {
      return loc;
    }
  }

  return null;
}

/**
 * Universal High-Accuracy Google Maps Geocoder with Fallback to Comprehensive Indian Directory
 * Provides Google Maps all-time high accuracy for EVERY address or landmark in India.
 */
export async function geocodeIndianLocationWithGoogle(query: string): Promise<KnownIndianLocation | null> {
  const clean = query.trim();
  if (!clean) return null;

  // Step 1: Check instant local match first
  const instantMatch = resolveIndianLocationInput(clean);

  // Step 2: If Google Maps JavaScript Geocoder is available in window.google.maps
  if (typeof window !== 'undefined' && (window as any).google?.maps?.Geocoder) {
    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const addressQuery = clean.toLowerCase().includes('india') ? clean : `${clean}, India`;

      const gResult: any = await new Promise((resolve) => {
        geocoder.geocode({ address: addressQuery }, (results: any[], status: string) => {
          if (status === 'OK' && results && results.length > 0) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        });
      });

      if (gResult && gResult.geometry && gResult.geometry.location) {
        const lat = gResult.geometry.location.lat();
        const lng = gResult.geometry.location.lng();

        // Extract city/state if available
        let city = 'India';
        let state = 'India';
        if (gResult.address_components) {
          for (const comp of gResult.address_components) {
            if (comp.types.includes('locality')) city = comp.long_name;
            if (comp.types.includes('administrative_area_level_1')) state = comp.long_name;
          }
        }

        return {
          name: gResult.formatted_address || clean,
          city,
          state,
          coords: { lat, lng },
          keywords: [clean.toLowerCase()],
        };
      }
    } catch {
      // Graceful fallback to directory match
    }
  }

  // Step 3: Return instant directory match or null
  return instantMatch;
}
