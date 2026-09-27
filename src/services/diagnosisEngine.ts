/**
 * AI Diagnosis Engine
 * Rule-based clinical reasoning system that analyzes manually entered vitals
 * and environmental data to detect conditions and generate localized advice.
 * 
 * 100% offline — all logic is on-device, no cloud calls.
 */

import {
  VitalsInput,
  EnvironmentInput,
  DiagnosisResult,
  DetectedCondition,
  AdviceItem,
  RiskScore,
  Severity,
} from '../types';

// ─── Parse Inputs ─────────────────────────────────────────
function num(val: string, fallback: number): number {
  const n = parseFloat(val);
  return isNaN(n) ? fallback : n;
}

// ─── Condition Detection ──────────────────────────────────
function detectConditions(
  hr: number, spo2: number, temp: number, resp: number,
  aqi: number, hi: number, hum: number,
): DetectedCondition[] {
  const conditions: DetectedCondition[] = [];

  // ── Heat-related ──
  if (temp >= 40) {
    conditions.push({
      id: 'heat_stroke',
      name: 'Heat Stroke',
      emoji: '🔴',
      severity: 'critical',
      description: `Core temperature ${temp}°C is dangerously high. Heat stroke is a life-threatening emergency requiring immediate cooling and medical evacuation.`,
    });
  } else if (temp >= 38.5 && hr > 100) {
    conditions.push({
      id: 'heat_exhaustion_severe',
      name: 'Severe Heat Exhaustion',
      emoji: '🟠',
      severity: 'severe',
      description: `Elevated temperature (${temp}°C) combined with rapid heart rate (${hr} BPM) indicates severe heat exhaustion. Risk of progressing to heat stroke without intervention.`,
    });
  } else if (temp >= 37.8 || (hi >= 40 && hr > 90)) {
    conditions.push({
      id: 'heat_exhaustion',
      name: 'Heat Exhaustion',
      emoji: '🟡',
      severity: 'moderate',
      description: `Body temperature ${temp}°C with heat index ${hi}°C suggests heat stress. Heavy sweating, weakness, and nausea are likely.`,
    });
  } else if (hi >= 35 && temp >= 37.2) {
    conditions.push({
      id: 'heat_stress',
      name: 'Mild Heat Stress',
      emoji: '🌡️',
      severity: 'mild',
      description: `Slight temperature elevation (${temp}°C) in hot conditions (Heat Index ${hi}°C). Early signs of heat strain. Monitor closely.`,
    });
  }

  // ── Respiratory ──
  if (spo2 < 88) {
    conditions.push({
      id: 'severe_hypoxia',
      name: 'Severe Hypoxia',
      emoji: '🔴',
      severity: 'critical',
      description: `Blood oxygen ${spo2}% is critically low. Tissue damage and organ failure risk. This is a medical emergency.`,
    });
  } else if (spo2 < 92) {
    conditions.push({
      id: 'hypoxia',
      name: 'Hypoxia',
      emoji: '🟠',
      severity: 'severe',
      description: `SpO2 ${spo2}% indicates insufficient oxygen reaching your tissues. Supplemental oxygen is needed if available.`,
    });
  } else if (spo2 < 95) {
    conditions.push({
      id: 'mild_hypoxemia',
      name: 'Mild Hypoxemia',
      emoji: '🟡',
      severity: 'moderate',
      description: `SpO2 ${spo2}% is below normal range (95-100%). May indicate respiratory compromise, especially with poor air quality (AQI ${aqi}).`,
    });
  }

  if (resp > 25) {
    conditions.push({
      id: 'tachypnea',
      name: 'Rapid Breathing (Tachypnea)',
      emoji: '💨',
      severity: resp > 30 ? 'severe' : 'moderate',
      description: `Respiration rate ${resp} breaths/min is elevated (normal: 12-20). Body is compensating for oxygen deficit or heat stress.`,
    });
  } else if (resp < 10) {
    conditions.push({
      id: 'bradypnea',
      name: 'Slow Breathing (Bradypnea)',
      emoji: '⚠️',
      severity: 'severe',
      description: `Respiration rate ${resp} breaths/min is dangerously low. May indicate CNS depression, exhaustion, or impending respiratory failure.`,
    });
  }

  // ── Cardiovascular ──
  if (hr > 150) {
    conditions.push({
      id: 'severe_tachycardia',
      name: 'Severe Tachycardia',
      emoji: '🔴',
      severity: 'critical',
      description: `Heart rate ${hr} BPM is dangerously elevated. Risk of cardiac arrhythmia. Immediate rest and cooling required.`,
    });
  } else if (hr > 120) {
    conditions.push({
      id: 'tachycardia',
      name: 'Tachycardia',
      emoji: '💓',
      severity: 'severe',
      description: `Heart rate ${hr} BPM is significantly elevated. Heart is under strain — likely from heat, dehydration, or physical exertion.`,
    });
  } else if (hr > 100) {
    conditions.push({
      id: 'elevated_hr',
      name: 'Elevated Heart Rate',
      emoji: '🟡',
      severity: 'mild',
      description: `Heart rate ${hr} BPM is above resting normal (60-100 BPM). Could indicate mild stress, dehydration, or anxiety.`,
    });
  } else if (hr < 50) {
    conditions.push({
      id: 'bradycardia',
      name: 'Bradycardia',
      emoji: '⚠️',
      severity: 'moderate',
      description: `Heart rate ${hr} BPM is below normal. Unless you're a trained athlete, this may indicate a cardiac issue or hypothermia.`,
    });
  }

  // ── Hypothermia ──
  if (temp < 35) {
    conditions.push({
      id: 'hypothermia',
      name: 'Hypothermia',
      emoji: '🥶',
      severity: temp < 33 ? 'critical' : 'severe',
      description: `Body temperature ${temp}°C is dangerously low. ${temp < 33 ? 'Severe hypothermia — cardiac arrest risk.' : 'Moderate hypothermia — active rewarming needed.'}`,
    });
  } else if (temp < 36) {
    conditions.push({
      id: 'mild_hypothermia',
      name: 'Mild Hypothermia',
      emoji: '❄️',
      severity: 'mild',
      description: `Body temperature ${temp}°C is slightly below normal (36.1-37.2°C). Shivering likely. Seek shelter and warmth.`,
    });
  }

  // ── Air Quality ──
  if (aqi > 200) {
    conditions.push({
      id: 'hazardous_air',
      name: 'Hazardous Air Quality',
      emoji: '☣️',
      severity: 'severe',
      description: `AQI ${aqi} — extremely dangerous to breathe. Smoke, chemical exposure, or severe pollution. Seek sealed shelter immediately.`,
    });
  } else if (aqi > 150) {
    conditions.push({
      id: 'unhealthy_air',
      name: 'Unhealthy Air Quality',
      emoji: '😷',
      severity: 'moderate',
      description: `AQI ${aqi} — prolonged exposure causes respiratory irritation. Use cloth or mask over nose/mouth. Limit exertion.`,
    });
  } else if (aqi > 100) {
    conditions.push({
      id: 'poor_air',
      name: 'Poor Air Quality',
      emoji: '🌫️',
      severity: 'mild',
      description: `AQI ${aqi} — sensitive groups may experience discomfort. Reduce outdoor activity if breathing feels labored.`,
    });
  }

  // ── Dehydration inference ──
  if (hr > 100 && temp >= 37.5 && hum < 40) {
    conditions.push({
      id: 'dehydration',
      name: 'Likely Dehydration',
      emoji: '💧',
      severity: 'moderate',
      description: `Elevated heart rate (${hr}) + raised temperature (${temp}°C) in dry conditions (${hum}% humidity) strongly suggests dehydration.`,
    });
  }

  // ── All clear ──
  if (conditions.length === 0) {
    conditions.push({
      id: 'normal',
      name: 'Vitals Normal',
      emoji: '✅',
      severity: 'normal',
      description: `All readings are within healthy ranges. Heart rate ${hr} BPM, SpO2 ${spo2}%, temperature ${temp}°C, respiration ${resp}/min. Keep monitoring.`,
    });
  }

  return conditions;
}

// ─── Risk Scoring ─────────────────────────────────────────
function scoreToSeverity(s: number): Severity {
  if (s >= 80) return 'critical';
  if (s >= 60) return 'severe';
  if (s >= 35) return 'moderate';
  if (s >= 15) return 'mild';
  return 'normal';
}

function calcRisks(
  hr: number, spo2: number, temp: number, resp: number,
  aqi: number, hi: number,
): RiskScore[] {
  // Heat stress
  let heat = 0;
  if (temp >= 40) heat += 50; else if (temp >= 38.5) heat += 35; else if (temp >= 37.5) heat += 15; else heat += 3;
  if (hi >= 46) heat += 30; else if (hi >= 40) heat += 22; else if (hi >= 35) heat += 12; else heat += 3;
  if (hr > 120) heat += 20; else if (hr > 100) heat += 10; else heat += 2;
  heat = Math.min(heat, 100);

  // Respiratory
  let respRisk = 0;
  if (spo2 < 88) respRisk += 50; else if (spo2 < 92) respRisk += 35; else if (spo2 < 95) respRisk += 18; else respRisk += 3;
  if (aqi > 200) respRisk += 30; else if (aqi > 150) respRisk += 20; else if (aqi > 100) respRisk += 10; else respRisk += 2;
  if (resp > 30) respRisk += 20; else if (resp > 25) respRisk += 12; else if (resp < 10) respRisk += 18; else respRisk += 2;
  respRisk = Math.min(respRisk, 100);

  // Cardiovascular
  let cardio = 0;
  if (hr > 150) cardio += 45; else if (hr > 120) cardio += 30; else if (hr > 100) cardio += 14; else if (hr < 50) cardio += 20; else cardio += 3;
  if (spo2 < 90) cardio += 25; else if (spo2 < 94) cardio += 12; else cardio += 2;
  const corr = Math.max((temp - 36.5) * (hr - 70) / 50, 0);
  cardio += Math.min(Math.round(corr * 12), 30);
  cardio = Math.min(cardio, 100);

  return [
    { label: 'Heat Stress', score: heat, severity: scoreToSeverity(heat) },
    { label: 'Respiratory', score: respRisk, severity: scoreToSeverity(respRisk) },
    { label: 'Cardiovascular', score: cardio, severity: scoreToSeverity(cardio) },
  ];
}

// ─── Advice Generation ────────────────────────────────────
function generateAdvice(
  conditions: DetectedCondition[],
  hr: number, spo2: number, temp: number, resp: number,
  aqi: number, hi: number, hum: number,
): AdviceItem[] {
  const advice: AdviceItem[] = [];
  const ids = new Set(conditions.map(c => c.id));
  const maxSeverity = conditions.reduce((max, c) => {
    const order: Severity[] = ['normal', 'mild', 'moderate', 'severe', 'critical'];
    return order.indexOf(c.severity) > order.indexOf(max) ? c.severity : max;
  }, 'normal' as Severity);

  // ── Critical: Immediate actions ──
  if (ids.has('heat_stroke')) {
    advice.push({
      id: 'a_cool_now', icon: '🧊', category: 'Immediate Action', urgency: 'critical',
      title: 'Begin aggressive cooling NOW',
      body: 'Remove excess clothing. Pour water over head, neck, armpits, and groin. Fan the body continuously. Apply wet cloth to forehead and neck. If near a river or water source, carefully immerse. Every minute matters — brain damage begins above 40°C.',
    });
    advice.push({
      id: 'a_evac', icon: '🚑', category: 'Evacuation', urgency: 'critical',
      title: 'Seek emergency medical help',
      body: 'Heat stroke is a life-threatening emergency. If others are nearby, send for help immediately. If you have a phone with signal, call emergency services. If using 2G fallback, trigger SOS with GPS coordinates.',
    });
  }

  if (ids.has('severe_hypoxia')) {
    advice.push({
      id: 'a_oxy', icon: '💨', category: 'Immediate Action', urgency: 'critical',
      title: 'Position for maximum airflow',
      body: 'Sit upright or in a tripod position (leaning forward, hands on knees). Move to the freshest air available — ideally upwind, away from smoke or debris. Breathe slowly and deeply through pursed lips. If supplemental oxygen is available, use it immediately.',
    });
  }

  if (ids.has('severe_tachycardia')) {
    advice.push({
      id: 'a_rest_cardiac', icon: '🫀', category: 'Immediate Action', urgency: 'critical',
      title: 'Stop all physical activity immediately',
      body: 'Lie down in a cool, shaded area. Try vagal maneuvers: bear down as if having a bowel movement, or splash cold water on your face. Slow, deep breathing — inhale for 4 counts, hold for 4, exhale for 6. Do not stand up quickly.',
    });
  }

  if (ids.has('hypothermia') && temp < 33) {
    advice.push({
      id: 'a_rewarm', icon: '🔥', category: 'Immediate Action', urgency: 'critical',
      title: 'Active rewarming — handle gently',
      body: 'Do NOT rub skin or move roughly — risk of cardiac arrest. Remove wet clothing. Wrap in any available insulation (blankets, sleeping bags, dry clothes). Apply warm objects to neck, armpits, groin. If conscious, give warm sweet drinks (not alcohol). Seek shelter from wind.',
    });
  }

  // ── Severe conditions ──
  if (ids.has('heat_exhaustion_severe') || ids.has('heat_exhaustion')) {
    advice.push({
      id: 'a_cool_rest', icon: '🌊', category: 'Cooling', urgency: ids.has('heat_exhaustion_severe') ? 'severe' : 'moderate',
      title: 'Move to shade and begin cooling',
      body: `Find shade or create it with available materials. Remove unnecessary clothing. Wet your skin and fan — evaporative cooling is most effective. ${hum > 70 ? 'High humidity (' + hum + '%) reduces evaporative cooling — pour water directly and use fanning.' : 'Humidity is manageable — wetting skin with fanning will help.'}`,
    });
  }

  if (ids.has('tachycardia') || ids.has('elevated_hr')) {
    advice.push({
      id: 'a_slow_hr', icon: '💓', category: 'Heart Rate', urgency: ids.has('tachycardia') ? 'severe' : 'mild',
      title: 'Reduce cardiac workload',
      body: `Heart rate is ${hr} BPM. Stop exertion, sit or lie down. Practice box breathing: inhale 4 seconds → hold 4 → exhale 4 → hold 4. ${temp > 37.5 ? 'Your elevated temperature is contributing — prioritize cooling alongside rest.' : 'Focus on calming your body. If anxiety is a factor, grounding techniques help.'}`,
    });
  }

  if (ids.has('hypoxia') || ids.has('mild_hypoxemia')) {
    advice.push({
      id: 'a_breathe', icon: '🫁', category: 'Breathing', urgency: ids.has('hypoxia') ? 'severe' : 'moderate',
      title: 'Controlled breathing technique',
      body: `SpO2 is ${spo2}%. Use pursed-lip breathing: inhale through nose for 2 counts, exhale through pursed lips for 4 counts. This creates back-pressure that keeps airways open longer. ${aqi > 100 ? 'Cover your nose and mouth with damp cloth — the air quality (AQI ' + aqi + ') is worsening your condition.' : ''}`,
    });
  }

  if (ids.has('tachypnea')) {
    advice.push({
      id: 'a_slow_breath', icon: '🧘', category: 'Breathing', urgency: 'moderate',
      title: 'Slow your breathing rate',
      body: `Breathing at ${resp}/min is too fast and may cause hyperventilation. Cup your hands over your mouth and nose — this increases CO2 rebreathing and helps normalize. Try to match breathing to a slow count: in-2-3, out-2-3-4.`,
    });
  }

  // ── Hydration advice ──
  if (ids.has('dehydration') || hi >= 35 || ids.has('heat_exhaustion') || ids.has('heat_exhaustion_severe')) {
    advice.push({
      id: 'a_hydrate', icon: '💧', category: 'Hydration', urgency: 'moderate',
      title: 'Rehydrate — but correctly',
      body: `Sip water slowly — do not gulp. If available, add a pinch of salt and sugar to water (oral rehydration). ${hi > 40 ? 'At heat index ' + hi + '°C, you may be losing 1-2 liters of sweat per hour. Prioritize finding water.' : 'Drink at least 250ml every 15-20 minutes.'} Avoid caffeine and alcohol — they worsen dehydration.`,
    });
  }

  // ── Air quality ──
  if (ids.has('hazardous_air') || ids.has('unhealthy_air')) {
    advice.push({
      id: 'a_air', icon: '😷', category: 'Air Protection', urgency: ids.has('hazardous_air') ? 'severe' : 'moderate',
      title: `Protect your airways (AQI ${aqi})`,
      body: `${aqi > 200 ? 'HAZARDOUS levels — seek enclosed shelter immediately. Seal gaps around doors/windows with wet cloth.' : 'Unhealthy air — limit time outdoors.'} If no mask available, breathe through multiple layers of damp cloth. Avoid physical exertion — it increases particle inhalation. If eyes are burning, flush with clean water.`,
    });
  }

  // ── Hypothermia ──
  if (ids.has('mild_hypothermia')) {
    advice.push({
      id: 'a_warm', icon: '🧥', category: 'Warmth', urgency: 'mild',
      title: 'Prevent further heat loss',
      body: `Body temperature ${temp}°C is slightly low. Put on additional layers, especially covering head and neck (50% of heat loss). Find or create shelter from wind. If wet, change into dry clothing. Eat high-energy foods if available — your body burns calories to generate heat.`,
    });
  }

  // ── Environmental warnings ──
  if (hi >= 40 && !ids.has('heat_stroke') && !ids.has('heat_exhaustion_severe')) {
    advice.push({
      id: 'a_env_heat', icon: '☀️', category: 'Environment', urgency: 'moderate',
      title: `Dangerous heat index: ${hi}°C`,
      body: `The combination of temperature and humidity makes it feel like ${hi}°C. Outdoor activity is dangerous even for healthy people. Limit movement to essentials only. If you must move, do so during cooler hours (dawn/dusk). Rest for 10 minutes every 20 minutes of activity.`,
    });
  }

  // ── All normal ──
  if (ids.has('normal')) {
    advice.push({
      id: 'a_maintain', icon: '👍', category: 'Maintenance', urgency: 'normal',
      title: 'Continue monitoring',
      body: `Your vitals look healthy. Keep hydrated, stay in shade when possible, and re-check vitals every 30-60 minutes. ${hi > 30 ? 'Heat index is ' + hi + '°C — conditions can change quickly. Stay vigilant.' : 'Conditions are manageable. Maintain your current routine.'}`,
    });
    if (aqi > 50 && aqi <= 100) {
      advice.push({
        id: 'a_air_watch', icon: '🌬️', category: 'Air Quality', urgency: 'normal',
        title: 'Air quality is moderate',
        body: `AQI ${aqi} is acceptable but not ideal. If you have respiratory sensitivities, consider wearing a cloth mask during exertion. Keep monitoring — conditions can deteriorate rapidly during wildfire or industrial events.`,
      });
    }
  }

  // Sort by urgency
  const urgencyOrder: Severity[] = ['critical', 'severe', 'moderate', 'mild', 'normal'];
  advice.sort((a, b) => urgencyOrder.indexOf(a.urgency) - urgencyOrder.indexOf(b.urgency));

  return advice;
}

// ─── Overall Status ───────────────────────────────────────
function getOverallStatus(conditions: DetectedCondition[]): DiagnosisResult['overallStatus'] {
  const severityOrder: Severity[] = ['critical', 'severe', 'moderate', 'mild', 'normal'];
  let worstSeverity: Severity = 'normal';

  for (const c of conditions) {
    if (severityOrder.indexOf(c.severity) < severityOrder.indexOf(worstSeverity)) {
      worstSeverity = c.severity;
    }
  }

  const statusMap: Record<Severity, { label: string; emoji: string; summary: string }> = {
    critical: {
      label: 'CRITICAL',
      emoji: '🚨',
      summary: 'Life-threatening condition detected. Immediate action required.',
    },
    severe: {
      label: 'SEVERE',
      emoji: '⚠️',
      summary: 'Significant health risk detected. Take corrective action now.',
    },
    moderate: {
      label: 'CAUTION',
      emoji: '🟡',
      summary: 'Abnormal readings detected. Monitor closely and follow advice.',
    },
    mild: {
      label: 'MILD CONCERN',
      emoji: '🔵',
      summary: 'Slight deviations from normal. Stay aware and keep hydrated.',
    },
    normal: {
      label: 'ALL CLEAR',
      emoji: '✅',
      summary: 'Vitals are within healthy ranges. Continue monitoring periodically.',
    },
  };

  return { ...statusMap[worstSeverity], severity: worstSeverity };
}

// ─── Main Diagnosis Function ──────────────────────────────
export function diagnose(vitals: VitalsInput, env: EnvironmentInput): DiagnosisResult {
  const hr = num(vitals.heartRate, 72);
  const spo2 = num(vitals.spo2, 98);
  const temp = num(vitals.skinTemp, 36.8);
  const resp = num(vitals.respRate, 16);
  const aqi = num(env.aqi, 45);
  const hi = num(env.heatIndex, 30);
  const hum = num(env.humidity, 50);

  const conditions = detectConditions(hr, spo2, temp, resp, aqi, hi, hum);
  const risks = calcRisks(hr, spo2, temp, resp, aqi, hi);
  const advice = generateAdvice(conditions, hr, spo2, temp, resp, aqi, hi, hum);
  const overallStatus = getOverallStatus(conditions);

  return { overallStatus, conditions, risks, advice, timestamp: Date.now() };
}

// ─── Severity to color mapping ────────────────────────────
export function severityColor(s: Severity): string {
  switch (s) {
    case 'normal': return '#4ADE80';
    case 'mild': return '#6C9FFF';
    case 'moderate': return '#FBBF24';
    case 'severe': return '#F87171';
    case 'critical': return '#EF4444';
  }
}
