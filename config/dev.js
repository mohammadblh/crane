// Development Configuration
// تنظیمات توسعه - برای تست بدون سرور

/**
 * حالت توسعه (Development Mode)
 * true = استفاده از داده‌های فیک (بدون نیاز به سرور)
 * false = استفاده از API واقعی
 */
export const DEV_MODE = true;

/**
 * داده‌های فیک برای تست
 */
export const MOCK_DATA = {
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
      username: "nejati",
      mobile: "09123456789",
      name: "کاربر تستی",
      email: "test@example.com",
    },
  },

  // داده‌های پروفایل کاربر
  profile: {
    success: true,
    data: {
      firstName: "محمد",
      lastName: "نجاتی",
      username: "nejati",
      phone: "۰۹۱۲۳۴۵۶۷۸۹",
      nationalId: "۰۰۱۲۳۴۵۶۷۸",
      birthDate: "۱۳۷۰/۰۵/۱۵",
      postalCode: "۱۲۳۴۵۶۷۸۹۰",
      email: "nejati@example.com",
      avatar: null,
    },
  },
};

/**
 * تاخیر شبیه‌سازی شده برای درخواست‌های فیک (میلی‌ثانیه)
 */
export const MOCK_DELAY = 1000;
