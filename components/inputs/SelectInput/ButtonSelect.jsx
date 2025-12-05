import { colorMap } from '@/config/config';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';

export default function ButtonSelect({ field, value, onChange }) {
    const isMulti = field.isMulti || false;

    const handleSelect = (option) => {
        if (!onChange) return;

        if (isMulti) {
            // Multi-selection mode
            const currentValues = Array.isArray(value) ? value : [];
            const isSelected = currentValues.includes(option);

            if (isSelected) {
                // Remove from selection
                onChange(currentValues.filter(v => v !== option));
            } else {
                // Add to selection
                onChange([...currentValues, option]);
            }
        } else {
            // Single selection mode
            if (value === option) {
                onChange(null);
            } else {
                onChange(option);
            }
        }
    };

    const isSelected = (option) => {
        if (isMulti) {
            return Array.isArray(value) && value.includes(option);
        }
        return value === option;
    };

    return (
        <View style={tw`mb-4`}>
            {field.title && (
                <Text style={tw`text-gray-800 font-bold text-base mb-3 text-right`}>
                    {field.title}
                </Text>
            )}

            <View style={tw`flex-row flex-wrap justify-end`}>
                {field.options?.map((option, index) => {
                    const selected = isSelected(option);
                    const bgColor = colorMap[field.color] || colorMap['yellow'];

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                tw`border-2 rounded-lg px-4 py-2 ml-2 mb-2`,
                                selected
                                    ? { backgroundColor: bgColor, borderColor: bgColor }
                                    : tw`bg-white border-gray-300`
                            ]}
                            onPress={() => handleSelect(option)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                tw`text-sm text-center`,
                                selected
                                    ? tw`text-gray-900 font-bold`
                                    : tw`text-gray-700 font-normal`
                            ]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}