// styles/Style1Input.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

export default function Style1Input({ field, value, onChange }) {
    const handleChange = (text) => {
        if (onChange) {
            onChange(text);
        }
    };

    const handleClear = () => {
        if (onChange) {
            onChange("");
        }
    };

    return (
        <Animatable.View
            animation="fadeIn"
            duration={600}
            delay={300}
            style={tw`mb-6`}
        >
            <View style={tw`relative bg-white rounded-xl border border-gray-200 px-4 py-3.5`}>

                {/* لیبل بالای باکس */}
                <View style={tw`absolute -top-2.5 right-3 bg-white px-1 z-10`}>
                    <Text style={[tw`text-xs text-gray-700`, { fontFamily: 'Dana' }]}>
                        {field.title}
                    </Text>
                </View>

                {/* باکس اینپوت */}
                <View style={tw`flex-row items-center h-12`}>
                    {value && value.length > 0 && (
                        <TouchableOpacity
                            onPress={handleClear}
                            style={tw`p-1 mr-2`}
                        >
                            <Ionicons name="close-circle-outline" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}

                    <TextInput
                        style={[
                            tw`flex-1 h-full text-base text-gray-800 text-right`,
                            { fontFamily: 'Dana' }
                        ]}
                        placeholder={field?.placeholder || ""}
                        placeholderTextColor="#9CA3AF"
                        value={value || ""}
                        onChangeText={handleChange}
                        autoCapitalize="none"
                    />
                </View>

            </View>
        </Animatable.View>
    );
}
