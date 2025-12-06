import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'; // اضافه کردن ScrollView
import tw from 'tailwind-react-native-classnames';

const statusTheme = {
    pending: {
        label: "در انتظار قیمت‌گذاری",
        bg: "bg-yellow-50",
        border: "border-yellow-300",
        btnBg: "bg-yellow-100",
        btnBorder: "border-yellow-400",
        btnText: "text-yellow-700",
    },
    paid: {
        label: "پرداخت شده",
        bg: "bg-green-50",
        border: "border-green-300",
        btnBg: "bg-green-100",
        btnBorder: "border-green-400",
        btnText: "text-green-700",
    },
    waiting: {
        label: "در انتظار پرداخت",
        bg: "bg-blue-50",
        border: "border-blue-300",
        btnBg: "bg-blue-100",
        btnBorder: "border-blue-400",
        btnText: "text-blue-700",
    }
};

export default function RentalReq({ item, onPress }) {
    const theme = statusTheme[item.status];

    return (
        <TouchableOpacity
            style={tw`${theme.bg} border ${theme.border} rounded-xl p-3 mb-4`}
            onPress={() => onPress && onPress(item.id)}
            activeOpacity={0.7}
        >
            <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-gray-600 text-xs`}>{item.date}</Text>
                <Text style={tw`text-gray-800 font-bold text-sm`}>{item.type}</Text>
            </View>

            <Text style={tw`text-gray-700 text-xs text-right mb-3`}>
                {item.description}
            </Text>

            <View style={tw`flex-row items-center justify-between`}>
                <TouchableOpacity
                    style={tw`${theme.btnBg} border ${theme.btnBorder} px-4 py-1.5 rounded-full`}
                >
                    <Text style={tw`${theme.btnText} text-xs font-bold`}>
                        {theme.label}
                    </Text>
                </TouchableOpacity>

                {/* جایگزین کردن View با ScrollView */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={tw`max-w-1/2 flex-row-reverse`}
                    contentContainerStyle={tw`flex-row items-center`}
                >
                    {item.tags?.map((tag, i) => (
                        <View
                            key={i}
                            style={tw`bg-gray-100 px-3 py-1 rounded-full border border-gray-300 ml-1.5`}
                        >
                            <Text style={tw`text-gray-700 text-xs`}>
                                {tag}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </TouchableOpacity>
    );
}