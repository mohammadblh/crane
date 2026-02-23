// rental-request.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { ArrowRight } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../hooks/useApi';
import ConfirmDialog from '../../components/ConfirmDialog';

// نقشه فیلدها برای خوانایی بهتر
const FIELD_MAP = {
    '1142': 'workshopName',      // نام کارگاه
    '1147': 'workType',           // نوع کار (بارگیری/تخلیه/نصب/جابجایی)
    '1154': 'materialType',       // نوع مصالح
    '1155': 'date',               // تاریخ
    '1177': 'location',           // محل اجرا
    '1148': 'tonnage',            // تناژ
    '1178': 'length',             // طول
    '1179': 'width',              // عرض
    '1180': 'environmentalConditions', // شرایط محیطی
    '1185': 'insurance',          // بیمه
    '1186': 'additionalServices', // خدمات اضافی
    '1159': 'prepaymentPercent',  // درصد پیش پرداخت
    '1160': 'executionPeriod',    // مدت اجرا
};

const getStatusTheme = (status) => {
    const themes = {
        'pending': {
            label: 'در انتظار قیمت‌گذاری',
            color: 'text-yellow-600',
            bg: 'bg-yellow-50'
        },
        'waiting': {
            label: 'در انتظار پرداخت',
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        'paid': {
            label: 'پرداخت شده',
            color: 'text-green-600',
            bg: 'bg-green-50'
        }
    };
    return themes[status] || themes.pending;
};

export default function RentalReqScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    useEffect(() => {
        loadRequestData();
    }, [id]);

    const loadRequestData = async () => {
        try {
            setLoading(true);
            const fullDataString = await AsyncStorage.getItem('requests_full_data');

            if (fullDataString) {
                const fullData = JSON.parse(fullDataString);
                const data = fullData[id];

                if (data) {
                    setRequestData(data);
                    console.log('📥 Loaded request data:', data);
                } else {
                    console.error('Request not found with ID:', id);
                }
            }
        } catch (error) {
            console.error('Error loading request data:', error);
        } finally {
            setLoading(false);
        }
    };

    // تبدیل داده‌های خام به فرمت قابل نمایش
    const parseRequestData = () => {
        if (!requestData || !requestData.fields) return null;

        const works = [];
        let workshopName = '';
        let mainDate = 'تاریخ نامشخص';
        let status = 'pending';
        let totalPrice = null;

        // پیمایش در همه گروه‌های کاری
        Object.entries(requestData.fields).forEach(([groupIndex, fieldGroup]) => {
            const work = {
                groupNumber: groupIndex,
                workType: '',
                materialType: '',
                date: '',
                location: '',
                tonnage: '',
                length: '',
                width: '',
                environmentalConditions: '',
                insurance: '',
                additionalServices: '',
                prepaymentPercent: '',
                executionPeriod: ''
            };

            Object.entries(fieldGroup).forEach(([fieldId, fieldValue]) => {
                const value = Array.isArray(fieldValue) && fieldValue[1] ? fieldValue[1] : '';

                switch (fieldId) {
                    case '1142':
                        workshopName = Array.isArray(fieldValue) && fieldValue[0] ? fieldValue[0] : '';
                        break;
                    case '1147':
                        work.workType = value;
                        break;
                    case '1154':
                        work.materialType = value;
                        break;
                    case '1155':
                        work.date = Array.isArray(fieldValue) && fieldValue[0] ? fieldValue[0] : '';
                        if (groupIndex === '1' && work.date) mainDate = work.date;
                        break;
                    case '1177':
                        work.location = Array.isArray(fieldValue) && fieldValue[0] ? fieldValue[0] : '';
                        break;
                    case '1148':
                        work.tonnage = Array.isArray(fieldValue) && fieldValue[0] ? fieldValue[0] : '';
                        break;
                    case '1178':
                        work.length = Array.isArray(fieldValue) && fieldValue[0] ? fieldValue[0] : '';
                        break;
                    case '1179':
                        work.width = Array.isArray(fieldValue) && fieldValue[0] ? fieldValue[0] : '';
                        break;
                    case '1180':
                        work.environmentalConditions = Array.isArray(fieldValue) && fieldValue[0] ? fieldValue[0] : '';
                        break;
                    case '1185':
                        work.insurance = value;
                        break;
                    case '1186':
                        work.additionalServices = value;
                        break;
                    case '1159':
                        work.prepaymentPercent = value;
                        if (value) status = 'waiting';
                        break;
                    case '1160':
                        work.executionPeriod = value;
                        break;
                }
            });

            works.push(work);
        });

        return {
            workshopName,
            mainDate,
            status,
            works,
            totalPrice
        };
    };

    const removeForm = async () => {
        try {
            setIsCanceling(true);
            const finger = await AsyncStorage.getItem('user_finger');

            console.log('Removing formId:', id);
            const response = await api.removeForm(finger, id);

            if (response && response.success) {
                // آپدیت کردن استوریج برای حذف درخواست از لیست لوکال (اختیاری)
                const fullDataString = await AsyncStorage.getItem('requests_full_data');
                if (fullDataString) {
                    const fullData = JSON.parse(fullDataString);
                    delete fullData[id];
                    await AsyncStorage.setItem('requests_full_data', JSON.stringify(fullData));
                }

                router.replace('/(tabs)/requests');
            } else {
                console.error('Failed to remove form:', response);
                Alert.alert('خطا', response?.message || 'خطا در لغو درخواست');
            }
        } catch (error) {
            console.error('Error in removeForm:', error);
            Alert.alert('خطا', 'خطایی رخ داد، لطفا اتصال اینترنت خود را بررسی کنید.');
        } finally {
            setIsCanceling(false);
            setIsCancelModalVisible(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50`}>
                <View style={tw`flex-1 items-center justify-center`}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={tw`text-gray-600 mt-4`}>در حال بارگذاری...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!requestData) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50`}>
                <View style={tw`flex-1 items-center justify-center px-4`}>
                    <Text style={tw`text-red-500 text-center`}>درخواست یافت نشد</Text>
                    <TouchableOpacity
                        style={tw`bg-blue-500 px-6 py-3 rounded-lg mt-4`}
                        onPress={() => router.back()}
                    >
                        <Text style={tw`text-white font-bold`}>بازگشت</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const parsedData = parseRequestData();
    const statusTheme = getStatusTheme(parsedData.status);

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
                    <View style={tw`${statusTheme.bg} rounded-xl p-4 mb-6`}>
                        <View style={tw`flex-row items-center justify-between mb-2`}>
                            <Text style={tw`text-gray-600 text-sm`}>{parsedData.mainDate}</Text>
                            <Text style={[tw`font-bold text-lg`, tw`${statusTheme.color}`]}>
                                {statusTheme.label}
                            </Text>
                        </View>
                        {parsedData.workshopName && (
                            <Text style={tw`text-gray-700 text-base text-right mt-2`}>
                                کارگاه: {parsedData.workshopName}
                            </Text>
                        )}
                    </View>

                    {/* Work Cards */}
                    {parsedData.works.map((work, index) => (
                        work.workType && (
                            <View key={index} style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100`}>
                                {/* Header */}
                                <View style={tw`flex-row items-center justify-between mb-4 pb-3 border-b border-gray-100`}>
                                    <Text style={tw`text-gray-600 text-sm`}>
                                        {index + 1}/{parsedData.works.length}
                                    </Text>
                                    <Text style={tw`text-gray-800 font-bold text-lg`}>
                                        {work.workType}
                                    </Text>
                                </View>

                                {/* Details Grid */}
                                <View style={tw`mb-3`}>
                                    {work.materialType && (
                                        <View style={tw`flex-row justify-between py-2 border-b border-gray-50`}>
                                            <Text style={tw`text-gray-700 text-sm`}>{work.materialType}</Text>
                                            <Text style={tw`text-gray-500 text-sm`}>نوع مصالح:</Text>
                                        </View>
                                    )}

                                    {work.location && (
                                        <View style={tw`flex-row justify-between py-2 border-b border-gray-50`}>
                                            <Text style={tw`text-gray-700 text-sm flex-1 text-right`} numberOfLines={2}>
                                                {work.location}
                                            </Text>
                                            <Text style={tw`text-gray-500 text-sm mr-2`}>محل اجرا:</Text>
                                        </View>
                                    )}

                                    {work.date && (
                                        <View style={tw`flex-row justify-between py-2 border-b border-gray-50`}>
                                            <Text style={tw`text-gray-700 text-sm`}>{work.date}</Text>
                                            <Text style={tw`text-gray-500 text-sm`}>تاریخ:</Text>
                                        </View>
                                    )}

                                    {(work.tonnage || work.length || work.width) && (
                                        <View style={tw`flex-row justify-between py-2 border-b border-gray-50`}>
                                            <View style={tw`flex-row`}>
                                                {work.tonnage && (
                                                    <Text style={tw`text-gray-700 text-sm ml-3`}>
                                                        تناژ: {work.tonnage}
                                                    </Text>
                                                )}
                                                {work.length && (
                                                    <Text style={tw`text-gray-700 text-sm ml-3`}>
                                                        طول: {work.length}
                                                    </Text>
                                                )}
                                                {work.width && (
                                                    <Text style={tw`text-gray-700 text-sm`}>
                                                        عرض: {work.width}
                                                    </Text>
                                                )}
                                            </View>
                                            <Text style={tw`text-gray-500 text-sm`}>ابعاد:</Text>
                                        </View>
                                    )}

                                    {work.environmentalConditions && (
                                        <View style={tw`flex-row justify-between py-2 border-b border-gray-50`}>
                                            <Text style={tw`text-gray-700 text-sm flex-1 text-right`} numberOfLines={2}>
                                                {work.environmentalConditions}
                                            </Text>
                                            <Text style={tw`text-gray-500 text-sm mr-2`}>شرایط محیطی:</Text>
                                        </View>
                                    )}

                                    {work.insurance && (
                                        <View style={tw`flex-row justify-between py-2 border-b border-gray-50`}>
                                            <Text style={tw`text-gray-700 text-sm`}>{work.insurance}</Text>
                                            <Text style={tw`text-gray-500 text-sm`}>بیمه:</Text>
                                        </View>
                                    )}

                                    {work.additionalServices && (
                                        <View style={tw`flex-row justify-between py-2 border-b border-gray-50`}>
                                            <Text style={tw`text-gray-700 text-sm`}>{work.additionalServices}</Text>
                                            <Text style={tw`text-gray-500 text-sm`}>خدمات اضافی:</Text>
                                        </View>
                                    )}

                                    {work.prepaymentPercent && (
                                        <View style={tw`flex-row justify-between py-2 border-b border-gray-50`}>
                                            <Text style={tw`text-gray-700 text-sm`}>{work.prepaymentPercent}</Text>
                                            <Text style={tw`text-gray-500 text-sm`}>پیش پرداخت:</Text>
                                        </View>
                                    )}

                                    {work.executionPeriod && (
                                        <View style={tw`flex-row justify-between py-2`}>
                                            <Text style={tw`text-gray-700 text-sm`}>{work.executionPeriod}</Text>
                                            <Text style={tw`text-gray-500 text-sm`}>مدت اجرا:</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )
                    ))}

                    {/* Total Price (if available) */}
                    {parsedData.totalPrice && (
                        <View style={tw`bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200`}>
                            <View style={tw`flex-row items-center justify-between`}>
                                <Text style={tw`text-blue-700 font-bold text-lg`}>
                                    {parsedData.totalPrice} تومان
                                </Text>
                                <Text style={tw`text-blue-600 font-bold text-base`}>
                                    قیمت کل:
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={tw`bg-red-500 py-4 rounded-xl shadow-lg mb-6`}
                        activeOpacity={0.8}
                        onPress={() => setIsCancelModalVisible(true)}
                    >
                        <Text style={tw`text-white font-bold text-center text-base`}>
                            لغو درخواست
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <ConfirmDialog
                visible={isCancelModalVisible}
                onClose={() => setIsCancelModalVisible(false)}
                onConfirm={removeForm}
                title="لغو درخواست"
                message="آیا از لغو این درخواست اطمینان دارید؟ این عمل قابل بازگشت نیست."
                confirmText="بله، لغو شود"
                cancelText="خیر، انصراف"
                isLoading={isCanceling}
            />
        </SafeAreaView>
    );
}