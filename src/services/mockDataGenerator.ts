/**
 * Mock Data Generator Service
 * Simulates realistic health telemetry at 3-second intervals.
 * Supports Normal, Heat Wave Anomaly, and Fall Event modes.
 */

import {
  VitalSigns,
  EnvironmentalData,
  SimulationMode,
  DeviceStatus,
  SleepData,
  TrendData,
  TrendDataPoint,
} from '../types';

// ─── Random Utilities ─────────────────────────────────────
function randomInRange(min: number, max: number, decimals = 1): number {
  const val = Math.random() * (max - min) + min;
  return Number(val.toFixed(decimals));
}

function jitter(base: number, range: number, decimals = 1): number {
  return Number((base + (Math.random() - 0.5) * 2 * range).toFixed(decimals));
}

// ─── Vitals Generator ─────────────────────────────────────
export function generateVitals(mode: SimulationMode): VitalSigns {
  const timestamp = Date.now();

  switch (mode) {
    case 'heatwave':
      return {
        heartRate: Math.round(randomInRange(115, 135, 0)),
        spo2: randomInRange(93, 96, 0),
        skinTemperature: randomInRange(38.5, 39.2),
        respirationRate: Math.round(randomInRange(22, 28, 0)),
        timestamp,
      };

    case 'fall':
      return {
        heartRate: Math.round(randomInRange(95, 140, 0)),
        spo2: randomInRange(91, 96, 0),
        skinTemperature: randomInRange(36.8, 37.5),
        respirationRate: Math.round(randomInRange(18, 30, 0)),
        timestamp,
      };

    case 'normal':
    default:
      return {
        heartRate: Math.round(randomInRange(65, 80, 0)),
        spo2: randomInRange(97, 99, 0),
        skinTemperature: randomInRange(36.5, 37.0),
        respirationRate: Math.round(randomInRange(14, 18, 0)),
        timestamp,
      };
  }
}

// ─── Environmental Generator ──────────────────────────────
export function generateEnvironmental(mode: SimulationMode): EnvironmentalData {
  const timestamp = Date.now();

  switch (mode) {
    case 'heatwave':
      return {
        aqi: Math.round(randomInRange(120, 180, 0)),
        heatIndex: randomInRange(42, 48),
        humidity: Math.round(randomInRange(65, 85, 0)),
        ambientTemp: randomInRange(40, 45),
        timestamp,
      };

    case 'fall':
      return {
        aqi: Math.round(randomInRange(40, 60, 0)),
        heatIndex: randomInRange(30, 34),
        humidity: Math.round(randomInRange(45, 60, 0)),
        ambientTemp: randomInRange(28, 33),
        timestamp,
      };

    case 'normal':
    default:
      return {
        aqi: Math.round(randomInRange(35, 55, 0)),
        heatIndex: randomInRange(30, 34),
        humidity: Math.round(randomInRange(40, 55, 0)),
        ambientTemp: randomInRange(28, 32),
        timestamp,
      };
  }
}

// ─── Device Status Generator ──────────────────────────────
export function generateDeviceStatus(mode: SimulationMode): DeviceStatus {
  return {
    qBand: mode === 'normal' ? 'connected' : 'connected',
    qDock: mode === 'fall' ? 'disconnected' : 'connected',
    offlineMode: true,
    batteryLevel: Math.round(randomInRange(65, 95, 0)),
    lastSync: Date.now() - Math.round(randomInRange(5000, 30000, 0)),
  };
}

// ─── Sleep Data Generator ─────────────────────────────────
export function generateSleepData(): SleepData {
  return {
    restingHR: Math.round(randomInRange(55, 65, 0)),
    apneaFlags: Math.round(randomInRange(0, 3, 0)),
    respirationStability: Math.round(randomInRange(82, 98, 0)),
    sleepDuration: randomInRange(5.5, 8.0),
    deepSleepPct: Math.round(randomInRange(18, 30, 0)),
    remSleepPct: Math.round(randomInRange(20, 28, 0)),
  };
}

// ─── 24-Hour Trend Generator ──────────────────────────────
export function generateTrendData(mode: SimulationMode): TrendData {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, '0');
    return `${h}:00`;
  });

  const isHeatwave = mode === 'heatwave';

  const heartRate: TrendDataPoint[] = hours.map((time, i) => {
    // Simulate circadian pattern: lower at night, higher in afternoon
    const circadian = Math.sin(((i - 6) / 24) * Math.PI * 2) * 8;
    const base = isHeatwave && i > 10 ? 110 : 72;
    const anomaly = isHeatwave && i >= 12 && i <= 16 ? 25 : 0;
    return { time, value: Math.round(base + circadian + anomaly + jitter(0, 3, 0)) };
  });

  const spo2: TrendDataPoint[] = hours.map((time, i) => {
    const base = isHeatwave && i >= 12 ? 94 : 98;
    return { time, value: Math.round(base + jitter(0, 0.8, 0)) };
  });

  const skinTemperature: TrendDataPoint[] = hours.map((time, i) => {
    const circadian = Math.sin(((i - 4) / 24) * Math.PI * 2) * 0.3;
    const base = isHeatwave && i >= 11 ? 38.6 : 36.7;
    return { time, value: Number((base + circadian + jitter(0, 0.15)).toFixed(1)) };
  });

  const heatIndex: TrendDataPoint[] = hours.map((time, i) => {
    const dailyCycle = Math.sin(((i - 6) / 24) * Math.PI) * 6;
    const base = isHeatwave ? 40 : 30;
    return { time, value: Number((base + Math.max(dailyCycle, -3) + jitter(0, 1)).toFixed(1)) };
  });

  return { heartRate, spo2, skinTemperature, heatIndex };
}
