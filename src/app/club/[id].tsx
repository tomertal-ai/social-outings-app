import {
  View, Text, ScrollView, TouchableOpacity,
  Linking, StyleSheet, Platform, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { allExperiences } from '../../data/experiences';
import { CATEGORY_LABELS } from '../../types';
import ClubAvatar from '../../components/clubs/ClubAvatar';

const LOCATION_STATUS_LABELS: Record<string, string> = {
  fixed: 'מיקום קבוע',
  announced: 'מיקום מוכרז לפני האירוע',
  secret: 'מיקום סודי',
  tba: 'מיקום TBA',
};

const LOCATION_STATUS_ICONS: Record<string, string> = {
  fixed: 'location-sharp',
  announced: 'megaphone-outline',
  secret: 'eye-off-outline',
  tba: 'help-circle-outline',
};

function InfoBox({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={styles.infoBox}>
      <Ionicons name={icon as any} size={18} color={color} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoVal} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function Tag({ label, color, filled }: { label: string; color: string; filled?: boolean }) {
  if (filled) {
    return (
      <View style={[styles.tag, { backgroundColor: color + '18', borderColor: color + '45' }]}>
        <Text style={[styles.tagText, { color }]}>{label}</Text>
      </View>
    );
  }
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

function BuyTicketsButton({ url, color }: { url: string; color: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 30, bounciness: 5 }).start();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => Linking.openURL(url).catch(() => {})}
      >
        <LinearGradient
          colors={['#2CB7FF', '#7B61FF', '#D946EF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buyBtn}
        >
          <Ionicons name="ticket-outline" size={20} color="#fff" />
          <Text style={styles.buyBtnText}>Buy Tickets</Text>
          <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.7)" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const club = allExperiences.find(c => String(c.id) === id);
  const [isSaved, setIsSaved] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  if (!club) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={48} color="#4b5563" />
          <Text style={styles.notFoundText}>לא נמצא</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>חזור</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const openLink = (url: string) => {
    if (url) Linking.openURL(url).catch(() => {});
  };

  const ticketUrl  = club.ticketUrl || club.website;
  const hasTicket  = !!ticketUrl;
  const hasInstagram = !!club.instagram;
  const hasWebsite   = !!club.website;

  const toggleSave = () => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.35, useNativeDriver: true, speed: 50, bounciness: 8 }),
      Animated.spring(heartScale, { toValue: 1,    useNativeDriver: true, speed: 30, bounciness: 3 }),
    ]).start();
    setIsSaved(s => !s);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.7}>
            <Ionicons name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'} size={22} color="#fff" />
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <TouchableOpacity onPress={toggleSave} style={styles.headerBtn} activeOpacity={0.7}>
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={22}
                color={isSaved ? '#ef4444' : '#fff'}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <ClubAvatar club={club} size={80} />
          <View style={styles.heroText}>
            {/* Category badge */}
            <View style={[styles.categoryBadge, { backgroundColor: club.color + '22', borderColor: club.color + '55' }]}>
              <Text style={[styles.categoryBadgeText, { color: club.color }]}>{CATEGORY_LABELS[club.category]}</Text>
            </View>
            <Text style={styles.clubName}>{club.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons
                name={(LOCATION_STATUS_ICONS[club.locationStatus ?? 'fixed']) as any}
                size={13} color={club.color}
              />
              <Text style={styles.locationText}>
                {club.city}{club.region && club.region !== club.city ? ` · ${club.region}` : ''}
              </Text>
            </View>
            {club.rating !== undefined && (
              <View style={styles.ratingRow}>
                <Text style={[styles.stars, { color: club.color }]}>
                  {'★'.repeat(Math.round(club.rating))}{'☆'.repeat(5 - Math.round(club.rating))}
                </Text>
                <Text style={styles.ratingNum}>{club.rating}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Primary CTA — top position */}
        {hasTicket && (
          <View style={styles.topCta}>
            <BuyTicketsButton url={ticketUrl!} color={club.color} />
          </View>
        )}

        {/* Description */}
        {!!club.description && (
          <View style={styles.section}>
            <Text style={styles.description}>{club.description}</Text>
          </View>
        )}

        {/* Location status banner — for non-fixed locations */}
        {club.locationStatus && club.locationStatus !== 'fixed' && (
          <View style={[styles.locationBanner, { borderColor: club.color + '40', backgroundColor: club.color + '10' }]}>
            <Ionicons name={(LOCATION_STATUS_ICONS[club.locationStatus]) as any} size={16} color={club.color} />
            <Text style={[styles.locationBannerText, { color: club.color }]}>
              {LOCATION_STATUS_LABELS[club.locationStatus]}
            </Text>
          </View>
        )}

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          {!!club.hours    && <InfoBox icon="time-outline"     label="שעות"    value={club.hours}           color={club.color} />}
          {!!club.openDays && <InfoBox icon="calendar-outline" label="ימים"    value={club.openDays}        color={club.color} />}
          {!!club.startDate && <InfoBox icon="calendar-outline" label="תאריך" value={club.startDate + (club.endDate ? ` — ${club.endDate}` : '')} color={club.color} />}
          {!!club.entryPrice && <InfoBox icon="cash-outline" label="כניסה" value={club.entryPrice} color={club.color} />}
          {club.minAge !== undefined && <InfoBox icon="person-outline" label="גיל מינ׳" value={`${club.minAge}+`} color={club.color} />}
          {!!club.dressCode && <InfoBox icon="shirt-outline" label="קוד לבוש" value={club.dressCode} color={club.color} />}
        </View>

        {/* Music */}
        {club.musicGenres && club.musicGenres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>מוזיקה / ז'אנר</Text>
            <View style={styles.tagsRow}>
              {club.musicGenres.map(m => <Tag key={m} label={m} color={club.color} filled />)}
            </View>
          </View>
        )}

        {/* Tags */}
        {club.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>מאפיינים</Text>
            <View style={styles.tagsRow}>
              {club.tags.map(t => <Tag key={t} label={t} color={club.color} />)}
            </View>
          </View>
        )}

        {/* Links */}
        {(hasInstagram || hasWebsite) && (
          <View style={styles.linksRow}>
            {hasInstagram && (
              <TouchableOpacity style={styles.linkBtn} onPress={() => openLink(club.instagram!)} activeOpacity={0.7}>
                <Ionicons name="logo-instagram" size={18} color="#E1306C" />
                <Text style={styles.linkBtnText}>Instagram</Text>
              </TouchableOpacity>
            )}
            {hasWebsite && (
              <TouchableOpacity style={styles.linkBtn} onPress={() => openLink(club.website!)} activeOpacity={0.7}>
                <Ionicons name="globe-outline" size={18} color="#60a5fa" />
                <Text style={styles.linkBtnText}>Website</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Verification note */}
        {club.verificationStatus === 'needs_verification' && !!club.verificationNotes && (
          <View style={styles.verificationBanner}>
            <Ionicons name="warning-outline" size={15} color="#f59e0b" />
            <Text style={styles.verificationText}>{club.verificationNotes}</Text>
          </View>
        )}

        {/* Bottom CTA */}
        <View style={styles.bottomCta}>
          {hasTicket ? (
            <BuyTicketsButton url={ticketUrl!} color={club.color} />
          ) : (
            <View style={styles.noTicketBox}>
              <Ionicons name="information-circle-outline" size={18} color="#4b5563" />
              <Text style={styles.noTicketText}>אין מידע על כרטיסים כרגע</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },
  scroll: { paddingBottom: 50 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  notFoundText: { color: '#9ca3af', fontSize: 16 },
  backBtn: { paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#161622', borderRadius: 12 },
  backBtnText: { color: '#fff', fontWeight: '700' },

  headerRow: {
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerBtn: {
    width: 40, height: 40, borderRadius: 13,
    backgroundColor: '#161622', borderWidth: 1, borderColor: '#2A2A3C',
    alignItems: 'center', justifyContent: 'center',
  },
  topCta: { paddingHorizontal: 20, marginBottom: 20 },
  bottomCta: { paddingHorizontal: 20, marginTop: 8, marginBottom: 8 },
  buyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 17, borderRadius: 18,
  },
  buyBtnText: { fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  noTicketBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 16,
    backgroundColor: '#161622', borderWidth: 1, borderColor: '#2A2A3C',
  },
  noTicketText: { fontSize: 14, color: '#4b5563', fontWeight: '600' },

  hero: {
    flexDirection: 'row', alignItems: 'center', gap: 18,
    paddingHorizontal: 20, paddingVertical: 20,
  },
  heroText: { flex: 1 },
  clubName: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5, marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  locationText: { fontSize: 14, color: '#9ca3af', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stars: { fontSize: 14 },
  ratingNum: { fontSize: 14, fontWeight: '800', color: '#fff' },

  section: { paddingHorizontal: 20, marginBottom: 20 },
  categoryBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10, borderWidth: 1, marginBottom: 6,
  },
  categoryBadgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  locationBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginBottom: 16,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1,
  },
  locationBannerText: { fontSize: 13, fontWeight: '600', flex: 1 },
  verificationBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    marginHorizontal: 20, marginBottom: 16,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    backgroundColor: '#f59e0b18', borderWidth: 1, borderColor: '#f59e0b40',
  },
  verificationText: { fontSize: 12, color: '#f59e0b', lineHeight: 18, flex: 1, textAlign: 'right' },
  description: { fontSize: 14, color: '#9ca3af', lineHeight: 22, textAlign: 'right' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#d1d5db', marginBottom: 10, textAlign: 'right' },

  infoGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    paddingHorizontal: 20, marginBottom: 20,
  },
  infoBox: {
    flex: 1, minWidth: '28%', backgroundColor: '#161622', borderRadius: 16,
    padding: 14, alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: '#2A2A3C',
  },
  infoLabel: { fontSize: 10, color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' },
  infoVal: { fontSize: 12, color: '#fff', fontWeight: '700', textAlign: 'center' },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 13, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#161622', borderWidth: 1, borderColor: '#2A2A3C',
  },
  tagText: { fontSize: 12, color: '#d1d5db', fontWeight: '600' },

  linksRow: {
    flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 20,
  },
  linkBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 14,
    backgroundColor: '#161622', borderWidth: 1, borderColor: '#2A2A3C',
  },
  linkBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  ctaSection: { paddingHorizontal: 20, marginTop: 4 },
  ticketBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: 18,
  },
  ticketBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
  ticketBtnDisabled: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: 18,
    backgroundColor: '#161622', borderWidth: 1, borderColor: '#2A2A3C',
  },
  ticketBtnDisabledText: { fontSize: 17, fontWeight: '700', color: '#4b5563' },
});
