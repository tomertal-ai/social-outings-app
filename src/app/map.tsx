import { View, Text, TextInput, ScrollView, TouchableOpacity, Animated, Keyboard, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import { Experience, ExperienceCategory, CATEGORY_LABELS, CATEGORY_ICONS, MapBounds } from '../types';
import { experiencesByCategory, getExperienceLogo, getExperienceInitials } from '../data/experiences';
import { useExperienceSearch } from '../hooks/useClubSearch';
import ClubSearchBar from '../components/clubs/ClubSearchBar';
import ClubMap from '../components/clubs/ClubMap';
import ClubDetailModal from '../components/clubs/ClubDetailModal';

const CATEGORIES: ExperienceCategory[] = ['clubs', 'nature_parties', 'festivals', 'concerts'];

const DEFAULT_CENTER = { lat: 32.0, lng: 34.85, zoom: 8 };

function useCardPressAnim() {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 30, bounciness: 4 }).start();
  return { scale, onPressIn, onPressOut };
}

interface CardProps {
  exp: Experience;
  index: number;
  total: number;
  isSelected: boolean;
  onLayout: (y: number) => void;
  onPress: () => void;
}

function AnimatedExperienceCard({ exp, index, total, isSelected, onLayout, onPress }: CardProps) {
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
          styles.clubCard,
          index < total - 1 && styles.clubCardBorder,
          isSelected && styles.clubCardSelected,
        ]}
      >
        {isSelected && <View style={[styles.selectedBar, { backgroundColor: exp.color }]} />}
        <View style={[styles.clubAvatar, { borderColor: exp.color + '55' }]}>
          {logo ? (
            <Image source={logo} style={styles.clubAvatarImg} />
          ) : (
            <View style={[styles.clubAvatarFallback, { backgroundColor: exp.color + '22' }]}>
              <Text style={[styles.clubAvatarInitials, { color: exp.color }]}>
                {getExperienceInitials(exp)}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.clubInfo}>
          <Text style={styles.clubName} numberOfLines={1}>{exp.name}</Text>
          <Text style={styles.clubCity} numberOfLines={1}>{exp.city}</Text>
        </View>
        <View style={styles.clubRight}>
          {exp.rating !== undefined && (
            <View style={styles.clubRatingRow}>
              <Text style={[styles.clubRatingStar, { color: exp.color }]}>★</Text>
              <Text style={styles.clubRatingValue}>{exp.rating}</Text>
            </View>
          )}
          {!!exp.entryPrice && <Text style={styles.clubPrice} numberOfLines={1}>{exp.entryPrice}</Text>}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  const [activeCategory, setActiveCategory] = useState<ExperienceCategory>('clubs');
  const [selected, setSelected] = useState<Experience | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const categoryData = useMemo(() => experiencesByCategory[activeCategory], [activeCategory]);
  const { query, setQuery, clear, filtered: searchFiltered } = useExperienceSearch(categoryData);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const sheetListRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['12%', '45%', '88%'], []);

  const animationConfigs = useBottomSheetSpringConfigs({
    mass: 0.6, stiffness: 280, damping: 28, overshootClamping: false,
  });
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
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
  }, []);

  const switchCategory = useCallback((cat: ExperienceCategory) => {
    setActiveCategory(cat);
    setSelected(null);
    setMapCenter(DEFAULT_CENTER);
    clear();
  }, [clear]);

  useEffect(() => {
    const shouldShow = query.trim().length > 0;
    setShowDropdown(shouldShow);
    Animated.spring(dropdownAnim, {
      toValue: shouldShow ? 1 : 0,
      useNativeDriver: true,
      tension: 120,
      friction: 14,
    }).start();
  }, [query]);

  const focusExperience = useCallback((exp: Experience) => {
    setSelected(exp);
    if (exp.latitude !== undefined && exp.longitude !== undefined) {
      setMapCenter({ lat: exp.latitude, lng: exp.longitude, zoom: 15 });
    }
    bottomSheetRef.current?.snapToIndex(1);
    const yOffset = cardRefs.current[exp.id];
    if (yOffset !== undefined && sheetListRef.current) {
      sheetListRef.current.scrollTo({ y: yOffset, animated: true });
    }
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Outly</Text>
          <Text style={styles.subtitle}>גלה את הלילה</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="options-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Category Selector */}
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
                size={14}
                color={isActive ? '#fff' : '#6b7280'}
              />
              <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>
                {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Search */}
      <View style={styles.searchWrapper}>
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
                    <Text style={[styles.dropdownRowRating, { color: exp.color }]}>★ {exp.rating}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </Animated.View>
        )}
      </View>

      {/* Map */}
      <ClubMap
        experiences={categoryData}
        center={mapCenter}
        selectedId={selected?.id}
        onSelect={focusExperience}
        onRecenter={resetMap}
        onBoundsChange={handleBoundsChange}
      />

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        animationConfigs={animationConfigs}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.sheetHandle}
        handleStyle={styles.sheetHandleArea as any}
        enableOverDrag={true}
        enablePanDownToClose={false}
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustResize"
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>
            {`${CATEGORY_LABELS[activeCategory]} באזור זה (${visibleExperiences.length})`}
          </Text>
        </View>
        <BottomSheetScrollView
          ref={sheetListRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetList}
        >
          {visibleExperiences.map((exp, index) => (
            <AnimatedExperienceCard
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
              <Ionicons name="map-outline" size={32} color="#2A2A3C" />
              <Text style={styles.emptyText}>אין תוצאות באזור זה</Text>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>

      <ClubDetailModal club={selected} onClose={() => setSelected(null)} onViewDetails={goToDetails} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#9ca3af', marginTop: 3 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#161622',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2A2A3C',
  },
  categoryScroll: { flexGrow: 0, marginBottom: 4 },
  categoryContent: { paddingHorizontal: 16, gap: 8, paddingBottom: 6 },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#161622', borderWidth: 1, borderColor: '#2A2A3C',
  },
  categoryPillActive: {
    backgroundColor: '#7B61FF', borderColor: '#7B61FF',
  },
  categoryLabel: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  categoryLabelActive: { color: '#fff' },
  searchWrapper: { paddingHorizontal: 16, paddingBottom: 8, zIndex: 100 },
  dropdown: {
    position: 'absolute', top: 54, left: 0, right: 0,
    backgroundColor: '#161622', borderRadius: 16,
    borderWidth: 1.5, borderColor: '#2A2A3C',
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 20,
    elevation: 20, zIndex: 200,
  },
  dropdownRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, gap: 12 },
  dropdownRowBorder: { borderBottomWidth: 1, borderBottomColor: '#1f1f30' },
  dropdownDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  dropdownRowInfo: { flex: 1 },
  dropdownRowName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  dropdownRowCity: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  dropdownRowRating: { fontSize: 12, fontWeight: '700', flexShrink: 0 },
  dropdownEmpty: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 24 },
  dropdownEmptyText: { fontSize: 14, color: '#4b5563', fontWeight: '600' },
  sheetBg: {
    backgroundColor: '#161622',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 24,
  },
  sheetHandleArea: {
    paddingTop: 10, paddingBottom: 4,
  },
  sheetHandle: {
    backgroundColor: '#3A3A4C', width: 40, height: 5, borderRadius: 3,
  },
  sheetHeader: {
    paddingHorizontal: 20, paddingTop: 6, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: '#1f1f30',
  },
  sheetTitle: {
    fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.2,
  },
  sheetList: {
    paddingBottom: 40,
  },

  clubCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 18, paddingVertical: 13,
    position: 'relative', overflow: 'hidden',
  },
  clubCardBorder: {
    borderBottomWidth: 1, borderBottomColor: '#1f1f30',
  },
  clubCardSelected: {
    backgroundColor: '#1e1e30',
  },
  selectedBar: {
    position: 'absolute', left: 0, top: 10, bottom: 10,
    width: 3, borderRadius: 2,
  },

  clubAvatar: {
    width: 42, height: 42, borderRadius: 13,
    borderWidth: 1.5, overflow: 'hidden', flexShrink: 0,
  },
  clubAvatarImg: {
    width: '100%', height: '100%',
  },
  clubAvatarFallback: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  clubAvatarInitials: {
    fontSize: 14, fontWeight: '800',
  },

  clubInfo: {
    flex: 1, gap: 2,
  },
  clubName: {
    fontSize: 14, fontWeight: '700', color: '#fff', letterSpacing: -0.2,
  },
  clubCity: {
    fontSize: 12, color: '#6b7280', fontWeight: '500',
  },

  clubRight: {
    alignItems: 'flex-end', gap: 3,
  },
  clubRatingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  clubRatingStar: {
    fontSize: 11,
  },
  clubRatingValue: {
    fontSize: 12, fontWeight: '700', color: '#fff',
  },
  clubPrice: {
    fontSize: 11, color: '#6b7280', fontWeight: '600',
  },

  emptyState: {
    alignItems: 'center', justifyContent: 'center',
    paddingTop: 48, gap: 10,
  },
  emptyText: {
    fontSize: 14, color: '#374151', fontWeight: '600',
  },
});
