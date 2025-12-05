import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import tw from 'tailwind-react-native-classnames';

export default function ToggleSwitch({ field, value, onChange }) {
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [value]);

    const handleToggle = () => {
        if (onChange) {
            onChange(!value);
        }
    };

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#D1D5DB', '#3B82F6'], // gray-300 to blue-500
    });

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 30], // Movement distance
    });

    return (
        <View style={tw`flex-row-reverse items-center justify-between mb-4`}>
            <Text style={tw`text-gray-800 text-base text-right flex-1 mr-3`}>
                {field.title}
            </Text>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleToggle}
            >
                <Animated.View
                    style={[
                        tw`w-14 h-7 rounded-full p-0.5`,
                        {
                            backgroundColor,
                        }
                    ]}
                >
                    <Animated.View
                        style={[
                            tw`w-6 h-6 bg-white rounded-full shadow-lg`,
                            {
                                transform: [{ translateX }],
                            }
                        ]}
                    />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}