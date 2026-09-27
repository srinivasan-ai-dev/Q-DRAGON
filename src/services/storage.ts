/**
 * Storage Service
 * Wraps AsyncStorage for offline-first data persistence.
 * All health data remains 100% local — never transmitted to any server.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyContact } from '../types';

const KEYS = {
  EMERGENCY_CONTACTS: '@qcompanion_emergency_contacts',
  SETTINGS: '@qcompanion_settings',
  VITALS_HISTORY: '@qcompanion_vitals_history',
};

// ─── Emergency Contacts ──────────────────────────────────
export async function saveEmergencyContacts(contacts: EmergencyContact[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.EMERGENCY_CONTACTS, JSON.stringify(contacts));
  } catch (e) {
    console.error('Failed to save emergency contacts:', e);
  }
}

export async function loadEmergencyContacts(): Promise<EmergencyContact[]> {
  try {
    const json = await AsyncStorage.getItem(KEYS.EMERGENCY_CONTACTS);
    return json ? JSON.parse(json) : getDefaultContacts();
  } catch (e) {
    console.error('Failed to load emergency contacts:', e);
    return getDefaultContacts();
  }
}

function getDefaultContacts(): EmergencyContact[] {
  return [
    { id: '1', name: 'Emergency Services', phone: '112', relationship: 'Emergency' },
    { id: '2', name: '', phone: '', relationship: '' },
    { id: '3', name: '', phone: '', relationship: '' },
  ];
}

// ─── Generic Key-Value ───────────────────────────────────
export async function saveData(key: string, data: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
}

export async function loadData<T>(key: string, fallback: T): Promise<T> {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : fallback;
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
    return fallback;
  }
}
