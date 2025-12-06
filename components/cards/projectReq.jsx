import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';

// 🎨 Map status → theme
const statusTheme = {
    pending: {
        label: "در انتظار قیمت گذاری",
        bg: "bg-yellow-50",
        border: "border-yellow-300",
        btnBg: "bg-yellow-100",
        btnBorder: "border-yellow-400",
        btnText: "text-yellow-700",
    },
    waiting: {
        label: "در انتظار پرداخت",
        bg: "bg-blue-50",
        border: "border-blue-300",
        btnBg: "bg-blue-100",
        btnBorder: "border-blue-400",
        btnText: "text-blue-700",
    },
    paid: {
        label: "پرداخت شده",
        bg: "bg-green-50",
        border: "border-green-300",
        btnBg: "bg-green-100",
        btnBorder: "border-green-400",
        btnText: "text-green-700",
    }
};

export default function ProjectReq({ item, onPress }) {
    const theme = statusTheme[item.status] || statusTheme.pending;

    return (
        <TouchableOpacity
            style={tw`${theme.bg} border-2 ${theme.border} rounded-xl p-3 mb-3`}
            onPress={() => onPress && onPress(item.id)}
            activeOpacity={0.7}
        >
            <View style={tw`flex-row items-center justify-between mb-2`}>
                <Text style={tw`text-gray-600 text-xs`}>{item.date}</Text>
                <Text style={tw`text-gray-800 font-bold text-sm`}>{item.type}</Text>
            </View>

            <Text style={tw`text-gray-700 text-xs text-right mb-3`}>
                {item.description}
            </Text>

            <View style={tw`flex-row items-center justify-between`}>
                <TouchableOpacity
                    style={tw`${theme.btnBg} border-2 ${theme.btnBorder} px-4 py-1.5 rounded-full`}
                    activeOpacity={0.8}
                >
                    <Text style={tw`${theme.btnText} font-bold text-xs`}>
                        {theme.label}
                    </Text>
                </TouchableOpacity>

                {item.tags && (
                    <View style={tw`flex-row flex-wrap`}>
                        {item.tags.map((tag, index) => (
                            <View
                                key={index}
                                style={tw`bg-white px-3 py-1 rounded-full border border-gray-300 mx-1 mb-1`}
                            >
                                <Text style={tw`text-gray-700 text-xs`}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}