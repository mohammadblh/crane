import React, { useState, useEffect, useRef } from "react";
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
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'tailwind-react-native-classnames';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../hooks/useApi';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;
const BANNER_HEIGHT = 200;

const HomeScreen = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [versionData, setVersionData] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const router = useRouter();
  const { setUserData } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-scroll banners
  useEffect(() => {
    if (versionData?.images && versionData.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % versionData.images.length;
          scrollViewRef.current?.scrollTo({
            x: nextIndex * (BANNER_WIDTH + 16),
            animated: true,
          });
          return nextIndex;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [versionData]);

  // تابع کمکی برای استخراج تاریخ از fields
  const extractDate = (fields) => {
    if (!fields) return null;

    for (const key in fields) {
      const fieldGroup = fields[key];

      if (fieldGroup['1155']) {
        return fieldGroup['1155'][1] || fieldGroup['1155'][0];
      }
      if (fieldGroup['1198']) {
        return fieldGroup['1198'][1] || fieldGroup['1198'][0];
      }
    }

    return null;
  };

  const loadDashboardData = async () => {
    try {
      const finger = await AsyncStorage.getItem('user_finger');

      // Fetch version data (includes banners)
      const versionRes = await api.getVersion();
      console.log('versionRes', versionRes);
      if (versionRes) {
        setVersionData(versionRes);
      }

      // Fetch requests
      const reqRes = await api.getRequest(finger);
      console.log('reqRes', reqRes);

      if (reqRes && reqRes.success && reqRes.forms) {
        const allRequests = [];

        Object.keys(reqRes.forms).forEach(formType => {
          const formData = reqRes.forms[formType];

          Object.keys(formData).forEach(formId => {
            const item = formData[formId];
            allRequests.push({
              id: formId,
              type: formType,
              name: item.name,
              status: item.status,
              fields: item.fields,
              submit_date: extractDate(item.fields)
            });
          });
        });

        const sortedList = allRequests.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setRecentRequests(sortedList.slice(0, 3));
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
      setShowProfileModal(false);
      await new Promise(resolve => setTimeout(resolve, 300));

      await AsyncStorage.removeItem('user_finger');
      await AsyncStorage.removeItem('temp_username');
      await AsyncStorage.removeItem('temp_finger');
      await AsyncStorage.removeItem('temp_mobile');
      await AsyncStorage.removeItem('user_data');

      setUserData(null);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBannerScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (BANNER_WIDTH + 16));
    setCurrentBannerIndex(index);
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

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            {versionData?.logo && (
              <Image
                source={{ uri: versionData.logo }}
                style={{ width: 36, height: 36 }}
                resizeMode="contain"
              />
            )}
          </View>

          <View style={tw`flex-row items-center`}>
            <Text style={styles.headerTitle}>
              {versionData?.name || 'سامانه جرثقیل'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => setShowProfileModal(true)}
          >
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={24} color="#1F2937" />
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#EAB308"]}
            tintColor="#EAB308"
          />
        }
      >
        {loading && !refreshing ? (
          <View style={tw`mt-10 items-center justify-center`}>
            <ActivityIndicator size="large" color="#EAB308" />
          </View>
        ) : (
          <View style={tw`pt-6`}>
            {/* Image Slider Section */}
            {versionData?.images && versionData.images.length > 0 && (
              <View style={tw`mb-6`}>
                <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  snapToInterval={BANNER_WIDTH + 16}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  onScroll={handleBannerScroll}
                  scrollEventThrottle={16}
                >
                  {versionData.images.map((imageUrl, index) => (
                    <View
                      key={index}
                      style={[
                        styles.bannerContainer,
                        { width: BANNER_WIDTH, height: BANNER_HEIGHT }
                      ]}
                    >
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.bannerImage}
                        resizeMode="cover"
                      />
                      <View style={styles.bannerGradient} />
                    </View>
                  ))}
                </ScrollView>

                {/* Pagination Dots */}
                {versionData.images.length > 1 && (
                  <View style={styles.paginationContainer}>
                    {versionData.images.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.paginationDot,
                          currentBannerIndex === index && styles.paginationDotActive
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Quick Actions Section */}
            <View style={tw`px-4 mb-8`}>
              <Text style={tw`text-xl font-bold text-gray-900 mb-4 text-right`}>
                ثبت درخواست جدید
              </Text>
              <View style={tw`flex-row justify-between`}>
                <TouchableOpacity
                  style={styles.serviceCard}
                  onPress={() => router.push('/rental-short')}
                  activeOpacity={0.8}
                >
                  <View style={styles.serviceIconContainer}>
                    <MaterialCommunityIcons name="truck-flatbed" size={32} color="#1F2937" />
                  </View>
                  <Text style={tw`text-gray-900 font-bold text-base mb-1`}>اجاره موردی</Text>
                  <Text style={tw`text-gray-600 text-xs text-center`}>ثبت سریع کفی</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.serviceCard}
                  onPress={() => router.push('/projects')}
                  activeOpacity={0.8}
                >
                  <View style={styles.serviceIconContainer}>
                    <MaterialCommunityIcons name="crane" size={32} color="#1F2937" />
                  </View>
                  <Text style={tw`text-gray-900 font-bold text-base mb-1`}>اجاره پروژه‌ای</Text>
                  <Text style={tw`text-gray-600 text-xs text-center`}>ویژه پروژه‌های بزرگ</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Requests Section */}
            <View style={tw`px-4 mb-6`}>
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/requests')}>
                  <Text style={tw`text-yellow-600 text-sm font-bold`}>مشاهده همه</Text>
                </TouchableOpacity>
                <Text style={tw`text-xl font-bold text-gray-900 text-right`}>
                  آخرین درخواست‌ها
                </Text>
              </View>

              {recentRequests.length > 0 ? (
                recentRequests.map((req, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.requestCard}
                    onPress={() => router.push(`rental-request?id=${req.id}`)}
                  // onPress={() => {
                  //   if (req.type === 'اجاره موردی') {
                  //     router.push(`/requests/RentalReqScreen?id=${req.id}`);
                  //   } else if (req.type === 'پروژه ای') {
                  //     router.push(`/requests/ProjectReqScreen?id=${req.id}`);
                  //   } else {
                  //     router.push(`/requests/DetailScreen?id=${req.id}&type=${req.type}`);
                  //   }
                  // }}
                  >
                    <Ionicons name="chevron-back" size={20} color="#9CA3AF" />
                    <View style={tw`flex-1 items-end`}>
                      <Text style={tw`text-gray-900 font-bold text-base mb-1`}>
                        {req.type}
                      </Text>
                      <Text style={tw`text-gray-600 text-sm mb-2 text-right`}>
                        {req.name}
                      </Text>
                      <View style={tw`flex-row items-center justify-end w-full`}>
                        {req.submit_date && (
                          <Text style={tw`text-xs text-gray-500 mr-3`}>
                            {req.submit_date}
                          </Text>
                        )}
                        <View style={[
                          styles.statusBadge,
                          req.status === 'پرداخت شده' && { backgroundColor: '#D1FAE5', borderColor: '#86EFAC' },
                          req.status === 'منتظر پرداخت' && { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
                          req.status === 'در حال بررسی' && { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
                        ]}>
                          <Text style={[
                            tw`text-xs font-bold`,
                            req.status === 'پرداخت شده' && tw`text-green-700`,
                            req.status === 'منتظر پرداخت' && tw`text-red-700`,
                            req.status === 'در حال بررسی' && tw`text-yellow-700`,
                          ]}>
                            {req.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyRequestsContainer}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                  </View>
                  <Text style={tw`text-gray-600 text-base text-center mb-1`}>
                    هنوز درخواستی ثبت نشده
                  </Text>
                  <Text style={tw`text-gray-500 text-sm text-center mb-4`}>
                    اولین درخواست خود را ثبت کنید
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyActionButton}
                    onPress={() => router.push('/rental-short')}
                  >
                    <Text style={tw`text-gray-900 font-bold text-sm`}>
                      ثبت درخواست جدید
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Version Info */}
            {versionData?.version && (
              <View style={tw`items-center py-4`}>
                <Text style={tw`text-gray-400 text-xs`}>
                  نسخه {versionData.version}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <ProfileModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
  },
  avatarButton: {
    padding: 4,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EAB308",
  },
  content: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  bannerContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#EAB308',
    width: 24,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  serviceIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#FEF3C7',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  requestCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  emptyRequestsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F9FAFB',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyActionButton: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EAB308',
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
  },
  logoutText: {
    color: "#DC2626",
  },
});

export default HomeScreen;