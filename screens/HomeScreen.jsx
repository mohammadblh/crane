import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
  Image,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'tailwind-react-native-classnames';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../hooks/useApi';

const HomeScreen = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [banners, setBanners] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const { userData, setUserData } = useAuth();

  React.useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const finger = await AsyncStorage.getItem('user_finger');
      const tempUser = await AsyncStorage.getItem('temp_username');
      setUserName(tempUser || 'کاربر گرامی');

      // Fetch banners
      const bannerRes = await api.getBanner(finger);
      if (bannerRes && bannerRes.success && bannerRes.banners) {
        setBanners(bannerRes.banners);
      }

      // Fetch requests
      const reqRes = await api.getRequest(finger);
      if (reqRes && reqRes.success && reqRes.list) {
        // Sort by id descending to get the newest first
        const sortedList = reqRes.list.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setRecentRequests(sortedList.slice(0, 3)); // show max 3 recent requests
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleLogout = async () => {
    try {
      // Close modal first
      setShowProfileModal(false);

      // Wait a bit for modal to close
      await new Promise(resolve => setTimeout(resolve, 300));

      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('user_finger');
      await AsyncStorage.removeItem('temp_username');
      await AsyncStorage.removeItem('temp_finger');
      await AsyncStorage.removeItem('temp_mobile');
      await AsyncStorage.removeItem('user_data');

      // Clear auth context
      setUserData(null);

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
          <View style={styles.headerLeft}>
            <Text style={tw`text-base text-gray-500 font-bold ml-1`}>CRANE</Text>
          </View>

          <View style={tw`flex-row items-center`}>
            <Text style={styles.headerTitle}>سلام، {userName}</Text>
          </View>

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3B82F6"]} />
        }
      >
        {loading && !refreshing ? (
          <View style={tw`mt-10 items-center justify-center`}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <View style={tw`p-4`}>
            {/* Banner Section */}
            {banners.length > 0 && (
              <View style={tw`mb-6`}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`-mx-4 px-4`}>
                  {banners.map((banner, index) => (
                    <TouchableOpacity key={index} style={tw`mr-4 rounded-2xl overflow-hidden shadow-sm bg-white`} activeOpacity={0.9}>
                      <Image
                        source={{ uri: `https://crane.feham.ir/modules/Icms/content/images/${banner.image}` }}
                        style={{ width: 300, height: 160 }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Quick Actions / Services Section */}
            <View style={tw`mb-8`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4 text-right`}>ثبت درخواست جدید</Text>
              <View style={tw`flex-row justify-between`}>
                {/* Rental Item */}
                <TouchableOpacity
                  style={tw`flex-1 bg-white p-4 rounded-2xl mr-2 shadow-sm border border-gray-100 items-center`}
                  onPress={() => router.push('/rental-short')}
                  activeOpacity={0.7}
                >
                  <View style={tw`w-14 h-14 bg-blue-50 rounded-full items-center justify-center mb-3`}>
                    <MaterialCommunityIcons name="truck-flatbed" size={30} color="#3B82F6" />
                  </View>
                  <Text style={tw`text-gray-800 font-bold mb-1`}>اجاره موردی</Text>
                  <Text style={tw`text-gray-500 text-xs text-center`}>ثبت سریع کفی</Text>
                </TouchableOpacity>

                {/* Project Item */}
                <TouchableOpacity
                  style={tw`flex-1 bg-white p-4 rounded-2xl ml-2 shadow-sm border border-gray-100 items-center`}
                  onPress={() => router.push('/project-req')}
                  activeOpacity={0.7}
                >
                  <View style={tw`w-14 h-14 bg-indigo-50 rounded-full items-center justify-center mb-3`}>
                    <MaterialCommunityIcons name="crane" size={30} color="#6366F1" />
                  </View>
                  <Text style={tw`text-gray-800 font-bold mb-1`}>اجاره پروژه‌ای</Text>
                  <Text style={tw`text-gray-500 text-xs text-center`}>ویژه پروژه‌های بزرگ</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Requests Section */}
            <View style={tw`mb-6`}>
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/requests')}>
                  <Text style={tw`text-blue-500 text-sm`}>مشاهده همه</Text>
                </TouchableOpacity>
                <Text style={tw`text-lg font-bold text-gray-800 text-right`}>آخرین درخواست‌ها</Text>
              </View>

              {recentRequests.length > 0 ? (
                recentRequests.map((req, index) => (
                  <TouchableOpacity
                    key={index}
                    style={tw`bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100 flex-row justify-between items-center`}
                    onPress={() => {
                      if (req.type === 'اجاره موردی (کفی)') {
                        router.push(`/requests/RentalReqScreen?id=${req.id}`);
                      } else {
                        router.push(`/requests/ProjectReqScreen?id=${req.id}`);
                      }
                    }}
                  >
                    <Ionicons name="chevron-back" size={20} color="#9CA3AF" />
                    <View style={tw`items-end`}>
                      <Text style={tw`text-gray-800 font-bold mb-1`}>{req.type}</Text>
                      <View style={tw`flex-row items-center`}>
                        <Text style={tw`text-xs text-gray-500 mr-2`}>{req.submit_date}</Text>
                        <View style={tw`px-2 py-1 bg-yellow-50 rounded text-xs`}>
                          <Text style={tw`text-yellow-600 text-xs`}>در انتظار قیمت‌گذاری</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={tw`bg-gray-100 rounded-2xl p-6 items-center border border-gray-200 border-dashed`}>
                  <Ionicons name="document-text-outline" size={40} color="#9CA3AF" style={tw`mb-2`} />
                  <Text style={tw`text-gray-500 text-center`}>
                    شما هنوز هیچ درخواستی ثبت نکرده‌اید
                  </Text>
                  <TouchableOpacity
                    style={tw`mt-4 bg-blue-50 px-4 py-2 rounded-lg`}
                    onPress={() => router.push('/rental-short')}
                  >
                    <Text style={tw`text-blue-600 font-bold`}>ثبت اولین درخواست</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

          </View>
        )}
      </ScrollView>

      {/* Profile Modal */}
      <ProfileModal />
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    fontFamily: "Dana",
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
    fontFamily: "Dana",
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
    fontFamily: "Dana",
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
    fontFamily: "Dana",
  },
  logoutText: {
    color: "#DC2626",
  },
});

export default HomeScreen;
