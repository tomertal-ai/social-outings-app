import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="home" />
      <Stack.Screen name="parties" />
      <Stack.Screen name="clubs" />
      <Stack.Screen name="my-events" />
    </Stack>
  );
}
