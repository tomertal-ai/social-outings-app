import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Image, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { clubs } from '../../data/clubs';
import { getClubLogo, getClubInitials } from '../../data/clubs';
import { Club } from '../../types';

// ---------------------------------------------------------------------------
// Mock data — replace with real persistence later
// ---------------------------------------------------------------------------
const MOCK_SAVED: Club[] = [clubs[0], clubs[2], clubs[5]].filter(Boolean);

const MOCK_HISTORY: Array<{ club: Club; visitedAt: string }> = [
  { club: clubs[1], visitedAt: 'אתמול' },
  { club: clubs[3], visitedAt: 'לפני 3 ימים' },
  { club: clubs[0], visitedAt: 'לפני שבוע' },
  { club: clubs[4], visitedAt: 'לפני שבועיים' },
].filter(item => Boolean(item.club));

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function ClubRow({ club, subtitle, onPress }: { club: Club; subtitle: string; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const logo = getClubLogo(club);
  const onPressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 30, bounciness: 4 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        <View style={[styles.avatar, { borderColor: club.color + '55' }]}>
          {logo ? (
            <Image source={logo} style={styles.avatarImg} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: club.color + '22' }]}>
              <Text style={[styles.avatarInitials, { color: club.color }]}>{getClubInitials(club)}</Text>
            </View>
          )}
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.rowName} numberOfLines={1}>{club.name}</Text>
          <Text style={styles.rowSub} numberOfLines={1}>{subtitle}</Text>
        </View>
        <View style={styles.rowRight}>
          <View style={styles.ratingRow}>
            <Text style={[styles.ratingStar, { color: club.color }]}>★</Text>
            <Text style={styles.ratingValue}>{club.rating}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#3A3A4C" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon as any} size={40} color="#2A2A3C" />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
type Tab = 'saved' | 'history';

export default function FavoritesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('saved');
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    Animated.spring(indicatorAnim, {
      toValue: tab === 'saved' ? 0 : 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>שמורים</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentWrapper}>
        <View style={styles.segment}>
          <Animated.View
            style={[
              styles.segmentIndicator,
              {
                left: indicatorAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [SEGMENT_PADDING, SEGMENT_PADDING + HALF_SEGMENT],
                }),
                width: HALF_SEGMENT,
              },
            ]}
          />
          <TouchableOpacity style={styles.segmentBtn} onPress={() => switchTab('saved')} activeOpacity={0.8}>
            <Text style={[styles.segmentLabel, activeTab === 'saved' && styles.segmentLabelActive]}>
              שמורים
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.segmentBtn} onPress={() => switchTab('history')} activeOpacity={0.8}>
            <Text style={[styles.segmentLabel, activeTab === 'history' && styles.segmentLabelActive]}>
              ביקרתי
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {activeTab === 'saved' ? (
          MOCK_SAVED.length === 0 ? (
            <EmptyState icon="heart-outline" text="עדיין לא שמרת מועדונים" />
          ) : (
            MOCK_SAVED.map((club, i) => (
              <View key={club.id}>
                <ClubRow
                  club={club}
                  subtitle={`${club.city} · ${club.music.slice(0, 2).join(', ')}`}
                  onPress={() => router.push(`/club/${club.id}`)}
                />
                {i < MOCK_SAVED.length - 1 && <View style={styles.separator} />}
              </View>
            ))
          )
        ) : (
          MOCK_HISTORY.length === 0 ? (
            <EmptyState icon="time-outline" text="עדיין אין היסטוריה" />
          ) : (
            MOCK_HISTORY.map((item, i) => (
              <View key={`${item.club.id}-${i}`}>
                <ClubRow
                  club={item.club}
                  subtitle={`${item.visitedAt} · ${item.club.city}`}
                  onPress={() => router.push(`/club/${item.club.id}`)}
                />
                {i < MOCK_HISTORY.length - 1 && <View style={styles.separator} />}
              </View>
            ))
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const SEGMENT_PADDING = 4;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SEGMENT_WIDTH = SCREEN_WIDTH - 36;
const HALF_SEGMENT = (SEGMENT_WIDTH / 2) - SEGMENT_PADDING;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },

  header: {
    paddingHorizontal: 22, paddingTop: 12, paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.6 },

  segmentWrapper: { paddingHorizontal: 18, marginBottom: 8 },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#161622',
    borderRadius: 14,
    padding: SEGMENT_PADDING,
    position: 'relative',
    width: '100%',
  },
  segmentIndicator: {
    position: 'absolute',
    top: SEGMENT_PADDING, bottom: SEGMENT_PADDING,
    backgroundColor: '#252535',
    borderRadius: 10,
  },
  segmentBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 9, zIndex: 1,
  },
  segmentLabel: {
    fontSize: 14, fontWeight: '600', color: '#6b7280',
  },
  segmentLabelActive: {
    color: '#fff',
  },

  list: { flex: 1 },
  listContent: { paddingBottom: 40, paddingTop: 4 },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 18, paddingVertical: 14,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 14,
    borderWidth: 1.5, overflow: 'hidden', flexShrink: 0,
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontSize: 15, fontWeight: '800' },

  rowInfo: { flex: 1, gap: 3 },
  rowName: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.2 },
  rowSub:  { fontSize: 12, color: '#6b7280', fontWeight: '500' },

  rowRight: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingStar: { fontSize: 12 },
  ratingValue: { fontSize: 12, fontWeight: '700', color: '#fff' },

  separator: { height: 1, backgroundColor: '#1a1a28', marginHorizontal: 18 },

  emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText:  { fontSize: 15, color: '#374151', fontWeight: '600' },
});
