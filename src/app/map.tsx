import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal, Animated, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../components/GradientButton';
import { venues, Venue, getVenueLogo, getVenueInitials } from '../data/venues';
import { useVenueSearch } from '../hooks/useVenueSearch';

type Club = Venue;

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  if (active) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={['#2CB7FF', '#7B61FF', '#D946EF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.filterChipGradient}
        >
          <Text style={styles.filterChipTextActive}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={styles.filterChip} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.filterChipText}>{label}</Text>
    </TouchableOpacity>
  );
}

function SearchBar({ value, onChangeText, onClear, inputRef }: { value: string; onChangeText: (text: string) => void; onClear: () => void; inputRef?: React.RefObject<TextInput | null> }) {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search" size={18} color={value.length > 0 ? '#7B61FF' : '#9ca3af'} style={styles.searchIcon} />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder="חפש מועדון..."
        placeholderTextColor="#4b5563"
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={Keyboard.dismiss}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.searchClear} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={20} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );
}

function VenueAvatar({ venue, size }: { venue: Club; size: number }) {
  const logo = getVenueLogo(venue);
  if (logo) {
    return (
      <View style={[styles.avatarWrap, { width: size, height: size, borderRadius: size / 2, backgroundColor: venue.color + '20', borderColor: venue.color + '50' }]}>
        <Image source={logo} style={{ width: size, height: size, borderRadius: size / 2 }} resizeMode="cover" />
      </View>
    );
  }
  return (
    <View style={[styles.avatarWrap, { width: size, height: size, borderRadius: size / 2, backgroundColor: venue.color, borderColor: venue.color + '80' }]}>
      <Text style={[styles.avatarInitials, { fontSize: size * 0.4, color: '#fff' }]}>{getVenueInitials(venue)}</Text>
    </View>
  );
}

function VenueCard({ club, selected, onPress }: { club: Club; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[
        styles.venueCard,
        selected && { borderColor: club.color, backgroundColor: club.color + '12' },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <VenueAvatar venue={club} size={52} />
      <View style={styles.venueInfo}>
        <Text style={styles.venueName} numberOfLines={1}>{club.name}</Text>
        <Text style={styles.venueCity}>{club.city}</Text>
        <View style={styles.venueMeta}>
          <Text style={[styles.venueRating, { color: club.color }]}>★ {club.rating}</Text>
          <Text style={styles.venueDot}>•</Text>
          <Text style={styles.venuePrice}>{club.priceRange}</Text>
        </View>
      </View>
      <Ionicons name="chevron-back" size={18} color="#6b7280" style={styles.venueArrow} />
    </TouchableOpacity>
  );
}

export default function MapScreen() {
  const webViewRef = useRef<any>(null);
  const searchInputRef = useRef<TextInput>(null);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 32.0, lng: 34.85, zoom: 8 });
  const [filterCity, setFilterCity] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const { query, setQuery, clear, filtered: searchFiltered } = useVenueSearch(venues);

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

  const cities = [...new Set(venues.map(c => c.city))];
  const filtered = filterCity
    ? searchFiltered.filter(c => c.city === filterCity)
    : searchFiltered;

  const buildMapHtml = (clubList: Club[], centerLat: number, centerLng: number, zoom: number, selectedClubId?: number) => {
    const getLogoUri = (venue: Club) => {
      const logo = getVenueLogo(venue);
      if (!logo) return '';
      if (Platform.OS === 'web') return '';
      try {
        return Image.resolveAssetSource(logo).uri || '';
      } catch {
        return '';
      }
    };

    const markersJs = clubList.map(c => {
      const logoUri = getLogoUri(c);
      const avatar = logoUri
        ? `<img class="marker-avatar" src="${logoUri}" alt="${c.name}" />`
        : `<div class="marker-initials" style="background-color:${c.color};">${getVenueInitials(c)}</div>`;
      return `
      var icon${c.id} = L.divIcon({
        html: \`<div class="marker-root" id="marker-${c.id}" onclick="selectMarker(${c.id})">
          <div class="marker-pill" style="border-color: rgba(123,97,255,0.35);">
            ${avatar}
            <div class="marker-name">${c.name}</div>
          </div>
        </div>\`,
        className: '',
        iconSize: [150, 40],
        iconAnchor: [75, 20]
      });
      var marker${c.id} = L.marker([${c.latitude}, ${c.longitude}], { icon: icon${c.id} });
      marker${c.id}.on('click', function(e) { e.originalEvent.stopPropagation(); selectMarker(${c.id}); });
      markers.addLayer(marker${c.id});
    `}).join('');

    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"/>
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
<style>
  body { margin:0; padding:0; background:#0B0B14; }
  #map { width:100vw; height:100vh; }
  .leaflet-tile-pane { filter: contrast(1.05) saturate(1.05) brightness(0.95); }
  .marker-cluster { background: rgba(123,97,255,0.5); border-radius: 50%; }
  .marker-cluster div { background: rgba(16,16,28,0.95); color: #fff; border-radius: 50%; font-weight: 700; border: 1px solid rgba(123,97,255,0.6); }
  .marker-root {
    display: flex; align-items: center; cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .marker-pill {
    display: flex; flex-direction: row; align-items: center;
    height: 38px; max-width: 150px; border-radius: 19px;
    background: rgba(16,16,28,0.95); border: 1.5px solid;
    box-shadow: 0 4px 14px rgba(0,0,0,0.5);
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .marker-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    object-fit: cover;
    margin-left: 4px; flex-shrink: 0;
    background-color: #161622;
  }
  .marker-initials {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-left: 4px; flex-shrink: 0;
    font-size: 12px; font-weight: 800; color: #fff;
  }
  .marker-name {
    font-size: 12px; font-weight: 700; color: #fff;
    padding: 0 12px 0 8px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 110px;
  }
  .marker-root.active .marker-pill {
    transform: scale(1.08);
    border-color: #7B61FF;
    box-shadow: 0 6px 20px rgba(0,0,0,0.6), 0 0 16px rgba(123,97,255,0.5);
  }
  .leaflet-control-attribution { font-size:8px; opacity:0.3; color:#9ca3af; }
  .leaflet-control-attribution a { color:#9ca3af; }
  .leaflet-control-zoom { border:none !important; box-shadow:0 4px 16px rgba(0,0,0,0.4) !important; border-radius:12px !important; overflow:hidden; }
  .leaflet-control-zoom a { color:#fff !important; background:rgba(16,16,28,0.9) !important; font-weight:bold !important; border-color:rgba(255,255,255,0.08) !important; }
  .leaflet-control-zoom a:hover { background:rgba(42,42,60,0.9) !important; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map').setView([${centerLat}, ${centerLng}], ${zoom});
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri', maxZoom: 18
  }).addTo(map);

  function selectMarker(id) {
    document.querySelectorAll('.marker-root').forEach(function(el) { el.classList.remove('active'); });
    var el = document.getElementById('marker-' + id);
    if (el) el.classList.add('active');
    var msg = JSON.stringify({clubId: id});
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(msg);
    } else if (window.parent) {
      window.parent.postMessage(msg, '*');
    }
  }

  function highlightMarker(id) {
    document.querySelectorAll('.marker-root').forEach(function(el) { el.classList.remove('active'); });
    var el = document.getElementById('marker-' + id);
    if (el) el.classList.add('active');
  }

  var markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
    maxClusterRadius: 50,
    disableClusteringAtZoom: 17
  });

  map.on('click', function(e) {
    if (!e.originalEvent || !e.originalEvent.target.closest('.marker-root')) {
      document.querySelectorAll('.marker-root').forEach(function(el) { el.classList.remove('active'); });
    }
  });

  ${markersJs}
  map.addLayer(markers);
  ${selectedClubId ? `highlightMarker(${selectedClubId});` : ''}
</script>
</body>
</html>`;
  };

  const focusClub = (club: Club) => {
    setSelectedClub(club);
    setMapCenter({ lat: club.latitude, lng: club.longitude, zoom: 15 });
  };

  const handleSelectFromSearch = (club: Club) => {
    Keyboard.dismiss();
    setShowDropdown(false);
    setQuery('');
    setFilterCity(null);
    focusClub(club);
  };

  const handleMapMessage = (e: { data?: string }) => {
    try {
      const data = JSON.parse(e.data || '{}');
      if (data.clubId) {
        const club = venues.find(c => c.id === data.clubId);
        if (club) focusClub(club);
      }
    } catch {}
  };

  const stars = (r: number) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

  const resetMap = () => {
    setFilterCity(null);
    setSelectedClub(null);
    setMapCenter({ lat: 32.0, lng: 34.85, zoom: 8 });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>מועדונים בישראל</Text>
          <Text style={styles.subtitle}>{filtered.length} מקומות בילוי</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="options-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <SearchBar
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
                    style={[
                      styles.dropdownRow,
                      index < searchFiltered.length - 1 && styles.dropdownRowBorder,
                    ]}
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

      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            ref={webViewRef}
            style={{ border: 'none', width: '100%', height: '100%' } as any}
            srcDoc={buildMapHtml(filtered, mapCenter.lat, mapCenter.lng, mapCenter.zoom)}
            title="clubs-map"
            onLoad={() => {
              if (webViewRef.current) {
                webViewRef.current.contentWindow?.addEventListener('message', handleMapMessage);
              }
            }}
          />
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ html: buildMapHtml(filtered, mapCenter.lat, mapCenter.lng, mapCenter.zoom), baseUrl: 'https://unpkg.com' }}
            style={{ flex: 1 }}
            onMessage={(e) => handleMapMessage(e.nativeEvent)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            mixedContentMode="always"
          />
        )}
        <TouchableOpacity style={styles.recenterBtn} onPress={resetMap} activeOpacity={0.7}>
          <Ionicons name="locate" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPanel}>
        <View style={styles.bottomHandle} />
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={28} color="#4b5563" />
            <Text style={styles.emptyStateText}>לא נמצאו מועדונים</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContent}>
            {filtered.map(club => (
              <VenueCard key={club.id} club={club} selected={selectedClub?.id === club.id} onPress={() => focusClub(club)} />
            ))}
          </ScrollView>
        )}
      </View>

      {selectedClub && (
        <Modal transparent animationType="slide" visible={!!selectedClub} onRequestClose={() => setSelectedClub(null)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedClub(null)}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />

              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setSelectedClub(null)} style={styles.closeBtn}>
                    <Ionicons name="close" size={22} color="#9ca3af" />
                  </TouchableOpacity>

                  <View style={styles.modalTitleRow}>
                    <View>
                      <Text style={styles.modalName}>{selectedClub.name}</Text>
                      <View style={styles.modalLocationRow}>
                        <Ionicons name="location-sharp" size={14} color={selectedClub.color} />
                        <Text style={styles.modalCity}>{selectedClub.city}</Text>
                      </View>
                    </View>
                    <VenueAvatar venue={selectedClub} size={56} />
                  </View>

                  <View style={styles.ratingRow}>
                    <Text style={[styles.ratingStars, { color: selectedClub.color }]}>{stars(selectedClub.rating)}</Text>
                    <Text style={styles.ratingNum}>{selectedClub.rating}</Text>
                    <Text style={styles.ratingCount}>• {selectedClub.capacity} איש</Text>
                  </View>
                </View>

                <View style={styles.infoGrid}>
                  {[
                    { icon: 'time-outline', label: 'שעות', val: selectedClub.hours },
                    { icon: 'calendar-outline', label: 'ימים', val: selectedClub.openDays },
                    { icon: 'cash-outline', label: 'כניסה', val: selectedClub.entryPrice },
                    { icon: 'person-outline', label: 'גיל מינ׳', val: selectedClub.minAge + '+' },
                    { icon: 'location-outline', label: 'כתובת', val: selectedClub.address },
                    { icon: 'musical-notes-outline', label: 'מוזיקה', val: selectedClub.music.join(', ') },
                  ].map((item, idx) => (
                    <View key={idx} style={styles.infoBox}>
                      <Ionicons name={item.icon as any} size={18} color={selectedClub.color} />
                      <Text style={styles.infoLabel}>{item.label}</Text>
                      <Text style={styles.infoVal}>{item.val}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.musicSection}>
                  <Text style={styles.sectionLabel}>סוגי מוזיקה</Text>
                  <View style={styles.tagsRow}>
                    {selectedClub.music.map(m => (
                      <View key={m} style={[styles.musicTag, { backgroundColor: selectedClub.color + '16', borderColor: selectedClub.color + '40' }]}>
                        <Text style={[styles.musicTagText, { color: selectedClub.color }]}>{m}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.tagsSection}>
                  <Text style={styles.sectionLabel}>מאפיינים</Text>
                  <View style={styles.tagsRow}>
                    {selectedClub.tags.map(t => (
                      <View key={t} style={styles.tag}>
                        <Text style={styles.tagText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <GradientButton onPress={() => {}}>
                  <Ionicons name="navigate" size={18} color="#fff" />
                  <Text style={styles.navBtnText}>נווט למועדון</Text>
                </GradientButton>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
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
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#161622', borderRadius: 16,
    borderWidth: 1.5, borderColor: '#2A2A3C',
    paddingHorizontal: 14, paddingVertical: 11,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '500', padding: 0, textAlign: 'right' },
  searchClear: { padding: 3, marginLeft: 6 },
  dropdown: {
    position: 'absolute', top: 54, left: 0, right: 0,
    backgroundColor: '#161622', borderRadius: 16,
    borderWidth: 1.5, borderColor: '#2A2A3C',
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 20,
    elevation: 20,
    zIndex: 200,
  },
  dropdownRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13,
    gap: 12,
  },
  dropdownRowBorder: { borderBottomWidth: 1, borderBottomColor: '#1f1f30' },
  dropdownDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  dropdownRowInfo: { flex: 1 },
  dropdownRowName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  dropdownRowCity: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  dropdownRowRating: { fontSize: 12, fontWeight: '700', flexShrink: 0 },
  dropdownEmpty: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 24 },
  dropdownEmptyText: { fontSize: 14, color: '#4b5563', fontWeight: '600' },
  emptyState: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 28 },
  emptyStateText: { fontSize: 14, color: '#4b5563', fontWeight: '600' },
  filterBar: { maxHeight: 56, backgroundColor: '#0B0B14' },
  filterBarContent: { paddingHorizontal: 16, paddingVertical: 8, gap: 10, flexDirection: 'row' },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24,
    backgroundColor: '#161622', borderWidth: 1, borderColor: '#2A2A3C',
  },
  filterChipGradient: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  filterChipText: { fontSize: 13, color: '#9ca3af', fontWeight: '600' },
  filterChipTextActive: { fontSize: 13, color: '#fff', fontWeight: '700' },
  mapContainer: { flex: 1, overflow: 'hidden' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fallbackText: { color: '#9ca3af', fontSize: 15 },
  recenterBtn: {
    position: 'absolute', right: 16, bottom: 16,
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#161622', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2A2A3C',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10,
    elevation: 8,
  },
  bottomPanel: {
    backgroundColor: '#0B0B14',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, paddingBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.5, shadowRadius: 20,
    elevation: 16,
  },
  bottomHandle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: '#2A2A3C',
    alignSelf: 'center', marginBottom: 12,
  },
  cardsContent: { paddingHorizontal: 16, gap: 10, flexDirection: 'row' },
  venueCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    width: 260, backgroundColor: '#161622', borderRadius: 20,
    padding: 12, borderWidth: 1.5, borderColor: 'transparent',
  },
  avatarWrap: {
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, overflow: 'hidden',
  },
  avatarInitials: { fontWeight: '800', color: '#fff' },
  venueInfo: { flex: 1, justifyContent: 'center' },
  venueName: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 3 },
  venueCity: { fontSize: 12, color: '#9ca3af', marginBottom: 6 },
  venueMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  venueRating: { fontSize: 12, fontWeight: '700' },
  venueDot: { fontSize: 12, color: '#6b7280' },
  venuePrice: { fontSize: 12, color: '#d1d5db', fontWeight: '600' },
  venueArrow: { marginLeft: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: {
    backgroundColor: '#161622', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: '85%', overflow: 'hidden',
  },
  modalHandle: {
    width: 40, height: 5, borderRadius: 3, backgroundColor: '#2A2A3C',
    alignSelf: 'center', marginTop: 12, marginBottom: 6,
  },
  modalScroll: { paddingHorizontal: 22, paddingBottom: 34 },
  modalHeader: { paddingTop: 6, paddingBottom: 18 },
  closeBtn: {
    alignSelf: 'flex-end', width: 32, height: 32, borderRadius: 10,
    backgroundColor: '#0B0B14', alignItems: 'center', justifyContent: 'center',
  },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  modalName: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  modalLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  modalCity: { fontSize: 14, color: '#9ca3af', fontWeight: '600' },
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
  musicSection: { marginBottom: 18 },
  tagsSection: { marginBottom: 24 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#d1d5db', marginBottom: 10, textAlign: 'right' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  musicTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  musicTagText: { fontSize: 13, fontWeight: '600' },
  tag: { backgroundColor: '#0B0B14', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#2A2A3C' },
  tagText: { fontSize: 12, color: '#d1d5db', fontWeight: '500' },
  navBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
