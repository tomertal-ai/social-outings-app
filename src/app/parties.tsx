import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function PartiesScreen() {
  const router = useRouter();
  const [partyTitle, setPartyTitle] = useState('');
  const [partyDescription, setPartyDescription] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');

  const mockParties = [
    {
      id: 1,
      title: 'מסיבת יום הולדת',
      description: 'מסיבה בבית שלי, יהיה מוזיקה ושתייה',
      location: 'תל אביב',
      date: 'מחר ב-20:00',
      attendees: 5,
      maxAttendees: 10,
    },
    {
      id: 2,
      title: 'ערב קריאה',
      description: 'ערב נעים של קריאה ושיחות',
      location: 'ירושלים',
      date: 'יום שישי ב-18:00',
      attendees: 3,
      maxAttendees: 8,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← חזור</Text>
          </TouchableOpacity>
          <Text style={styles.title}>מסיבות</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>צור מסיבה חדשה</Text>
          
          <TextInput
            style={styles.input}
            placeholder="שם המסיבה"
            value={partyTitle}
            onChangeText={setPartyTitle}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="תיאור המסיבה"
            value={partyDescription}
            onChangeText={setPartyDescription}
            multiline
            numberOfLines={4}
          />
          
          <TextInput
            style={styles.input}
            placeholder="מספר משתתפים מקסימלי"
            value={maxAttendees}
            onChangeText={setMaxAttendees}
            keyboardType="numeric"
          />
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>צור מסיבה</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מסיבות פתוחות</Text>
          
          {mockParties.map((party) => (
            <View key={party.id} style={styles.partyCard}>
              <Text style={styles.partyTitle}>{party.title}</Text>
              <Text style={styles.partyDescription}>{party.description}</Text>
              <View style={styles.partyDetails}>
                <Text style={styles.partyDetail}>📍 {party.location}</Text>
                <Text style={styles.partyDetail}>🕐 {party.date}</Text>
              </View>
              <View style={styles.attendees}>
                <Text style={styles.attendeesText}>
                  {party.attendees}/{party.maxAttendees} משתתפים
                </Text>
              </View>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>בקש להצטרף</Text>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#f97316',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  partyCard: {
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
  partyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  partyDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  partyDetails: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
  },
  partyDetail: {
    fontSize: 14,
    color: '#6b7280',
  },
  attendees: {
    marginBottom: 15,
  },
  attendeesText: {
    fontSize: 14,
    color: '#6b7280',
  },
  joinButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
