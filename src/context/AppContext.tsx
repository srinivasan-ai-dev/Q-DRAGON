/**
 * App State — Manual input flow with diagnosis results.
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { VitalsInput, EnvironmentInput, DiagnosisResult, EmergencyContact } from '../types';
import { diagnose } from '../services/diagnosisEngine';

interface AppState {
  vitals: VitalsInput;
  environment: EnvironmentInput;
  diagnosis: DiagnosisResult | null;
  hasAnalyzed: boolean;
  contacts: EmergencyContact[];
  sosActive: boolean;
  sosCountdown: number;
}

type Action =
  | { type: 'SET_VITALS'; vitals: Partial<VitalsInput> }
  | { type: 'SET_ENV'; env: Partial<EnvironmentInput> }
  | { type: 'ANALYZE' }
  | { type: 'CLEAR_DIAGNOSIS' }
  | { type: 'SET_CONTACTS'; contacts: EmergencyContact[] }
  | { type: 'TRIGGER_SOS' }
  | { type: 'CANCEL_SOS' }
  | { type: 'SOS_TICK' }
  | { type: 'LOAD_PRESET'; vitals: VitalsInput; env: EnvironmentInput };

const defaultVitals: VitalsInput = { heartRate: '', spo2: '', skinTemp: '', respRate: '' };
const defaultEnv: EnvironmentInput = { aqi: '', heatIndex: '', humidity: '' };

const defaultContacts: EmergencyContact[] = [
  { id: '1', name: 'Emergency Services', phone: '112', relation: 'Emergency' },
  { id: '2', name: '', phone: '', relation: '' },
  { id: '3', name: '', phone: '', relation: '' },
];

const initialState: AppState = {
  vitals: defaultVitals,
  environment: defaultEnv,
  diagnosis: null,
  hasAnalyzed: false,
  contacts: defaultContacts,
  sosActive: false,
  sosCountdown: 30,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_VITALS':
      return { ...state, vitals: { ...state.vitals, ...action.vitals } };
    case 'SET_ENV':
      return { ...state, environment: { ...state.environment, ...action.env } };
    case 'ANALYZE':
      return {
        ...state,
        diagnosis: diagnose(state.vitals, state.environment),
        hasAnalyzed: true,
      };
    case 'CLEAR_DIAGNOSIS':
      return { ...state, diagnosis: null, hasAnalyzed: false };
    case 'SET_CONTACTS':
      return { ...state, contacts: action.contacts };
    case 'TRIGGER_SOS':
      return { ...state, sosActive: true, sosCountdown: 30 };
    case 'CANCEL_SOS':
      return { ...state, sosActive: false, sosCountdown: 30 };
    case 'SOS_TICK':
      const next = state.sosCountdown - 1;
      return next <= 0
        ? { ...state, sosActive: false, sosCountdown: 30 }
        : { ...state, sosCountdown: next };
    case 'LOAD_PRESET':
      return { ...state, vitals: action.vitals, environment: action.env };
    default:
      return state;
  }
}

interface ContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  analyze: () => void;
  loadPreset: (name: 'normal' | 'heatwave' | 'hypoxia') => void;
}

const AppContext = createContext<ContextValue | undefined>(undefined);

const presets: Record<string, { vitals: VitalsInput; env: EnvironmentInput }> = {
  normal: {
    vitals: { heartRate: '72', spo2: '98', skinTemp: '36.7', respRate: '16' },
    env: { aqi: '42', heatIndex: '31', humidity: '48' },
  },
  heatwave: {
    vitals: { heartRate: '128', spo2: '94', skinTemp: '39.1', respRate: '24' },
    env: { aqi: '155', heatIndex: '46', humidity: '72' },
  },
  hypoxia: {
    vitals: { heartRate: '108', spo2: '89', skinTemp: '37.2', respRate: '28' },
    env: { aqi: '220', heatIndex: '33', humidity: '55' },
  },
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const analyze = useCallback(() => {
    dispatch({ type: 'ANALYZE' });
  }, []);

  const loadPreset = useCallback((name: 'normal' | 'heatwave' | 'hypoxia') => {
    const p = presets[name];
    dispatch({ type: 'LOAD_PRESET', vitals: p.vitals, env: p.env });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, analyze, loadPreset }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
