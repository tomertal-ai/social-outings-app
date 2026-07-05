import { View, Text, TextInput, ScrollView, TouchableOpacity, Animated, Keyboard, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { clubs } from '../data/clubs';
import { Club } from '../types';
import { useClubSearch } from '../hooks/useClubSearch';
import ClubSearchBar from '../components/clubs/ClubSearchBar';
import ClubMap from '../components/clubs/ClubMap';
import ClubDetailModal from '../components/clubs/ClubDetailModal';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const DEFAULT_CENTER = { lat: 32.0, lng: 34.85, zoom: 8 };

export default function MapScreen() {
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const { query, setQuery, clear, filtered: searchFiltered } = useClubSearch(clubs);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['12%', '45%', '88%'], []);

  useEffect(() => {
    const shouldShow = query.trim().length > 0;
    setShowDropdown(shouldShow);
    Animated.spring(dropdownAnim, {
      toValue: shouldShow ? 1 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [query]);

  const focusClub = (club: Club) => {
    setSelectedClub(club);
    setMapCenter({ lat: club.latitude, lng: club.longitude, zoom: 15 });
  };

  const handleSelectFromSearch = (club: Club) => {
    Keyboard.dismiss();
    setShowDropdown(false);
    setQuery('');
    router.push(`/club/${club.id}`);
  };

  const goToDetails = (club: Club) => {
    setSelectedClub(null);
    router.push(`/club/${club.id}`);
  };

  const resetMap = () => {
    setSelectedClub(null);
    setMapCenter(DEFAULT_CENTER);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>מועדונים בישראל</Text>
          <Text style={styles.subtitle}>{clubs.length} מקומות בילוי</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="options-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

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
                <Text style={styles.dropdownEmptyText}>לא נמצאו מועדונים</Text>
              </View>
            ) : (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 260 }}
              >
                {searchFiltered.map((club, index) => (
                  <TouchableOpacity
                    key={club.id}
                    style={[styles.dropdownRow, index < searchFiltered.length - 1 && styles.dropdownRowBorder]}
                    onPress={() => handleSelectFromSearch(club)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.dropdownDot, { backgroundColor: club.color }]} />
                    <View style={styles.dropdownRowInfo}>
                      <Text style={styles.dropdownRowName} numberOfLines={1}>{club.name}</Text>
                      <Text style={styles.dropdownRowCity}>{club.city}</Text>
                    </View>
                    <Text style={[styles.dropdownRowRating, { color: club.color }]}>★ {club.rating}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </Animated.View>
        )}
      </View>

      <ClubMap
        clubs={clubs}
        center={mapCenter}
        selectedClubId={selectedClub?.id}
        onSelectClub={focusClub}
        onRecenter={resetMap}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.sheetHandle}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>מועדונים באזור זה</Text>
        </BottomSheetView>
      </BottomSheet>

      <ClubDetailModal club={selectedClub} onClose={() => setSelectedClub(null)} onViewDetails={goToDetails} />
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
  },
  sheetHandle: {
    backgroundColor: '#3A3A4C', width: 36, height: 4,
  },
  sheetContent: {
    paddingHorizontal: 22, paddingTop: 8,
  },
  sheetTitle: {
    fontSize: 17, fontWeight: '700', color: '#fff', letterSpacing: -0.3,
  },
});
