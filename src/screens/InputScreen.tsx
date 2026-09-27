/**
 * Input Screen — Manual vital sign entry.
 * User types in their readings like a sensor feed, then taps "Analyze".
 */

import React, { useRef } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, S, R, F, W } from '../theme/colors';
import { useApp } from '../context/AppContext';

interface FieldProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  unit: string;
  hint: string;
  color: string;
  onChangeText: (t: string) => void;
  placeholder: string;
}

function VitalField({ icon, label, value, unit, hint, color, onChangeText, placeholder }: FieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldHeader}>
        <View style={[styles.fieldIcon, { backgroundColor: color + '18' }]}>
          <Feather name={icon} size={16} color={color} />
        </View>
        <View style={styles.fieldLabels}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.fieldHint}>{hint}</Text>
        </View>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          keyboardType="decimal-pad"
          selectionColor={color}
        />
        <Text style={[styles.unit, { color }]}>{unit}</Text>
      </View>
    </View>
  );
}

export default function InputScreen({ navigation }: any) {
  const { state, dispatch, analyze, loadPreset } = useApp();
  const { vitals, environment } = state;

  const handleAnalyze = () => {
    analyze();
    navigation.navigate('Diagnosis');
  };

  const canAnalyze =
    vitals.heartRate !== '' || vitals.spo2 !== '' ||
    vitals.skinTemp !== '' || vitals.respRate !== '';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>Q</Text>
            <View>
              <Text style={styles.title}>Q-Companion</Text>
              <Text style={styles.subtitle}>Enter your vitals below</Text>
            </View>
            <View style={styles.offlineBadge}>
              <Feather name="wifi-off" size={10} color={Colors.teal} />
              <Text style={styles.offlineText}>Offline</Text>
            </View>
          </View>

          {/* Quick Presets */}
          <View style={styles.presetRow}>
            <Text style={styles.presetLabel}>Quick fill:</Text>
            <TouchableOpacity style={styles.presetBtn} onPress={() => loadPreset('normal')}>
              <Text style={[styles.presetText, { color: Colors.good }]}>Normal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetBtn} onPress={() => loadPreset('heatwave')}>
              <Text style={[styles.presetText, { color: Colors.amber }]}>Heat Wave</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetBtn} onPress={() => loadPreset('hypoxia')}>
              <Text style={[styles.presetText, { color: Colors.danger }]}>Hypoxia</Text>
            </TouchableOpacity>
          </View>

          {/* Body Vitals Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Feather name="user" size={14} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Body Vitals</Text>
            </View>

            <VitalField
              icon="heart" label="Heart Rate" unit="BPM" color={Colors.accent}
              hint="Normal resting: 60-100" placeholder="72"
              value={vitals.heartRate}
              onChangeText={(t) => dispatch({ type: 'SET_VITALS', vitals: { heartRate: t } })}
            />
            <VitalField
              icon="droplet" label="Blood Oxygen (SpO2)" unit="%" color={Colors.primary}
              hint="Normal: 95-100%" placeholder="98"
              value={vitals.spo2}
              onChangeText={(t) => dispatch({ type: 'SET_VITALS', vitals: { spo2: t } })}
            />
            <VitalField
              icon="thermometer" label="Skin Temperature" unit="°C" color={Colors.amber}
              hint="Normal: 36.1-37.2°C" placeholder="36.8"
              value={vitals.skinTemp}
              onChangeText={(t) => dispatch({ type: 'SET_VITALS', vitals: { skinTemp: t } })}
            />
            <VitalField
              icon="wind" label="Respiration Rate" unit="br/min" color={Colors.purple}
              hint="Normal: 12-20 breaths/min" placeholder="16"
              value={vitals.respRate}
              onChangeText={(t) => dispatch({ type: 'SET_VITALS', vitals: { respRate: t } })}
            />
          </View>

          {/* Environment Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Feather name="cloud" size={14} color={Colors.teal} />
              <Text style={styles.sectionTitle}>Environment</Text>
            </View>

            <VitalField
              icon="wind" label="Air Quality Index" unit="AQI" color={Colors.teal}
              hint="Good: 0-50 / Hazardous: 200+" placeholder="45"
              value={environment.aqi}
              onChangeText={(t) => dispatch({ type: 'SET_ENV', env: { aqi: t } })}
            />
            <VitalField
              icon="sun" label="Heat Index" unit="°C" color={Colors.amber}
              hint="Danger zone: >39°C" placeholder="32"
              value={environment.heatIndex}
              onChangeText={(t) => dispatch({ type: 'SET_ENV', env: { heatIndex: t } })}
            />
            <VitalField
              icon="droplet" label="Humidity" unit="%" color="#38BDF8"
              hint="Comfort range: 30-50%" placeholder="50"
              value={environment.humidity}
              onChangeText={(t) => dispatch({ type: 'SET_ENV', env: { humidity: t } })}
            />
          </View>

          {/* Analyze Button */}
          <TouchableOpacity
            style={[styles.analyzeBtn, !canAnalyze && styles.analyzeBtnDisabled]}
            onPress={handleAnalyze}
            activeOpacity={0.8}
            disabled={!canAnalyze}
          >
            <Feather name="cpu" size={20} color={canAnalyze ? Colors.textInverse : Colors.textMuted} />
            <Text style={[styles.analyzeBtnText, !canAnalyze && styles.analyzeBtnTextDisabled]}>
              Analyze My Vitals
            </Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            100% on-device analysis • No data leaves your phone
          </Text>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: S.lg, paddingTop: S.md },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    marginBottom: S.xl,
  },
  logo: {
    fontSize: 28,
    fontWeight: W.heavy,
    color: Colors.primary,
    backgroundColor: Colors.primaryMuted,
    width: 44,
    height: 44,
    textAlign: 'center',
    lineHeight: 44,
    borderRadius: R.md,
    overflow: 'hidden',
  },
  title: {
    fontSize: F.xl,
    fontWeight: W.bold,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: F.sm,
    color: Colors.textSoft,
    marginTop: 1,
  },
  offlineBadge: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: S.sm,
    paddingVertical: S.xs,
    borderRadius: R.full,
    backgroundColor: Colors.tealMuted,
  },
  offlineText: {
    fontSize: F.xs,
    fontWeight: W.semi,
    color: Colors.teal,
  },

  // Presets
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    marginBottom: S.lg,
  },
  presetLabel: {
    fontSize: F.xs,
    color: Colors.textMuted,
    fontWeight: W.medium,
  },
  presetBtn: {
    paddingHorizontal: S.md,
    paddingVertical: S.xs + 2,
    borderRadius: R.full,
    backgroundColor: Colors.white04,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetText: {
    fontSize: F.xs,
    fontWeight: W.semi,
  },

  // Section
  sectionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: R.lg,
    padding: S.lg,
    marginBottom: S.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    marginBottom: S.lg,
  },
  sectionTitle: {
    fontSize: F.sm,
    fontWeight: W.semi,
    color: Colors.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Field
  field: {
    marginBottom: S.lg,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    marginBottom: S.sm,
  },
  fieldIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldLabels: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: F.md,
    fontWeight: W.medium,
    color: Colors.text,
  },
  fieldHint: {
    fontSize: F.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderRadius: R.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: S.md,
  },
  input: {
    flex: 1,
    fontSize: F.xxl,
    fontWeight: W.bold,
    color: Colors.text,
    paddingVertical: S.md,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: F.sm,
    fontWeight: W.semi,
    marginLeft: S.sm,
  },

  // Analyze
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S.sm,
    backgroundColor: Colors.primary,
    paddingVertical: S.lg,
    borderRadius: R.md,
    marginTop: S.sm,
  },
  analyzeBtnDisabled: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  analyzeBtnText: {
    fontSize: F.lg,
    fontWeight: W.bold,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
  analyzeBtnTextDisabled: {
    color: Colors.textMuted,
  },

  footer: {
    textAlign: 'center',
    fontSize: F.xs,
    color: Colors.textMuted,
    marginTop: S.lg,
    fontStyle: 'italic',
  },
});
