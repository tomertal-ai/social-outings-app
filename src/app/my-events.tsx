import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../components/GradientButton';

export default function MyEventsScreen() {
  const router = useRouter();

  const mockMyEvents = [
    {
      id: 1,
      title: 'מסיבת יום הולדת',
      description: 'מסיבה בבית שלי',
      location: 'תל אביב',
      date: 'מחר ב-20:00',
      status: 'approved',
      role: 'host',
    },
    {
      id: 2,
      title: 'ערב קריאה',
      description: 'ערב נעים של קריאה',
      location: 'ירושלים',
      date: 'יום שישי ב-18:00',
      status: 'pending',
      role: 'guest',
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
          <Text style={styles.title}>האירועים שלי</Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>האירועים שלך</Text>
          
          {mockMyEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={[
                  styles.statusBadge,
                  event.status === 'approved' ? styles.approvedBadge : styles.pendingBadge
                ]}>
                  <Text style={styles.statusText}>
                    {event.status === 'approved' ? 'אושר' : 'ממתין'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.eventDescription}>{event.description}</Text>
              <View style={styles.eventDetails}>
                <Text style={styles.eventDetail}>📍 {event.location}</Text>
                <Text style={styles.eventDetail}>🕐 {event.date}</Text>
              </View>
              
              {event.status === 'approved' && (
                <GradientButton onPress={() => {}} style={styles.chatButton}>
                  <Text style={styles.chatButtonText}>💬 צאט קבוצתי</Text>
                </GradientButton>
              )}
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  approvedBadge: {
    backgroundColor: '#10b981',
  },
  pendingBadge: {
    backgroundColor: '#f59e0b',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 10,
  },
  eventDetails: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  eventDetail: {
    fontSize: 14,
    color: '#d1d5db',
  },
  chatButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
