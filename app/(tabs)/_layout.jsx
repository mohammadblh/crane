import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 16);
  const tabBarHeight = 75 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1F2937',
        tabBarInactiveTintColor: '#78716C',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#FBC02D',
          borderTopWidth: 0,
          elevation: 8,
          height: tabBarHeight,
          paddingBottom: bottomInset,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 4,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'Vazir',
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="requests"
        options={{
          title: 'درخواست‌ها',
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'}
              size={size + 2}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'پروژه‌ای',
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? 'briefcase' : 'briefcase-outline'}
              size={size + 2}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'خانه',
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size + 2}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rental-short"
        options={{
          title: 'اجاره موردی',
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size + 2}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rental-long"
        options={{
          title: 'اجاره بلند مدت',
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? 'time' : 'time-outline'}
              size={size + 2}
              color={color}
            />
          ),
        }}
      />
      {/* صفحه پروفایل مخفی */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'پروفایل',
          href: null, // این باعث میشه توی تب‌بار نمایش داده نشه
        }}
      />
    </Tabs>
  );
}