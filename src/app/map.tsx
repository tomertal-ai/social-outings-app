import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Animated, Keyboard, StyleSheet, Image, Platform, Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
// Rich card — cover gradient, prominent title, genre chips
// ---------------------------------------------------------------------------
interface CardProps {
  exp: Experience;
  index: number;
  total: number;
  isSelected: boolean;
  onLayout: (y: number) => void;
  onPress: () => void;
}

function RichCard({ exp, index, total, isSelected, onLayout, onPress }: CardProps) {
  const { scale, onPressIn, onPressOut } = useCardPressAnim();
  const logo = getExperienceLogo(exp);
  const isApprox = exp.locationStatus && exp.locationStatus !== 'fixed';
  const cityLabel = exp.approximateArea?.regionName ?? exp.city;

  // Simple status badge — rotate through Open/Trending/Popular based on rating
  const statusBadge = exp.rating !== undefined && exp.rating >= 4.6
    ? { label: 'Trending 🔥', bg: '#2d1a00', border: '#f59e0b50', text: '#f59e0b' }
    : exp.rating !== undefined && exp.rating >= 4.3
    ? { label: 'Popular ⭐', bg: '#1a1a2e', border: '#7B61FF50', text: '#a78bfa' }
    : { label: 'Open Tonight', bg: '#0d1f0d', border: '#22c55e50', text: '#4ade80' };

  return (
    <Animated.View
      style={[styles.richCardWrap, { transform: [{ scale }] }, index < total - 1 && styles.richCardGap]}
      onLayout={e => onLayout(e.nativeEvent.layout.y)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={[styles.richCard, isSelected && { borderColor: exp.color + '90', borderWidth: 1.5 }]}
      >
        {/* ── Cover ── */}
        <View style={[styles.richCover, { backgroundColor: exp.color + '20' }]}>
          {/* Background blobs */}
          <View style={[styles.richCoverAccent,  { backgroundColor: exp.color + '35' }]} />
          <View style={[styles.richCoverAccent2, { backgroundColor: exp.color + '18' }]} />
          <View style={[styles.richCoverAccent3, { backgroundColor: exp.color + '12' }]} />

          {/* Logo centered — large, prominent */}
          <View style={[styles.richCoverAvatar, { borderColor: exp.color + '70', backgroundColor: exp.color + '30' }]}>
            {logo ? (
              <Image source={logo} style={styles.richCoverAvatarImg} />
            ) : (
              <Text style={[styles.richCoverInitials, { color: exp.color }]}>
                {getExperienceInitials(exp)}
              </Text>
            )}
          </View>

          {/* Status badge — top-left */}
          <View style={[styles.richStatusBadge, { backgroundColor: statusBadge.bg, borderColor: statusBadge.border }]}>
            <Text style={[styles.richStatusText, { color: statusBadge.text }]}>{statusBadge.label}</Text>
          </View>

          {/* Approx badge — top-right */}
          {isApprox && (
            <View style={styles.richApproxBadge}>
              <Ionicons name="warning-outline" size={9} color="#f59e0b" />
              <Text style={styles.richApproxText}>משוער</Text>
            </View>
          )}

          {/* Selected top bar */}
          {isSelected && <View style={[styles.richSelectedBar, { backgroundColor: exp.color }]} />}
        </View>

        {/* ── Body ── */}
        <View style={styles.richBody}>

          {/* Name + arrow */}
          <View style={styles.richNameRow}>
            <Text style={styles.richName} numberOfLines={1}>{exp.name}</Text>
            <Ionicons name="chevron-forward" size={16} color="#3A3A4C" />
          </View>

          {/* City */}
          <View style={styles.richCityRow}>
            <Ionicons
              name={isApprox ? 'location-outline' : 'location-sharp'}
              size={11}
              color={isApprox ? '#f59e0b' : '#6b7280'}
            />
            <Text style={[styles.richCity, isApprox && styles.richCityApprox]} numberOfLines={1}>
              {cityLabel}
            </Text>
          </View>

          {/* Rating + Price */}
          <View style={styles.richMetaRow}>
            {exp.rating !== undefined && (
              <View style={styles.richRatingPill}>
                <Text style={[styles.richRatingStar, { color: exp.color }]}>★</Text>
                <Text style={styles.richRatingVal}>{exp.rating}</Text>
              </View>
            )}
            {!!exp.entryPrice && (
              <View style={styles.richPricePill}>
                <Text style={styles.richPriceText}>{exp.entryPrice}</Text>
              </View>
            )}
            {!!exp.hours && (
              <View style={styles.richHoursPill}>
                <Ionicons name="time-outline" size={10} color="#6b7280" />
                <Text style={styles.richHoursText}>{exp.hours}</Text>
              </View>
            )}
          </View>

          {/* Genre chips — wrapping */}
          {exp.musicGenres && exp.musicGenres.length > 0 && (
            <View style={styles.richGenreWrap}>
              {exp.musicGenres.slice(0, 5).map(g => (
                <View key={g} style={[styles.richGenreChip, { borderColor: exp.color + '40' }]}>
                  <Text style={[styles.richGenreText, { color: exp.color }]}>{g}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
const TAB_BAR_HEIGHT = 60; // approximate tab bar height

export default function MapScreen() {
  const router = useRouter();
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
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
  // Available map zone = between bottom of overlay and top of tab bar
  // overlayH: topInset + title(52) + search(44) + chips(38) + spacing(10)
  const overlayH = Math.max(topInset, 8) + 52 + 44 + 38 + 10;
  const availableH = SCREEN_H - overlayH - TAB_BAR_HEIGHT - bottomInset;
  // snapFull = sheet fills the available zone exactly (stops right below chips)
  const snapFull   = availableH - 4;
  const snapPoints = useMemo(
    () => [SNAP_PEEK, Math.round(snapFull * 0.48), snapFull],
    [snapFull]
  );

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

  const sheetMarginBottom = TAB_BAR_HEIGHT + bottomInset;

  return (
    <View style={styles.container}>
      {/* ── Map fills full screen absolutely ── */}
      <View style={StyleSheet.absoluteFill}>
        <ClubMap
          experiences={categoryData}
          center={mapCenter}
          selectedId={selected?.id}
          onSelect={focusExperience}
          onRecenter={resetMap}
          onBoundsChange={handleBoundsChange}
        />
      </View>

      {/* ── Floating overlay: header + categories + search ── */}
      <View
        style={[styles.overlay, { paddingTop: Math.max(topInset - 4, 8) }]}
        pointerEvents="box-none"
      >

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

      </View>

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
        style={{ marginBottom: sheetMarginBottom }}
        topInset={overlayH}
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
            <RichCard
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
    paddingHorizontal: 20, paddingTop: 4, paddingBottom: 2,
  },
  headerLeft: {},
  title:    { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5, lineHeight: 26 },
  subtitle: { fontSize: 11, color: '#6b7280', marginTop: 0, lineHeight: 14 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: '#161622',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2A2A3C',
  },

  // Categories
  categoryScroll:  { flexGrow: 0, marginBottom: 0 },
  categoryContent: { paddingHorizontal: 16, gap: 7, paddingBottom: 2 },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#161622', borderWidth: 1, borderColor: '#2A2A3C',
  },
  categoryPillActive: { backgroundColor: '#7B61FF', borderColor: '#7B61FF' },
  categoryLabel:       { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  categoryLabelActive: { color: '#fff' },

  // Search
  searchWrapper: { paddingHorizontal: 16, paddingBottom: 2, zIndex: 100, pointerEvents: 'box-none' as any },
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

  // Rich card wrapper
  richCardWrap: { paddingHorizontal: 12 },
  richCardGap:  { marginBottom: 10 },
  richCard: {
    borderRadius: 18, overflow: 'hidden',
    backgroundColor: '#161622',
    borderWidth: 1, borderColor: '#1f1f30',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },

  // Cover
  richCover: {
    height: 96, width: '100%',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  richCoverAccent: {
    position: 'absolute', top: -30, left: -40,
    width: 180, height: 180, borderRadius: 90,
  },
  richCoverAccent2: {
    position: 'absolute', bottom: -40, right: -20,
    width: 140, height: 140, borderRadius: 70,
  },
  richCoverAccent3: {
    position: 'absolute', top: 10, right: 60,
    width: 80, height: 80, borderRadius: 40,
  },
  richCoverAvatar: {
    width: 58, height: 58, borderRadius: 18,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  richCoverAvatarImg:   { width: '100%', height: '100%' },
  richCoverInitials:    { fontSize: 20, fontWeight: '800' },
  richStatusBadge: {
    position: 'absolute', top: 8, left: 8,
    borderRadius: 8, borderWidth: 1,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  richStatusText: { fontSize: 10, fontWeight: '700' },
  richApproxBadge: {
    position: 'absolute', top: 8, right: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#1a1200', borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 3,
    borderWidth: 1, borderColor: '#f59e0b40',
  },
  richApproxText:   { fontSize: 10, color: '#f59e0b', fontWeight: '700' },
  richSelectedBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 3,
  },

  // Body
  richBody:    { paddingHorizontal: 14, paddingTop: 11, paddingBottom: 13, gap: 7 },
  richNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  richName:    { fontSize: 16, fontWeight: '800', color: '#f9fafb', letterSpacing: -0.3, flex: 1 },
  richCityRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  richCity:      { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  richCityApprox:{ color: '#f59e0b' },

  richMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' as any },
  richRatingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#1f1f2e', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  richRatingStar: { fontSize: 11 },
  richRatingVal:  { fontSize: 12, fontWeight: '700', color: '#f3f4f6' },
  richPricePill: {
    backgroundColor: '#1f1f2e', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  richPriceText: { fontSize: 12, color: '#9ca3af', fontWeight: '600' },
  richHoursPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#1f1f2e', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  richHoursText: { fontSize: 11, color: '#6b7280', fontWeight: '500' },

  // Genre chips — wrapping
  richGenreScroll:  { marginTop: 0 },
  richGenreContent: { gap: 6 },
  richGenreWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  richGenreChip: {
    borderRadius: 20, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  richGenreText: { fontSize: 11, fontWeight: '600' },

  // Empty
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 10 },
  emptyText:  { fontSize: 13, color: '#374151', fontWeight: '600' },
});
