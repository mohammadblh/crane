import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, View, Text, TextInput, Animated, Platform } from 'react-native';
import { Check, X } from 'lucide-react-native';
import tw from 'tailwind-react-native-classnames';
import { colorMap } from '../../../config/config';

export default function Checkbox2({ label, checked, color = 'yellow-500', onPress, value, onChange, placeholder = "وارد کنید..." }) {
    const isWeb = Platform.OS === 'web'

    const [isExpanded, setIsExpanded] = useState(checked);
    const animatedHeight = useRef(new Animated.Value(checked ? 1 : 0)).current;
    const bgColor = colorMap[color] || colorMap['yellow-500'];

    // Sync with external checked state
    useEffect(() => {
        setIsExpanded(checked);
        Animated.timing(animatedHeight, {
            toValue: checked ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [checked]);

    const handleCheckboxPress = () => {
        const newChecked = !checked;
        if (onPress) {
            onPress(newChecked);
        }

        setIsExpanded(newChecked);
        Animated.timing(animatedHeight, {
            toValue: newChecked ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handleTextChange = (text) => {
        if (onChange) {
            onChange(text);
        }
    };

    const handleClear = () => {
        if (onChange) {
            onChange("");
        }
    };

    const inputHeight = animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 70], // ارتفاع کامل input
    });

    const inputOpacity = animatedHeight.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
    });

    return (
        <View style={tw`border-gray-100`}>
            {/* Checkbox Header - همون استایل Checkbox1 */}
            <TouchableOpacity
                style={tw`flex-row items-center justify-between py-2`}
                onPress={handleCheckboxPress}
                activeOpacity={0.8}
            >
                {/* Check Icon */}
                <View
                    style={[
                        tw`w-5 h-5 rounded items-center justify-center`,
                        checked
                            ? { backgroundColor: bgColor }
                            : tw`bg-white border-2 border-gray-300`
                    ]}
                >
                    {checked && <Check size={14} color="white" strokeWidth={3} />}
                </View>

                {/* Label */}
                <Text style={tw`flex-1 text-gray-700 text-sm text-right mr-2`}>
                    {label}
                </Text>
            </TouchableOpacity>

            {/* Animated Input Section - استایل Input2 */}
            <Animated.View
                style={[
                    tw`overflow-hidden`,
                    {
                        height: inputHeight,
                        opacity: inputOpacity,
                    }
                ]}
            >
                <View style={tw`mt-2 px-1`}>
                    <View style={tw`bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5 flex-row items-center justify-between`}>

                        {value && value.length > 0 ? (
                            <TouchableOpacity onPress={handleClear}>
                                <X size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        ) : (
                            <View style={tw`w-5`} />
                        )}

                        <TextInput
                            style={tw`flex-1 text-gray-800 text-base text-right mr-3`}
                            placeholder={placeholder}
                            placeholderTextColor="#9CA3AF"
                            value={value || ""}
                            onChangeText={handleTextChange}
                            editable={checked}
                        />

                        <Text style={tw`absolute bg-white px-1 right-4 -top-1/4 transform -translate-y-1/2 text-gray-500 text-xs`}>
                            {label}
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}
