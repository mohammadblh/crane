import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { api } from '../hooks/useApi';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AppProvider, useApp } from '../contexts/AppContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading, isFirstLaunch } = useAuth();
  const { version, setConfig } = useApp();
  const segments = useSegments();
  const router = useRouter();

  const getForms = async () => {
    const finger = await AsyncStorage.getItem('user_finger');
    if (!finger) return;

    const rentalShort = await api.rentalShort(finger);
    const rentalProject = await api.rentalProject(finger);
    const rentalLong = await api.rentalLong(finger);

    if (rentalLong)
      await AsyncStorage.setItem('rentalLong', JSON.stringify(rentalLong));
    if (rentalShort)
      await AsyncStorage.setItem('rentalShort', JSON.stringify(rentalShort));
    if (rentalProject)
      await AsyncStorage.setItem('rentalProject', JSON.stringify(rentalProject))
  }

  useEffect(() => {
    if (loading) return;

    //set app version
    api.getVersion().then((res) => setConfig(res))

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';
    const inRequestScreen = segments[0] === 'rental-request' || segments[0] === 'project-request';

    if (isFirstLaunch) {
      router.replace('/onboarding');
    } else if (!user && !inAuthGroup && !inRequestScreen) {
      // router.replace('/(tabs)');
      router.replace('/auth/login');
    } else if (user && !inTabsGroup && !inRequestScreen) {
      router.replace('/(tabs)');
      // getForms();
    }
  }, [user, loading, isFirstLaunch, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_left',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="rental-request" />
      <Stack.Screen name="project-request" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  const [loaded, error] = useFonts({
    'Dana': require('../assets/fonts/dana-regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppProvider>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </AppProvider>
    </AuthProvider>
  );
}
