import { View, Image, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { Club } from '../../types';
import { getClubLogo, getClubInitials } from '../../data/clubs';

interface MapCenter {
  lat: number;
  lng: number;
  zoom: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface Props {
  clubs: Club[];
  center: MapCenter;
  selectedClubId?: number;
  onSelectClub: (club: Club) => void;
  onRecenter: () => void;
  onBoundsChange?: (bounds: MapBounds) => void;
}

function buildMapHtml(
  clubList: Club[],
  centerLat: number,
  centerLng: number,
  zoom: number,
  selectedClubId?: number
): string {
  const getLogoUri = (club: Club) => {
    const logo = getClubLogo(club);
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
      : `<div class="marker-initials" style="background-color:${c.color};">${getClubInitials(c)}</div>`;
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
  `;
  }).join('');

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
  .marker-root { display: flex; align-items: center; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .marker-pill {
    display: flex; flex-direction: row; align-items: center;
    height: 38px; max-width: 150px; border-radius: 19px;
    background: rgba(16,16,28,0.95); border: 1.5px solid;
    box-shadow: 0 4px 14px rgba(0,0,0,0.5); overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .marker-avatar { width:30px; height:30px; border-radius:50%; object-fit:cover; margin-left:4px; flex-shrink:0; background-color:#161622; }
  .marker-initials { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-left:4px; flex-shrink:0; font-size:12px; font-weight:800; color:#fff; }
  .marker-name { font-size:12px; font-weight:700; color:#fff; padding:0 12px 0 8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:110px; }
  .marker-root.active .marker-pill { transform:scale(1.08); border-color:#7B61FF; box-shadow:0 6px 20px rgba(0,0,0,0.6), 0 0 16px rgba(123,97,255,0.5); }
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
    if (window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(msg); }
    else if (window.parent) { window.parent.postMessage(msg, '*'); }
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

  function emitBounds() {
    var b = map.getBounds();
    var msg = JSON.stringify({
      type: 'bounds',
      north: b.getNorth(), south: b.getSouth(),
      east: b.getEast(), west: b.getWest()
    });
    if (window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(msg); }
    else if (window.parent) { window.parent.postMessage(msg, '*'); }
  }

  map.on('moveend', emitBounds);
  map.on('zoomend', emitBounds);

  map.on('click', function(e) {
    if (!e.originalEvent || !e.originalEvent.target.closest('.marker-root')) {
      document.querySelectorAll('.marker-root').forEach(function(el) { el.classList.remove('active'); });
    }
  });

  ${markersJs}
  map.addLayer(markers);
  ${selectedClubId ? `highlightMarker(${selectedClubId});` : ''}
  setTimeout(emitBounds, 300);
</script>
</body>
</html>`;
}

export default function ClubMap({ clubs, center, selectedClubId, onSelectClub, onRecenter, onBoundsChange }: Props) {
  const webViewRef = useRef<any>(null);

  const handleMessage = (e: { data?: string }) => {
    try {
      const data = JSON.parse(e.data || '{}');
      if (data.type === 'bounds' && onBoundsChange) {
        onBoundsChange({ north: data.north, south: data.south, east: data.east, west: data.west });
      } else if (data.clubId) {
        const club = clubs.find(c => c.id === data.clubId);
        if (club) onSelectClub(club);
      }
    } catch {}
  };

  const mapKey = `${center.lat}-${center.lng}-${center.zoom}`;
  const html = buildMapHtml(clubs, center.lat, center.lng, center.zoom, selectedClubId);

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <iframe
          key={mapKey}
          ref={webViewRef}
          style={{ border: 'none', width: '100%', height: '100%' } as any}
          srcDoc={html}
          title="clubs-map"
          onLoad={() => {
            webViewRef.current?.contentWindow?.addEventListener('message', handleMessage);
          }}
        />
      ) : (
        <WebView
          key={mapKey}
          originWhitelist={['*']}
          source={{ html, baseUrl: 'https://unpkg.com' }}
          style={{ flex: 1 }}
          onMessage={(e) => handleMessage(e.nativeEvent)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
        />
      )}
      <TouchableOpacity style={styles.recenterBtn} onPress={onRecenter} activeOpacity={0.7}>
        <Ionicons name="locate" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  recenterBtn: {
    position: 'absolute', right: 16, bottom: 16,
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#161622', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2A2A3C',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
  },
});
