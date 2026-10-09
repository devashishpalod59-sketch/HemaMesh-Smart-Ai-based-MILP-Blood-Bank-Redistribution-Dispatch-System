export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatContext {
  activeRegion?: string;
  activeCoords?: { lat: number; lng: number };
  activeLocationLabel?: string;
  selectedBloodGroup?: string;
  totalFacilitiesCount?: number;
  criticalDemandsCount?: number;
  activeDispatchesCount?: number;
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  context: ChatContext,
  languageMode: 'EN' | 'HI' = 'EN'
): Promise<string> {
  try {
    const formattedHistory = history.map((h) => ({
      sender: h.sender,
      text: h.text,
    }));

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: formattedHistory,
        context,
        languageMode,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.response || data.reply || getLocalFallbackResponse(message, languageMode);
  } catch (err) {
    console.warn('Backend chat API failed, engaging client fallback:', err);
    return getLocalFallbackResponse(message, languageMode);
  }
}

function getLocalFallbackResponse(query: string, languageMode: 'EN' | 'HI'): string {
  const q = query.toLowerCase();

  if (languageMode === 'HI') {
    if (q.includes('donor') || q.includes('रक्त') || q.includes('दान')) {
      return `### ❤️ स्वैच्छिक रक्तदान दिशानिर्देश (भारत सरकार)

* **आयु सीमा:** 18 से 65 वर्ष
* **न्यूनतम वजन:** 45 किलोग्राम
* **हीमोग्लोबिन:** न्यूनतम 12.5 g/dL
* **अंतराल:** पुरुष हर 3 महीने (90 दिन) में और महिलाएं हर 4 महीने (120 दिन) में रक्तदान कर सकती हैं।

आपातकालीन सहायता के लिए टोल-फ्री नंबर **1910** (राष्ट्रीय रक्त हेल्पलाइन) या **108** पर कॉल करें।`;
    }

    if (q.includes('universal') || q.includes('ग्रुप') || q.includes('संगतता')) {
      return `### 🩸 रक्त समूह संगतता चार्ट

* **सार्वभौमिक दाता (Universal Donor):** **O-Negative (O-)** सभी रक्त समूहों को लाल रक्त कोशिकाएं दे सकता है।
* **सार्वभौमिक प्राप्तकर्ता (Universal Recipient):** **AB-Positive (AB+)** किसी भी समूह से रक्त प्राप्त कर सकता है।
* **प्लाज्मा सार्वभौमिक दाता:** **AB+** प्लाज्मा सभी को दिया जा सकता है।`;
    }

    return `### 🏥 हेमोपल्स (e-RaktKosh) आपातकालीन सहायता

मैं आपको रक्त उपलब्धता, 108 एम्बुलेंस डिस्पैच, ग्रीन कॉरिडोर और एनबीटीसी दिशानिर्देशों के बारे में पूरी जानकारी दे सकता हूँ। कृपया अपना प्रश्न पूछें।`;
  }

  if (
    q.includes('predictive') ||
    q.includes('forecaster') ||
    q.includes('forecast') ||
    q.includes('diwali') ||
    q.includes('dengue') ||
    q.includes('holi') ||
    q.includes('kumbh') ||
    q.includes('rebalanc') ||
    q.includes('preempt') ||
    q.includes('monsoon') ||
    q.includes('festival')
  ) {
    return `### 🔮 Predictive Inventory Forecaster (MILP Preemptive Rebalancing)

HEMOPULSE incorporates an epidemiological **Predictive Inventory Forecaster** within its Mixed-Integer Linear Programming (MILP) solver to proactively prevent shortages before they occur, rather than merely reacting to emergency trauma surges:

* 🪔 **Diwali & Chhath Puja:** PRBC (+185%), FFP (+220% for firework burns), Cryo (+190%), combined with a -48% voluntary donor camp drop.
* 🦟 **Monsoon Dengue Epidemic:** Catastrophic Platelet (PLT) surge of **+410%** due to thrombocytopenia (<20,000/µL). Preemptive 24-48h platelet replenishment into agitators is critical due to the perishable 5-day shelf-life limit.
* 🎨 **Holi Spring Festival:** Highway collision blunt trauma (+215% PRBC, +180% Whole Blood) with -55% holiday donor turnout.
* 🕉️ **Kumbh Mela / Pilgrimage:** Mass congregation stampede & crush injury readiness (+230% PRBC, +210% WB).
* 🚗 **New Year Winter Fog:** Multi-vehicle expressway pileups (+250% PRBC, +205% WB).

**Preemptive MILP Action:** Instead of paying emergency Code-3 rush fees and navigating gridlocked festival traffic, the solver calculates the optimal multi-commodity flow **24 to 72 hours in advance (T-24h to T-72h)**, transferring surplus units from peripheral spoke clinics and central blood depots into tertiary trauma centers!`;
  }

  // English fallbacks
  if (q.includes('universal') || q.includes('compatib') || q.includes('group') || q.includes('match') || q.includes('o-')) {
    return `### 🩸 Universal Donor & Compatibility Guide (NBTC Standards)

* **Universal Red Cell Donor:** **O-Negative (O-)** can give Packed Red Blood Cells (PRBC) to **all blood types** (O-, O+, A-, A+, B-, B+, AB-, AB+). In severe trauma, emergency O- units are transfused immediately prior to formal cross-matching.
* **Universal Plasma Donor:** **AB-Positive (AB+)** plasma contains neither anti-A nor anti-B antibodies, making it universally safe for all patients.
* **Universal Recipient:** **AB-Positive (AB+)** can receive PRBC from any ABO and Rh group.

#### ABO Compatibility:
* **O-** can receive: **O- only**
* **O+** can receive: **O-, O+**
* **A-** can receive: **A-, O-**
* **A+** can receive: **A+, A-, O+, O-**
* **B-** can receive: **B-, O-**
* **B+** can receive: **B+, B-, O+, O-**
* **AB-** can receive: **AB-, A-, B-, O-**
* **AB+** can receive: **All blood groups (Universal Recipient)**`;
  }

  if (q.includes('green corridor') || q.includes('corridor') || q.includes('police') || q.includes('ambulance')) {
    return `### 🚨 Green Corridor Ambulance & Transit Protocol

A **Green Corridor** provides a non-stop, clear-lane route managed by Traffic Police for emergency blood transfers and organ dispatches:

1. **Digital Authorization:** The dispatching hospital generates a certified Digital Green Corridor Transit Pass containing manifest lot number, cold-chain seal signature, and GPS beacon.
2. **Traffic Clearance:** Central Traffic Police Control Room synchronizes traffic lights along arterial expressways.
3. **Continuous Cold Chain:** Courier monitors temperature via calibrated IoT sensors (2–6°C for PRBC / 20–24°C with continuous agitation for Platelets).
4. **Receiving Verification:** Blood bank technologist verifies cryptographic seal and temperature logs before trauma ward infusion.`;
  }

  if (q.includes('shelf life') || q.includes('storage') || q.includes('expiry') || q.includes('temp')) {
    return `### ⏱️ e-RaktKosh Component Storage & Expiry Standards

* **Platelets (PLT):** **5 Days** stored at **20°C to 24°C** with **continuous gentle agitation**.
* **Packed Red Blood Cells (PRBC):** **42 Days** (SAGM solution) or **35 Days** (CPDA-1) stored at **2°C to 6°C**.
* **Fresh Frozen Plasma (FFP):** **365 Days (1 Year)** stored at **-18°C or colder**.
* **Cryoprecipitate (CRYO):** **365 Days** stored at **-18°C or colder**.
* **Whole Blood (WB):** **35 Days** stored at **2°C to 6°C**.`;
  }

  if (q.includes('donate') || q.includes('eligib') || q.includes('criteria') || q.includes('weight')) {
    return `### ❤️ Voluntary Blood Donation Guidelines (Govt of India Criteria)

* **Age:** 18 to 65 years.
* **Weight:** Minimum **45 kg** for 350 mL donation; **55 kg** for 450 mL.
* **Hemoglobin Level:** Minimum **12.5 g/dL**.
* **Donation Intervals:**
  * **Males:** Every 90 days (3 months).
  * **Females:** Every 120 days (4 months).
  * **Platelet Apheresis:** Every 48 hours (maximum 24 times per year).
* **Deferrals:** Tattoos (6 months), major surgery (12 months), alcohol consumption within 24 hours.`;
  }

  if (q.includes('phone') || q.includes('helpline') || q.includes('number') || q.includes('contact') || q.includes('108')) {
    return `### 📞 Critical Emergency Helplines in India

* 🚑 **108** — National Emergency Medical Services (Toll-Free, 24x7 Ambulance Dispatch)
* 🩸 **1910** — National Blood Transfusion Helpline (e-RaktKosh / NACO)
* 🏥 **102** — Maternal & Infant Free Medical Transport
* 🚓 **112** — Pan-India Unified Emergency Response Service`;
  }

  return `### 🏥 HEMOPULSE AI Medical Assistant

I am your 24x7 clinical and logistical assistant for the Indian blood banking network. You can ask me about:
* **Blood compatibility** (Universal donor, Rh factor, Bombay blood group)
* **Nearest hospital stock & dispatch tracking**
* **e-RaktKosh storage limits** (PRBC 42 days, Platelets 5 days)
* **Emergency Green Corridor activation & 108 ambulance dispatch**
* **Voluntary donor eligibility rules**

How can I assist you right now?`;
}
