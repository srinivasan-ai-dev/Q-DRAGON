/**
 * Q-Companion Types — Redesigned for manual input flow.
 */

export interface VitalsInput {
  heartRate: string;
  spo2: string;
  skinTemp: string;
  respRate: string;
}

export interface EnvironmentInput {
  aqi: string;
  heatIndex: string;
  humidity: string;
}

export type Severity = 'normal' | 'mild' | 'moderate' | 'severe' | 'critical';

export interface DetectedCondition {
  id: string;
  name: string;
  emoji: string;
  severity: Severity;
  description: string;
}

export interface AdviceItem {
  id: string;
  icon: string;         // emoji
  category: string;     // e.g. "Immediate Action", "Hydration"
  title: string;
  body: string;
  urgency: Severity;
}

export interface RiskScore {
  label: string;
  score: number;        // 0-100
  severity: Severity;
}

export interface DiagnosisResult {
  overallStatus: {
    label: string;
    emoji: string;
    severity: Severity;
    summary: string;
  };
  conditions: DetectedCondition[];
  risks: RiskScore[];
  advice: AdviceItem[];
  timestamp: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}
