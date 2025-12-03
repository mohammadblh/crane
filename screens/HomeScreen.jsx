import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

const CraneRequestsScreen = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const router = useRouter();
  const { setUserData } = useAuth();

  const handleLogout = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('user_finger');
      await AsyncStorage.removeItem('temp_username');
      await AsyncStorage.removeItem('temp_finger');
      await AsyncStorage.removeItem('temp_mobile');

      // Clear auth context
      await setUserData(null);

      // Close modal
      setShowProfileModal(false);

      // Navigate to login
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const ProfileModal = () => (
    <Modal
      visible={showProfileModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowProfileModal(false)}
    >
      <TouchableOpacity
        style={styles.profileModalOverlay}
        activeOpacity={1}
        onPress={() => setShowProfileModal(false)}
      >
        <View style={styles.profileModalContent}>
          <TouchableOpacity
            style={styles.profileModalOption}
            onPress={() => {
              setShowProfileModal(false);
              router.push('/profile');
            }}
          >

            <Ionicons name="person-outline" size={20} color="#1F2937" />
            <Text style={styles.profileModalText}>پروفایل</Text>
          </TouchableOpacity>

          <View style={styles.profileModalDivider} />

          <TouchableOpacity
            style={styles.profileModalOption}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={[styles.profileModalText, styles.logoutText]}>خروج</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header with Avatar */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft} />

          <Text style={styles.headerTitle}>خانه</Text>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => setShowProfileModal(true)}
          >
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={24} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            خوش آمدید
          </Text>
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <ProfileModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    fontFamily: "Vazir",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: "Vazir",
  },
  avatarButton: {
    padding: 4,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    fontFamily: "Vazir",
  },
  profileModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 70,
    paddingRight: 20,
  },
  profileModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  profileModalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  profileModalDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  profileModalText: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
    fontFamily: "Vazir",
  },
  logoutText: {
    color: "#DC2626",
  },
});

export default CraneRequestsScreen;
