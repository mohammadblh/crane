import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';

export default function RequestsScreen() {
    const requests = [
        {
            id: 1,
            type: 'پروژه ای',
            date: '۱۴۰۳/۰۸/۲۷',
            description: 'کاشان بلوار مطهری میدان مدخل شهر خیابان نظیر',
            status: 'pending',
            statusText: 'در انتظار قیمت گذاری',
            color: 'yellow',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-300',
            buttonBg: 'bg-yellow-100',
            buttonBorder: 'border-yellow-400',
            buttonText: 'text-yellow-700'
        },
        {
            id: 2,
            type: 'پروژه ای',
            date: '۱۴۰۳/۰۸/۲۷',
            description: 'کاشان بلوار مطهری میدان مدخل شهر خیابان نظیر',
            status: 'paid',
            statusText: 'پرداخت شده',
            tags: ['۱ جرثقیل'],
            color: 'green',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-300',
            buttonBg: 'bg-green-100',
            buttonBorder: 'border-green-400',
            buttonText: 'text-green-700'
        },
        {
            id: 3,
            type: 'پروژه ای',
            date: '۱۴۰۳/۰۸/۲۷',
            description: 'کاشان بلوار مطهری میدان مدخل شهر خیابان نظیر',
            status: 'waiting',
            statusText: 'در انتظار پرداخت',
            tags: ['۴ جرثقیل'],
            color: 'blue',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-300',
            buttonBg: 'bg-blue-100',
            buttonBorder: 'border-blue-400',
            buttonText: 'text-blue-700'
        }
    ];

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`bg-white border-b border-gray-200 px-4 py-4`}>
                <Text style={tw`text-lg font-bold text-gray-800 text-center`}>درخواست‌ها</Text>
            </View>

            <ScrollView
                style={tw`flex-1`}
                contentContainerStyle={[tw`px-4 py-4`, { paddingBottom: 100 }]}
            >
                {requests.map((request) => (
                    <View
                        key={request.id}
                        style={tw`${request.bgColor} border-2 ${request.borderColor} rounded-2xl p-4 mb-4`}
                    >
                        {/* Header */}
                        <View style={tw`flex-row items-center justify-between mb-3`}>
                            <Text style={tw`text-gray-600 text-sm`}>{request.date}</Text>
                            <Text style={tw`text-gray-800 font-bold text-base`}>{request.type}</Text>
                        </View>

                        {/* Description */}
                        <Text style={tw`text-gray-700 text-sm text-right mb-4`}>
                            {request.description}
                        </Text>

                        {/* Bottom Section */}
                        <View style={tw`flex-row items-center justify-between`}>
                            <TouchableOpacity
                                style={tw`${request.buttonBg} border-2 ${request.buttonBorder} px-6 py-2 rounded-full`}
                                activeOpacity={0.8}
                            >
                                <Text style={tw`${request.buttonText} font-bold text-sm`}>
                                    {request.statusText}
                                </Text>
                            </TouchableOpacity>

                            {request.tags && (
                                <View style={tw`flex-row`}>
                                    {request.tags.map((tag, index) => (
                                        <View
                                            key={index}
                                            style={tw`bg-white px-4 py-2 rounded-full border border-gray-300`}
                                        >
                                            <Text style={tw`text-gray-700 text-sm`}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}