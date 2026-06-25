import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ClubsScreen() {
  const router = useRouter();

  const mockClubs = [
    {
      id: 1,
      name: 'The Block',
      location: 'תל אביב, רחוב אלנבי 120',
      rating: 4.5,
      price: '₪80-120',
      music: 'EDM, House',
      isOpen: true,
    },
    {
      id: 2,
      name: 'Pasaz',
      location: 'תל אביב, רחוב דיזנגוף 99',
      rating: 4.2,
      price: '₪100-150',
      music: 'Hip-Hop, R&B',
      isOpen: true,
    },
    {
      id: 3,
      name: 'Haoman 17',
      location: 'ירושלים, רחוב האמנים 17',
      rating: 4.7,
      price: '₪90-130',
      music: 'Trance, Techno',
      isOpen: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← חזור</Text>
          </TouchableOpacity>
          <Text style={styles.title}>מועדונים</Text>
        </View>

        <View style={styles.searchSection}>
          <Text style={styles.searchText}>🔍 חפש מועדונים לידך</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מועדונים מומלצים</Text>
          
          {mockClubs.map((club) => (
            <View key={club.id} style={styles.clubCard}>
              <View style={styles.clubHeader}>
                <Text style={styles.clubName}>{club.name}</Text>
                <View style={[styles.statusBadge, club.isOpen ? styles.openBadge : styles.closedBadge]}>
                  <Text style={styles.statusText}>{club.isOpen ? 'פתוח' : 'סגור'}</Text>
                </View>
              </View>
              
              <Text style={styles.clubLocation}>📍 {club.location}</Text>
              
              <View style={styles.clubDetails}>
                <Text style={styles.clubDetail}>⭐ {club.rating}</Text>
                <Text style={styles.clubDetail}>💰 {club.price}</Text>
                <Text style={styles.clubDetail}>🎵 {club.music}</Text>
              </View>
              
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>הזמן כרטיס</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f97316',
  },
  backButton: {
    fontSize: 16,
    color: '#fff',
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  clubCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  clubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clubName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  openBadge: {
    backgroundColor: '#10b981',
  },
  closedBadge: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clubLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  clubDetails: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  clubDetail: {
    fontSize: 14,
    color: '#6b7280',
  },
  bookButton: {
    backgroundColor: '#f97316',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
