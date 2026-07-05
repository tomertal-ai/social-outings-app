import {
  View, Text, ScrollView, TouchableOpacity,
  Linking, StyleSheet, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { clubs } from '../../data/clubs';
import ClubAvatar from '../../components/clubs/ClubAvatar';

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

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const club = clubs.find(c => String(c.id) === id);

  if (!club) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={48} color="#4b5563" />
          <Text style={styles.notFoundText}>מועדון לא נמצא</Text>
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

  const hasTicket = !!club.ticketLink;
  const hasInstagram = !!club.instagram;
  const hasWebsite = !!club.website;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backCircle} activeOpacity={0.7}>
            <Ionicons name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'} size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <ClubAvatar club={club} size={80} />
          <View style={styles.heroText}>
            <Text style={styles.clubName}>{club.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={14} color={club.color} />
              <Text style={styles.locationText}>{club.city}</Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={[styles.stars, { color: club.color }]}>
                {'★'.repeat(Math.round(club.rating))}{'☆'.repeat(5 - Math.round(club.rating))}
              </Text>
              <Text style={styles.ratingNum}>{club.rating}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {!!club.description && (
          <View style={styles.section}>
            <Text style={styles.description}>{club.description}</Text>
          </View>
        )}

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <InfoBox icon="location-outline" label="כתובת" value={club.address} color={club.color} />
          <InfoBox icon="time-outline" label="שעות" value={club.hours} color={club.color} />
          <InfoBox icon="calendar-outline" label="ימים" value={club.openDays} color={club.color} />
          <InfoBox icon="cash-outline" label="כניסה" value={club.entryPrice} color={club.color} />
          <InfoBox icon="person-outline" label="גיל מינ׳" value={`${club.minAge}+`} color={club.color} />
          <InfoBox icon="people-outline" label="קיבולת" value={`${club.capacity} אנשים`} color={club.color} />
        </View>

        {/* Music */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מוזיקה</Text>
          <View style={styles.tagsRow}>
            {club.music.map(m => <Tag key={m} label={m} color={club.color} filled />)}
          </View>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מאפיינים</Text>
          <View style={styles.tagsRow}>
            {club.tags.map(t => <Tag key={t} label={t} color={club.color} />)}
          </View>
        </View>

        {/* Links row */}
        {(hasInstagram || hasWebsite) && (
          <View style={styles.linksRow}>
            {hasInstagram && (
              <TouchableOpacity
                style={styles.linkBtn}
                onPress={() => openLink(club.instagram)}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-instagram" size={18} color="#E1306C" />
                <Text style={styles.linkBtnText}>Instagram</Text>
              </TouchableOpacity>
            )}
            {hasWebsite && (
              <TouchableOpacity
                style={styles.linkBtn}
                onPress={() => openLink(club.website)}
                activeOpacity={0.7}
              >
                <Ionicons name="globe-outline" size={18} color="#60a5fa" />
                <Text style={styles.linkBtnText}>אתר</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Ticket CTA */}
        <View style={styles.ctaSection}>
          {hasTicket ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => openLink(club.ticketLink)}
            >
              <LinearGradient
                colors={['#2CB7FF', '#7B61FF', '#D946EF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ticketBtn}
              >
                <Ionicons name="ticket-outline" size={20} color="#fff" />
                <Text style={styles.ticketBtnText}>רכוש כרטיס</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.ticketBtnDisabled}>
              <Ionicons name="ticket-outline" size={20} color="#4b5563" />
              <Text style={styles.ticketBtnDisabledText}>כרטיסים בקרוב</Text>
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
    flexDirection: 'row', alignItems: 'center',
  },
  backCircle: {
    width: 40, height: 40, borderRadius: 13,
    backgroundColor: '#161622', borderWidth: 1, borderColor: '#2A2A3C',
    alignItems: 'center', justifyContent: 'center',
  },

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
