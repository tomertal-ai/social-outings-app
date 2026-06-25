import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>יציאות חברתיות</Text>
          <Text style={styles.subtitle}>מצא חברים לצאת איתם</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מה תרצה לעשות?</Text>
          
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push('/parties')}
          >
            <Text style={styles.cardTitle}>🎉 ארגן מסיבה</Text>
            <Text style={styles.cardDescription}>
              צור מסיבה בבית והזמן חברים חדשים
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push('/clubs')}
          >
            <Text style={styles.cardTitle}>🎵 מועדונים</Text>
            <Text style={styles.cardDescription}>
              מצא מועדונים קרובים והזמן כרטיסים
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push('/my-events')}
          >
            <Text style={styles.cardTitle}>📅 האירועים שלי</Text>
            <Text style={styles.cardDescription}>
              ראה את כל האירועים שנרשמת אליהם
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>אירועים פעילים</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>אין אירועים פעילים כרגע</Text>
          </View>
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
    padding: 20,
    backgroundColor: '#f97316',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    marginTop: 5,
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
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});
