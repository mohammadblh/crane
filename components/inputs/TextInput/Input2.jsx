import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { X } from 'lucide-react-native';

export default function Input2({ field, value, onChange }) {
    const handleClear = () => {
        if (onChange) onChange("");
    };

    return (
        <View style={tw`mb-4`}>
            {/* باکس ورودی */}
            <View style={tw`bg-white border-2 border-gray-200 rounded-lg px-3 py-2 flex-row items-center justify-between`}>

                {value ? (
                    <TouchableOpacity onPress={handleClear}>
                        <X size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                ) : (
                    <View style={tw`w-4`} />
                )}

                <TextInput
                    style={tw`flex-1 text-gray-800 text-sm text-right mr-2`}
                    placeholder={field.placeholder || ""}
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                />

                <Text style={tw`absolute bg-white px-1 right-3 -top-1/4 transform -translate-y-1/2 text-gray-500 text-xs`}>
                    {field.title}
                </Text>
            </View>
        </View>
    );
}