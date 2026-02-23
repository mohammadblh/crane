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

    const params = {
      name: "Icms",
      file: "json",
      op: operation,
      ...additionalParams
    };
    console.log('params',params)

    const response = await apiClient.get(baseUrl, {
      params,
      timeout: 15000,
      responseType: "arraybuffer",
    });

    const text = new TextDecoder("utf-8").decode(new Uint8Array(response.data));
    if(!text) return {};
    const json = JSON.parse(text);
    return json;

  } catch (error) {
    console.error("Request failed:", error);

    if (error.response) {
      console.error(`خطای سرور: ${error.response.status}`);
    } else if (error.request) {
      console.error("عدم اتصال به سرور");
    } else {
      console.error(error.message || "خطای ناشناخته");
    }
  }
};

// تابع جدید برای آپلود فایل با POST
export const uploadFile = async (finger, fileUri, fileName, fileType) => {
  try {
    const baseUrl = "https://crane.feham.ir";

    const formData = new FormData();

    formData.append('ufile', {
      uri: fileUri,
      name: fileName || `file_${Date.now()}.jpg`,
      type: fileType || 'image/jpeg',
    });

    // سرور انتظار یک فیلد خالی هم داره (مثل curl --form '=""')
    formData.append('', '');

    const url = `${baseUrl}?finger=${finger}&op=m_upload&file=json`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    console.log('Upload response:', json);

    if (json?.success && json?.file) {
      return {
        success: true,
        file: json.file,
        message: json.message,
        fileUrl: `https://crane.feham.ir/modules/Icms/backup/files/${json.file}`,
      };
    }

    return { success: false, message: json?.message || 'خطا در آپلود', ...json };
  } catch (error) {
    console.error("Upload failed:", error);

    if (error.message.includes('HTTP error')) {
      return {
        success: false,
        message: `خطای سرور: ${error.message}`,
      };
    } else if (error.message.includes('Network request failed')) {
      return {
        success: false,
        message: "عدم اتصال به سرور",
      };
    } else {
      return {
        success: false,
        message: error.message || "خطای ناشناخته",
      };
    }
  }
};

// هوک برای استفاده در کامپوننت‌ها
export const useApi = () => {
  return {
    sendRequest,
    uploadFile
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

  getMessage: (fingerData, time) => sendRequest('m_message', {
    finger: fingerData,
    time
  }),

  removeForm: (finger, formId) => sendRequest('m_delform', {
    finger,
    formId
  }),

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
    return sendRequest('m_banner', { finger });
  },

  forms: async (finger) => {
    return sendRequest('m_forms', { finger });
  },

  Sendform: async (finger, data) => {
    console.log('Sending form data:', { finger, data });
    return sendRequest('m_sendform', { finger, ...data });
  },

  getRequest: async (finger) => {
    return sendRequest('m_request', { finger });
  },

  news: (fingerData, time) => sendRequest('m_news', {
    finger: fingerData,
    time
  }),

  // آپلود فایل
  uploadFile: async (finger, fileUri, fileName, fileType) => {
    if (DEV_MODE) {
      console.log('🔧 DEV MODE: Mock file upload');
      return mockDelay({
        success: true,
        message: "آپلود فایل با موفقیت انجام شد.",
        file: "mock_" + fileName,
        fileUrl: `https://crane.feham.ir/modules/Icms/backup/files/mock_${fileName}`
      });
    }
    return uploadFile(finger, fileUri, fileName, fileType);
  },
};