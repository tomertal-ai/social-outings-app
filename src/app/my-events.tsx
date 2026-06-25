import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← חזור</Text>
          </TouchableOpacity>
          <Text style={styles.title}>האירועים שלי</Text>
        </View>

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
                <TouchableOpacity style={styles.chatButton}>
                  <Text style={styles.chatButtonText}>💬 צאט קבוצתי</Text>
                </TouchableOpacity>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
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
    color: '#6b7280',
    marginBottom: 10,
  },
  eventDetails: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  eventDetail: {
    fontSize: 14,
    color: '#6b7280',
  },
  chatButton: {
    backgroundColor: '#f97316',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
