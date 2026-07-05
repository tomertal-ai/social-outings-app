import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type TicketStatus = 'active' | 'used' | 'cancelled';
type TicketType = 'Regular' | 'VIP' | 'Early Bird';

interface MockTicket {
  id: number;
  clubName: string;
  eventName: string;
  date: string;
  time: string;
  ticketType: TicketType;
  status: TicketStatus;
  ticketNumber: string;
  accentColor: string[];
  city: string;
}

const ACTIVE_TICKETS: MockTicket[] = [
  {
    id: 1,
    clubName: 'The Block',
    eventName: 'Subsist with Hernan Cattaneo',
    date: 'Fri, Jul 18',
    time: '23:00',
    ticketType: 'VIP',
    status: 'active',
    ticketNumber: 'TBK-2024-001',
    accentColor: ['#7c3aed', '#4f46e5'],
    city: 'Tel Aviv',
  },
  {
    id: 2,
    clubName: 'Haoman 17',
    eventName: 'Weekend Techno Night',
    date: 'Sat, Jul 26',
    time: '00:00',
    ticketType: 'Regular',
    status: 'active',
    ticketNumber: 'H17-2024-088',
    accentColor: ['#dc2626', '#b91c1c'],
    city: 'Jerusalem',
  },
  {
    id: 3,
    clubName: 'Kuli Alma',
    eventName: 'Late Night House',
    date: 'Fri, Aug 1',
    time: '22:30',
    ticketType: 'Early Bird',
    status: 'active',
    ticketNumber: 'KA-2024-312',
    accentColor: ['#ec4899', '#9d174d'],
    city: 'Tel Aviv',
  },
];

const HISTORY_TICKETS: MockTicket[] = [
  {
    id: 4,
    clubName: 'The Block',
    eventName: 'Dark Room x Recondite',
    date: 'Sat, Jun 21',
    time: '23:00',
    ticketType: 'Regular',
    status: 'used',
    ticketNumber: 'TBK-2024-055',
    accentColor: ['#374151', '#1f2937'],
    city: 'Tel Aviv',
  },
  {
    id: 5,
    clubName: 'Pergamon Club',
    eventName: 'Underground Friday',
    date: 'Fri, Jun 13',
    time: '00:00',
    ticketType: 'VIP',
    status: 'used',
    ticketNumber: 'PGM-2024-019',
    accentColor: ['#374151', '#1f2937'],
    city: 'Jerusalem',
  },
  {
    id: 6,
    clubName: 'Valium Club',
    eventName: 'NYE 2024',
    date: 'Tue, Dec 31',
    time: '22:00',
    ticketType: 'VIP',
    status: 'cancelled',
    ticketNumber: 'VLM-2023-001',
    accentColor: ['#374151', '#1f2937'],
    city: 'Tel Aviv',
  },
];

const STATUS_CONFIG = {
  active:    { label: 'Active',    color: '#10b981', bg: '#10b98120' },
  used:      { label: 'Used',      color: '#6b7280', bg: '#6b728020' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#ef444420' },
};

const TYPE_CONFIG: Record<TicketType, { color: string }> = {
  Regular:    { color: '#9ca3af' },
  VIP:        { color: '#f59e0b' },
  'Early Bird': { color: '#34d399' },
};

function QRPlaceholder() {
  return (
    <View style={styles.qrContainer}>
      <View style={styles.qrGrid}>
        {Array.from({ length: 25 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.qrCell,
              { opacity: Math.random() > 0.45 ? 1 : 0.1 },
            ]}
          />
        ))}
      </View>
      <Text style={styles.qrLabel}>Scan at entry</Text>
    </View>
  );
}

function TicketCard({ ticket }: { ticket: MockTicket }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[ticket.status];
  const type = TYPE_CONFIG[ticket.ticketType];
  const isActive = ticket.status === 'active';

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => isActive && setExpanded(e => !e)}
      style={styles.ticketWrapper}
    >
      <LinearGradient
        colors={ticket.accentColor as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ticketCard}
      >
        {/* Top row */}
        <View style={styles.ticketTop}>
          <View style={styles.ticketTopLeft}>
            <Text style={styles.ticketClub}>{ticket.clubName}</Text>
            <Text style={styles.ticketCity}>{ticket.city}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.color + '60' }]}>
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        {/* Event name */}
        <Text style={styles.ticketEvent} numberOfLines={2}>{ticket.eventName}</Text>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerNotchLeft} />
          <View style={styles.dividerLine} />
          <View style={styles.dividerNotchRight} />
        </View>

        {/* Details row */}
        <View style={styles.ticketDetails}>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>DATE</Text>
            <Text style={styles.detailValue}>{ticket.date}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>TIME</Text>
            <Text style={styles.detailValue}>{ticket.time}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={[styles.detailLabel]}>TYPE</Text>
            <Text style={[styles.detailValue, { color: type.color }]}>{ticket.ticketType}</Text>
          </View>
        </View>

        {/* QR area — expands on tap for active tickets */}
        {isActive && expanded && <QRPlaceholder />}

        {/* Ticket number */}
        <Text style={styles.ticketNumber}>{ticket.ticketNumber}</Text>

        {isActive && (
          <View style={styles.tapHint}>
            <Ionicons name={expanded ? 'chevron-up' : 'qr-code-outline'} size={13} color="rgba(255,255,255,0.5)" />
            <Text style={styles.tapHintText}>{expanded ? 'Hide QR' : 'Tap to show QR'}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function MyTicketsScreen() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const tickets = activeTab === 'active' ? ACTIVE_TICKETS : HISTORY_TICKETS;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tickets</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{ACTIVE_TICKETS.length}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Active Tickets
          </Text>
          {activeTab === 'active' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            History
          </Text>
          {activeTab === 'history' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Ticket list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {tickets.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="ticket-outline" size={52} color="#2A2A3C" />
            <Text style={styles.emptyTitle}>No tickets yet</Text>
            <Text style={styles.emptySubtitle}>Tickets you purchase will appear here</Text>
          </View>
        ) : (
          tickets.map(t => <TicketCard key={t.id} ticket={t} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 22, paddingTop: 14, paddingBottom: 6,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  headerBadge: {
    backgroundColor: '#7B61FF', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 3, marginTop: 2,
  },
  headerBadgeText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  tabs: {
    flexDirection: 'row', paddingHorizontal: 22,
    marginBottom: 16, gap: 24,
  },
  tab: { paddingBottom: 10, position: 'relative' },
  tabActive: {},
  tabText: { fontSize: 15, fontWeight: '600', color: '#4b5563' },
  tabTextActive: { color: '#fff', fontWeight: '700' },
  tabIndicator: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 2, backgroundColor: '#7B61FF', borderRadius: 2,
  },

  list: { paddingHorizontal: 18, paddingBottom: 40, gap: 16 },

  ticketWrapper: {
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  ticketCard: {
    borderRadius: 22,
    padding: 22,
    overflow: 'hidden',
  },

  ticketTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  ticketTopLeft: { flex: 1 },
  ticketClub: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  ticketCity: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2, fontWeight: '500' },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: { fontSize: 11, fontWeight: '700' },

  ticketEvent: {
    fontSize: 22, fontWeight: '800', color: '#fff',
    letterSpacing: -0.5, lineHeight: 28, marginBottom: 18,
  },

  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  dividerNotchLeft: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#0B0B14', marginLeft: -22,
  },
  dividerLine: {
    flex: 1, height: 1,
    borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 6,
  },
  dividerNotchRight: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#0B0B14', marginRight: -22,
  },

  ticketDetails: { flexDirection: 'row', gap: 24, marginBottom: 6 },
  detailCol: { gap: 3 },
  detailLabel: { fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: '700', letterSpacing: 0.8 },
  detailValue: { fontSize: 14, color: '#fff', fontWeight: '700' },

  qrContainer: {
    alignItems: 'center', marginTop: 20, marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 16, padding: 16,
  },
  qrGrid: {
    width: 120, height: 120,
    flexDirection: 'row', flexWrap: 'wrap', gap: 3,
    marginBottom: 10,
  },
  qrCell: {
    width: 20, height: 20, borderRadius: 3,
    backgroundColor: '#fff',
  },
  qrLabel: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '600', letterSpacing: 0.5 },

  ticketNumber: {
    fontSize: 10, color: 'rgba(255,255,255,0.3)',
    fontWeight: '600', letterSpacing: 1.5, marginTop: 14,
  },
  tapHint: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4,
  },
  tapHintText: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },

  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
  emptySubtitle: { fontSize: 13, color: '#1f2937', fontWeight: '500', textAlign: 'center' },
});
