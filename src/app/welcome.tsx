import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function WelcomeScreen() {
  const router = useRouter();
  const [age, setAge] = useState('');

  const handleContinue = () => {
    // כאן נשמור את תאריך הלידה בעתיד
    // עכשיו פשוט נעבור למסך הבית
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>:)</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>ברוכים הבאים! 🎉</Text>
          
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>בן/בת כמה את/ה</Text>
            
            <TextInput
              style={styles.ageInput}
              placeholder="הכנס את הגיל שלך"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              maxLength={3}
            />

            <Text style={styles.hint}>
              המידע הזה עוזר לנו להציע לך אירועים מתאימים
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>המשך</Text>
          </TouchableOpacity>

          <Text style={styles.privacyText}>
            המידע שלך נשמר בצורה מאובטחת ולא ישותף עם אף אחד
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7ed',
  },
  scrollContent: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  content: {
    padding: 30,
    alignItems: 'center',
    marginTop: 100,
  },
  logo: {
    fontSize: 120,
    color: '#fb923c',
    textShadowColor: '#f97316',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  title: {
    fontSize: 58,
    fontWeight: 'bold',
    color: '#f97316',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  dateInputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  ageInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 15,
  },
  hint: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    padding: 18,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  privacyText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
});
