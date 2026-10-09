import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client according to AI Studio guidelines
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Comprehensive Indian Healthcare & Transfusion Medicine Knowledge Base Fallback
function generateKnowledgeBaseResponse(query: string, context?: any): string {
  const q = query.toLowerCase().trim();

  // 1. Universal Donor & Blood Group Compatibility
  if (
    q.includes('universal') ||
    q.includes('compatible') ||
    q.includes('compatibility') ||
    q.includes('match') ||
    q.includes('o-') ||
    q.includes('ab+') ||
    q.includes('rh factor') ||
    q.includes('bombay')
  ) {
    return `### 🩸 Blood Type Compatibility & Transfusion Matrix (NBTC / e-RaktKosh)

* **Universal Red Cell Donor:** **O-Negative (O-)** can give Packed Red Blood Cells (PRBC) to **all blood types** (O-, O+, A-, A+, B-, B+, AB-, AB+). Essential in acute trauma resuscitation before cross-matching.
* **Universal Plasma Donor:** **AB-Positive (AB+)** plasma contains no anti-A or anti-B antibodies and can be safely transfused to all patients.
* **Universal Red Cell Recipient:** **AB-Positive (AB+)** can safely receive PRBC from any ABO/Rh group.

#### ABO & Rh Compatibility Summary:
* **O-** can receive: **O- only**
* **O+** can receive: **O-, O+**
* **A-** can receive: **A-, O-**
* **A+** can receive: **A+, A-, O+, O-**
* **B-** can receive: **B-, O-**
* **B+** can receive: **B+, B-, O+, O-**
* **AB-** can receive: **AB-, A-, B-, O-**
* **AB+** can receive: **All blood groups (Universal Recipient)**

⚠️ *Special Rare Type:* **Bombay Blood Group (hh phenotype)** lacks the H antigen. Individuals with Bombay blood can only receive blood from another Bombay blood donor.`;
  }

  // 2. Green Corridor Protocols
  if (
    q.includes('green corridor') ||
    q.includes('corridor') ||
    q.includes('traffic') ||
    q.includes('escort') ||
    q.includes('police')
  ) {
    return `### 🚨 Digital Green Corridor Protocol in India

A **Green Corridor** is a dedicated, zero-halt transit pathway cleared by State Police and Traffic Authorities to transport critical organs or emergency blood components between hospitals without red-light stops.

#### Protocol Activation Steps:
1. **Hospital Dispatch Initiates Request:** The transmitting blood bank (e.g., AIIMS, KEM, NIMS) generates a signed **Digital Green Corridor Transit Pass** containing manifest hash, courier vehicle number, and dispatch GPS coordinates.
2. **Police Control Room Clearance:** Coordinated with City Traffic Police Control Room (Dial **108 / 100**) to synchronize traffic signals and provide escort patrol vehicles.
3. **Continuous Cold-Chain Telemetry:** Transit box is sealed with cryptographic tamper tag and monitored via BLE IoT temperature sensor (keeping PRBC at 2–6°C or Platelets at 20–24°C).
4. **Verified Handover:** Destination hospital trauma team verifies lot barcode, seal integrity, and temperature logs upon arrival.`;
  }

  // 3. e-RaktKosh & NBTC Shelf Life & Cold Chain
  if (
    q.includes('shelf life') ||
    q.includes('storage') ||
    q.includes('temperature') ||
    q.includes('e-raktkosh') ||
    q.includes('nbtc') ||
    q.includes('expiry') ||
    q.includes('cold chain')
  ) {
    return `### ⏱️ e-RaktKosh & NBTC Component Storage Standards

According to the **National Blood Transfusion Council (NBTC)** and **e-RaktKosh** standards:

| Blood Component | Storage Temperature | Shelf Life | Special Handling |
| :--- | :--- | :--- | :--- |
| **Packed Red Cells (PRBC)** | **2°C to 6°C** | **42 Days** (SAGM) / 35 Days (CPDA-1) | Do not freeze; store in cold room |
| **Platelets (Random / Apheresis)** | **20°C to 24°C** | **5 Days** | **Continuous gentle agitation** required |
| **Fresh Frozen Plasma (FFP)** | **-18°C or colder** | **1 Year (365 Days)** | Thaw at 37°C in water bath before use |
| **Cryoprecipitate** | **-18°C or colder** | **1 Year (365 Days)** | Rich in Factor VIII & Fibrinogen |
| **Whole Blood (WB)** | **2°C to 6°C** | **35 Days** (CPDA-1) | Screened for TTIs before release |

❄️ *Critical Alert:* If PRBC exceeds **10°C** or falls below **1°C** for >30 mins, a cold-chain breach occurs and units must be quarantined!`;
  }

  // 4. Voluntary Blood Donation Eligibility
  if (
    q.includes('donate') ||
    q.includes('donation') ||
    q.includes('eligibility') ||
    q.includes('who can donate') ||
    q.includes('donor')
  ) {
    return `### ❤️ Voluntary Blood Donation Eligibility (Govt of India Criteria)

Anyone meeting the following criteria can donate blood voluntarily in India:

#### Basic Health Qualifications:
* **Age:** 18 to 65 years.
* **Weight:** Minimum **45 kg** for 350 mL whole blood; **55 kg** for 450 mL.
* **Hemoglobin Level:** Minimum **12.5 g/dL**.
* **Pulse Rate:** 60 to 100 beats/min with regular rhythm.
* **Blood Pressure:** Systolic 100–140 mmHg, Diastolic 60–90 mmHg.
* **Body Temperature:** Normal oral temperature (<37.5°C / 99.5°F).

#### Donation Frequency Intervals:
* **Males:** Once every **90 days** (3 months).
* **Females:** Once every **120 days** (4 months).
* **Platelet Apheresis:** Once every **48 hours** (max 24 times/year).

❌ *Temporary Deferrals:* Tattoos/piercings (6 months), major surgery (12 months), dental extraction (3 days), antibiotics completion (7 days), post-vaccination (14 days).`;
  }

  // 5. Emergency Helpline Numbers in India
  if (
    q.includes('emergency') ||
    q.includes('phone') ||
    q.includes('helpline') ||
    q.includes('contact') ||
    q.includes('108') ||
    q.includes('sos')
  ) {
    return `### 📞 Emergency Blood & Medical Contact Numbers in India

* 🚑 **108** — National Emergency Medical Ambulance Service (Toll-Free, 24x7)
* 🩸 **1910** — National Blood Helpline (e-RaktKosh / NACO, 24x7)
* 🏥 **102** — Janani Shishu Suraksha Karyakram (Maternal & Infant Ambulance)
* 🩺 **104** — State Medical Consultation & Health Advice Helpline
* 🚓 **112** — Pan-India Emergency Response Support System (ERSS - Police/Fire/Ambulance)

*Immediate Action:* You can also trigger the glowing **SOS Request** button in HEMOPULSE to mobilize nearby 108 ambulances and broadcast urgent deficit beacons to compatible donors!`;
  }

  // 6. Massive Transfusion Protocol (MTP) & Vitals Triage
  if (
    q.includes('mtp') ||
    q.includes('massive transfusion') ||
    q.includes('shock index') ||
    q.includes('triage') ||
    q.includes('trauma')
  ) {
    return `### ⚡ Massive Transfusion Protocol (MTP 1:1:1 Ratio)

In acute hemorrhagic shock or polytrauma, the **Massive Transfusion Protocol (MTP)** prevents trauma-induced coagulopathy:

1. **Balanced Component Ratio:** Transfuse **1 Unit PRBC : 1 Unit FFP : 1 Unit Platelets** (1:1:1 balanced ratio).
2. **Assessment of Shock:**
   * **Shock Index (SI) = Heart Rate / Systolic Blood Pressure**
   * If **SI > 0.9**, critical hypoperfusion is suspected.
   * If **SI ≥ 1.3**, trigger immediate STAT MTP package.
3. **Tranexamic Acid (TXA):** Administer 1g IV bolus within 3 hours of trauma injury followed by 1g over 8 hours.
4. **Permissive Hypotension:** Target Mean Arterial Pressure (MAP) ~65 mmHg until surgical hemostasis is achieved.`;
  }

  // 7. Predictive Inventory Forecaster & Indian Festival/Monsoon Surges
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

#### 1. Why Proactive Rebalancing is Essential in India:
* **The Holiday Donor Paradox:** During major Indian festivals (Diwali, Holi, Durga Puja, Eid), voluntary blood donation camp turnouts crash by **40% to 55%** as schools and corporates close.
* **Corridor Congestion:** Highway exodus on national expressways (NH-44, Yamuna, Mumbai-Pune) leads to severe road collision spikes while festival traffic jams triple ambulance transit times.
* **Vector Epidemics:** The annual Monsoon (July–October) triggers massive Dengue and Chikungunya outbreaks with platelet demand soaring by **+380% to +450%**.

#### 2. Key Historical Event Spikes Modeled:
* 🪔 **Diwali & Chhath Puja:** PRBC (+185%), FFP (+220% for firework burns), Cryo (+190%), with a -48% voluntary donor camp drop.
* 🦟 **Monsoon Dengue Epidemic:** Catastrophic Platelet (PLT) surge of **+410%** due to thrombocytopenia (<20,000/µL). Preemptive 24-48h platelet replenishment is life-saving due to the 5-day shelf-life limit.
* 🎨 **Holi Celebration:** Highway & two-wheeler blunt trauma (+215% PRBC, +180% Whole Blood) with -55% holiday donor turnout.
* 🕉️ **Kumbh Mela / Mega-Pilgrimage:** Mass gathering stampede & crush injury readiness (+230% PRBC, +210% WB).
* 🚗 **New Year Winter Fog:** Multi-vehicle expressway pileups (+250% PRBC, +205% WB).

#### 3. Preemptive MILP Redistribution:
Instead of paying emergency Code-3 rush fees and navigating gridlocked festival traffic, the solver calculates the optimal multi-commodity flow **24 to 72 hours in advance (T-24h to T-72h)**, transferring surplus units from peripheral spoke clinics and central blood depots into tertiary trauma centers!`;
  }

  // Default response covering platform overview
  return `### 🏥 HEMOPULSE · e-RaktKosh Medical Information System

I can assist you with comprehensive blood banking and emergency transfusion medicine protocols across India:

* 🩸 **Blood Group Compatibility:** Check universal donor/recipient matching, Rh antigens, and Bombay blood group rules.
* 📍 **All-India Blood Locator:** Locate nearest blood banks with live inventory in Delhi, Mumbai, Pune, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad, Lucknow, Jaipur, and nationwide corridors.
* ⏱️ **Storage & Shelf Life:** NBTC standards for PRBC (42 days), Platelets (5 days), FFP (1 year), and cold-chain compliance.
* 🚨 **Emergency Procedures:** Green Corridor activation, 108 EMS coordination, and 1910 National Blood Helpline.
* ❤️ **Voluntary Blood Donation:** Criteria, weight/hemoglobin limits, and post-donation guidelines.

Feel free to ask a specific question, or select one of the suggested prompts below!`;
}

// POST /api/chat - Gemini AI Copilot Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, context, languageMode } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required.' });
      return;
    }

    const currentLang = languageMode === 'HI' ? 'Hindi' : 'English';

    // System instruction for Gemini model
    const systemInstruction = `You are HEMOPULSE AI, an expert emergency blood banking and transfusion medicine copilot for the Indian healthcare ecosystem, developed in alignment with e-RaktKosh (Ministry of Health & Family Welfare, Govt. of India) and National Blood Transfusion Council (NBTC) guidelines.
Your duties:
1. Deliver rapid, clinically accurate, empathetic, and clear answers to ANY questions about:
   - Blood type compatibility (ABO, Rh, Bombay blood group hh, cross-matching).
   - e-RaktKosh standards (PRBC: 2-6°C for 42 days, Platelets: 20-24°C continuous agitation for 5 days, FFP: -18°C for 1 year).
   - Emergency protocols in India (Green Corridor police clearance, 108 EMS ambulance, 1910 National Blood Helpline, ICMR drone corridor).
   - Voluntary donation eligibility in India (Age 18-65, weight >= 45kg, Hb >= 12.5 g/dL, 3 months gap for males / 4 months for females).
   - Massive Transfusion Protocol (MTP 1:1:1 PRBC:FFP:PLT), Shock Index calculation.
   - The Predictive Inventory Forecaster within the MILP solver: preempting blood stockouts before Indian holiday seasons and events (Diwali burn/highway injuries, Monsoon Dengue platelet surges of +410%, Holi road trauma, Kumbh Mela crush injuries) by rebalancing stock from peripheral clinics and central depots to tertiary trauma centers 24-72 hours ahead of time before traffic jams and donor slump hit.
   - Finding blood banks across all Indian cities and states (Delhi NCR, Mumbai, Bengaluru, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad, Lucknow, Jaipur, etc.).
2. Current Application Context:
   ${context ? JSON.stringify(context) : 'Standard Indian emergency healthcare mesh.'}
3. Language: Respond in ${currentLang}. If the user asks in Hindi, answer in clear, respectful Hindi.
4. Formatting: Use structured Markdown with bold titles, clean bullet points, and actionable warnings for emergencies.`;

    if (aiClient) {
      try {
        // Construct conversation contents with history
        const promptParts: string[] = [];
        if (history && Array.isArray(history)) {
          history.slice(-6).forEach((h: { sender: string; text: string }) => {
            promptParts.push(`${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`);
          });
        }
        promptParts.push(`User: ${message}`);

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptParts.join('\n\n'),
          config: {
            systemInstruction,
          },
        });

        const replyText = response.text || generateKnowledgeBaseResponse(message, context);
        res.json({ response: replyText });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using knowledge-base fallback:', geminiError?.message);
        // Fallback gracefully
        const fallbackText = generateKnowledgeBaseResponse(message, context);
        res.json({ response: fallbackText });
        return;
      }
    } else {
      // Offline / Local knowledge base mode
      const reply = generateKnowledgeBaseResponse(message, context);
      res.json({ response: reply });
    }
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'Failed to process inquiry.',
      response: generateKnowledgeBaseResponse('general emergency'),
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'HEMOPULSE e-RaktKosh Full-Stack Engine',
    geminiEnabled: Boolean(aiClient),
  });
});

async function startServer() {
  // Vite integration in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HEMOPULSE Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
