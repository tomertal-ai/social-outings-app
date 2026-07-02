import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import GradientButton from '../components/GradientButton';

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
      router.replace('/(tabs)/map' as any);
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
            <Logo size={120} showBackground={false} />
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
                  <Ionicons name={f.icon as any} size={20} color="#7B61FF" />
                </View>
              </View>
            ))}
            <GradientButton onPress={handleContinue}>
              <Text style={styles.buttonText}>בוא נתחיל!</Text>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </GradientButton>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ספר לנו קצת עליך</Text>

            <Text style={styles.label}>שם *</Text>
            <TextInput
              style={styles.input}
              placeholder="השם שלך"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              textAlign="right"
            />

            <Text style={styles.label}>גיל *</Text>
            <TextInput
              style={styles.input}
              placeholder="הגיל שלך"
              placeholderTextColor="#9ca3af"
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
              placeholderTextColor="#9ca3af"
              value={city}
              onChangeText={setCity}
              textAlign="right"
            />

            <Text style={styles.hint}>המידע שלך נשמר בצורה מאובטחת</Text>

            <GradientButton onPress={handleContinue}>
              <Text style={styles.buttonText}>כניסה לאפליקציה</Text>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </GradientButton>

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
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  heroSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 10,
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  tagline: { fontSize: 16, color: '#9ca3af' },
  card: {
    backgroundColor: '#1e1e2e',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
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
  featureText: { fontSize: 14, color: '#d1d5db', textAlign: 'right', flex: 1 },
  featureIcon: {
    backgroundColor: '#2a2a3c',
    borderRadius: 10,
    padding: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 6,
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#1e1e2e',
    borderRadius: 10,
    padding: 13,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#374151',
    color: '#ffffff',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backLink: { alignItems: 'center', marginTop: 14 },
  backLinkText: { fontSize: 14, color: '#9ca3af' },
});
