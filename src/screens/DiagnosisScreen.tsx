/**
 * Diagnosis Screen — AI analysis results.
 * Shows detected conditions, risk scores, and localized survival advice.
 */

import React, { useEffect, useRef } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, S, R, F, W } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { severityColor } from '../services/diagnosisEngine';
import { Severity, RiskScore } from '../types';

function severityBg(s: Severity): string {
  switch (s) {
    case 'normal': return Colors.goodMuted;
    case 'mild': return Colors.primaryMuted;
    case 'moderate': return Colors.warnMuted;
    case 'severe': return Colors.dangerMuted;
    case 'critical': return Colors.criticalMuted;
  }
}

function RiskBar({ risk }: { risk: RiskScore }) {
  const anim = useRef(new Animated.Value(0)).current;
  const color = severityColor(risk.severity);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: risk.score,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [risk.score]);

  return (
    <View style={styles.riskItem}>
      <View style={styles.riskHeader}>
        <Text style={styles.riskLabel}>{risk.label}</Text>
        <View style={[styles.riskBadge, { backgroundColor: severityBg(risk.severity) }]}>
          <Text style={[styles.riskBadgeText, { color }]}>
            {risk.severity.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.riskBarBg}>
        <Animated.View
          style={[
            styles.riskBarFill,
            {
              backgroundColor: color,
              width: anim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={[styles.riskScore, { color }]}>{risk.score}/100</Text>
    </View>
  );
}

export default function DiagnosisScreen({ navigation }: any) {
  const { state } = useApp();
  const { diagnosis } = state;

  if (!diagnosis) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.empty}>
          <Feather name="cpu" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No Analysis Yet</Text>
          <Text style={styles.emptyText}>
            Enter your vitals on the Input tab and tap "Analyze" to get your diagnosis.
          </Text>
          <TouchableOpacity
            style={styles.goInputBtn}
            onPress={() => navigation.navigate('Input')}
          >
            <Text style={styles.goInputText}>Go to Input</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { overallStatus, conditions, risks, advice } = diagnosis;
  const statusColor = severityColor(overallStatus.severity);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Status Banner */}
        <View style={[styles.statusBanner, { borderColor: statusColor + '40' }]}>
          <Text style={styles.statusEmoji}>{overallStatus.emoji}</Text>
          <Text style={[styles.statusLabel, { color: statusColor }]}>
            {overallStatus.label}
          </Text>
          <Text style={styles.statusSummary}>{overallStatus.summary}</Text>
        </View>

        {/* What You're Experiencing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You're Experiencing</Text>
          {conditions.map((c) => {
            const color = severityColor(c.severity);
            return (
              <View key={c.id} style={[styles.conditionCard, { borderLeftColor: color }]}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.conditionEmoji}>{c.emoji}</Text>
                  <Text style={styles.conditionName}>{c.name}</Text>
                  <View style={[styles.sevBadge, { backgroundColor: severityBg(c.severity) }]}>
                    <Text style={[styles.sevBadgeText, { color }]}>
                      {c.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.conditionDesc}>{c.description}</Text>
              </View>
            );
          })}
        </View>

        {/* Risk Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Assessment</Text>
          <View style={styles.risksCard}>
            {risks.map((r) => (
              <RiskBar key={r.label} risk={r} />
            ))}
          </View>
        </View>

        {/* AI Advice */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Advice</Text>
          <Text style={styles.adviceSubtitle}>
            Localized guidance based on your readings
          </Text>
          {advice.map((a) => {
            const color = severityColor(a.urgency);
            return (
              <View key={a.id} style={styles.adviceCard}>
                <View style={styles.adviceHeader}>
                  <Text style={styles.adviceIcon}>{a.icon}</Text>
                  <View style={styles.adviceHeaderText}>
                    <Text style={[styles.adviceCategory, { color }]}>{a.category}</Text>
                    <Text style={styles.adviceTitle}>{a.title}</Text>
                  </View>
                </View>
                <Text style={styles.adviceBody}>{a.body}</Text>
              </View>
            );
          })}
        </View>

        {/* Re-analyze */}
        <TouchableOpacity
          style={styles.reanalyzeBtn}
          onPress={() => navigation.navigate('Input')}
          activeOpacity={0.8}
        >
          <Feather name="edit-3" size={16} color={Colors.primary} />
          <Text style={styles.reanalyzeText}>Edit Vitals & Re-analyze</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: S.lg, paddingTop: S.lg },

  // Empty
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: S.xxl,
    gap: S.md,
  },
  emptyTitle: {
    fontSize: F.xl,
    fontWeight: W.bold,
    color: Colors.textSoft,
    marginTop: S.md,
  },
  emptyText: {
    fontSize: F.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  goInputBtn: {
    marginTop: S.md,
    paddingHorizontal: S.xl,
    paddingVertical: S.md,
    backgroundColor: Colors.primaryMuted,
    borderRadius: R.md,
  },
  goInputText: {
    fontSize: F.md,
    fontWeight: W.semi,
    color: Colors.primary,
  },

  // Status
  statusBanner: {
    alignItems: 'center',
    padding: S.xl,
    backgroundColor: Colors.bgCard,
    borderRadius: R.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: S.xl,
  },
  statusEmoji: { fontSize: 48, marginBottom: S.sm },
  statusLabel: {
    fontSize: F.xxl,
    fontWeight: W.heavy,
    letterSpacing: 1.5,
  },
  statusSummary: {
    fontSize: F.md,
    color: Colors.textSoft,
    textAlign: 'center',
    marginTop: S.sm,
    lineHeight: 22,
  },

  // Sections
  section: { marginBottom: S.xl },
  sectionTitle: {
    fontSize: F.lg,
    fontWeight: W.bold,
    color: Colors.text,
    marginBottom: S.md,
  },

  // Conditions
  conditionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: R.md,
    padding: S.lg,
    marginBottom: S.sm,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    marginBottom: S.sm,
  },
  conditionEmoji: { fontSize: 20 },
  conditionName: {
    fontSize: F.md,
    fontWeight: W.semi,
    color: Colors.text,
    flex: 1,
  },
  sevBadge: {
    paddingHorizontal: S.sm,
    paddingVertical: 2,
    borderRadius: R.full,
  },
  sevBadgeText: {
    fontSize: F.xs,
    fontWeight: W.bold,
    letterSpacing: 0.5,
  },
  conditionDesc: {
    fontSize: F.sm,
    color: Colors.textSoft,
    lineHeight: 20,
  },

  // Risks
  risksCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: R.md,
    padding: S.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: S.lg,
  },
  riskItem: {},
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: S.xs,
  },
  riskLabel: {
    fontSize: F.md,
    fontWeight: W.medium,
    color: Colors.text,
  },
  riskBadge: {
    paddingHorizontal: S.sm,
    paddingVertical: 2,
    borderRadius: R.full,
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: W.bold,
    letterSpacing: 0.5,
  },
  riskBarBg: {
    height: 6,
    backgroundColor: Colors.bgInput,
    borderRadius: 3,
    overflow: 'hidden',
  },
  riskBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  riskScore: {
    fontSize: F.xs,
    fontWeight: W.bold,
    textAlign: 'right',
    marginTop: 3,
  },

  // Advice
  adviceSubtitle: {
    fontSize: F.sm,
    color: Colors.textMuted,
    marginBottom: S.md,
    marginTop: -S.sm,
  },
  adviceCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: R.md,
    padding: S.lg,
    marginBottom: S.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  adviceHeader: {
    flexDirection: 'row',
    gap: S.md,
    marginBottom: S.sm,
    alignItems: 'flex-start',
  },
  adviceIcon: { fontSize: 24, marginTop: -2 },
  adviceHeaderText: { flex: 1 },
  adviceCategory: {
    fontSize: F.xs,
    fontWeight: W.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  adviceTitle: {
    fontSize: F.md,
    fontWeight: W.semi,
    color: Colors.text,
  },
  adviceBody: {
    fontSize: F.sm,
    color: Colors.textSoft,
    lineHeight: 21,
  },

  // Re-analyze
  reanalyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S.sm,
    paddingVertical: S.lg,
    backgroundColor: Colors.primaryMuted,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  reanalyzeText: {
    fontSize: F.md,
    fontWeight: W.semi,
    color: Colors.primary,
  },
});
