/**
 * Navigation — Tab navigator for the new Input/Diagnosis/Emergency flow.
 */

import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Colors, F, W, S, R } from '../theme/colors';

import InputScreen from '../screens/InputScreen';
import DiagnosisScreen from '../screens/DiagnosisScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import { useApp } from '../context/AppContext';

const Tab = createBottomTabNavigator();

function TabBarIcon({ name, color, focused }: { name: keyof typeof Feather.glyphMap; color: string; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Feather name={name} size={22} color={color} />
      {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
    </View>
  );
}

export default function AppNavigator() {
  const { state } = useApp();
  const hasDiagnosis = state.hasAnalyzed;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Input"
          component={InputScreen}
          options={{
            tabBarLabel: 'Vitals',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="edit-3" color={color} focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Diagnosis"
          component={DiagnosisScreen}
          options={{
            tabBarLabel: 'Diagnosis',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="activity" color={hasDiagnosis && !focused ? Colors.teal : color} focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Emergency"
          component={EmergencyScreen}
          options={{
            tabBarLabel: 'SOS',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="alert-triangle" color={focused ? Colors.accent : Colors.textMuted} focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.bgCard,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: S.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : S.sm,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: F.xs,
    fontWeight: W.medium,
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    position: 'absolute',
    bottom: -8,
  },
});
