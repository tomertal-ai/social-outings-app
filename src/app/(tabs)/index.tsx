import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>יציאות חברתיות</Text>
            <Text style={styles.subtitle}>מצא חברים לצאת איתם</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מה תרצה לעשות?</Text>

          <TouchableOpacity style={styles.card} onPress={() => router.push('/parties' as any)}>
            <Ionicons name="chevron-back" size={20} color="#d1d5db" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>ארגן מסיבה</Text>
              <Text style={styles.cardDescription}>צור מסיבה בבית והזמן חברים חדשים</Text>
            </View>
            <View style={styles.cardIcon}>
              <Ionicons name="calendar" size={28} color="#f97316" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push('/clubs' as any)}>
            <Ionicons name="chevron-back" size={20} color="#d1d5db" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>מועדונים</Text>
              <Text style={styles.cardDescription}>מצא מועדונים קרובים והזמן כרטיסים</Text>
            </View>
            <View style={styles.cardIcon}>
              <Ionicons name="musical-notes" size={28} color="#f97316" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push('./my-events' as any)}>
            <Ionicons name="chevron-back" size={20} color="#d1d5db" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>האירועים שלי</Text>
              <Text style={styles.cardDescription}>ראה את כל האירועים שנרשמת אליהם</Text>
            </View>
            <View style={styles.cardIcon}>
              <Ionicons name="checkmark-circle" size={28} color="#f97316" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push('./map' as any)}>
            <Ionicons name="chevron-back" size={20} color="#d1d5db" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>מפת יציאות</Text>
              <Text style={styles.cardDescription}>ראה יציאות על המפה וסמן מיקום חדש</Text>
            </View>
            <View style={styles.cardIcon}>
              <Ionicons name="map" size={28} color="#f97316" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>אירועים פעילים</Text>
          <View style={styles.emptyState}>
            <Ionicons name="calendar-clear" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>אין אירועים פעילים כרגע</Text>
            <Text style={styles.emptySubtext}>צור מסיבה חדשה כדי להתחיל</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollView: { flex: 1 },
  header: {
    padding: 24, paddingTop: 20, backgroundColor: '#f97316',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerContent: { flex: 1 },
  profileButton: { marginLeft: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 15, textAlign: 'right' },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08,
    shadowRadius: 8, elevation: 3, flexDirection: 'row', alignItems: 'center',
  },
  cardIcon: { backgroundColor: '#fff7ed', borderRadius: 12, padding: 10, marginLeft: 14 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#1f2937', marginBottom: 4, textAlign: 'right' },
  cardDescription: { fontSize: 13, color: '#6b7280', textAlign: 'right' },
  cardContent: { flex: 1 },
  emptyState: {
    backgroundColor: '#fff', borderRadius: 16, padding: 36, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05,
    shadowRadius: 4, elevation: 1,
  },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#6b7280', marginTop: 12 },
  emptySubtext: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
});
