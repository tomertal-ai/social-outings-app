import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [step, setStep] = useState(1);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  const features = [
    { icon: 'calendar', text: 'ארגן מסיבות וצאת עם חברים חדשים' },
    { icon: 'musical-notes', text: 'מצא מועדונים והזמן כרטיסים' },
    { icon: 'chatbubbles', text: 'תקשר עם המשתתפים לפני האירוע' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        <View style={styles.heroSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🎉</Text>
          </View>
          <Text style={styles.appName}>יציאות חברתיות</Text>
          <Text style={styles.tagline}>צא, תכיר, תהנה</Text>
        </View>

        {step === 1 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>מה מביא אותך לכאן?</Text>
            {features.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.featureText}>{f.text}</Text>
                <View style={styles.featureIcon}>
                  <Ionicons name={f.icon as any} size={20} color="#f97316" />
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>בוא נתחיל!</Text>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ספר לנו קצת עליך</Text>

            <Text style={styles.label}>שם *</Text>
            <TextInput
              style={styles.input}
              placeholder="השם שלך"
              value={name}
              onChangeText={setName}
              textAlign="right"
            />

            <Text style={styles.label}>גיל *</Text>
            <TextInput
              style={styles.input}
              placeholder="הגיל שלך"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              maxLength={3}
              textAlign="right"
            />

            <Text style={styles.label}>עיר מגורים</Text>
            <TextInput
              style={styles.input}
              placeholder="מאיזו עיר אתה?"
              value={city}
              onChangeText={setCity}
              textAlign="right"
            />

            <Text style={styles.hint}>המידע שלך נשמר בצורה מאובטחת</Text>

            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>כניסה לאפליקציה</Text>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep(1)} style={styles.backLink}>
              <Text style={styles.backLinkText}>חזור</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff7ed' },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  heroSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  logoEmoji: { fontSize: 48 },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#f97316', marginBottom: 4 },
  tagline: { fontSize: 16, color: '#9ca3af' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 16,
  },
  featureText: { fontSize: 14, color: '#374151', textAlign: 'right', flex: 1 },
  featureIcon: {
    backgroundColor: '#fff7ed',
    borderRadius: 10,
    padding: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 13,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#1f2937',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backLink: { alignItems: 'center', marginTop: 14 },
  backLinkText: { fontSize: 14, color: '#9ca3af' },
});
