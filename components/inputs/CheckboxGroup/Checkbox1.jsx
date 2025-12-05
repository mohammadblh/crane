import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import tw from 'tailwind-react-native-classnames';
import { colorMap } from '../../../config/config';

export default function Checkbox1({ label, checked, onPress, color = 'yellow-500' }) {
    const bgColor = colorMap[color] || colorMap['yellow-500'];

    return (
        <TouchableOpacity
            style={tw`flex-row items-center justify-between py-2 border-gray-100`}
            onPress={onPress}
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
    );
}