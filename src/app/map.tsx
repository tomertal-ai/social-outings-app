import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Animated, Keyboard, StyleSheet, Image, Platform, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import { Experience, ExperienceCategory, CATEGORY_LABELS, CATEGORY_ICONS, MapBounds } from '../types';
import { experiencesByCategory, getExperienceLogo, getExperienceInitials } from '../data/experiences';
import { useExperienceSearch } from '../hooks/useClubSearch';
import ClubSearchBar from '../components/clubs/ClubSearchBar';
import ClubMap from '../components/clubs/ClubMap';
import ClubDetailModal from '../components/clubs/ClubDetailModal';

const CATEGORIES: ExperienceCategory[] = ['clubs', 'nature_parties', 'festivals', 'concerts'];
const DEFAULT_CENTER = { lat: 32.0, lng: 34.85, zoom: 8 };

// Fixed pixel snap points — independent of SafeAreaView
const SCREEN_H   = Dimensions.get('window').height;
const SNAP_PEEK  = 72;                       // grabber + one card row
const SNAP_MID   = Math.round(SCREEN_H * 0.40);
const SNAP_FULL  = Math.round(SCREEN_H * 0.82);

function useCardPressAnim() {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 30, bounciness: 4 }).start();
  return { scale, onPressIn, onPressOut };
}

// ---------------------------------------------------------------------------
// Compact card — ~20% smaller, clean
// ---------------------------------------------------------------------------
interface CardProps {
  exp: Experience;
  index: number;
  total: number;
  isSelected: boolean;
  onLayout: (y: number) => void;
  onPress: () => void;
}

function CompactCard({ exp, index, total, isSelected, onLayout, onPress }: CardProps) {
  const { scale, onPressIn, onPressOut } = useCardPressAnim();
  const logo = getExperienceLogo(exp);
  return (
    <Animated.View
      style={{ transform: [{ scale }] }}
      onLayout={e => onLayout(e.nativeEvent.layout.y)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={[
          styles.card,
          index < total - 1 && styles.cardBorder,
          isSelected && styles.cardSelected,
        ]}
      >
        {isSelected && <View style={[styles.selectedBar, { backgroundColor: exp.color }]} />}

        {/* Avatar */}
        <View style={[styles.avatar, { borderColor: exp.color + '50' }]}>
          {logo ? (
            <Image source={logo} style={styles.avatarImg} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: exp.color + '20' }]}>
              <Text style={[styles.avatarInitials, { color: exp.color }]}>
                {getExperienceInitials(exp)}
              </Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>{exp.name}</Text>
          <View style={styles.cardMeta}>
            <Ionicons
              name={exp.locationStatus && exp.locationStatus !== 'fixed' ? 'location-outline' : 'location-sharp'}
              size={10}
              color={exp.locationStatus && exp.locationStatus !== 'fixed' ? '#f59e0b' : '#6b7280'}
            />
            <Text style={[
              styles.cardCity,
              exp.locationStatus && exp.locationStatus !== 'fixed' && styles.cardCityApprox,
            ]} numberOfLines={1}>
              {exp.approximateArea?.regionName ?? exp.city}
              {exp.locationStatus && exp.locationStatus !== 'fixed' ? ' ·̃' : ''}
            </Text>
          </View>
        </View>

        {/* Right */}
        <View style={styles.cardRight}>
          {exp.rating !== undefined && (
            <View style={styles.ratingRow}>
              <Text style={[styles.ratingStar, { color: exp.color }]}>★</Text>
              <Text style={styles.ratingVal}>{exp.rating}</Text>
            </View>
          )}
          {!!exp.entryPrice && (
            <Text style={styles.price} numberOfLines={1}>{exp.entryPrice}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function MapScreen() {
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  const [activeCategory, setActiveCategory] = useState<ExperienceCategory>('clubs');
  const [selected, setSelected]   = useState<Experience | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const categoryData = useMemo(() => experiencesByCategory[activeCategory], [activeCategory]);
  const { query, setQuery, clear, filtered: searchFiltered } = useExperienceSearch(categoryData);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const sheetListRef   = useRef<any>(null);
  const snapPoints = useMemo(() => [SNAP_PEEK, SNAP_MID, SNAP_FULL], []);

  const animationConfigs = useBottomSheetSpringConfigs({
    mass: 0.5, stiffness: 320, damping: 32, overshootClamping: false,
  });

  const [mapBounds, setMapBounds]         = useState<MapBounds | null>(null);
  const [mapInteracting, setMapInteracting] = useState(false);
  const mapInteractTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRefs = useRef<Record<number, number>>({});

  const visibleExperiences = useMemo(() => {
    if (!mapBounds) return categoryData;
    return categoryData.filter(e =>
      e.latitude  !== undefined && e.longitude !== undefined &&
      e.latitude  <= mapBounds.north &&
      e.latitude  >= mapBounds.south &&
      e.longitude <= mapBounds.east  &&
      e.longitude >= mapBounds.west
    );
  }, [mapBounds, categoryData]);

  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    setMapBounds(bounds);
    setMapInteracting(true);
    if (mapInteractTimeoutRef.current) clearTimeout(mapInteractTimeoutRef.current);
    mapInteractTimeoutRef.current = setTimeout(() => setMapInteracting(false), 600);
  }, []);

  const switchCategory = useCallback((cat: ExperienceCategory) => {
    setActiveCategory(cat);
    setSelected(null);
    setMapCenter(DEFAULT_CENTER);
    clear();
    bottomSheetRef.current?.snapToIndex(0);
  }, [clear]);

  useEffect(() => {
    const shouldShow = query.trim().length > 0;
    setShowDropdown(shouldShow);
    Animated.spring(dropdownAnim, {
      toValue: shouldShow ? 1 : 0,
      useNativeDriver: true, tension: 120, friction: 14,
    }).start();
  }, [query]);

  const focusExperience = useCallback((exp: Experience) => {
    setSelected(exp);
    if (exp.latitude !== undefined && exp.longitude !== undefined) {
      setMapCenter({ lat: exp.latitude, lng: exp.longitude, zoom: 15 });
    }
    // Expand sheet to mid if currently peeking
    bottomSheetRef.current?.snapToIndex(1);
    // Scroll list to card
    setTimeout(() => {
      const yOffset = cardRefs.current[exp.id];
      if (yOffset !== undefined && sheetListRef.current) {
        sheetListRef.current.scrollTo({ y: yOffset, animated: true });
      }
    }, 320);
  }, []);

  const handleSelectFromSearch = (exp: Experience) => {
    Keyboard.dismiss();
    setShowDropdown(false);
    setQuery('');
    router.push(`/club/${exp.id}`);
  };

  const goToDetails = (exp: Experience) => {
    setSelected(null);
    router.push(`/club/${exp.id}`);
  };

  const resetMap = () => {
    setSelected(null);
    setMapCenter(DEFAULT_CENTER);
  };

  // Header label: "18 מועדונים קרובים"
  const countLabel = useMemo(() => {
    const n = visibleExperiences.length;
    const cat = CATEGORY_LABELS[activeCategory];
    return `${n} ${cat} באזור`;
  }, [visibleExperiences.length, activeCategory]);

  return (
    <View style={styles.container}>
      {/* ── Map fills full screen ── */}
      <ClubMap
        experiences={categoryData}
        center={mapCenter}
        selectedId={selected?.id}
        onSelect={focusExperience}
        onRecenter={resetMap}
        onBoundsChange={handleBoundsChange}
      />

      {/* ── Floating overlay: header + categories + search ── */}
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">

      {/* ── Floating header overlay ── */}
      <View style={styles.header} pointerEvents="box-none">
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Outly</Text>
          <Text style={styles.subtitle}>גלה את הלילה</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="options-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Category pills ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map(cat => {
          const isActive = cat === activeCategory;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => switchCategory(cat)}
              activeOpacity={0.75}
              style={[styles.categoryPill, isActive && styles.categoryPillActive]}
            >
              <Ionicons
                name={CATEGORY_ICONS[cat] as any}
                size={13}
                color={isActive ? '#fff' : '#6b7280'}
              />
              <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>
                {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Search bar ── */}
      <View style={styles.searchWrapper} pointerEvents="box-none">
        <ClubSearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => { clear(); setShowDropdown(false); }}
          inputRef={searchInputRef}
        />
        {showDropdown && (
          <Animated.View
            style={[
              styles.dropdown,
              {
                opacity: dropdownAnim,
                transform: [{ translateY: dropdownAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }],
              },
            ]}
          >
            {searchFiltered.length === 0 ? (
              <View style={styles.dropdownEmpty}>
                <Ionicons name="search-outline" size={22} color="#4b5563" />
                <Text style={styles.dropdownEmptyText}>לא נמצאו תוצאות</Text>
              </View>
            ) : (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 260 }}
              >
                {searchFiltered.map((exp, index) => (
                  <TouchableOpacity
                    key={exp.id}
                    style={[styles.dropdownRow, index < searchFiltered.length - 1 && styles.dropdownRowBorder]}
                    onPress={() => handleSelectFromSearch(exp)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.dropdownDot, { backgroundColor: exp.color }]} />
                    <View style={styles.dropdownRowInfo}>
                      <Text style={styles.dropdownRowName} numberOfLines={1}>{exp.name}</Text>
                      <Text style={styles.dropdownRowCity}>{exp.city}</Text>
                    </View>
                    {exp.rating !== undefined && (
                      <Text style={[styles.dropdownRowRating, { color: exp.color }]}>★ {exp.rating}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </Animated.View>
        )}
      </View>

      </SafeAreaView>

      {/* ── Bottom Sheet ── */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        animationConfigs={animationConfigs}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.sheetHandle}
        handleStyle={styles.sheetHandleArea as any}
        enableOverDrag={false}
        enablePanDownToClose={false}
        enableHandlePanningGesture={!mapInteracting}
        enableContentPanningGesture={!mapInteracting}
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustResize"
      >
        {/* Sheet header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{countLabel}</Text>
          {selected && (
            <TouchableOpacity onPress={() => setSelected(null)} style={styles.sheetClearBtn} activeOpacity={0.7}>
              <Text style={styles.sheetClearText}>נקה</Text>
            </TouchableOpacity>
          )}
        </View>

        <BottomSheetScrollView
          ref={sheetListRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetList}
        >
          {visibleExperiences.map((exp, index) => (
            <CompactCard
              key={exp.id}
              exp={exp}
              index={index}
              total={visibleExperiences.length}
              isSelected={selected?.id === exp.id}
              onLayout={(y: number) => { cardRefs.current[exp.id] = y; }}
              onPress={() => { focusExperience(exp); goToDetails(exp); }}
            />
          ))}
          {visibleExperiences.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="map-outline" size={28} color="#2A2A3C" />
              <Text style={styles.emptyText}>אין תוצאות באזור זה</Text>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>

      <ClubDetailModal club={selected} onClose={() => setSelected(null)} onViewDetails={goToDetails} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },

  // Floating overlay on top of map
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0,
    zIndex: 10,
  },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10,
  },
  headerLeft: {},
  title:    { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: '#161622',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2A2A3C',
  },

  // Categories
  categoryScroll:  { flexGrow: 0, marginBottom: 4 },
  categoryContent: { paddingHorizontal: 16, gap: 7, paddingBottom: 6 },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#161622', borderWidth: 1, borderColor: '#2A2A3C',
  },
  categoryPillActive: { backgroundColor: '#7B61FF', borderColor: '#7B61FF' },
  categoryLabel:       { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  categoryLabelActive: { color: '#fff' },

  // Search
  searchWrapper: { paddingHorizontal: 16, paddingBottom: 8, zIndex: 100, pointerEvents: 'box-none' as any },
  dropdown: {
    position: 'absolute', top: 54, left: 0, right: 0,
    backgroundColor: '#161622', borderRadius: 16,
    borderWidth: 1.5, borderColor: '#2A2A3C', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 20, zIndex: 200,
  },
  dropdownRow:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  dropdownRowBorder: { borderBottomWidth: 1, borderBottomColor: '#1f1f30' },
  dropdownDot:       { width: 9, height: 9, borderRadius: 5, flexShrink: 0 },
  dropdownRowInfo:   { flex: 1 },
  dropdownRowName:   { fontSize: 14, fontWeight: '700', color: '#fff' },
  dropdownRowCity:   { fontSize: 12, color: '#6b7280', marginTop: 2 },
  dropdownRowRating: { fontSize: 12, fontWeight: '700', flexShrink: 0 },
  dropdownEmpty:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 24 },
  dropdownEmptyText: { fontSize: 14, color: '#4b5563', fontWeight: '600' },

  // Bottom Sheet
  sheetBg: {
    backgroundColor: '#13131f',
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 20,
  },
  sheetHandleArea: { paddingTop: 10, paddingBottom: 2 },
  sheetHandle:     { backgroundColor: '#2A2A3C', width: 36, height: 4, borderRadius: 2 },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 4, paddingBottom: 8,
  },
  sheetTitle:     { fontSize: 13, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.1 },
  sheetClearBtn:  { paddingHorizontal: 10, paddingVertical: 4 },
  sheetClearText: { fontSize: 12, color: '#7B61FF', fontWeight: '600' },
  sheetList:      { paddingBottom: 40 },

  // Compact card
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 11,
    paddingHorizontal: 16, paddingVertical: 10,
    position: 'relative', overflow: 'hidden',
  },
  cardBorder:   { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#1f1f2e' },
  cardSelected: { backgroundColor: '#1a1a2e' },
  selectedBar: {
    position: 'absolute', left: 0, top: 8, bottom: 8,
    width: 3, borderRadius: 2,
  },

  // Avatar — 36px (was 42)
  avatar: {
    width: 36, height: 36, borderRadius: 11,
    borderWidth: 1.5, overflow: 'hidden', flexShrink: 0,
  },
  avatarImg:      { width: '100%', height: '100%' },
  avatarFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontSize: 12, fontWeight: '800' },

  // Card text
  cardInfo:      { flex: 1, gap: 2 },
  cardName:      { fontSize: 13, fontWeight: '700', color: '#f3f4f6', letterSpacing: -0.1 },
  cardMeta:      { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardCity:      { fontSize: 11, color: '#6b7280', fontWeight: '500' },
  cardCityApprox:{ color: '#f59e0b' },

  // Card right
  cardRight:  { alignItems: 'flex-end', gap: 2 },
  ratingRow:  { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingStar: { fontSize: 10 },
  ratingVal:  { fontSize: 11, fontWeight: '700', color: '#f3f4f6' },
  price:      { fontSize: 10, color: '#6b7280', fontWeight: '500' },

  // Empty
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 10 },
  emptyText:  { fontSize: 13, color: '#374151', fontWeight: '600' },
});
