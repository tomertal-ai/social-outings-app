import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

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
        ">
          <div style="
            background:${c.color};color:white;font-size:11px;font-weight:bold;
            padding:3px 9px;border-radius:12px;margin-bottom:4px;
            box-shadow:0 2px 8px rgba(0,0,0,0.25);white-space:nowrap;
          ">${c.name}</div>
          <div style="
            width:46px;height:46px;border-radius:50%;
            background:white;border:3px solid ${c.color};
            box-shadow:0 3px 10px rgba(0,0,0,0.2);
            display:flex;align-items:center;justify-content:center;
            font-size:22px;
          ">${c.image}</div>
          <div style="width:2px;height:8px;background:${c.color};margin-top:2px;border-radius:2px;"></div>
        </div>\`,
        className: '',
        iconSize: [80, 75],
        iconAnchor: [40, 75]
      });
      L.marker([${c.latitude}, ${c.longitude}], { icon: icon${c.id} }).addTo(map)
        .on('click', function() {
          window.parent && window.parent.postMessage(JSON.stringify({clubId: ${c.id}}), '*');
        });
    `).join('');

    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  body { margin:0; padding:0; }
  #map { width:100vw; height:100vh; }
  .leaflet-control-attribution { font-size:9px; opacity:0.4; }
  .leaflet-control-zoom { border:none !important; box-shadow:0 2px 8px rgba(0,0,0,0.12) !important; border-radius:12px !important; overflow:hidden; }
  .leaflet-control-zoom a { color:#374151 !important; font-weight:bold !important; }
  .leaflet-popup-content-wrapper { border-radius:14px !important; box-shadow:0 4px 20px rgba(0,0,0,0.15) !important; }
  .leaflet-popup-tip { display:none; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map').setView([${centerLat}, ${centerLng}], ${zoom});
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© CARTO', subdomains: 'abcd', maxZoom: 19
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

  const handleMapMessage = (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data);
      if (data.clubId) {
        const club = clubs.find(c => c.id === data.clubId);
        if (club) focusClub(club);
      }
    } catch {}
  };

  const stars = (r: number) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ מועדונים בישראל</Text>
        <Text style={styles.subtitle}>{filtered.length} מועדונים</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterBarContent}>
        <TouchableOpacity style={[styles.filterChip, !filterCity && styles.filterChipActive]} onPress={() => { setFilterCity(null); setMapCenter({ lat: 32.0, lng: 34.85, zoom: 8 }); }}>
          <Text style={[styles.filterChipText, !filterCity && styles.filterChipTextActive]}>הכל</Text>
        </TouchableOpacity>
        {cities.map(city => (
          <TouchableOpacity key={city} style={[styles.filterChip, filterCity === city && styles.filterChipActive]} onPress={() => { setFilterCity(city); }}>
            <Text style={[styles.filterChipText, filterCity === city && styles.filterChipTextActive]}>{city}</Text>
          </TouchableOpacity>
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
          <View style={styles.fallback}>
            <Text style={styles.fallbackText}>המפה זמינה בדפדפן בלבד</Text>
          </View>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipBar} contentContainerStyle={styles.chipBarContent}>
        {filtered.map(club => (
          <TouchableOpacity
            key={club.id}
            style={[styles.clubChip, selectedClub?.id === club.id && { borderColor: club.color, backgroundColor: club.color + '15' }]}
            onPress={() => focusClub(club)}
          >
            <Text style={styles.clubChipEmoji}>{club.image}</Text>
            <View>
              <Text style={[styles.clubChipName, selectedClub?.id === club.id && { color: club.color }]}>{club.name}</Text>
              <Text style={styles.clubChipCity}>{club.city}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedClub && (
        <Modal transparent animationType="slide" visible={!!selectedClub} onRequestClose={() => setSelectedClub(null)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedClub(null)}>
            <View style={styles.modalSheet}>
              <View style={[styles.modalColorBar, { backgroundColor: selectedClub.color }]} />

              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setSelectedClub(null)} style={styles.closeBtn}>
                    <Ionicons name="close" size={22} color="#6b7280" />
                  </TouchableOpacity>
                  <View style={styles.modalTitleRow}>
                    <View>
                      <Text style={styles.modalName}>{selectedClub.name}</Text>
                      <Text style={styles.modalCity}>{selectedClub.city}</Text>
                    </View>
                    <Text style={styles.modalEmoji}>{selectedClub.image}</Text>
                  </View>
                  <View style={styles.ratingRow}>
                    <Text style={[styles.ratingStars, { color: selectedClub.color }]}>{stars(selectedClub.rating)}</Text>
                    <Text style={styles.ratingNum}>{selectedClub.rating}</Text>
                  </View>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoBox}>
                    <Ionicons name="location-outline" size={18} color={selectedClub.color} />
                    <Text style={styles.infoLabel}>כתובת</Text>
                    <Text style={styles.infoVal}>{selectedClub.address}</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Ionicons name="time-outline" size={18} color={selectedClub.color} />
                    <Text style={styles.infoLabel}>שעות</Text>
                    <Text style={styles.infoVal}>{selectedClub.hours}</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Ionicons name="calendar-outline" size={18} color={selectedClub.color} />
                    <Text style={styles.infoLabel}>ימים</Text>
                    <Text style={styles.infoVal}>{selectedClub.openDays}</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Ionicons name="cash-outline" size={18} color={selectedClub.color} />
                    <Text style={styles.infoLabel}>כניסה</Text>
                    <Text style={styles.infoVal}>{selectedClub.entryPrice}</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Ionicons name="person-outline" size={18} color={selectedClub.color} />
                    <Text style={styles.infoLabel}>גיל מינ׳</Text>
                    <Text style={styles.infoVal}>{selectedClub.minAge}+</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Ionicons name="people-outline" size={18} color={selectedClub.color} />
                    <Text style={styles.infoLabel}>קיבולת</Text>
                    <Text style={styles.infoVal}>{selectedClub.capacity}</Text>
                  </View>
                </View>

                <View style={styles.musicSection}>
                  <Text style={styles.sectionLabel}>סוגי מוזיקה</Text>
                  <View style={styles.tagsRow}>
                    {selectedClub.music.map(m => (
                      <View key={m} style={[styles.musicTag, { backgroundColor: selectedClub.color + '20', borderColor: selectedClub.color + '40' }]}>
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

                <TouchableOpacity style={[styles.navBtn, { backgroundColor: selectedClub.color }]}>
                  <Ionicons name="navigate" size={18} color="#fff" />
                  <Text style={styles.navBtnText}>נווט למועדון</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, backgroundColor: '#1a1a2e' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  filterBar: { backgroundColor: '#1a1a2e', maxHeight: 48 },
  filterBarContent: { paddingHorizontal: 16, paddingBottom: 10, gap: 8, flexDirection: 'row' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
  filterChipActive: { backgroundColor: '#f97316' },
  filterChipText: { fontSize: 12, color: '#d1d5db', fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
  mapContainer: { flex: 1 },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fallbackText: { color: '#9ca3af', fontSize: 15 },
  chipBar: { maxHeight: 82, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  chipBarContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  clubChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f9fafb', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  clubChipEmoji: { fontSize: 20 },
  clubChipName: { fontSize: 13, fontWeight: 'bold', color: '#1f2937' },
  clubChipCity: { fontSize: 11, color: '#9ca3af' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '80%', overflow: 'hidden',
  },
  modalColorBar: { height: 4, width: 40, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  modalScroll: { paddingHorizontal: 20, paddingBottom: 30 },
  modalHeader: { paddingTop: 8, paddingBottom: 16 },
  closeBtn: { alignSelf: 'flex-end', padding: 4 },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  modalEmoji: { fontSize: 40 },
  modalName: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e' },
  modalCity: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingStars: { fontSize: 16 },
  ratingNum: { fontSize: 14, fontWeight: 'bold', color: '#374151' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  infoBox: {
    flex: 1, minWidth: '28%', backgroundColor: '#f9fafb', borderRadius: 12,
    padding: 12, alignItems: 'center', gap: 4,
  },
  infoLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '600' },
  infoVal: { fontSize: 13, color: '#1f2937', fontWeight: 'bold', textAlign: 'center' },
  musicSection: { marginBottom: 14 },
  tagsSection: { marginBottom: 20 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8, textAlign: 'right' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  musicTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  musicTagText: { fontSize: 13, fontWeight: '600' },
  tag: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  tagText: { fontSize: 12, color: '#374151' },
  navBtn: {
    borderRadius: 14, paddingVertical: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 30,
  },
  navBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
