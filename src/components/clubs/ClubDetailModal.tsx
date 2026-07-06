import { View, Text, ScrollView, TouchableOpacity, Modal, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Experience } from '../../types';
import ClubAvatar from './ClubAvatar';

interface Props {
  club: Experience | null;
  onClose: () => void;
  onViewDetails?: (club: Experience) => void;
}

function stars(r: number) {
  return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
}

export default function ClubDetailModal({ club, onClose, onViewDetails }: Props) {
  const openLink = (url: string) => { if (url) Linking.openURL(url).catch(() => {}); };
  if (!club) return null;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={!!club}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color="#9ca3af" />
              </TouchableOpacity>

              <View style={styles.titleRow}>
                <View>
                  <Text style={styles.name}>{club.name}</Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={14} color={club.color} />
                    <Text style={styles.city}>{club.city}</Text>
                  </View>
                </View>
                <ClubAvatar club={club} size={56} />
              </View>

              {club.rating !== undefined && (
              <View style={styles.ratingRow}>
                <Text style={[styles.ratingStars, { color: club.color }]}>{stars(club.rating)}</Text>
                <Text style={styles.ratingNum}>{club.rating}</Text>
                {club.amenities?.length ? <Text style={styles.ratingCount}>• {club.amenities[0]}</Text> : null}
              </View>
              )}
            </View>

            <View style={styles.infoGrid}>
              {[
                { icon: 'time-outline', label: 'שעות', val: club.hours },
                { icon: 'calendar-outline', label: 'ימים', val: club.openDays },
                { icon: 'cash-outline', label: 'כניסה', val: club.entryPrice },
                { icon: 'person-outline', label: "גיל מינ׳", val: club.minAge !== undefined ? `${club.minAge}+` : '' },
                { icon: 'location-outline', label: 'כתובת', val: club.address },
                { icon: 'musical-notes-outline', label: 'מוזיקה', val: (club.musicGenres ?? []).join(', ') },
              ].filter(item => !!item.val).map((item, idx) => (
                <View key={idx} style={styles.infoBox}>
                  <Ionicons name={item.icon as any} size={18} color={club.color} />
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoVal}>{item.val}</Text>
                </View>
              ))}
            </View>

            {(club.musicGenres ?? []).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>סוגי מוזיקה</Text>
              <View style={styles.tagsRow}>
                {(club.musicGenres ?? []).map((m: string) => (
                  <View key={m} style={[styles.musicTag, { backgroundColor: club.color + '16', borderColor: club.color + '40' }]}>
                    <Text style={[styles.musicTagText, { color: club.color }]}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>מאפיינים</Text>
              <View style={styles.tagsRow}>
                {club.tags.map(t => (
                  <View key={t} style={styles.tag}>
                    <Text style={styles.tagText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actionsRow}>
              {!!club.instagram && (
                <TouchableOpacity style={styles.actionBtn} onPress={() => openLink(club.instagram!)} activeOpacity={0.7}>
                  <Ionicons name="logo-instagram" size={18} color="#E1306C" />
                  <Text style={styles.actionBtnText}>Instagram</Text>
                </TouchableOpacity>
              )}
              {!!club.website && (
                <TouchableOpacity style={styles.actionBtn} onPress={() => openLink(club.website!)} activeOpacity={0.7}>
                  <Ionicons name="globe-outline" size={18} color="#60a5fa" />
                  <Text style={styles.actionBtnText}>אתר</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Ticket CTA */}
            {club.ticketUrl ? (
              <TouchableOpacity activeOpacity={0.85} onPress={() => openLink(club.ticketUrl!)} style={styles.ticketWrap}>
                <LinearGradient
                  colors={['#2CB7FF', '#7B61FF', '#D946EF']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.ticketBtn}
                >
                  <Ionicons name="ticket-outline" size={20} color="#fff" />
                  <Text style={styles.ticketBtnText}>רכוש כרטיס</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={[styles.ticketWrap, styles.ticketBtnDisabled]}>
                <Ionicons name="ticket-outline" size={20} color="#4b5563" />
                <Text style={styles.ticketBtnDisabledText}>כרטיסים בקרוב</Text>
              </View>
            )}

            {/* View full details */}
            {onViewDetails && (
              <TouchableOpacity style={styles.detailsLink} onPress={() => { onClose(); onViewDetails(club); }} activeOpacity={0.7}>
                <Text style={styles.detailsLinkText}>פרטים נוספים</Text>
                <Ionicons name="chevron-back" size={14} color="#7B61FF" />
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: '#161622',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  handle: {
    width: 40, height: 5, borderRadius: 3, backgroundColor: '#2A2A3C',
    alignSelf: 'center', marginTop: 12, marginBottom: 6,
  },
  scroll: { paddingHorizontal: 22, paddingBottom: 34 },
  header: { paddingTop: 6, paddingBottom: 18 },
  closeBtn: {
    alignSelf: 'flex-end', width: 32, height: 32, borderRadius: 10,
    backgroundColor: '#0B0B14', alignItems: 'center', justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 10,
  },
  name: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  city: { fontSize: 14, color: '#9ca3af', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingStars: { fontSize: 15 },
  ratingNum: { fontSize: 15, fontWeight: '800', color: '#fff' },
  ratingCount: { fontSize: 13, color: '#9ca3af', marginRight: 4 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  infoBox: {
    flex: 1, minWidth: '28%', backgroundColor: '#0B0B14', borderRadius: 16,
    padding: 14, alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: '#2A2A3C',
  },
  infoLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '600' },
  infoVal: { fontSize: 12, color: '#fff', fontWeight: '700', textAlign: 'center' },
  section: { marginBottom: 18 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#d1d5db', marginBottom: 10, textAlign: 'right' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  musicTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  musicTagText: { fontSize: 13, fontWeight: '600' },
  tag: {
    backgroundColor: '#0B0B14', paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: '#2A2A3C',
  },
  tagText: { fontSize: 12, color: '#d1d5db', fontWeight: '500' },
  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, paddingVertical: 11, borderRadius: 12,
    backgroundColor: '#0B0B14', borderWidth: 1, borderColor: '#2A2A3C',
  },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  ticketWrap: { marginBottom: 10 },
  ticketBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 15, borderRadius: 16,
  },
  ticketBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  ticketBtnDisabled: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 15, borderRadius: 16,
    backgroundColor: '#161622', borderWidth: 1, borderColor: '#2A2A3C',
  },
  ticketBtnDisabledText: { fontSize: 16, fontWeight: '700', color: '#4b5563' },
  detailsLink: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 10,
  },
  detailsLinkText: { fontSize: 13, color: '#7B61FF', fontWeight: '700' },
});
