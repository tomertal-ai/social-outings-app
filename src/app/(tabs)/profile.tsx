/**
 * EXPERIMENTAL — Profile / Me screen.
 *
 * Uses mock data only. No real identity verification.
 * KYC integration point: src/services/kyc.ts
 *
 * To disable this feature: set href: null on the profile tab in _layout.tsx
 */

import {
  View, Text, ScrollView, TouchableOpacity,
  Linking, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { KYCStatus } from '../../services/kyc';

// ─── Mock user data ───────────────────────────────────────────────────────────
const MOCK_USER = {
  id: 'mock-user-001',
  name: 'Tom Tal',
  age: 26,
  city: 'Tel Aviv',
  instagram: 'https://instagram.com/',
  initials: 'TT',
  avatarColor: ['#7B61FF', '#2CB7FF'] as [string, string],
  kycStatus: 'unverified' as KYCStatus,
};
// ─────────────────────────────────────────────────────────────────────────────

const KYC_CONFIG: Record<KYCStatus, { label: string; color: string; bg: string; icon: string }> = {
  unverified: { label: 'לא מאומת',         color: '#6b7280', bg: '#6b728018', icon: 'shield-outline' },
  pending:    { label: 'בתהליך בדיקה',      color: '#f59e0b', bg: '#f59e0b18', icon: 'time-outline' },
  verified:   { label: 'גיל מאומת ✓',       color: '#10b981', bg: '#10b98118', icon: 'shield-checkmark' },
  rejected:   { label: 'אימות נכשל',        color: '#ef4444', bg: '#ef444418', icon: 'shield-outline' },
};

function AvatarCircle({ initials, colors }: { initials: string; colors: [string, string] }) {
  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
      <Text style={styles.avatarInitials}>{initials}</Text>
    </LinearGradient>
  );
}

function InfoRow({ icon, label, value, onPress, valueColor }: {
  icon: string; label: string; value: string;
  onPress?: () => void; valueColor?: string;
}) {
  return (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.infoLeft}>
        <Ionicons name={icon as any} size={18} color="#7B61FF" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, valueColor ? { color: valueColor } : undefined]} numberOfLines={1}>
        {value}
      </Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const [kycStatus, setKycStatus] = useState<KYCStatus>(MOCK_USER.kycStatus);
  const [starting, setStarting] = useState(false);
  const kyc = KYC_CONFIG[kycStatus];

  const handleStartVerification = async () => {
    if (kycStatus !== 'unverified') return;
    setStarting(true);
    // Simulates calling startKYCSession from src/services/kyc.ts
    await new Promise(r => setTimeout(r, 1200));
    setKycStatus('pending');
    setStarting(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>הפרופיל שלי</Text>
        </View>

        {/* Avatar + name */}
        <View style={styles.heroSection}>
          <AvatarCircle initials={MOCK_USER.initials} colors={MOCK_USER.avatarColor} />
          <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={16} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.heroName}>{MOCK_USER.name}</Text>
          <Text style={styles.heroCity}>{MOCK_USER.city}</Text>
        </View>

        {/* Info card */}
        <View style={styles.card}>
          <InfoRow icon="person-outline"    label="שם"       value={MOCK_USER.name} />
          <View style={styles.divider} />
          <InfoRow icon="calendar-outline"  label="גיל"      value={`${MOCK_USER.age}`} />
          <View style={styles.divider} />
          <InfoRow
            icon="logo-instagram"
            label="Instagram"
            value="@outly_user"
            valueColor="#E1306C"
            onPress={() => Linking.openURL(MOCK_USER.instagram).catch(() => {})}
          />
        </View>

        {/* Age verification section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>אימות גיל</Text>
          <View style={styles.experimentBadge}>
            <Text style={styles.experimentBadgeText}>BETA</Text>
          </View>
        </View>

        <View style={styles.card}>
          {/* Status row */}
          <View style={[styles.kycStatusRow, { backgroundColor: kyc.bg }]}>
            <Ionicons name={kyc.icon as any} size={22} color={kyc.color} />
            <View style={styles.kycStatusText}>
              <Text style={[styles.kycStatusLabel, { color: kyc.color }]}>{kyc.label}</Text>
              {kycStatus === 'verified' && (
                <Text style={styles.kycSubtext}>אומת על ידי Outly · {new Date().toLocaleDateString('he-IL')}</Text>
              )}
              {kycStatus === 'pending' && (
                <Text style={styles.kycSubtext}>הבדיקה עשויה לקחת עד 24 שעות</Text>
              )}
            </View>
          </View>

          {/* CTA */}
          {kycStatus === 'unverified' && (
            <TouchableOpacity
              style={styles.kycBtn}
              onPress={handleStartVerification}
              activeOpacity={0.85}
              disabled={starting}
            >
              <LinearGradient
                colors={['#7B61FF', '#2CB7FF']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.kycBtnGradient}
              >
                <Ionicons name="shield-checkmark-outline" size={18} color="#fff" />
                <Text style={styles.kycBtnText}>
                  {starting ? 'מתחיל...' : 'התחל אימות גיל'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {kycStatus === 'pending' && (
            <View style={styles.kycPendingHint}>
              <Ionicons name="information-circle-outline" size={16} color="#f59e0b" />
              <Text style={styles.kycPendingText}>קיבלת אישור? רענן את האפליקציה</Text>
            </View>
          )}

          {/* Dev shortcut — remove before production */}
          {__DEV__ && (
            <View style={styles.devRow}>
              <Text style={styles.devLabel}>DEV: simulate status →</Text>
              {(['unverified', 'pending', 'verified', 'rejected'] as KYCStatus[]).map(s => (
                <TouchableOpacity key={s} onPress={() => setKycStatus(s)} style={styles.devBtn}>
                  <Text style={styles.devBtnText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={15} color="#4b5563" style={{ marginTop: 1 }} />
          <Text style={styles.disclaimerText}>
            אימות גיל באפליקציה עשוי לעזור בכניסה, אך מועדונים עשויים עדיין לדרוש תעודת זהות פיזית.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },
  scroll: { paddingBottom: 50 },

  header: {
    paddingHorizontal: 22, paddingTop: 14, paddingBottom: 8,
    flexDirection: 'row', alignItems: 'center',
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },

  heroSection: { alignItems: 'center', paddingVertical: 24, position: 'relative' },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: { fontSize: 32, fontWeight: '800', color: '#fff' },
  editAvatarBtn: {
    position: 'absolute', bottom: 28, right: '35%',
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#2A2A3C', borderWidth: 2, borderColor: '#0B0B14',
    alignItems: 'center', justifyContent: 'center',
  },
  heroName: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 12, letterSpacing: -0.3 },
  heroCity: { fontSize: 14, color: '#6b7280', marginTop: 4, fontWeight: '500' },

  card: {
    marginHorizontal: 18, marginBottom: 20,
    backgroundColor: '#161622', borderRadius: 20,
    borderWidth: 1, borderColor: '#2A2A3C',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 16,
  },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoLabel: { fontSize: 14, color: '#9ca3af', fontWeight: '600' },
  infoValue: { fontSize: 14, color: '#fff', fontWeight: '700', maxWidth: 180, textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#2A2A3C', marginHorizontal: 18 },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 22, marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#d1d5db' },
  experimentBadge: {
    backgroundColor: '#7B61FF22', borderRadius: 6, borderWidth: 1,
    borderColor: '#7B61FF55', paddingHorizontal: 6, paddingVertical: 2,
  },
  experimentBadgeText: { fontSize: 10, fontWeight: '800', color: '#7B61FF', letterSpacing: 1 },

  kycStatusRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    margin: 16, borderRadius: 14, padding: 14,
  },
  kycStatusText: { flex: 1 },
  kycStatusLabel: { fontSize: 15, fontWeight: '700' },
  kycSubtext: { fontSize: 12, color: '#6b7280', marginTop: 3, fontWeight: '500' },

  kycBtn: { marginHorizontal: 16, marginBottom: 16, borderRadius: 14, overflow: 'hidden' },
  kycBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14,
  },
  kycBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  kycPendingHint: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 14,
  },
  kycPendingText: { fontSize: 12, color: '#f59e0b', fontWeight: '600' },

  devRow: {
    marginHorizontal: 16, marginBottom: 14, padding: 10,
    backgroundColor: '#0B0B14', borderRadius: 10,
    flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center',
  },
  devLabel: { fontSize: 10, color: '#4b5563', fontWeight: '600' },
  devBtn: {
    paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#1f2937',
    borderRadius: 6, borderWidth: 1, borderColor: '#374151',
  },
  devBtnText: { fontSize: 10, color: '#9ca3af', fontWeight: '700' },

  disclaimer: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    marginHorizontal: 22, marginTop: 4,
  },
  disclaimerText: {
    flex: 1, fontSize: 12, color: '#4b5563',
    lineHeight: 18, fontWeight: '500', textAlign: 'right',
  },
});
