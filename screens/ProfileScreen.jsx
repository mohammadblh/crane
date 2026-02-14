import React, { useState, useEffect, use } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, TextInput, ActivityIndicator, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    fname: '',
    lname: '',
    mobile: '',
    codem: '',
    aid: ''
  });
  const [editData, setEditData] = useState();



  // دریافت تنها فیلد‌های تغییر یافته
  const getChangedFields = () => {
    const changed = {};
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== editData?.[key]) {
        changed[key] = editData[key];
      }
    });
    return changed;
  };

  useEffect(() => {
    if (profileData) {
      setEditData({ ...profileData });
    }
  }, [profileData]);

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

      console.log('Profile response:', response.prof);

      if (response.success && response.prof) {
        const data = response.prof;

        console.log(data, 'data');

        setProfileData({
          fname: data.fname,
          lname: data.lname,
          mobile: data.mobile,
          codem: data.codem,
          aid: data.aid
        });

        // setProfileData(newProfileData);
        setEditData({ ...profileData });
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

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const changedFields = getChangedFields();

      // اگر تغییری نکرده باشید
      if (Object.keys(changedFields).length === 0) {
        console.log('ℹ️ هیچ تغییری انجام نشده است');
        setIsEditing(false);
        setIsLoading(false);
        return;
      }

      console.log('📤 تغییرات برای ارسال:', changedFields);

      const finger = await AsyncStorage.getItem('user_finger');
      if (finger) {
        const res = await api.UpdateProfile(finger, changedFields);
        console.log('✅ Update profile response:', res);

        if (res.success) {
          setProfileData({ ...editData });
          setIsEditing(false);
          setError('');
        } else {
          setError(res.message || 'خطا در بروزرسانی پروفایل');
        }
      }
    } catch (err) {
      console.error('❌ Error saving profile:', err);
      setError(err.message || 'خطا در ذخیره‌سازی');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}

      <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Edit2 size={22} color="#FBC02D" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-gray-800`}>پروفایل</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowRight size={24} color="#374151" />
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
                style={tw`absolute bottom-0 right-0 w-10 h-10 bg-yellow-500 rounded-full items-center justify-center border-2 border-white shadow-lg`}
                activeOpacity={0.8}
              >
                <Camera size={20} color="#FFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            {!isEditing && (
              <Text style={tw`text-gray-800 font-bold text-xl mt-4`}>
                {profileData.fname} {profileData.lname}
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
                  value={editData.fname}
                  onChangeText={(value) => updateField('fname', value)}
                />
              ) : (
                <View style={tw`bg-gray-50 rounded-xl px-4 py-3`}>
                  <Text style={tw`text-gray-800 text-base text-right`}>{profileData.fname}</Text>
                </View>
              )}
            </View>

            {/* Last Name */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2 text-right`}>نام خانوادگی</Text>
              {isEditing ? (
                <TextInput
                  style={tw`bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base text-right`}
                  value={editData.lname}
                  onChangeText={(value) => updateField('lname', value)}
                />
              ) : (
                <View style={tw`bg-gray-50 rounded-xl px-4 py-3`}>
                  <Text style={tw`text-gray-800 text-base text-right`}>{profileData.lname}</Text>
                </View>
              )}
            </View>

            {/* Username */}
            {/* <View style={tw`mb-4`}>
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
            </View> */}

            {/* Phone */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2 text-right`}>شماره تماس</Text>
              {isEditing ? (
                <TextInput
                  style={tw`bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base text-right`}
                  value={editData.mobile}
                  onChangeText={(value) => updateField('mobile', value)}
                  keyboardType="phone-pad"
                />
              ) : (
                <View style={tw`bg-gray-50 rounded-xl px-4 py-3`}>
                  <Text style={tw`text-gray-800 text-base text-right`}>{profileData.mobile}</Text>
                </View>
              )}
            </View>

            {/* Birth Date */}
            {/* <View style={tw`mb-4`}>
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
            </View> */}

            {/* National ID */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 text-sm mb-2 text-right`}>کد ملی</Text>
              {isEditing ? (
                <TextInput
                  style={tw`bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base text-right`}
                  value={editData.codem}
                  onChangeText={(value) => updateField('codem', value)}
                  keyboardType="numeric"
                />
              ) : (
                <View style={tw`bg-gray-50 rounded-xl px-4 py-3`}>
                  <Text style={tw`text-gray-800 text-base text-right`}>{profileData.codem}</Text>
                </View>
              )}
            </View>

            {/* Postal Code */}
            <View style={tw`mb-0`}>
              <Text style={tw`text-gray-600 text-sm mb-2 text-right`}>کد پستی</Text>
              {isEditing ? (
                <TextInput
                  style={tw`bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base text-right`}
                  value={editData.aid}
                  onChangeText={(value) => updateField('aid', value)}
                  keyboardType="numeric"
                />
              ) : (
                <View style={tw`bg-gray-50 rounded-xl px-4 py-3`}>
                  <Text style={tw`text-gray-800 text-base text-right`}>{profileData.aid}</Text>
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
