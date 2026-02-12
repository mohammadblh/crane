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
    Dimensions,
    FlatList,
    Animated,
    ActivityIndicator,
} from "react-native";
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'tailwind-react-native-classnames';
import { api } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

const { width } = Dimensions.get('window');

const CraneOTPScreen = () => {
    const { images, } = useApp();
    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [finger, setFinger] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const inputRefs = useRef([]);
    const scrollX = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const { setUserData } = useAuth();

    // Load finger and mobile number on mount
    React.useEffect(() => {
        const loadData = async () => {
            const storedFinger = await AsyncStorage.getItem('user_finger');
            const storedMobile = await AsyncStorage.getItem('temp_mobile');
            if (storedFinger) {
                setFinger(storedFinger);
            }
            if (storedMobile) {
                setMobileNumber(storedMobile);
            }
        };
        loadData();
    }, []);

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // Move to previous input on backspace
        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerification = async () => {
        if (isLoading) return;

        const otpCode = otp.join("");

        // Validation
        if (otpCode.length !== 5) {
            setError("لطفاً کد 5 رقمی را وارد کنید");
            return;
        }

        if (!finger) {
            setError("خطا در بارگذاری اطلاعات. لطفاً دوباره وارد شوید");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            console.log("Verifying OTP with:", { finger, code: otpCode });

            // Call verify API
            const response = await api.verify(finger, otpCode);

            console.log('response', response)

            if(!response || !response.success) throw new Error("کد وارد شده نامعتبر است")
            // Store user data
            if (response) {
            // if (response && response.user) { TODO: اینجا باید یوزر پر شود
                // await AsyncStorage.setItem('user_finger', finger);
                // Update AuthContext with user data
                // await setUserData(response.user);


                await setUserData({
                    fname: 'mohammad', lname: 'njt', phone: '09130895830', username: 'nejati'
                });

                // Navigate to Home (Tabs)
                router.push('/(tabs)');
            }

            // Clear temp data
            // await AsyncStorage.removeItem('temp_username');
            // await AsyncStorage.removeItem('temp_finger');
            await AsyncStorage.removeItem('temp_mobile');


        } catch (error) {
            console.error("Verification error:", error);
            setError(error.message || "کد وارد شده نامعتبر است");
        } finally {
            setIsLoading(false);
        }
    };

    const renderSliderItem = ({ item, index }) => {
        return (
        <Animatable.View
            animation="fadeIn"
            duration={1000}
            delay={index * 300}
            style={{ width: width - 48, height: 250 }}
        >
            <Image
            style={tw`w-full h-full rounded-2xl`}
            source={item}
            resizeMode="cover"
            />
        </Animatable.View>
        );
    };

    const renderPagination = () => {
        return (
            <View style={styles.paginationContainer}>
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
                                styles.paginationDot,
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
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* اسلایدر تصاویر */}
                    <Animatable.View
                        animation="fadeIn"
                        duration={1000}
                        style={tw`h-64 my-5 rounded-2xl overflow-hidden bg-white shadow-lg`}
                        // style={styles.sliderContainer}
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
                            style={styles.slider}
                        />
                        {renderPagination()}
                    </Animatable.View>

                    {/* Logo Section */}
                    <Animatable.View
                        animation="bounceIn"
                        duration={800}
                        delay={300}
                        style={styles.logoSection}
                    >
                        <Image
                            style={styles.logoImage}
                            source={require("../assets/images/image.png")}
                        />
                    </Animatable.View>

                    {/* Description */}
                    <Animatable.Text
                        animation="fadeIn"
                        duration={800}
                        delay={400}
                        style={styles.description}
                    >
                        کد ارسال شده به شماره {mobileNumber || "۰۹۱۲۰۰۰۰۰۰۰"} را وارد کنید.
                    </Animatable.Text>

                    {/* OTP Input Section */}
                    <Animatable.View
                        animation="fadeInUp"
                        duration={600}
                        delay={500}
                        style={styles.otpSection}
                    >
                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <Animatable.View
                                    key={index}
                                    animation="zoomIn"
                                    duration={400}
                                    delay={600 + (index * 100)}
                                >
                                    <TextInput
                                        ref={(ref) => (inputRefs.current[index] = ref)}
                                        style={[
                                            styles.otpInput,
                                            digit ? styles.otpInputFilled : styles.otpInputEmpty,
                                        ]}
                                        value={digit}
                                        onChangeText={(value) => handleOtpChange(value, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        textAlign="center"
                                        selectTextOnFocus={true}
                                    />
                                </Animatable.View>
                            ))}
                        </View>

                        <TouchableOpacity onPress={() => router.replace('/login')}>
                        {/* <TouchableOpacity onPress={() => router.back()}> */}
                            <Animatable.Text
                                animation="fadeIn"
                                duration={600}
                                delay={1100}
                                style={styles.otpLabel}
                            >
                                تغییر شماره موبایل
                            </Animatable.Text>
                        </TouchableOpacity>
                    </Animatable.View>

                    {/* Error Message */}
                    {error ? (
                        <Animatable.View animation="shake" duration={500} style={styles.errorContainer}>
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>
                                    {error}
                                </Text>
                            </View>
                        </Animatable.View>
                    ) : null}

                    {/* Verify Button */}
                    <Animatable.View
                        animation="fadeInUp"
                        duration={600}
                        delay={1200}
                        style={styles.buttonContainer}
                    >
                        <TouchableOpacity
                            style={[
                                styles.verifyButton,
                                otp.every((digit) => digit)
                                    ? styles.verifyButtonActive
                                    : styles.verifyButtonInactive,
                                isLoading && styles.verifyButtonLoading,
                            ]}
                            onPress={handleVerification}
                            activeOpacity={0.8}
                            disabled={!otp.every((digit) => digit) || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#1F2937" />
                            ) : (
                                <Text style={styles.verifyButtonText}>بررسی</Text>
                            )}
                        </TouchableOpacity>
                    </Animatable.View>

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
        backgroundColor: "#ffffff",
    },
    keyboardView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    sliderContainer: {
        height: 220,
        marginBottom: 30,
        marginTop: 30,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    slide: {
        width: width - 48,
        height: 220,
    },
    sliderImage: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
    },
    slider: {
        flex: 1,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 15,
        alignSelf: 'center',
    },
    paginationDot: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FBC02D',
        marginHorizontal: 4,
    },
    logoSection: {
        alignItems: "center",
        marginBottom: 15,
    },
    logoImage: {
        width: 300,
        height: 90,
        resizeMode: "contain",
    },
    description: {
        textAlign: "center",
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 40,
        fontFamily: "Dana",
        lineHeight: 24,
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
        width: 48,
        height: 48,
        borderRadius: 12,
        fontSize: 20,
        fontWeight: "600",
        color: "#1F2937",
        backgroundColor: "#ffffff",
        textAlign: "center",
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
    buttonContainer: {
        marginBottom: 30,
    },
    verifyButton: {
        paddingVertical: 12,
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
        fontFamily: "Dana",
    },
    otpLabel: {
        fontSize: 14,
        color: "#3B82F6",
        textAlign: "center",
        fontFamily: "Dana",
        textDecorationLine: "underline",
    },
    errorContainer: {
        marginBottom: 16,
        marginTop: 8,
    },
    errorBox: {
        backgroundColor: "#FEE2E2",
        borderWidth: 1,
        borderColor: "#FCA5A5",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    errorText: {
        fontSize: 14,
        color: "#DC2626",
        textAlign: "center",
        fontFamily: "Dana",
    },
    verifyButtonLoading: {
        opacity: 0.7,
    },
    keyboardSpacer: {
        height: 100,
    },
});

export default CraneOTPScreen;