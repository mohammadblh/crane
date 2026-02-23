import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    ScrollView,
    Dimensions,
    Platform,
    Modal,
    KeyboardAvoidingView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import RenderForm from '../../FormRenderer/RenderForm';
import { ChevronDown, Plus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../../hooks/useApi';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SelectWithAdd = ({
    label = "انتخاب:",
    placeholder = "انتخاب کنید",
    options = [],
    selectedValue,
    onSelect,
    sections,          // محتوای داخل مودال (فیلدها)
    itemKey = "",
    formId,
    maxVisibleItems = 3,
    disabled = false,
    addLabel = "افزودن",
    modalTitle = "افزودن آیتم جدید",
    onAdd,                    // callback هنگام کلیک دکمه "ایجاد آیتم" — (closeModal) رو دریافت می‌کنه
}) => {
    const isWeb = Platform.OS === 'web';

    const [internalValue, setInternalValue] = useState(null);
    const isControlled = selectedValue !== undefined;
    const finalValue = selectedValue;
    // const finalValue = isControlled ? selectedValue : internalValue;

    const [isOpen, setIsOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const slideAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const modalSlide = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const animationRef = useRef(null);

    useEffect(() => {
        return () => {
            if (animationRef.current) animationRef.current.stop();
        };
    }, []);

    useEffect(() => {
        if (isControlled) setInternalValue(selectedValue);
    }, [selectedValue]);

    // ── dropdown ──────────────────────────────────────────────
    const toggleDropdown = () => {
        if (disabled) return;
        if (!isOpen) {
            setIsOpen(true);
            animationRef.current = Animated.parallel([
                Animated.timing(slideAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]);
            animationRef.current.start();
        } else {
            animationRef.current = Animated.parallel([
                Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
            ]);
            animationRef.current.start(() => setIsOpen(false));
        }
    };

    const handleSelect = (option) => {
        if (!isControlled) setInternalValue(option);
        onSelect?.(option);
        toggleDropdown();
    };

    // ── modal ─────────────────────────────────────────────────
    const openModal = () => {
        setModalVisible(true);
        Animated.timing(modalSlide, {
            toValue: 0,
            duration: 320,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(modalSlide, {
            toValue: SCREEN_HEIGHT,
            duration: 280,
            useNativeDriver: true,
        }).start(() => setModalVisible(false));
    };

    console.log('formData AA::', formData);
    const handleAdd = async () => {
        try {
            setIsSubmitting(true);
            const finger = await AsyncStorage.getItem('user_finger');

            const response = await api.Sendform(finger, { ...formData, formId });
            console.log('response', response);

            if (response?.success && response?.ID) {
                // نوتیفیکیشن موفقیت
                Alert.alert('موفقیت', response.message || 'ایتم جدید ایجاد شد.');

                // پاس دادن ID به عنوان value انتخاب شده
                onSelect?.(String(response.ID));

                // ریست فرم و بستن مودال
                setFormData({});
                closeModal();
            } else {
                Alert.alert('خطا', response?.message || 'خطایی رخ داد. لطفاً دوباره تلاش کنید.');
            }
        } catch (error) {
            console.error('handleAdd error:', error);
            Alert.alert('خطا', 'ارتباط با سرور برقرار نشد.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── layout ────────────────────────────────────────────────
    const dropdownHeight = Math.min(
        options.length * 48,
        maxVisibleItems * 48,
        SCREEN_HEIGHT * 0.2
    );

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, 0],
    });

    return (
        <View style={tw`mb-1 relative`} key={itemKey}>

            {isOpen && (
                <TouchableOpacity
                    style={tw`absolute inset-0`}
                    onPress={toggleDropdown}
                    activeOpacity={1}
                />
            )}

            <Text style={tw`text-gray-800 font-bold text-sm mb-3 text-right`}>
                {label}
            </Text>

            {/* دکمه اصلی سلکت */}
            <TouchableOpacity
                style={[
                    tw`${isOpen ? 'z-10' : ''} relative bg-white border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between`,
                    disabled && tw`opacity-60`,
                ]}
                onPress={toggleDropdown}
                activeOpacity={0.7}
                disabled={disabled}
            >
                <ChevronDown
                    size={18}
                    color="#6B7280"
                    style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
                />

                <View style={tw`flex-1 items-end mr-2`}>
                    <Text style={[tw`text-sm`, finalValue ? tw`text-gray-800` : tw`text-gray-400`]}>
                        {finalValue || placeholder}
                    </Text>
                </View>

                <Text style={tw`absolute right-4 ${isWeb ? '-top-1/4' : '-top-2/4'} text-gray-500 text-xs bg-white px-1`}>
                    {label}
                </Text>
            </TouchableOpacity>

            {/* لیست بازشو */}
            {isOpen && (
                <Animated.View
                    style={{
                        overflow: 'hidden',
                        opacity: opacityAnim,
                        transform: [{ translateY }],
                        maxHeight: dropdownHeight,
                        top: -5,
                        zIndex: 1,
                    }}
                >
                    <ScrollView showsVerticalScrollIndicator={!isWeb}>
                        <View style={tw`bg-white border border-gray-300 rounded-b-xl overflow-hidden`}>
                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        tw`px-3 py-2.5`,
                                        index !== options.length - 1 && tw`border-b border-gray-100`,
                                        finalValue === option && tw`bg-yellow-50`,
                                    ]}
                                    onPress={() => handleSelect(option)}
                                >
                                    <Text
                                        style={[
                                            tw`text-sm text-right`,
                                            finalValue === option
                                                ? tw`text-yellow-600 font-semibold`
                                                : tw`text-gray-700`,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </Animated.View>
            )}

            {/* دکمه افزودن */}
            <TouchableOpacity
                style={tw`flex-row items-center justify-end mt-2 py-1`}
                onPress={openModal}
                activeOpacity={0.7}
            >
                <Text style={tw`text-yellow-600 text-xs font-semibold ml-1`}>{addLabel}</Text>
                <Plus size={14} color="#D97706" />
            </TouchableOpacity>

            {/* ── مودال از پایین ── */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="none"
                onRequestClose={closeModal}
            >
                {/* پس‌زمینه تاریک */}
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
                    activeOpacity={1}
                    onPress={closeModal}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
                >
                    <Animated.View
                        style={[
                            {
                                transform: [{ translateY: modalSlide }],
                                backgroundColor: '#fff',
                                borderTopLeftRadius: 24,
                                borderTopRightRadius: 24,
                                paddingHorizontal: 20,
                                paddingBottom: Platform.OS === 'ios' ? 36 : 24,
                                paddingTop: 20,
                                maxHeight: SCREEN_HEIGHT * 0.85,
                                // سایه
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: -4 },
                                shadowOpacity: 0.12,
                                shadowRadius: 12,
                                elevation: 20,
                            },
                        ]}
                    >
                        {/* هندل بالای مودال */}
                        <View style={{ alignItems: 'center', marginBottom: 16 }}>
                            <View style={{
                                width: 40,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: '#D1D5DB',
                            }} />
                        </View>

                        {/* عنوان */}
                        <Text style={[tw`text-gray-800 font-bold text-base mb-4`, { textAlign: 'right' }]}>
                            {modalTitle}
                        </Text>

                        {/* محتوای داخل مودال (فیلدها) */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <RenderForm
                                data={sections}
                                onChange={(val) => setFormData(val)}
                            // onChange={(val) => console.log("FORM WORK:", val)}
                            // onChange={onFormChange}
                            />
                        </ScrollView>

                        {/* دکمه ایجاد آیتم */}
                        <TouchableOpacity
                            style={[
                                tw`mt-5 rounded-xl py-3.5 items-center`,
                                { backgroundColor: isSubmitting ? '#F59E0B' : '#D97706', opacity: isSubmitting ? 0.7 : 1 },
                            ]}
                            onPress={handleAdd}
                            activeOpacity={0.8}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={tw`text-white font-bold text-sm`}>ایجاد آیتم</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                </KeyboardAvoidingView>
            </Modal>

        </View>
    );
};

export default SelectWithAdd;