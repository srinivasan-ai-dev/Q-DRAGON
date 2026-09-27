/**
 * Emergency Screen — SOS triggers and contacts.
 */

import React, { useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, S, R, F, W } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { EmergencyContact } from '../types';
import SOSCountdownModal from '../components/shared/SOSCountdownModal';

export default function EmergencyScreen() {
  const { state, dispatch } = useApp();
  const { contacts, sosActive, sosCountdown } = state;
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSaveContact = (contact: EmergencyContact) => {
    const updated = contacts.map(c => c.id === contact.id ? contact : c);
    dispatch({ type: 'SET_CONTACTS', contacts: updated });
    setEditingId(null);
  };

  const triggerSOS = () => {
    dispatch({ type: 'TRIGGER_SOS' });
  };

  const cancelSOS = () => {
    dispatch({ type: 'CANCEL_SOS' });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Emergency</Text>
          <Text style={styles.subtitle}>SOS Management & Contacts</Text>
        </View>

        {/* Big SOS Button */}
        <View style={styles.sosContainer}>
          <TouchableOpacity
            style={styles.sosButton}
            onPress={triggerSOS}
            activeOpacity={0.8}
          >
            <View style={styles.sosInner}>
              <Feather name="alert-triangle" size={32} color={Colors.text} />
              <Text style={styles.sosText}>SEND SOS</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.sosHint}>
            Triggers offline SMS payload with last vitals & GPS
          </Text>
        </View>

        {/* Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="users" size={16} color={Colors.teal} />
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          </View>

          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isEditing={editingId === contact.id}
              onEdit={() => setEditingId(contact.id)}
              onSave={handleSaveContact}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* SOS Modal */}
      <SOSCountdownModal
        visible={sosActive}
        countdown={sosCountdown}
        onCancel={cancelSOS}
      />
    </SafeAreaView>
  );
}

function ContactCard({
  contact,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: {
  contact: EmergencyContact;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (c: EmergencyContact) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [relation, setRelation] = useState(contact.relation);

  const isEmpty = !contact.name && !contact.phone;

  if (isEditing) {
    return (
      <View style={styles.contactEdit}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={Colors.textMuted}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={Colors.textMuted}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Relation"
          placeholderTextColor={Colors.textMuted}
          value={relation}
          onChangeText={setRelation}
        />
        <View style={styles.editActions}>
          <TouchableOpacity style={styles.btnSave} onPress={() => onSave({ ...contact, name, phone, relation })}>
            <Text style={styles.btnSaveText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCancel} onPress={onCancel}>
            <Text style={styles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.contactCard} onPress={onEdit} activeOpacity={0.7}>
      <View style={styles.contactIcon}>
        <Feather name={isEmpty ? 'user-plus' : 'user'} size={18} color={isEmpty ? Colors.textMuted : Colors.teal} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, isEmpty && styles.contactNameEmpty]}>
          {isEmpty ? 'Add Contact' : contact.name}
        </Text>
        {!isEmpty && (
          <Text style={styles.contactDetails}>
            {contact.phone} • {contact.relation}
          </Text>
        )}
      </View>
      <Feather name="edit-2" size={14} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: S.lg, paddingTop: S.md },

  header: { marginBottom: S.xxl },
  title: { fontSize: F.xxl, fontWeight: W.bold, color: Colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: F.sm, color: Colors.textSoft, marginTop: 2 },

  sosContainer: {
    alignItems: 'center',
    marginBottom: S.xxl * 1.5,
  },
  sosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.criticalMuted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.critical,
    shadowColor: Colors.critical,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
  },
  sosInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.critical,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosText: {
    fontSize: F.lg,
    fontWeight: W.heavy,
    color: Colors.text,
    marginTop: S.sm,
    letterSpacing: 1.5,
  },
  sosHint: {
    fontSize: F.xs,
    color: Colors.textMuted,
    marginTop: S.lg,
    textAlign: 'center',
  },

  section: {},
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

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    padding: S.lg,
    borderRadius: R.md,
    marginBottom: S.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgInput,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: S.md,
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: F.md, fontWeight: W.semi, color: Colors.text },
  contactNameEmpty: { color: Colors.textMuted, fontWeight: W.medium },
  contactDetails: { fontSize: F.xs, color: Colors.textSoft, marginTop: 2 },

  contactEdit: {
    backgroundColor: Colors.bgCard,
    padding: S.lg,
    borderRadius: R.md,
    marginBottom: S.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    backgroundColor: Colors.bgInput,
    padding: S.md,
    borderRadius: R.sm,
    color: Colors.text,
    fontSize: F.md,
    marginBottom: S.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: S.sm,
    marginTop: S.xs,
  },
  btnSave: {
    backgroundColor: Colors.teal,
    paddingHorizontal: S.lg,
    paddingVertical: S.sm,
    borderRadius: R.sm,
  },
  btnSaveText: { fontSize: F.sm, fontWeight: W.semi, color: Colors.textInverse },
  btnCancel: {
    paddingHorizontal: S.md,
    paddingVertical: S.sm,
  },
  btnCancelText: { fontSize: F.sm, color: Colors.textSoft },
});
