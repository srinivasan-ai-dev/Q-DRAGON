/**
 * Risk Calculation Utilities
 * AI-simulated risk scoring based on vital signs and environmental data.
 * Each risk is scored 0-100 and mapped to a severity level.
 */

import { VitalSigns, EnvironmentalData, RiskAssessment, RiskLevel } from '../types';

function scoreToLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 35) return 'moderate';
  return 'low';
}

/**
 * Calculates Heat Stress Risk
 * Factors: skin temperature, ambient heat index, heart rate elevation
 */
function calcHeatStress(vitals: VitalSigns, env: EnvironmentalData): number {
  let score = 0;

  // Skin temperature contribution (normal ~36.5-37.0)
  if (vitals.skinTemperature > 38.5) score += 40;
  else if (vitals.skinTemperature > 38.0) score += 30;
  else if (vitals.skinTemperature > 37.5) score += 15;
  else score += 5;

  // Heat index contribution
  if (env.heatIndex > 42) score += 35;
  else if (env.heatIndex > 38) score += 25;
  else if (env.heatIndex > 33) score += 15;
  else score += 5;

  // Heart rate contribution (elevated HR in heat = stress)
  if (vitals.heartRate > 120) score += 25;
  else if (vitals.heartRate > 100) score += 15;
  else if (vitals.heartRate > 85) score += 8;
  else score += 2;

  return Math.min(score, 100);
}

/**
 * Calculates Respiratory Risk
 * Factors: SpO2 levels, AQI, respiration rate anomalies
 */
function calcRespiratoryRisk(vitals: VitalSigns, env: EnvironmentalData): number {
  let score = 0;

  // SpO2 contribution (normal 95-100%)
  if (vitals.spo2 < 90) score += 45;
  else if (vitals.spo2 < 93) score += 30;
  else if (vitals.spo2 < 95) score += 15;
  else score += 3;

  // AQI contribution
  if (env.aqi > 200) score += 35;
  else if (env.aqi > 150) score += 25;
  else if (env.aqi > 100) score += 15;
  else if (env.aqi > 50) score += 8;
  else score += 2;

  // Respiration rate (normal 12-20 breaths/min)
  if (vitals.respirationRate > 25 || vitals.respirationRate < 10) score += 20;
  else if (vitals.respirationRate > 22 || vitals.respirationRate < 11) score += 10;
  else score += 2;

  return Math.min(score, 100);
}

/**
 * Calculates Cardiovascular Stress
 * Factors: heart rate, SpO2, temperature correlation
 */
function calcCardiovascularStress(vitals: VitalSigns, env: EnvironmentalData): number {
  let score = 0;

  // Heart rate contribution
  if (vitals.heartRate > 130) score += 40;
  else if (vitals.heartRate > 110) score += 28;
  else if (vitals.heartRate > 95) score += 15;
  else if (vitals.heartRate > 80) score += 5;
  else score += 2;

  // SpO2 contribution to cardiac load
  if (vitals.spo2 < 90) score += 30;
  else if (vitals.spo2 < 94) score += 18;
  else score += 2;

  // Temperature-HR correlation (high temp + high HR = extra stress)
  const tempHRCorrelation = (vitals.skinTemperature - 36.5) * (vitals.heartRate - 70) / 50;
  score += Math.min(Math.max(tempHRCorrelation * 10, 0), 30);

  return Math.min(Math.round(score), 100);
}

/**
 * Main risk assessment function
 */
export function calculateRiskAssessment(
  vitals: VitalSigns,
  env: EnvironmentalData
): RiskAssessment {
  const heatScore = calcHeatStress(vitals, env);
  const respScore = calcRespiratoryRisk(vitals, env);
  const cardioScore = calcCardiovascularStress(vitals, env);

  const maxScore = Math.max(heatScore, respScore, cardioScore);
  const overall = scoreToLevel(maxScore);

  return {
    heatStress: { score: heatScore, level: scoreToLevel(heatScore) },
    respiratory: { score: respScore, level: scoreToLevel(respScore) },
    cardiovascular: { score: cardioScore, level: scoreToLevel(cardioScore) },
    overall,
    timestamp: Date.now(),
  };
}

/**
 * Returns a color string for a risk level
 */
export function riskLevelColor(level: RiskLevel): string {
  switch (level) {
    case 'low': return '#22C55E';
    case 'moderate': return '#F59E0B';
    case 'high': return '#EF4444';
    case 'critical': return '#DC2626';
  }
}

/**
 * Returns a human-readable risk label
 */
export function riskLevelLabel(level: RiskLevel): string {
  switch (level) {
    case 'low': return 'Low';
    case 'moderate': return 'Moderate';
    case 'high': return 'High';
    case 'critical': return 'Critical';
  }
}
