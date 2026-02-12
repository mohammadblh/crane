import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { ArrowRight, Edit2, Camera, User } from 'lucide-react-native';
import { api } from '../hooks/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    nationalId: '',
    birthDate: '',
    postalCode: ''
  });

  console.log("profile>>",)

  const [editData, setEditData] = useState({ ...profileData });

  // بارگذاری اطلاعات پروفایل
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError('');

      // دریافت finger از AsyncStorage
      const finger = await AsyncStorage.getItem('user_finger');

      if (!finger) {
        setError('لطفاً ابتدا وارد شوید');
        setIsLoading(false);
        return;
      }

      console.log('Loading profile with finger:', finger);

      // فراخوانی API
      const response = await api.getProfile(finger);

      console.log('Profile response:', response);

      if (response.success && response.data) {
        const data = response.data;
        const newProfileData = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          username: data.username || '',
          phone: data.phone || '',
          nationalId: data.nationalId || '',
          birthDate: data.birthDate || '',
          postalCode: data.postalCode || ''
        };

        setProfileData(newProfileData);
        setEditData(newProfileData);
      } else {
        setError('خطا در دریافت اطلاعات پروفایل');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.message || 'خطا در بارگذاری اطلاعات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowRight size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-gray-800`}>پروفایل</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Edit2 size={22} color="#FBC02D" />
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1`}>
        <View style={tw`px-4 py-6`}>
          {/* Profile Picture */}
          <View style={tw`items-center mb-8`}>
            <View style={tw`relative`}>
              <View style={tw`w-32 h-32 rounded-full bg-yellow-500 items-center justify-center border-4 border-white shadow-lg`}>
                <User size={64} color="#FFF" strokeWidth={2} />
              </View>
              <TouchableOpacity
                style={tw`absolute bottom-0 right-0 w-10 h-10 bg-yellow-500 rounded-full items-center justify-center border-3 border-white shadow-lg`}
                activeOpacity={0.8}
              >
                <Camera size={20} color="#FFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            {!isEditing && (
              <Text style={tw`text-gray-800 font-bold text-xl mt-4`}>
                {profileData.firstName} {profileData.lastName}
              </Text>
            )}
          </View>

          {/* Profile Fields */}
          <View style={tw`bg-white rounded-2xl p-4 shadow-sm`}>
            {/* First Name */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2 text-right`}>نام</Text>
              {isEditing ? (
                <TextInput
                  style={tw`bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base text-right`}
                  value={editData.firstName}
                  onChangeText={(value) => updateField('firstName', value)}
                />
              ) : (
                <View style={tw`bg-gray-50 rounded-xl px-4 py-3`}>
                  <Text style={tw`text-gray-800 text-base text-right`}>{profileData.firstName}</Text>
                </View>
              )}
            </View>

            {/* Last Name */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2 text-right`}>نام خانوادگی</Text>
              {isEditing ? (
                <TextInput
                  style={tw`bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base text-right`}
                  value={editData.lastName}
                  onChangeText={(value) => updateField('lastName', value)}
                />
              ) : (
                <View style={tw`bg-gray-50 rounded-xl px-4 py-3`}>
                  <Text style={tw`text-gray-800 text-base text-right`}>{profileData.lastName}</Text>
                </View>
              )}
            </View>

            {/* Username */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2 text-right`}>نام کاربری</Text>
              {isEditing ? (
                <TextInput
                  style={tw`bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base text-right`}
                  value={editData.username}
                  onChangeText={(value) => updateField('username', value)}
                />
              ) : (
                <View style={tw`bg-gray-50 rounded-xl px-4 py-3`}>
                  <Text style={tw`text-gray-800 text-base text-right`}>{profileData.username}</Text>
                </View>
              )}
            </View>

            {/* Phone */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2 text-right`}>شماره تماس</Text>
              {isEditing ? (
                <TextInput
                  style={tw`bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base text-right`}
                  value={editData.phone}
                  onChangeText={(value) => updateField('phone', value)}
                  keyboardType="phone-pad"
                />
              ) : (
                <View style={tw`bg-gray-50 rounded-xl px-4 py-3`}>
                  <Text style={tw`text-gray-800 text-base text-right`}>{profileData.phone}</Text>
                </View>
              )}
            </View>

            {/* Birth Date */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2 text-right`}>تاریخ تولد</Text>
              {isEditing ? (
                <TextInput
                  style={tw`bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base text-right`}
                  value={editData.birthDate}
                  onChangeText={(value) => updateField('birthDate', value)}
                  placeholder="۱۳۷۰/۰۵/۱۵"
                  placeholderTextColor="#9CA3AF"
                />
              ) : (
                <View style={tw`bg-gray-50 rounded-xl px-4 py-3`}>
                  <Text style={tw`text-gray-800 text-base text-right`}>{profileData.birthDate}</Text>
                </View>
              )}
            </View>

            {/* National ID */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2 text-right`}>کد ملی</Text>
              {isEditing ? (
                <TextInput
                  style={tw`bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base text-right`}
                  value={editData.nationalId}
                  onChangeText={(value) => updateField('nationalId', value)}
                  keyboardType="numeric"
                />
              ) : (
                <View style={tw`bg-gray-50 rounded-xl px-4 py-3`}>
                  <Text style={tw`text-gray-800 text-base text-right`}>{profileData.nationalId}</Text>
                </View>
              )}
            </View>

            {/* Postal Code */}
            <View style={tw`mb-0`}>
              <Text style={tw`text-gray-600 text-sm mb-2 text-right`}>کد پستی</Text>
              {isEditing ? (
                <TextInput
                  style={tw`bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base text-right`}
                  value={editData.postalCode}
                  onChangeText={(value) => updateField('postalCode', value)}
                  keyboardType="numeric"
                />
              ) : (
                <View style={tw`bg-gray-50 rounded-xl px-4 py-3`}>
                  <Text style={tw`text-gray-800 text-base text-right`}>{profileData.postalCode}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          {isEditing && (
            <View style={tw`flex-row mt-6 pb-6`}>
              <TouchableOpacity
                style={tw`flex-1 bg-yellow-500 py-4 rounded-xl ml-2 shadow-lg`}
                activeOpacity={0.8}
                onPress={handleSave}
              >
                <Text style={tw`text-gray-900 font-bold text-center text-base`}>
                  ذخیره تغییرات
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 border-2 border-gray-300 bg-white py-4 rounded-xl mr-2`}
                activeOpacity={0.8}
                onPress={handleCancel}
              >
                <Text style={tw`text-gray-700 font-bold text-center text-base`}>
                  انصراف
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {!isEditing && <View style={tw`h-6`} />}

          {/* Loading State */}
          {isLoading && (
            <View style={tw`items-center justify-center py-20`}>
              <ActivityIndicator size="large" color="#FBC02D" />
              <Text style={tw`text-gray-600 mt-4 text-center`}>در حال بارگذاری...</Text>
            </View>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <View style={tw`items-center justify-center py-20`}>
              <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>
              <TouchableOpacity
                style={tw`bg-yellow-500 px-6 py-3 rounded-xl`}
                onPress={loadProfile}
              >
                <Text style={tw`text-gray-900 font-bold`}>تلاش مجدد</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
