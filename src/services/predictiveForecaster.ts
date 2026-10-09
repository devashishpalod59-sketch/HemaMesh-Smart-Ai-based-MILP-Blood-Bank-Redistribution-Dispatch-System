import {
  BloodComponent,
  BloodType,
  FacilityNode,
  FacilityType,
  PredictiveEventId,
  PredictiveEventProfile,
  PredictiveForecastAnalysis,
  FacilityForecastVulnerability,
} from '../types/bloodMesh.ts';

/**
 * Historical Epidemiological Event Profiles across India
 * Grounded in National Blood Transfusion Council (NBTC), e-RaktKosh statistics,
 * and AIIMS / PGIMER / CMC emergency trauma registries.
 */
export const INDIAN_PREDICTIVE_EVENTS: PredictiveEventProfile[] = [
  {
    id: 'DIWALI_FESTIVAL',
    name: 'Diwali & Chhath Puja Mega-Exodus',
    hindiName: 'दीपावली एवं छठ महापर्व',
    seasonPeriod: 'October – November (Autumn Festive Peak)',
    historicalSpikeMultipliers: {
      PRBC: 1.85,  // Polytrauma & Golden Quadrilateral highway collisions during mass migration
      PLT: 1.25,   // Routine surgical + oncology maintenance
      FFP: 2.20,   // Severe burn injuries from firecrackers & deep coagulopathy
      CRYO: 1.90,  // Microvascular burn hemostasis & factor replenishment
      WB: 1.55,    // Emergency rural resuscitation
    },
    donorTurnoutModifier: -0.48, // -48% slump in voluntary blood donation camps due to holidays
    primaryClinicalRisk: 'Cracker blast burn resuscitation + Highway polytrauma + Severe donor shortage',
    epidemiologicalRationale:
      'Multi-day national holiday leads to an abrupt 48% contraction in corporate and collegiate voluntary blood donation camps. Concurrently, fireworks-related 2nd/3rd degree burns surge FFP & Cryoprecipitate demand by +220%, while Yamuna, NH-44, and Mumbai-Pune expressway collisions trigger massive red cell depletion.',
    recommendedLeadHours: 48,
    highRiskComponents: ['FFP', 'PRBC', 'CRYO'],
    priorityFacilityTypes: ['LEVEL_1_TRAUMA', 'LEVEL_2_TRAUMA'],
  },
  {
    id: 'MONSOON_DENGUE_SURGE',
    name: 'Monsoon Dengue & Chikungunya Epidemic',
    hindiName: 'मानसून डेंगू एवं चिकनगुनिया प्रकोप',
    seasonPeriod: 'July – October (Pan-India Vector Season)',
    historicalSpikeMultipliers: {
      PRBC: 1.15,
      PLT: 4.10,   // Catastrophic +310% to +410% spike in Platelet demand for thrombocytopenia
      FFP: 1.45,   // Plasma leakage in Dengue Shock Syndrome (DSS)
      CRYO: 1.30,
      WB: 1.05,
    },
    donorTurnoutModifier: -0.22, // Donors suffering from viral fevers, deferrals
    primaryClinicalRisk: 'Severe Thrombocytopenia (<20k/µL) & Dengue Hemorrhagic Fever shock',
    epidemiologicalRationale:
      'Seasonal monsoon stagnation breeds Aedes aegypti vectors across Delhi-NCR, Maharashtra, West Bengal, and Karnataka. Acute thrombocytopenia drops patient platelet counts below 20,000/µL, creating severe pan-city run on short shelf-life (5-day) platelets. Preemptive reallocation into cold agitators is life-critical.',
    recommendedLeadHours: 72,
    highRiskComponents: ['PLT', 'FFP'],
    priorityFacilityTypes: ['LEVEL_1_TRAUMA', 'LEVEL_2_TRAUMA', 'AMBULATORY_CENTER'],
  },
  {
    id: 'HOLI_FESTIVAL_TRAUMA',
    name: 'Holi Spring Festival & Road Collision Surge',
    hindiName: 'होली पर्व एवं सड़क दुर्घटना चेतावनी',
    seasonPeriod: 'March (Spring Equinox)',
    historicalSpikeMultipliers: {
      PRBC: 2.15,  // High-speed two-wheeler crashes, intoxicated polytrauma
      PLT: 1.15,
      FFP: 1.40,
      CRYO: 1.25,
      WB: 1.80,   // Direct trauma hemorrhage in peripheral centers
    },
    donorTurnoutModifier: -0.55, // -55% camp cancellations over festival week
    primaryClinicalRisk: 'Blunt force trauma, intoxicated road accidents & ocular lacerations',
    epidemiologicalRationale:
      'Holi festivities witness severe spikes in vehicular trauma across state highways and urban arterial roads, coupled with chemical eye lacerations. Voluntary donor turnout drops by over 55% as blood banks remain closed on Dhuleti, triggering critical red cell shortages in casualty departments.',
    recommendedLeadHours: 24,
    highRiskComponents: ['PRBC', 'WB', 'FFP'],
    priorityFacilityTypes: ['LEVEL_1_TRAUMA', 'LEVEL_2_TRAUMA'],
  },
  {
    id: 'DURGA_PUJA_NAVRATRI',
    name: 'Durga Puja & Navratri Pandal Congestion',
    hindiName: 'दुर्गा पूजा एवं नवरात्रि भीड़ प्रबंधन',
    seasonPeriod: 'September – October (Autumn Festival)',
    historicalSpikeMultipliers: {
      PRBC: 1.70,
      PLT: 1.35,
      FFP: 1.45,
      CRYO: 1.30,
      WB: 1.50,
    },
    donorTurnoutModifier: -0.40,
    primaryClinicalRisk: 'High-density crowd stampede risk, late-night traffic congestion & cardiac distress',
    epidemiologicalRationale:
      'Dense crowd gatherings in Kolkata, Mumbai, and Delhi pandals create localized stampede risks and nighttime collision surges. Public transit is saturated, making emergency dispatch during festival days 3x slower. Stock must be pre-positioned at trauma hubs prior to Shashthi.',
    recommendedLeadHours: 48,
    highRiskComponents: ['PRBC', 'WB'],
    priorityFacilityTypes: ['LEVEL_1_TRAUMA', 'CENTRAL_BLOOD_DEPOT'],
  },
  {
    id: 'KUMBH_MELA_PILGRIMAGE',
    name: 'Kumbh Mela & Mega-Pilgrimage Gathering',
    hindiName: 'कुंभ मेला एवं महातीर्थ जनसमूह',
    seasonPeriod: 'Peak Pilgrimage Windows (Haridwar / Prayagraj / Puri)',
    historicalSpikeMultipliers: {
      PRBC: 2.30,
      PLT: 1.55,
      FFP: 1.65,
      CRYO: 1.45,
      WB: 2.10,
    },
    donorTurnoutModifier: -0.30,
    primaryClinicalRisk: 'Mass casualty crush incidents, station stampedes & geriatric dehydration',
    epidemiologicalRationale:
      'Over 20–50 million pilgrims gather at riverbanks and ghats. Railway station bottleneck rushes and ghat stampedes generate mass casualty events. Peripheral medical camps have zero buffer, requiring proactive regional blood depot stockpiling in 40ft refrigerated trucks.',
    recommendedLeadHours: 72,
    highRiskComponents: ['PRBC', 'WB', 'FFP'],
    priorityFacilityTypes: ['LEVEL_1_TRAUMA', 'CENTRAL_BLOOD_DEPOT'],
  },
  {
    id: 'NEW_YEAR_HIGHWAY_CORRIDOR',
    name: 'New Year Highway & Dense Winter Fog Surge',
    hindiName: 'नववर्ष एवं घना कोहरा राजमार्ग चेतावनी',
    seasonPeriod: 'Late December – Early January (Winter Solstice)',
    historicalSpikeMultipliers: {
      PRBC: 2.50,  // Multi-vehicle expressway pileups in dense north Indian smog/fog
      PLT: 1.20,
      FFP: 1.55,
      CRYO: 1.40,
      WB: 2.05,
    },
    donorTurnoutModifier: -0.35,
    primaryClinicalRisk: 'Dense fog pileups (50+ vehicle crashes) & holiday intoxication trauma',
    epidemiologicalRationale:
      'Dense winter radiation fog across Punjab, Haryana, UP, and Rajasthan corridors combined with New Year celebrants causes multi-vehicle pileups on Yamuna and Eastern Peripheral expressways. Sub-zero night temperatures also cause whole blood storage complications.',
    recommendedLeadHours: 24,
    highRiskComponents: ['PRBC', 'WB'],
    priorityFacilityTypes: ['LEVEL_1_TRAUMA', 'LEVEL_2_TRAUMA'],
  },
  {
    id: 'EID_HIGHWAY_SURGE',
    name: 'Eid Interstate Transit & Corridor Rush',
    hindiName: 'ईद-उल-फ़ित्र / ईद-उल-अज़हा यात्रा कॉरिडोर',
    seasonPeriod: 'Post-Ramadan Interstate Migration',
    historicalSpikeMultipliers: {
      PRBC: 1.65,
      PLT: 1.20,
      FFP: 1.35,
      CRYO: 1.25,
      WB: 1.50,
    },
    donorTurnoutModifier: -0.38,
    primaryClinicalRisk: 'Intercity bus and rail corridor collisions during family homecomings',
    epidemiologicalRationale:
      'Inter-district private buses and crowded train networks face heavy vehicular density. Donation camps slow down in pre-festival fasting and post-festival gatherings, necessitating preemptive reserve balancing 48 hours prior.',
    recommendedLeadHours: 48,
    highRiskComponents: ['PRBC', 'WB'],
    priorityFacilityTypes: ['LEVEL_1_TRAUMA', 'CENTRAL_BLOOD_DEPOT'],
  },
  {
    id: 'SANKRANTI_HARVEST_SURGE',
    name: 'Makar Sankranti & Pongal Harvest Travel',
    hindiName: 'मकर संक्रांति एवं पोंगल फसल उत्सव',
    seasonPeriod: 'Mid-January (Harvest Solstice)',
    historicalSpikeMultipliers: {
      PRBC: 1.80,
      PLT: 1.15,
      FFP: 1.40,
      CRYO: 1.35,
      WB: 1.60,
    },
    donorTurnoutModifier: -0.28,
    primaryClinicalRisk: 'Manja (glass-coated string) carotid lacerations & highway travel collisions',
    epidemiologicalRationale:
      'Glass-coated metallic manja kite strings inflict deep carotid artery and jugular vascular lacerations on two-wheeler riders in Gujarat, Maharashtra, and Telangana, requiring immediate un-crossmatched O- red cells and surgical repair.',
    recommendedLeadHours: 24,
    highRiskComponents: ['PRBC', 'WB'],
    priorityFacilityTypes: ['LEVEL_1_TRAUMA', 'LEVEL_2_TRAUMA'],
  },
];

export function getPredictiveEvent(id: PredictiveEventId): PredictiveEventProfile {
  return (
    INDIAN_PREDICTIVE_EVENTS.find((e) => e.id === id) || INDIAN_PREDICTIVE_EVENTS[0]
  );
}

/**
 * Calculates baseline historical daily consumption rate per facility
 * based on clinical designation, operational bed count, and historical turnover.
 */
export function calculateFacilityBaselineDemand(
  node: FacilityNode
): Record<BloodComponent, number> {
  const isLevel1 = node.type === 'LEVEL_1_TRAUMA';
  const isLevel2 = node.type === 'LEVEL_2_TRAUMA';
  const isDepot = node.type === 'CENTRAL_BLOOD_DEPOT';
  const isPeripheral =
    node.type === 'COMMUNITY_CLINIC' || node.type === 'AMBULATORY_CENTER';

  if (isLevel1) {
    return {
      PRBC: 24, // units/day baseline
      PLT: 14,
      FFP: 12,
      CRYO: 6,
      WB: 8,
    };
  }
  if (isLevel2) {
    return {
      PRBC: 14,
      PLT: 8,
      FFP: 7,
      CRYO: 3,
      WB: 5,
    };
  }
  if (isDepot) {
    return {
      PRBC: 6,
      PLT: 4,
      FFP: 3,
      CRYO: 2,
      WB: 2,
    };
  }
  // Peripheral Spoke
  return {
    PRBC: 3,
    PLT: 1,
    FFP: 2,
    CRYO: 1,
    WB: 2,
  };
}

/**
 * Generates Comprehensive Predictive Inventory Forecast
 * Anticipates shortages across all network nodes BEFORE the festival/event starts.
 */
export function generatePredictiveForecast(
  nodes: FacilityNode[],
  eventId: PredictiveEventId,
  horizonHours: number = 48,
  intensityScale: number = 1.0
): PredictiveForecastAnalysis {
  const event = getPredictiveEvent(eventId);
  const horizonDays = horizonHours / 24;

  const facilityVulnerabilities: FacilityForecastVulnerability[] = [];
  let totalProjectedDeficitUnits = 0;

  // Track component-level demand shifts across entire regional network
  const compBaselineTotals: Record<BloodComponent, number> = {
    PRBC: 0,
    PLT: 0,
    FFP: 0,
    CRYO: 0,
    WB: 0,
  };
  const compPredictedTotals: Record<BloodComponent, number> = {
    PRBC: 0,
    PLT: 0,
    FFP: 0,
    CRYO: 0,
    WB: 0,
  };

  nodes.forEach((node) => {
    const baselineDaily = calculateFacilityBaselineDemand(node);
    let nodeBaselineSum = 0;
    let nodePredictedSum = 0;
    let nodeShortfallUnits = 0;
    const criticalComponentsSet = new Set<BloodComponent>();

    const isPriorityFacility = event.priorityFacilityTypes.includes(node.type);
    const facilitySpikeWeight = isPriorityFacility ? 1.0 : 0.65;

    // Evaluate each component
    (Object.keys(baselineDaily) as BloodComponent[]).forEach((comp) => {
      const baseUnitsPerDay = baselineDaily[comp];
      const rawMultiplier = event.historicalSpikeMultipliers[comp] || 1.0;
      // Scaled multiplier with user intensity slider
      const effectiveMultiplier = 1.0 + (rawMultiplier - 1.0) * intensityScale * facilitySpikeWeight;

      const projectedDemandOverHorizon = baseUnitsPerDay * effectiveMultiplier * horizonDays;
      const baselineDemandOverHorizon = baseUnitsPerDay * horizonDays;

      compBaselineTotals[comp] += baselineDemandOverHorizon;
      compPredictedTotals[comp] += projectedDemandOverHorizon;

      nodeBaselineSum += baselineDemandOverHorizon;
      nodePredictedSum += projectedDemandOverHorizon;

      // Available on-hand matching inventory
      const onHandCompUnits = node.inventory
        .filter((c) => c.component === comp)
        .reduce((sum, c) => sum + c.units, 0);

      // Inflow anticipated (damped by donor turnout slump)
      const expectedDonorInflow =
        baseUnitsPerDay * (1 + event.donorTurnoutModifier) * 0.75 * horizonDays;

      // Projected net balance
      const projectedNet = onHandCompUnits + expectedDonorInflow - projectedDemandOverHorizon;

      // Safety buffer threshold: 12 units for Level-1 trauma, 6 units for Level-2, 2 for clinics
      const minSafetyThreshold =
        node.type === 'LEVEL_1_TRAUMA' ? 12 : node.type === 'LEVEL_2_TRAUMA' ? 6 : 2;

      if (projectedNet < minSafetyThreshold) {
        const compDeficit = Math.round(minSafetyThreshold - projectedNet);
        nodeShortfallUnits += compDeficit;
        criticalComponentsSet.add(comp);
      }
    });

    const totalOnHand = node.inventory.reduce((sum, c) => sum + c.units, 0);
    const projectedNetUnits = Math.round(totalOnHand - nodePredictedSum);

    let vulnerabilityLevel: FacilityForecastVulnerability['vulnerabilityLevel'] = 'RESILIENT_SURPLUS';
    if (nodeShortfallUnits > 18) {
      vulnerabilityLevel = 'CRITICAL_STOCKOUT_RISK';
    } else if (nodeShortfallUnits > 8) {
      vulnerabilityLevel = 'HIGH_DEFICIT_WARNING';
    } else if (nodeShortfallUnits > 0) {
      vulnerabilityLevel = 'MODERATE_MONITORED';
    }

    totalProjectedDeficitUnits += nodeShortfallUnits;

    facilityVulnerabilities.push({
      nodeId: node.id,
      nodeName: node.shortName || node.name,
      facilityType: node.type,
      baselineDailyDemand: Math.round(nodeBaselineSum / horizonDays),
      predictedDailyDemand: Math.round(nodePredictedSum / horizonDays),
      currentOnHandUnits: totalOnHand,
      projectedNetUnits,
      shortfallUnits: nodeShortfallUnits,
      vulnerabilityLevel,
      criticalComponents: Array.from(criticalComponentsSet),
      suggestedPreemptiveInflow: Math.max(0, nodeShortfallUnits),
    });
  });

  // Sort facilities: highest shortfall first
  facilityVulnerabilities.sort((a, b) => b.shortfallUnits - a.shortfallUnits);

  const componentDemandSpikes = (Object.keys(compBaselineTotals) as BloodComponent[]).map(
    (comp) => {
      const base = Math.max(1, Math.round(compBaselineTotals[comp]));
      const pred = Math.max(1, Math.round(compPredictedTotals[comp]));
      return {
        component: comp,
        baselineUnits: base,
        predictedUnits: pred,
        multiplier: Math.round((pred / base) * 100) / 100,
      };
    }
  );

  // Network resilience scoring: without rebalancing vs with proactive rebalancing
  const totalDemand = Math.max(1, compPredictedTotals.PRBC + compPredictedTotals.PLT + compPredictedTotals.FFP + compPredictedTotals.WB);
  const unaddressedRatio = Math.min(1, totalProjectedDeficitUnits / totalDemand);
  const resilienceWithout = Math.max(25, Math.round((1 - unaddressedRatio) * 100));
  const resilienceWith = Math.min(99, Math.round(resilienceWithout + (100 - resilienceWithout) * 0.92));

  return {
    eventId,
    event,
    horizonHours,
    intensityScale,
    totalProjectedDeficitUnits,
    vulnerableFacilities: facilityVulnerabilities,
    componentDemandSpikes,
    networkResilienceWithoutRebalance: resilienceWithout,
    networkResilienceWithRebalance: resilienceWith,
  };
}

/**
 * Augments Facility Nodes with Predictive Demand Requirements
 * Injecting proactive buffer demands into high-risk trauma centers
 * while preserving existing acute trauma demands.
 */
export function injectPredictiveDemandsIntoNodes(
  nodes: FacilityNode[],
  analysis: PredictiveForecastAnalysis
): FacilityNode[] {
  const vulnerableMap = new Map(
    analysis.vulnerableFacilities.map((v) => [v.nodeId, v])
  );

  const event = analysis.event;

  return nodes.map((node) => {
    const vuln = vulnerableMap.get(node.id);
    if (!vuln || vuln.shortfallUnits <= 0) {
      return node; // No deficit at this facility
    }

    const updatedDemands = [...node.demands];

    // Priority blood types for emergency pre-positioning: O-, O+, A+, B+
    const priorityTypes: BloodType[] = ['O-', 'O+', 'B+', 'A+'];

    vuln.criticalComponents.forEach((comp) => {
      const rawMultiplier = event.historicalSpikeMultipliers[comp] || 1.2;
      const effectiveSpike = Math.round((rawMultiplier - 1.0) * analysis.intensityScale * 10);

      // Pre-position for each priority blood type
      priorityTypes.forEach((bType, idx) => {
        const unitsForType = Math.max(
          2,
          Math.round((vuln.shortfallUnits / (vuln.criticalComponents.length * priorityTypes.length)) * (idx === 0 ? 1.6 : 0.9))
        );

        if (unitsForType <= 0) return;

        const existingIdx = updatedDemands.findIndex(
          (d) => d.bloodType === bType && d.component === comp
        );

        if (existingIdx >= 0) {
          // Boost existing requirement with predictive buffer
          updatedDemands[existingIdx] = {
            ...updatedDemands[existingIdx],
            requiredUnits: updatedDemands[existingIdx].requiredUnits + unitsForType,
            criticality:
              updatedDemands[existingIdx].criticality === 'CODE_RED_TRAUMA'
                ? 'CODE_RED_TRAUMA'
                : vuln.vulnerabilityLevel === 'CRITICAL_STOCKOUT_RISK'
                ? 'CRITICAL_DEFICIT'
                : 'ELEVATED',
          };
        } else {
          // Add new predictive buffer demand
          updatedDemands.push({
            bloodType: bType,
            component: comp,
            requiredUnits: unitsForType,
            criticality:
              vuln.vulnerabilityLevel === 'CRITICAL_STOCKOUT_RISK'
                ? 'CRITICAL_DEFICIT'
                : 'ELEVATED',
            burnRatePerHour: Math.round((effectiveSpike / 4) * 10) / 10,
          });
        }
      });
    });

    return {
      ...node,
      demands: updatedDemands,
      status:
        vuln.vulnerabilityLevel === 'CRITICAL_STOCKOUT_RISK' && node.status !== 'MASS_CASUALTY_SURGE'
          ? 'CRITICAL_SHORTAGE'
          : vuln.vulnerabilityLevel === 'HIGH_DEFICIT_WARNING' && node.status === 'OPTIMAL'
          ? 'ELEVATED_DEMAND'
          : node.status,
    };
  });
}
