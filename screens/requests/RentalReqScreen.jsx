import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { ArrowRight } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const getColor = (key) => {
    switch (key) {
        case 'در انتظار قیمت گذاری':
            return 'bg-yellow-500'
        case 'در انتظار قیمت گذاری':
            return 'bg-yellow-500'
    
        default:
            break;
    }
}

export default function RentalReqScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    console.log('📍 RentalReqScreen - Request ID:', id);

    const rentalData = {
        status: 'در انتظار قیمت گذاری',
        statusColor: 'bg-yellow-500',
        date: '۱۴۰۳/۰۸/۲۷',
        address: 'کاشان بلوار مطهری میدان مدخل شهر خیابان نظیر',
        installation: {
            title: 'نصب',
            number: '۱/۳',
            details: [
                { label: 'متوسط', value: '' },
                { label: '۵۵ متر', value: '' },
                { label: 'سیم برق هوایی - درختان بلند', value: '' }
            ]
        },
        evacuation: {
            title: 'تخلیه',
            number: '۱/۳',
            details: [
                { label: 'مستقیم کنار جرثقیل', value: '' },
                { label: 'بلافاصله', value: '' },
                { label: 'زمین صاف', value: '' }
            ]
        },
        cranes: {
            title: 'جرثقیل‌ها',
            count: '۳ عدد',
            items: ['۵۰ تن', '۳۰ تن', '۲۰ تن'],
            price: '۲۱,۰۰۰,۰۰۰ میلیون تومان'
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
                <View style={tw`w-6`} />
                <Text style={tw`text-lg font-bold text-gray-800`}>اجاره موردی</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowRight size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            <ScrollView style={tw`flex-1`}>
                <View style={tw`px-4 py-6`}>
                    {/* Status Header */}
                    <View style={tw`mb-6`}>
                        <View style={tw`flex-row items-center justify-between mb-2`}>
                            <Text style={tw`text-gray-600 text-sm`}>{rentalData.date}</Text>
                            <Text style={tw`text-orange-500 font-bold text-lg`}>
                                {rentalData.status}
                            </Text>
                        </View>
                    </View>

                    {/* Address */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-700 text-base text-right leading-6`}>
                            آدرس: {rentalData.address}
                        </Text>
                    </View>

                    {/* Installation Card */}
                    <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100`}>
                        <View style={tw`flex-row items-center justify-between mb-4`}>
                            <Text style={tw`text-gray-600 text-sm`}>{rentalData.installation.number}</Text>
                            <Text style={tw`text-gray-800 font-bold text-base`}>
                                {rentalData.installation.title}
                            </Text>
                        </View>

                        <View style={tw`flex-row items-center justify-between`}>
                            {rentalData.installation.details.map((detail, index) => (
                                <Text key={index} style={tw`text-gray-700 text-sm`}>
                                    {detail.label}
                                </Text>
                            ))}
                        </View>
                    </View>

                    {/* Evacuation Card */}
                    <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100`}>
                        <View style={tw`flex-row items-center justify-between mb-4`}>
                            <Text style={tw`text-gray-600 text-sm`}>{rentalData.evacuation.number}</Text>
                            <Text style={tw`text-gray-800 font-bold text-base`}>
                                {rentalData.evacuation.title}
                            </Text>
                        </View>

                        <View style={tw`flex-row items-center justify-between`}>
                            {rentalData.evacuation.details.map((detail, index) => (
                                <Text key={index} style={tw`text-gray-700 text-sm`}>
                                    {detail.label}
                                </Text>
                            ))}
                        </View>
                    </View>

                    {/* Cranes Card */}
                    <View style={tw`bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100`}>
                        <View style={tw`flex-row items-center justify-between mb-4`}>
                            <Text style={tw`text-gray-600 text-sm`}>{rentalData.cranes.count}</Text>
                            <Text style={tw`text-gray-800 font-bold text-base`}>
                                {rentalData.cranes.title}
                            </Text>
                        </View>

                        {/* Crane Items */}
                        <View style={tw`flex-row items-center justify-between mb-4`}>
                            {rentalData.cranes.items.map((item, index) => (
                                <Text key={index} style={tw`text-gray-700 text-sm`}>
                                    {item}
                                </Text>
                            ))}
                        </View>

                        {/* Price */}
                        <View style={tw`border-t border-gray-100 pt-4 flex-row items-center justify-between`}>
                            <Text style={tw`text-gray-700 text-sm`}>
                                {rentalData.cranes.price}
                            </Text>
                            <Text style={tw`text-gray-800 font-bold text-sm`}>قیمت:</Text>
                        </View>
                    </View>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={tw`bg-red-500 py-4 rounded-xl shadow-lg mb-6`}
                        activeOpacity={0.8}
                    >
                        <Text style={tw`text-white font-bold text-center text-base`}>
                            لغو درخواست
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}