import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { X } from 'lucide-react-native';

export default function TextArea({ field, value, onChange }) {
    const isWeb = Platform.OS === 'web';

    const handleClear = () => {
        if (onChange) onChange("");
    };

    // Calculate character count
    const maxLength = field.maxLength || 250;
    const currentLength = value ? value.length : 0;

    return (
        <View style={tw`mb-4`}>
            {/* باکس ورودی */}
            <View style={tw`bg-white border-2 border-blue-400 rounded-xl px-4 py-3`}>
                {/* Header with title and clear button */}
                <View style={tw`flex-row items-center justify-between mb-2`}>
                    <Text style={tw`text-blue-600 font-bold text-sm`}>
                        {field.title}
                    </Text>
                    {value && value.length > 0 && (
                        <TouchableOpacity onPress={handleClear}>
                            <X size={18} color="#3B82F6" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* TextInput */}
                <TextInput
                    style={[
                        tw`text-gray-800 text-sm text-right`,
                        {
                            minHeight: 80,
                            textAlignVertical: 'top',
                        }
                    ]}
                    placeholder={field.placeholder || "توضیحات خود را ثبت کنید."}
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    multiline={true}
                    numberOfLines={4}
                    maxLength={maxLength}
                />

                {/* Character Counter */}
                <View style={tw`flex-row justify-start mt-2`}>
                    <Text style={tw`text-gray-500 text-xs`}>
                        {currentLength}/{maxLength}
                    </Text>
                </View>
            </View>
        </View>
    );
}