// Development Configuration
// تنظیمات توسعه - برای تست بدون سرور
import rentalLong from './rental-long-data.json'
import rentalShort from './rental-short-data.json'
import rentalProject from './rental-project-data.json'
/**
 * حالت توسعه (Development Mode)
 * true = استفاده از داده‌های فیک (بدون نیاز به سرور)
 * false = استفاده از API واقعی
 */
export const DEV_MODE = false;


/**
 * داده‌های فیک برای تست
 */
export const MOCK_DATA = {
  version: {
    success: true,
    version: "1.0.1", 
    logo: "",
    name: "سامانه جرثقیل",
    images: []
  },
  // داده‌های لاگین موفق
  login: {
    success: true,
    message: "کد تایید برای شما ارسال شد",
    finger: "mock_finger_12345",
  },
  
  // داده‌های تایید OTP موفق
  verify: {
    success: true,
    message: "ورود موفقیت‌آمیز",
    user: {
      id: 1,
      mobile: "09123456789",
      fname: "mohammad",
      lname: "nejati",
      email: "test@example.com",
      avatar: "",
      nationalCode: ""
    },
  },

  // داده‌های پروفایل کاربر
  profile: {
    success: true,
    data: {
      id: 1,
      mobile: "09123456789",
      fname: "mohammad",
      lname: "nejati",
      email: "test@example.com",
      avatar: "",
      nationalCode: ""
    },
  },

  rentalLong: {
    success: true,
    data: rentalLong
  },

  rentalShort: {
    success: true,
    data: rentalShort
  },

  rentalProject: {
    success: true,
    data: rentalProject
  },
};

/**
 * تاخیر شبیه‌سازی شده برای درخواست‌های فیک (میلی‌ثانیه)
 */
export const MOCK_DELAY = 1000;
