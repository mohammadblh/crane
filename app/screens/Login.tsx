import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CraneLoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Handle login logic here
    console.log("Login pressed");
    console.log("Username:", username);
    console.log("Password:", password);
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
            {/* <View style={styles.imageFrame}>
              <View style={styles.craneContainer}> */}
            {/* Simple Crane SVG representation */}
            {/* <View style={styles.craneBase} />
                <View style={styles.craneMast} />
                <View style={styles.craneJib} />
                <View style={styles.craneHook} />
                <View style={styles.craneCounterweight} /> */}
            {/* </View>
            </View> */}
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image
              style={{ width: 320, height: 100, resizeMode: "contain" }}
              source={require("../../assets/images/image.png")}
            />
            {/* <Text style={styles.logoText}>CRANE</Text> */}
            {/* <View style={styles.logoSymbol}>
              <View style={styles.triangle} />
            </View> */}
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            برای مدیریت پروژه ها و حساب کاربری شوید.
          </Text>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>نام کاربری</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Mohammadzilaee"
                  placeholderTextColor="#9CA3AF"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                رمز عبور (اختیاری حداقل ۸ کاراکتر)
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>
                رمز عبور خود را فراموش کرده ام
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>ورود</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>حساب کاربری ندارید؟ ثبت نام</Text>
            </View>
          </View>
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
  },
  craneContainer: {
    width: 120,
    height: 100,
    position: "relative",
  },
  // Crane SVG Components
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
    transform: [{ rotate: "0deg" }],
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 40,
    fontFamily: "Vazir",
    // fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  formSection: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    textAlign: "right",
    // fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontFamily: Platform.OS === "ios" ? "System" : "Vazir",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    textAlign: "left",
    fontFamily: Platform.OS === "ios" ? "System" : "Vazir",
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: Platform.OS === "ios" ? "System" : "Vazir",
  },
  loginButton: {
    backgroundColor: "#FBC02D",
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
  loginButtonText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Vazir",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: Platform.OS === "ios" ? "System" : "Vazir",
  },
});

export default CraneLoginScreen;
