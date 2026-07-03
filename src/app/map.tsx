import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../components/GradientButton';

const clubs = [
  {
    id: 1,
    name: 'The Block',
    city: 'תל אביב',
    address: 'רחוב האלוף דוד 157, תל אביב',
    latitude: 32.0538,
    longitude: 34.7620,
    music: ['טכנו', 'האוס'],
    minAge: 21,
    entryPrice: '₪60-120',
    capacity: 800,
    rating: 4.7,
    openDays: 'ה׳-ש׳',
    hours: '23:00 - 06:00',
    image: '🎵',
    color: '#7c3aed',
    tags: ['LGBTQ+ Friendly', 'DJ בינלאומי', 'תאורה מתקדמת'],
  },
  {
    id: 2,
    name: 'Haoman 17',
    city: 'ירושלים',
    address: 'רחוב האומן 17, ירושלים',
    latitude: 31.7857,
    longitude: 35.2007,
    music: ['טכנו', 'פסיכדלי', 'ד"ב'],
    minAge: 18,
    entryPrice: '₪80-150',
    capacity: 3000,
    rating: 4.5,
    openDays: 'ש׳',
    hours: '23:30 - 07:00',
    image: '🔊',
    color: '#dc2626',
    tags: ['הגדול בישראל', 'DJ עולמי', 'גן חיצוני'],
  },
  {
    id: 3,
    name: 'Alphabet',
    city: 'תל אביב',
    address: 'רחוב ליליענבלום 40, תל אביב',
    latitude: 32.0637,
    longitude: 34.7710,
    music: ['האוס', 'דיסקו', 'פופ'],
    minAge: 23,
    entryPrice: '₪50-100',
    capacity: 400,
    rating: 4.3,
    openDays: 'ד׳-ש׳',
    hours: '22:00 - 05:00',
    image: '🍸',
    color: '#f59e0b',
    tags: ['בר + קלאב', 'קוקטיילים', 'וי"פ'],
  },
  {
    id: 4,
    name: 'Gärten',
    city: 'תל אביב',
    address: 'שדרות רוטשילד 43, תל אביב',
    latitude: 32.0634,
    longitude: 34.7742,
    music: ['טכנו', 'מינימל'],
    minAge: 21,
    entryPrice: '₪60-90',
    capacity: 250,
    rating: 4.6,
    openDays: 'ה׳-ש׳',
    hours: '23:00 - 06:00',
    image: '🌿',
    color: '#059669',
    tags: ['גן פתוח', 'אווירה ברלינית', 'בר'],
  },
  {
    id: 5,
    name: 'Club One',
    city: 'חיפה',
    address: 'שדרות בן גוריון 1, חיפה',
    latitude: 32.8156,
    longitude: 34.9895,
    music: ['R&B', 'היפ הופ', 'פופ'],
    minAge: 18,
    entryPrice: '₪40-80',
    capacity: 600,
    rating: 4.1,
    openDays: 'ה׳-ש׳',
    hours: '22:30 - 05:00',
    image: '🎤',
    color: '#0ea5e9',
    tags: ['R&B Night', 'VIP Lounge', 'פלור גדול'],
  },
  {
    id: 6,
    name: 'Nana',
    city: 'תל אביב',
    address: 'רחוב הרברט סמואל 1, תל אביב',
    latitude: 32.0604,
    longitude: 34.7649,
    music: ['קומרשיאל', 'פופ', 'לטינו'],
    minAge: 21,
    entryPrice: '₪60-120',
    capacity: 500,
    rating: 4.0,
    openDays: 'ד׳-ש׳',
    hours: '22:00 - 05:00',
    image: '🌊',
    color: '#f97316',
    tags: ['נוף לים', 'טרסה', 'DJ מקומי'],
  },
  {
    id: 7,
    name: 'Roxanne',
    city: 'באר שבע',
    address: 'רחוב הנשיא 12, באר שבע',
    latitude: 31.2518,
    longitude: 34.7913,
    music: ['פופ', 'רוק', 'אלקטרו'],
    minAge: 18,
    entryPrice: '₪30-60',
    capacity: 350,
    rating: 3.9,
    openDays: 'ה׳-ש׳',
    hours: '21:00 - 04:00',
    image: '🎸',
    color: '#ec4899',
    tags: ['דרום ישראל', 'סטודנטים', 'אווירה כיפית'],
  },
  {
    id: 8,
    name: 'Comfort 13',
    city: 'תל אביב',
    address: 'רחוב ויצמן 13, תל אביב',
    latitude: 32.0847,
    longitude: 34.7853,
    music: ['אינדי', 'אלטרנטיב', 'רוק'],
    minAge: 18,
    entryPrice: '₪40-70',
    capacity: 300,
    rating: 4.4,
    openDays: 'ג׳-ש׳',
    hours: '20:00 - 03:00',
    image: '🎶',
    color: '#6366f1',
    tags: ['הופעות חיות', 'בר', 'אווירה אינדי'],
  },
];

type Club = typeof clubs[0];

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
      <View style={[styles.venueIconWrap, { backgroundColor: club.color + '20', borderColor: club.color + '50' }]}>
        <Text style={styles.venueIcon}>{club.image}</Text>
      </View>
      <View style={styles.venueInfo}>
        <Text style={styles.venueName} numberOfLines={1}>{club.name}</Text>
        <Text style={styles.venueCity}>{club.city}</Text>
        <View style={styles.venueMeta}>
          <Text style={[styles.venueRating, { color: club.color }]}>★ {club.rating}</Text>
          <Text style={styles.venueDot}>•</Text>
          <Text style={styles.venuePrice}>{club.entryPrice}</Text>
        </View>
      </View>
      <Ionicons name="chevron-back" size={18} color="#6b7280" style={styles.venueArrow} />
    </TouchableOpacity>
  );
}

export default function MapScreen() {
  const webViewRef = useRef<any>(null);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 32.0, lng: 34.85, zoom: 8 });
  const [filterCity, setFilterCity] = useState<string | null>(null);

  const cities = [...new Set(clubs.map(c => c.city))];
  const filtered = filterCity ? clubs.filter(c => c.city === filterCity) : clubs;

  const buildMapHtml = (clubList: Club[], centerLat: number, centerLng: number, zoom: number) => {
    const markersJs = clubList.map(c => `
      var icon${c.id} = L.divIcon({
        html: \`<div onclick="window.parent.postMessage('${c.id}','*')" style="
          display:flex;flex-direction:column;align-items:center;cursor:pointer;
          filter: drop-shadow(0 6px 16px rgba(0,0,0,0.55));
        ">
          <div style="
            background:rgba(16,16,28,0.92);
            border:1.5px solid ${c.color}60;
            border-radius:18px;
            padding:7px 13px;
            margin-bottom:3px;
            display:flex;align-items:center;gap:7px;
            white-space:nowrap;
            backdrop-filter:blur(8px);
          ">
            <span style="font-size:18px">${c.image}</span>
            <span style="color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.2px;">${c.name}</span>
          </div>
          <div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:9px solid rgba(16,16,28,0.92);"></div>
          <div style="width:8px;height:8px;border-radius:50%;background:${c.color};box-shadow:0 0 12px ${c.color};margin-top:1px;"></div>
        </div>\`,
        className: '',
        iconSize: [100, 80],
        iconAnchor: [50, 80]
      });
      L.marker([${c.latitude}, ${c.longitude}], { icon: icon${c.id} }).addTo(map)
        .on('click', function() {
          var msg = JSON.stringify({clubId: ${c.id}});
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(msg);
          } else if (window.parent) {
            window.parent.postMessage(msg, '*');
          }
        });
    `).join('');

    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  body { margin:0; padding:0; background:#0B0B14; }
  #map { width:100vw; height:100vh; }
  .leaflet-tile-pane { filter: contrast(1.05) saturate(1.05) brightness(0.95); }
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
  ${markersJs}
</script>
</body>
</html>`;
  };

  const focusClub = (club: Club) => {
    setSelectedClub(club);
    setMapCenter({ lat: club.latitude, lng: club.longitude, zoom: 15 });
  };

  const handleMapMessage = (e: { data?: string }) => {
    try {
      const data = JSON.parse(e.data || '{}');
      if (data.clubId) {
        const club = clubs.find(c => c.id === data.clubId);
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterBarContent}>
        <FilterChip label="הכל" active={!filterCity} onPress={resetMap} />
        {cities.map(city => (
          <FilterChip key={city} label={city} active={filterCity === city} onPress={() => setFilterCity(city)} />
        ))}
      </ScrollView>

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContent}>
          {filtered.map(club => (
            <VenueCard key={club.id} club={club} selected={selectedClub?.id === club.id} onPress={() => focusClub(club)} />
          ))}
        </ScrollView>
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
                    <View style={[styles.modalEmojiWrap, { backgroundColor: selectedClub.color + '20', borderColor: selectedClub.color + '50' }]}>
                      <Text style={styles.modalEmoji}>{selectedClub.image}</Text>
                    </View>
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
  venueIconWrap: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  venueIcon: { fontSize: 26 },
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
  modalEmojiWrap: {
    width: 56, height: 56, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  modalEmoji: { fontSize: 32 },
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
