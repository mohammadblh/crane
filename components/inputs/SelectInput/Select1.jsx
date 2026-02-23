import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    ScrollView,
    Dimensions,
    Platform
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { ChevronDown } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Select1 = ({
    label = "انتخاب:",
    placeholder = "انتخاب کنید",
    options = [],
    selectedValue,
    onSelect,
    itemKey = "",
    maxVisibleItems = 3,
    disabled = false,
}) => {
    const isWeb = Platform.OS === 'web';

    const [internalValue, setInternalValue] = useState(null);

    // تشخیص controlled / uncontrolled
    const isControlled = selectedValue !== undefined;

    console.log('selectedValue', selectedValue)
    // مقدار نهایی که تو UI نمایش داده میشه
    const finalValue = selectedValue;
    // const finalValue = isControlled ? selectedValue : internalValue;

    const [isOpen, setIsOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const animationRef = useRef(null);

    // Cleanup animations on unmount
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, []);

    // اگر مقدار از بیرون عوض شد، استیت داخلی هم sync بشه
    useEffect(() => {
        if (isControlled) {
            setInternalValue(selectedValue);
        }
    }, [selectedValue]);

    const toggleDropdown = () => {
        if (disabled) return;

        if (!isOpen) {
            setIsOpen(true);
            animationRef.current = Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]);
            animationRef.current.start();
        } else {
            animationRef.current = Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]);
            animationRef.current.start(() => setIsOpen(false));
        }
    };

    const handleSelect = (option) => {
        if (!isControlled) {
            setInternalValue(option);
        }

        onSelect?.(option);
        toggleDropdown();
    };

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

            {/* کلیک خارج — بالاتر رندر شد تا روی آیتم‌ها نیفته */}
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

            {/* دکمه اصلی */}
            <TouchableOpacity
                style={[
                    tw`${isOpen && 'z-10'} relative bg-white border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between`,
                    disabled && tw`opacity-60`,
                ]}
                onPress={toggleDropdown}
                activeOpacity={0.7}
                disabled={disabled}
            >
                <ChevronDown
                    size={18}
                    color="#6B7280"
                    style={{
                        transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                    }}
                />

                <View style={tw`flex-1 items-end mr-2`}>
                    <Text
                        style={[
                            tw`text-sm`,
                            finalValue ? tw`text-gray-800` : tw`text-gray-400`,
                        ]}
                    >
                        {finalValue || placeholder}
                    </Text>
                </View>

                <Text
                    style={tw`absolute right-4 ${isWeb ? '-top-1/4' : '-top-2/4'} text-gray-500 text-xs bg-white px-1`}
                >
                    {label}
                    {/* {itemKey} */}
                </Text>
            </TouchableOpacity>

            {/* لیست بازشو */}
            {isOpen && (
                <Animated.View
                    style={{
                        overflow: "hidden",
                        opacity: opacityAnim,
                        transform: [{ translateY }],
                        maxHeight: dropdownHeight,
                        top: -5,
                        zIndex: 1
                    }}
                >
                    <ScrollView showsVerticalScrollIndicator={!isWeb}>
                        <View
                            style={tw`bg-white border border-gray-300 rounded-b-xl overflow-hidden`}
                        >
                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        tw`px-3 py-2.5`,
                                        index !== options.length - 1 &&
                                        tw`border-b border-gray-100`,
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

        </View>
    );
};

export default Select1;
