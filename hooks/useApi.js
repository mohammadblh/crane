// services/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DEV_MODE, MOCK_DATA, MOCK_DELAY } from '../config/dev';
import { Redirect } from 'expo-router';

// ایجاد instance از axios
const apiClient = axios.create();

// تابع کمکی برای شبیه‌سازی تاخیر
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY);
  });
};

// تابع اصلی برای ارسال درخواست
export const sendRequest = async (operation, additionalParams = {}) => {  
  try {
    const baseUrl = "https://crane.feham.ir";

    // -----------------------
    // پارامترهای ثابت GET
    // -----------------------
    const params = {
      name: "Icms",
      file: "json",
      op: operation,
      ...additionalParams
    };

    const response = await apiClient.get(baseUrl, {
      params,
      // headers: {
      //   "Accept": "application/json",
      //   "Accept-Charset": "utf8",
      // },
      timeout: 15000,
      responseType: "arraybuffer",
    });


    const text = new TextDecoder("utf-8").decode(new Uint8Array(response.data));
    if(!text) return {};
    const json = JSON.parse(text);
    return json;
    // return response.data;

  } catch (error) {
    console.error("Request failed:", error);

    if (error.response) {
      console.error(`خطای سرور: ${error.response.status}`);
      // throw new Error(`خطای سرور: ${error.response.status}`);
    } else if (error.request) {
      console.error("عدم اتصال به سرور");
      // throw new Error("عدم اتصال به سرور");
    } else {
      console.error(error.message || "خطای ناشناخته");
      // throw new Error(error.message || "خطای ناشناخته");
    }
  }
};


// هوک برای استفاده در کامپوننت‌ها
export const useApi = () => {
  return {
    sendRequest
  };
};

// توابع آماده برای عملیات رایج
export const api = {
  // گرفتن نسخه
  getVersion: () => sendRequest('m_version'),
  
  // لاگین
  login: async (mob , username) => {
    if (DEV_MODE) {
      console.log('🔧 DEV MODE: Using mock login data');
      console.log('Mock login with:', { username, mob });
      return mockDelay(MOCK_DATA.login);
    }
    return sendRequest('m_login', {
      username,
      mob
    });
  },

  // تایید OTP
  verify: async (finger, code) => {
    if (DEV_MODE) {
      console.log('🔧 DEV MODE: Using mock verify data');
      console.log('Mock verify with:', { finger, code });
      return mockDelay(MOCK_DATA.verify);
    }
    return sendRequest('m_verify', {
      finger,
      code
    });
  },
  
  // گرفتن اطلاعات پروفایل کاربر
  getProfile: async (finger) => {
    if (DEV_MODE) {
      console.log('🔧 DEV MODE: Using mock profile data');
      console.log('Mock profile with finger:', finger);
      return mockDelay(MOCK_DATA.profile);
    }
    return sendRequest('m_profile', {
      finger
    });
  },
  
  UpdateProfile: async (finger, data) => {
    if (DEV_MODE) {
      console.log('🔧 DEV MODE: Using mock profile data');
      console.log('Mock profile with finger:', finger);
      return mockDelay(MOCK_DATA.profile);
    }
    return sendRequest('m_profile', {
      finger,
      ...data
    });
  },
  
  // ارسال موقعیت
//   sendLocation: (latitude, longitude, userId, timestamp) => sendRequest('m_location', {
//     lat: latitude,
//     lng: longitude,
//     user_id: userId,
//     time: timestamp
//   }),
  
  // دریافت پیام
  getMessage: (fingerData, time) => sendRequest('m_message', {
    finger: fingerData,
    time
  }),

  // دریافت فرم
  rentalShort: async (finger) => {
    if (DEV_MODE) {
      return mockDelay(MOCK_DATA.rentalShort);
    }
    return sendRequest('m_rentalShort', {
      finger
    });
  },

  rentalLong: async (finger) => {
    if (DEV_MODE) {
      return mockDelay(MOCK_DATA.rentalLong);
    }
    return sendRequest('m_rentalProject', {
      finger
    });
  },

  rentalProject: async (finger) => {
    if (DEV_MODE) {
      return mockDelay(MOCK_DATA.rentalProject);
    }
    return sendRequest('m_rentalProject', {
      finger
    });
  },

  getBanner: async (finger) => {
    // if (DEV_MODE) {
    //   return mockDelay(MOCK_DATA.rentalProject);
    // }
    return sendRequest('m_banner', { finger });
  },

  forms: async (finger) => {
    // if (DEV_MODE) {
    //   return mockDelay(MOCK_DATA.rentalProject);
    // }
    return sendRequest('m_forms', { finger });
  },

  // ارسال کار (درخواست اجاره)
  addWork: async (requestData) => {
    if (DEV_MODE) {
      console.log('🔧 DEV MODE: Saving request to AsyncStorage');
      console.log('Request data:', requestData);
      
      // دریافت درخواست‌های قبلی
      const existingRequestsJson = await AsyncStorage.getItem('requests');
      const existingRequests = existingRequestsJson ? JSON.parse(existingRequestsJson) : [];
      
      // اضافه کردن ID و timestamp
      const newRequest = {
        ...requestData,
        id: existingRequests.length + 1,
        timestamp: new Date().toISOString(),
        status: 'pending' // وضعیت پیش‌فرض
      };
      
      // اضافه کردن به لیست
      existingRequests.push(newRequest);
      
      // ذخیره در AsyncStorage
      await AsyncStorage.setItem('requests', JSON.stringify(existingRequests));
      
      return mockDelay({
        success: true,
        message: 'درخواست شما با موفقیت ثبت شد',
        data: newRequest
      });
    }
    
    return sendRequest('m_addwork', requestData);
  },

  // دریافت فرم
  news: (fingerData, time) => sendRequest('m_news', {
    finger: fingerData,
    time
  })
};