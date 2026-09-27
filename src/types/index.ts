/**
 * Q-Companion Type Definitions
 * Core data structures for health telemetry, contacts, and system state.
 */

// ─── Vital Signs ──────────────────────────────────────────
export interface VitalSigns {
  heartRate: number;         // BPM
  spo2: number;              // % (0-100)
  skinTemperature: number;   // °C
  respirationRate: number;   // breaths per minute
  timestamp: number;         // Unix ms
}

// ─── Environmental Data ───────────────────────────────────
export interface EnvironmentalData {
  aqi: number;               // Air Quality Index (0-500)
  heatIndex: number;         // °C
  humidity: number;          // % (0-100)
  ambientTemp: number;       // °C
  timestamp: number;
}

// ─── Risk Assessment ─────────────────────────────────────
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface RiskAssessment {
  heatStress: { score: number; level: RiskLevel };
  respiratory: { score: number; level: RiskLevel };
  cardiovascular: { score: number; level: RiskLevel };
  overall: RiskLevel;
  timestamp: number;
}

// ─── Connection Status ───────────────────────────────────
export type ConnectionStatus = 'connected' | 'disconnected' | 'fallback';

export interface DeviceStatus {
  qBand: ConnectionStatus;
  qDock: ConnectionStatus;
  offlineMode: boolean;
  batteryLevel: number;      // % (0-100)
  lastSync: number;          // Unix ms
}

// ─── Simulation Mode ─────────────────────────────────────
export type SimulationMode = 'normal' | 'heatwave' | 'fall';

// ─── Emergency Contacts ──────────────────────────────────
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

// ─── SOS Event ───────────────────────────────────────────
export type SOSEventType = 'fall_detected' | 'heat_stroke' | 'manual';

export interface SOSEvent {
  id: string;
  type: SOSEventType;
  timestamp: number;
  coordinates: { lat: number; lng: number };
  cancelled: boolean;
  vitalsSnapshot: VitalSigns;
}

// ─── Sleep & Overnight Data ──────────────────────────────
export interface SleepData {
  restingHR: number;
  apneaFlags: number;
  respirationStability: number;  // 0-100 score
  sleepDuration: number;         // hours
  deepSleepPct: number;          // %
  remSleepPct: number;           // %
}

// ─── Historical Data Point ───────────────────────────────
export interface TrendDataPoint {
  time: string;   // e.g., "01:00", "14:00"
  value: number;
}

export interface TrendData {
  heartRate: TrendDataPoint[];
  spo2: TrendDataPoint[];
  skinTemperature: TrendDataPoint[];
  heatIndex: TrendDataPoint[];
}
