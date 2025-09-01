import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";

const CraneOTPScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputRefs: any = useRef([]);

  const handleOtpChange = (value: any, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerification = () => {
    const otpCode = otp.join("");
    console.log("OTP Code:", otpCode);
    // Handle verification logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section with Crane Image */}
          <View
            style={{
              maxHeight: 400,
              overflow: "hidden",
              backgroundColor: "#eee",
              width: "auto",
              right: -20,
            }}
          >
            <Image
              style={{ top: -50, resizeMode: "contain" }}
              source={require("../../assets/images/bg-login.png")}
            />
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image
              style={{ width: 320, height: 100, resizeMode: "contain" }}
              source={require("../../assets/images/image.png")}
            />
          </View>

          {/* Description */}
          <Text style={styles.description}>
            کد ارسال شده به شماره ۰۹۱۲۰۰۰۰۰۰۰ را وارد کنید.
          </Text>

          {/* OTP Input Section */}
          <View style={styles.otpSection}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : styles.otpInputEmpty,
                    index === 0 ? styles.otpInputActive : null,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus={true}
                />
              ))}
            </View>

            <Text style={styles.otpLabel}>تغییر شماره موبایل</Text>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              otp.every((digit) => digit)
                ? styles.verifyButtonActive
                : styles.verifyButtonInactive,
            ]}
            onPress={handleVerification}
            activeOpacity={0.8}
            disabled={!otp.every((digit) => digit)}
          >
            <Text style={styles.verifyButtonText}>ثبت نام</Text>
          </TouchableOpacity>

          {/* Custom Keyboard Spacer */}
          <View style={styles.keyboardSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  headerSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  imageFrame: {
    width: 200,
    height: 160,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    borderColor: "#D4AF37",
    position: "relative",
  },
  craneContainer: {
    width: 120,
    height: 100,
    position: "relative",
  },
  // Crane Components
  craneBase: {
    position: "absolute",
    bottom: 0,
    left: 55,
    width: 10,
    height: 20,
    backgroundColor: "#FFD700",
  },
  craneMast: {
    position: "absolute",
    bottom: 20,
    left: 58,
    width: 4,
    height: 70,
    backgroundColor: "#FFD700",
  },
  craneJib: {
    position: "absolute",
    top: 20,
    left: 25,
    width: 70,
    height: 4,
    backgroundColor: "#FFD700",
    transform: [{ rotate: "15deg" }],
  },
  craneHook: {
    position: "absolute",
    top: 45,
    right: 15,
    width: 2,
    height: 30,
    backgroundColor: "#FFD700",
  },
  craneCounterweight: {
    position: "absolute",
    top: 15,
    left: 20,
    width: 8,
    height: 12,
    backgroundColor: "#FFD700",
  },
  // Decorative Plant
  plant: {
    position: "absolute",
    bottom: 5,
    right: 20,
  },
  plantPot: {
    width: 12,
    height: 8,
    backgroundColor: "#D4AF37",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  plantStem1: {
    position: "absolute",
    bottom: 8,
    left: 3,
    width: 2,
    height: 15,
    backgroundColor: "#10B981",
    transform: [{ rotate: "-15deg" }],
  },
  plantStem2: {
    position: "absolute",
    bottom: 8,
    left: 5,
    width: 2,
    height: 18,
    backgroundColor: "#10B981",
  },
  plantStem3: {
    position: "absolute",
    bottom: 8,
    right: 3,
    width: 2,
    height: 12,
    backgroundColor: "#10B981",
    transform: [{ rotate: "20deg" }],
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "300",
    color: "#2D3748",
    letterSpacing: 8,
    marginRight: 12,
  },
  logoSymbol: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#2D3748",
  },
  description: {
    textAlign: "center",
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 40,
    fontFamily: Platform.OS === "ios" ? "System" : "Vazir",
    lineHeight: 20,
  },
  otpSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 12,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  otpInputEmpty: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  otpInputFilled: {
    borderWidth: 2,
    borderColor: "#FBC02D",
  },
  otpInputActive: {
    borderWidth: 2,
    borderColor: "#FBC02D",
  },
  otpLabel: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Vazir",
  },
  verifyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  verifyButtonActive: {
    backgroundColor: "#FBC02D",
  },
  verifyButtonInactive: {
    backgroundColor: "#E5E7EB",
  },
  verifyButtonText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Vazir",
  },
  keyboardSpacer: {
    height: 100,
  },
});

export default CraneOTPScreen;
