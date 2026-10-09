import { DisasterTelemetryEvent } from '../types/bloodMesh.ts';

type TelemetryListener = (event: DisasterTelemetryEvent) => void;

class DisasterTelemetryEngine {
  private listeners: Set<TelemetryListener> = new Set();
  private timer: number | null = null;
  private isConnected: boolean = true;
  private eventHistory: DisasterTelemetryEvent[] = [];

  constructor() {
    this.startStreaming();
  }

  public subscribe(listener: TelemetryListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getHistory(): DisasterTelemetryEvent[] {
    return [...this.eventHistory];
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public toggleConnection(): boolean {
    this.isConnected = !this.isConnected;
    if (this.isConnected) {
      this.startStreaming();
    } else {
      this.stopStreaming();
    }
    return this.isConnected;
  }

  public triggerPresetScenario(type: 'FREEWAY_MCI' | 'EXPLOSION_MCI' | 'OB_HEMORRHAGE' | 'PLATELET_EXPIRY_CRISIS'): DisasterTelemetryEvent {
    let event: DisasterTelemetryEvent;

    switch (type) {
      case 'FREEWAY_MCI':
        event = {
          id: `EVT-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          headline: '16-Vehicle Multi-Collision with Fire on Major Interstate Expressway',
          incidentType: 'FREEWAY_PILEUP',
          locationName: 'I-95 South Mile Marker 14',
          affectedHospitalId: 'fac-metro-t1',
          affectedHospitalName: 'Metropolitan University Level 1 Trauma Hub',
          estimatedCasualties: 14,
          severity: 'LEVEL_1_CATASTROPHIC',
          urgentUnitsNeeded: [
            { component: 'PRBC', bloodType: 'O-', units: 16 },
            { component: 'PLT', bloodType: 'O-', units: 8 },
            { component: 'FFP', bloodType: 'AB-', units: 12 },
          ],
          acknowledged: false,
        };
        break;

      case 'EXPLOSION_MCI':
        event = {
          id: `EVT-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          headline: 'Industrial Chemical Refinery Vapor Cloud Explosion & Flash Burns',
          incidentType: 'METRO_EXPLOSION',
          locationName: 'East Industrial District Bay 4',
          affectedHospitalId: 'fac-regional-t2',
          affectedHospitalName: 'Mercy Queen Level 2 Regional Hospital',
          estimatedCasualties: 22,
          severity: 'LEVEL_1_CATASTROPHIC',
          urgentUnitsNeeded: [
            { component: 'FFP', bloodType: 'AB+', units: 20 },
            { component: 'PLT', bloodType: 'A+', units: 10 },
            { component: 'PRBC', bloodType: 'O+', units: 14 },
          ],
          acknowledged: false,
        };
        break;

      case 'OB_HEMORRHAGE':
        event = {
          id: `EVT-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          headline: 'Severe Postpartum Amniotic Embolism & Disseminated Coagulopathy',
          incidentType: 'OB_EMERGENCY',
          locationName: 'Labor & Delivery OR 3',
          affectedHospitalId: 'fac-bronx-specialty',
          affectedHospitalName: 'St. Jude Bronx Children & Specialty Hospital',
          estimatedCasualties: 1,
          severity: 'LEVEL_2_SEVERE',
          urgentUnitsNeeded: [
            { component: 'PRBC', bloodType: 'O-', units: 8 },
            { component: 'CRYO', bloodType: 'AB+', units: 10 },
            { component: 'PLT', bloodType: 'O-', units: 4 },
          ],
          acknowledged: false,
        };
        break;

      case 'PLATELET_EXPIRY_CRISIS':
        event = {
          id: `EVT-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          headline: 'Regional Platelet Shelf-Life Expiry Imminent: 12 Units Expiring within 24 Hours',
          incidentType: 'CIVILIAN_SURGE',
          locationName: 'Pine Valley Outpatient & Harbor Surgery',
          affectedHospitalId: 'fac-community-clinic-1',
          affectedHospitalName: 'Pine Valley Outpatient Community Clinic',
          estimatedCasualties: 0,
          severity: 'LEVEL_3_ELEVATED',
          urgentUnitsNeeded: [
            { component: 'PLT', bloodType: 'O-', units: 4 },
            { component: 'PLT', bloodType: 'A+', units: 5 },
          ],
          acknowledged: false,
        };
        break;
    }

    this.emitEvent(event);
    return event;
  }

  private emitEvent(event: DisasterTelemetryEvent) {
    this.eventHistory = [event, ...this.eventHistory.slice(0, 19)];
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  private startStreaming() {
    if (this.timer) clearInterval(this.timer);
    // Periodically emit routine hospital telemetry updates
    this.timer = window.setInterval(() => {
      if (!this.isConnected) return;
      // 25% chance of spontaneous telemetry surge update
      if (Math.random() < 0.25) {
        const incidents: Array<'FREEWAY_MCI' | 'OB_HEMORRHAGE' | 'PLATELET_EXPIRY_CRISIS'> = [
          'FREEWAY_MCI',
          'OB_HEMORRHAGE',
          'PLATELET_EXPIRY_CRISIS',
        ];
        const pick = incidents[Math.floor(Math.random() * incidents.length)];
        this.triggerPresetScenario(pick);
      }
    }, 28000);
  }

  private stopStreaming() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const telemetryEngine = new DisasterTelemetryEngine();
