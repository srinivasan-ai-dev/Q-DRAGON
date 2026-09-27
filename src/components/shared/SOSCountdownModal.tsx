/**
 * SOSCountdownModal — Updated for the new theme.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, S, R, F, W } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

interface Props {
  visible: boolean;
  countdown: number;
  onCancel: () => void;
}

export default function SOSCountdownModal({ visible, countdown, onCancel }: Props) {
  const flashAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const { state, dispatch } = useApp();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (visible && countdown > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'SOS_TICK' });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [visible, countdown, dispatch]);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();

      const flash = Animated.loop(
        Animated.sequence([
          Animated.timing(flashAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(flashAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      );
      flash.start();
      return () => flash.stop();
    } else {
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  const progress = countdown / 30;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: flashAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(239, 68, 68, 0.90)', 'rgba(239, 68, 68, 0.98)'],
            }),
          },
        ]}
      >
        <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconCircle}>
            <Feather name="alert-octagon" size={48} color="#FFF" />
          </View>

          <Text style={styles.eventType}>SOS ALERT TRIGGERED</Text>

          <Text style={styles.countdownLabel}>Emergency SMS sending in</Text>
          <Text style={styles.countdown}>{countdown}</Text>
          <Text style={styles.countdownUnit}>seconds</Text>

          <View style={styles.progressContainer}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          <View style={styles.coordsRow}>
            <Feather name="map-pin" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.coords}>
              28.6139°N, 77.2090°E
            </Text>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
            <Feather name="x" size={20} color={Colors.critical} />
            <Text style={styles.cancelText}>CANCEL ALERT</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: S.xxl,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: S.xl,
  },
  eventType: {
    fontSize: F.xl,
    fontWeight: W.bold,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: S.xxl,
    letterSpacing: 1,
  },
  countdownLabel: {
    fontSize: F.md,
    fontWeight: W.medium,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: S.sm,
  },
  countdown: {
    fontSize: 80,
    fontWeight: W.heavy,
    color: '#FFF',
    letterSpacing: -2,
  },
  countdownUnit: {
    fontSize: F.lg,
    fontWeight: W.medium,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: S.xl,
  },
  progressContainer: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: S.xl,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 3,
  },
  coordsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: S.xxl,
  },
  coords: {
    fontSize: F.sm,
    fontWeight: W.medium,
    color: 'rgba(255,255,255,0.7)',
    fontVariant: ['tabular-nums'],
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    paddingHorizontal: S.xxxl,
    paddingVertical: S.lg,
    backgroundColor: '#FFF',
    borderRadius: R.full,
  },
  cancelText: {
    fontSize: F.lg,
    fontWeight: W.bold,
    color: Colors.critical,
    letterSpacing: 1,
  },
});
