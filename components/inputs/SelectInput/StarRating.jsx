import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Star } from 'lucide-react-native';

export default function StarRating({ field, value, onChange }) {
    const maxStars = field.maxStars || 5;
    const currentRating = value || 0;

    const handleRating = (rating) => {
        if (onChange) {
            onChange(rating);
        }
    };

    return (
        <View style={tw`mb-4`}>
            <Text style={tw`text-gray-800 font-bold text-base mb-3 text-right`}>
                {field.title}
            </Text>

            <View style={tw`flex-row-reverse m-auto items-center justify-end`}>
                {[...Array(maxStars)].map((_, index) => {
                    const starValue = index + 1;
                    const isFilled = starValue <= currentRating;

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleRating(starValue)}
                            activeOpacity={0.7}
                            style={tw`ml-2`}
                        >
                            <Star
                                size={32}
                                color={isFilled ? '#FBC02D' : '#D1D5DB'}
                                fill={isFilled ? '#FBC02D' : '#D1D5DB'}
                                strokeWidth={1}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}