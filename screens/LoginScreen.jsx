import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Animated,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import tw from 'tailwind-react-native-classnames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../hooks/useApi';
import { useApp } from '../contexts/AppContext';

const { width, height } = Dimensions.get('window');

const CraneLoginScreen = () => {
  const { version, logo, images, appName } = useApp();

  // محاسبه ارتفاع اسلایدر به صورت responsive
  const sliderHeight = width > 768 ? height * 0.40 : 256;
  // const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const scrollX = useRef(new Animated.Value(0)).current;
  const formRef = useRef(null);
  const logoRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogin = async () => {
    if (isLoading) return;

    // Validation
    // if (!username.trim()) {
    //   setError("لطفاً نام کاربری را وارد کنید");
    //   return;
    // }
    if (!mobile.trim()) {
      setError("لطفاً شماره موبایل را وارد کنید");
      return;
    }

    const mobileRegex = /^(?:\+98|0)?9\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      setError("فرمت شماره موبایل صحیح نیست");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Generate or retrieve finger (device ID)
      // let finger = await AsyncStorage.getItem('user_finger');
      // if (!finger) {
      //   finger = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      //   await AsyncStorage.setItem('user_finger', finger);
      // }

      // console.log("Logging in with:", {mob: mobile, finger });

      // Call API
      const response = await api.login(mobile);
      // const response = await api.login(username, password);

      console.log("Login response:", response);

      if (!response.success) throw new Error(response.message);
      // Store finger, username and mobile for OTP screen
      // await AsyncStorage.setItem('temp_username', username);
      await AsyncStorage.setItem('user_finger', response.finger);
      await AsyncStorage.setItem('temp_mobile', mobile);

      // Navigate to OTP screen
      router.push('/auth/otp');

    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "خطا در ورود. لطفاً دوباره تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  };

  // انیمیشن هنگام ورود کامپوننت
  useEffect(() => {
    if (logoRef.current) {
      logoRef.current.bounceIn?.(1000);
    }
    if (formRef.current) {
      formRef.current.fadeInUp?.(1000);
    }
  }, []);

  const renderSliderItem = ({ item, index }) => {
    return (
      <Animatable.View
        animation="fadeIn"
        duration={1000}
        delay={index * 300}
        style={{ width: width - 48, height: sliderHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}
      >
        <Image
          style={tw`w-full h-full`}
          source={item}
          resizeMode="contain"
        />
      </Animatable.View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={tw`flex-row justify-center items-center absolute bottom-4 self-center`}>
        {images.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                tw`h-2 rounded-full bg-yellow-500 mx-1`,
                {
                  width: dotWidth,
                  opacity: opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <KeyboardAvoidingView
        behavior="padding"
        style={tw`flex-1`}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={tw`flex-grow px-6 pb-8`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* اسلایدر تصاویر */}
          <Animatable.View
            animation="zoomIn"
            duration={1500}
            style={[
              tw`my-5 rounded-2xl overflow-hidden bg-white shadow-lg`,
              { height: sliderHeight }
            ]}
          >
            <FlatList
              data={images}
              renderItem={renderSliderItem}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              style={tw`flex-1`}
            />
            {renderPagination()}
          </Animatable.View>

          {/* Logo Section */}
          <Animatable.View
            ref={logoRef}
            animation="bounceIn"
            duration={1000}
            delay={500}
            style={tw`items-center mb-2`}
          >
            <Image
              style={tw`w-80 h-24`}
              source={require("../assets/images/image.png")}
              resizeMode="contain"
            />
          </Animatable.View>

          {/* Subtitle */}
          <Animatable.Text
            animation="fadeIn"
            duration={1000}
            delay={700}
            style={[tw`text-center text-sm text-gray-500 mb-10 leading-6`, { fontFamily: 'Dana' }]}
          >
            برای مدیریت پروژه ها و حساب کاربری شوید.
          </Animatable.Text>

          {/* Form Section */}
          <Animatable.View
            ref={formRef}
            animation="fadeInUp"
            duration={800}
            delay={900}
            style={tw`flex-1`}
          >
            {/* Username Input */}
            {/* <Animatable.View
              animation="fadeIn"
              duration={600}
              delay={1000}
              style={tw`mb-6`}
            >
              <View style={tw`relative bg-white rounded-xl border border-gray-200 px-4 py-3.5`}>
                <View style={tw`absolute -top-2.5 right-3 bg-white px-1 z-10`}>
                  <Text style={[tw`text-xs text-gray-700`, { fontFamily: 'Dana' }]}>
                    نام کاربری
                  </Text>
                </View>
                <View style={tw`flex-row items-center h-12`}>
                  {username.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setUsername("")}
                      style={tw`p-1 mr-2`}
                    >
                      <Ionicons name="close-circle-outline" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                  <TextInput
                    style={[tw`flex-1 h-full text-base text-gray-800 text-right`, { fontFamily: 'Dana' }]}
                    placeholder="Mohammadzilaee"
                    placeholderTextColor="#9CA3AF"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </Animatable.View> */}

            {/* mobile Input */}
            <Animatable.View
              animation="fadeIn"
              duration={600}
              delay={1100}
              style={tw`mb-6`}
            >
              <View style={tw`relative bg-white rounded-xl border border-gray-200 px-4 py-3.5`}>
                <View style={tw`absolute -top-2.5 right-3 bg-white px-1 z-10`}>
                  <Text style={[tw`text-xs text-gray-700`, { fontFamily: 'Dana' }]}>
                    شماره موبایل
                  </Text>
                </View>
                <View style={tw`flex-row items-center h-12`}>
                  <TextInput
                    style={[tw`flex-1 h-full text-base text-gray-800 text-right`, { fontFamily: 'Dana' }]}
                    placeholder="۰۹۳۳۰۰۰۰۰۰۰"
                    placeholderTextColor="#9CA3AF"
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </Animatable.View>

            {/* Forgot Password */}
            {/* <Animatable.View
              animation="fadeIn"
              duration={600}
              delay={1200}
            >
              <TouchableOpacity style={tw`items-center mb-8`}>
                <Text style={[tw`text-sm text-gray-500`, { fontFamily: 'Dana' }]}>
                  رمز عبور خود را فراموش کرده ام
                </Text>
              </TouchableOpacity>
            </Animatable.View> */}

            {/* Error Message */}
            {error ? (
              <Animatable.View animation="shake" duration={500}>
                <View style={tw`bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4`}>
                  <Text style={[tw`text-red-600 text-sm text-center`, { fontFamily: 'Dana' }]}>
                    {error}
                  </Text>
                </View>
              </Animatable.View>
            ) : null}

            {/* Login Button */}
            <Animatable.View
              ref={buttonRef}
              animation="fadeIn"
              duration={1000}
              delay={1300}
            >
              <TouchableOpacity
                style={[
                  tw`bg-yellow-500 py-3 rounded-xl items-center shadow-lg mb-6 border border-yellow-400`,
                  isLoading && tw`opacity-80`
                ]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#1F2937" />
                ) : (
                  <Text style={[tw`text-gray-900 text-base font-semibold`, { fontFamily: 'Dana' }]}>
                    ورود
                  </Text>
                )}
              </TouchableOpacity>
            </Animatable.View>

            {/* Footer */}
            <Animatable.View
              animation="fadeIn"
              duration={600}
              delay={1400}
              style={tw`items-center pb-5`}
            >
              <Text style={[tw`text-sm text-gray-500`, { fontFamily: 'Dana' }]}>
                {appName}
                {/* حساب کاربری ندارید؟ ثبت نام */}
              </Text>
            </Animatable.View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CraneLoginScreen;