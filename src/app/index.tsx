import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../components/Logo';

export default function SplashScreen() {
  const router = useRouter();
  const entryScale   = useRef(new Animated.Value(0.72)).current;
  const entryOpacity = useRef(new Animated.Value(0)).current;
  const pulseScale   = useRef(new Animated.Value(1)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const textY        = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    // 1. Logo entry — spring-like feel via easing
    Animated.parallel([
      Animated.timing(entryScale, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.6)),
        useNativeDriver: true,
      }),
      Animated.timing(entryOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Text fade-in after logo lands
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(textY, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();

      // 3. Subtle breathing pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.06,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    const timer = setTimeout(() => {
      router.replace('/welcome' as any);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: entryOpacity,
            transform: [
              { scale: Animated.multiply(entryScale, pulseScale) },
            ],
          },
        ]}
      >
        <Logo size={130} />
      </Animated.View>

      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [{ translateY: textY }],
          alignItems: 'center',
        }}
      >
        <MaskedView
          style={styles.gradientWrapper}
          maskElement={
            <View style={styles.gradientWrapper}>
              <Text style={styles.appName}>Outly</Text>
            </View>
          }
        >
          <LinearGradient
            colors={['#38BDF8', '#818CF8', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientText}
          />
        </MaskedView>
        <Text style={styles.tagline}>Discover where to go tonight</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  gradientWrapper: {
    alignSelf: 'center',
    marginBottom: 6,
  },
  gradientText: {
    height: 50,
    width: 160,
  },
  tagline: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
    letterSpacing: 0.1,
  },
});
