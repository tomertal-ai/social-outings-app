import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../components/GradientButton';

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
        <LinearGradient
          colors={['#2CB7FF', '#7B61FF', '#D946EF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← חזור</Text>
          </TouchableOpacity>
          <Text style={styles.title}>מועדונים</Text>
        </LinearGradient>

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
              
              <GradientButton onPress={() => {}} style={styles.bookButton}>
                <Text style={styles.bookButtonText}>הזמן כרטיס</Text>
              </GradientButton>
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
    backgroundColor: '#0f0f1a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
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
    backgroundColor: '#1e1e2e',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  searchText: {
    fontSize: 16,
    color: '#d1d5db',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  clubCard: {
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#7B61FF',
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
    color: '#ffffff',
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
    color: '#9ca3af',
    marginBottom: 10,
  },
  clubDetails: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  clubDetail: {
    fontSize: 14,
    color: '#d1d5db',
  },
  bookButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
