import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { ArrowRight, FileText, MoreVertical, Upload, File } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { api } from '../../hooks/useApi';
import ConfirmDialog from '../../components/ConfirmDialog';

// نقشه فیلدها برای پروژه‌ای
const PROJECT_FIELD_MAP = {
    '1211': 'workshopName',           // نام کارگاه
    '1236': 'category',               // دسته‌بندی
    '1213': 'attachments',            // فایل‌های پیوست
    '1221': 'description',            // توضیحات
    '1224': 'requiredDocuments',      // مدارک مورد نیاز
    '1223': 'insurance',              // بیمه
    '1226': 'prepaymentPercent',      // درصد پیش پرداخت
    '1227': 'executionPeriod',        // مدت اجرا
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

export default function ProjectReqScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploadedFiles, setUploadedFiles] = useState([]);
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
                    console.log('📥 Loaded project data:', data);

                    // استخراج فایل‌های پیوست
                    if (data.fields && data.fields['1']) {
                        const attachmentsField = data.fields['1']['1213'];
                        if (attachmentsField && Array.isArray(attachmentsField) && attachmentsField[0]) {
                            const fileNames = attachmentsField[0].split(',');
                            const files = fileNames.map((fileName, index) => ({
                                id: index + 1,
                                name: fileName.trim(),
                                date: new Date().toLocaleDateString('fa-IR'),
                                size: 'نامشخص',
                                type: fileName.endsWith('.jpg') || fileName.endsWith('.png') ? 'image' : 'file'
                            }));
                            setUploadedFiles(files);
                        }
                    }
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

    // پارس کردن داده‌های پروژه
    const parseProjectData = () => {
        if (!requestData || !requestData.fields) return null;

        const fields = requestData.fields['1'] || {};

        return {
            workshopName: fields['1211']?.[0] || 'نامشخص',
            category: fields['1236']?.[1] || '',
            attachments: fields['1213']?.[0] || '',
            description: fields['1221']?.[0] || '',
            requiredDocuments: fields['1224']?.[1] || '',
            insurance: fields['1223']?.[1] || '',
            prepaymentPercent: fields['1226']?.[1] || '',
            executionPeriod: fields['1227']?.[1] || '',
            status: fields['1226']?.[1] ? 'waiting' : 'pending'
        };
    };

    const handleFileOptions = (fileId) => {
        Alert.alert(
            'گزینه‌های فایل',
            'چه کاری می‌خواهید انجام دهید؟',
            [
                { text: 'مشاهده', onPress: () => console.log('View file:', fileId) },
                { text: 'دانلود', onPress: () => console.log('Download file:', fileId) },
                { text: 'حذف', onPress: () => handleDeleteFile(fileId), style: 'destructive' },
                { text: 'انصراف', style: 'cancel' }
            ]
        );
    };

    const handleDeleteFile = (fileId) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const handleUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (result.type === 'success' || !result.canceled) {
                const newFile = {
                    id: uploadedFiles.length + 1,
                    name: result.name || 'فایل جدید',
                    date: new Date().toLocaleDateString('fa-IR'),
                    size: result.size ? `${Math.round(result.size / 1024)}kb` : 'نامشخص',
                    type: 'file',
                    uri: result.uri
                };
                setUploadedFiles(prev => [...prev, newFile]);
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('خطا', 'خطا در انتخاب فایل');
        }
    };

    const handleCancelRequest = async () => {
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
            console.error('Error in handleCancelRequest:', error);
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

    const parsedData = parseProjectData();
    const statusTheme = getStatusTheme(parsedData.status);
    const projectType = requestData.type === 'اجاره طولانی مدت' ? 'اجاره طولانی مدت' : 'اجاره پروژه‌ای';

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
                <View style={tw`w-6`} />
                <Text style={tw`text-lg font-bold text-gray-800`}>{projectType}</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowRight size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            <ScrollView style={tw`flex-1`}>
                <View style={tw`px-4 py-6`}>
                    {/* Status Header */}
                    <View style={tw`${statusTheme.bg} rounded-xl p-4 mb-6`}>
                        <View style={tw`flex-row items-center justify-between mb-2`}>
                            <Text style={tw`text-gray-600 text-sm`}>درخواست #{id}</Text>
                            <Text style={[tw`font-bold text-lg`, tw`${statusTheme.color}`]}>
                                {statusTheme.label}
                            </Text>
                        </View>
                        <Text style={tw`text-gray-700 text-base text-right mt-2`}>
                            {parsedData.workshopName}
                        </Text>
                    </View>

                    {/* Project Details Card */}
                    <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100`}>
                        <Text style={tw`text-gray-800 font-bold text-lg mb-4 text-right`}>
                            جزئیات پروژه
                        </Text>

                        {/* Category */}
                        {parsedData.category && (
                            <View style={tw`flex-row justify-between py-3 border-b border-gray-50`}>
                                <Text style={tw`text-gray-700 text-sm`}>{parsedData.category}</Text>
                                <Text style={tw`text-gray-500 text-sm`}>دسته‌بندی:</Text>
                            </View>
                        )}

                        {/* Description */}
                        {parsedData.description && (
                            <View style={tw`flex-row justify-between py-3 border-b border-gray-50`}>
                                <Text style={tw`text-gray-700 text-sm flex-1 text-right`} numberOfLines={3}>
                                    {parsedData.description}
                                </Text>
                                <Text style={tw`text-gray-500 text-sm mr-2`}>توضیحات:</Text>
                            </View>
                        )}

                        {/* Required Documents */}
                        {parsedData.requiredDocuments && (
                            <View style={tw`flex-row justify-between py-3 border-b border-gray-50`}>
                                <Text style={tw`text-gray-700 text-sm flex-1 text-right`}>
                                    {parsedData.requiredDocuments}
                                </Text>
                                <Text style={tw`text-gray-500 text-sm mr-2`}>مدارک مورد نیاز:</Text>
                            </View>
                        )}

                        {/* Insurance */}
                        {parsedData.insurance && (
                            <View style={tw`flex-row justify-between py-3 border-b border-gray-50`}>
                                <Text style={tw`text-gray-700 text-sm`}>{parsedData.insurance}</Text>
                                <Text style={tw`text-gray-500 text-sm`}>بیمه:</Text>
                            </View>
                        )}

                        {/* Prepayment */}
                        {parsedData.prepaymentPercent && (
                            <View style={tw`flex-row justify-between py-3 border-b border-gray-50`}>
                                <Text style={tw`text-gray-700 text-sm`}>{parsedData.prepaymentPercent}</Text>
                                <Text style={tw`text-gray-500 text-sm`}>پیش پرداخت:</Text>
                            </View>
                        )}

                        {/* Execution Period */}
                        {parsedData.executionPeriod && (
                            <View style={tw`flex-row justify-between py-3`}>
                                <Text style={tw`text-gray-700 text-sm`}>{parsedData.executionPeriod}</Text>
                                <Text style={tw`text-gray-500 text-sm`}>مدت اجرا:</Text>
                            </View>
                        )}
                    </View>

                    {/* Files Section */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-800 font-bold text-xl text-right mb-2`}>
                            فایل‌های پیوست
                        </Text>
                        <Text style={tw`text-gray-600 text-sm text-right mb-4`}>
                            شما می‌توانید تا حداکثر ۲۰ فایل آپلود کنید
                        </Text>

                        {/* Uploaded Files List */}
                        {uploadedFiles.length > 0 ? (
                            uploadedFiles.map((file) => (
                                <View
                                    key={file.id}
                                    style={tw`bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between shadow-sm border border-gray-100`}
                                >
                                    {/* File Icon */}
                                    <View style={tw`w-12 h-12 bg-blue-50 rounded-lg items-center justify-center`}>
                                        {file.type === 'image' ? (
                                            <Image
                                                source={{ uri: file.uri || 'https://via.placeholder.com/48' }}
                                                style={{ width: 48, height: 48, borderRadius: 8 }}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <FileText size={24} color="#3B82F6" />
                                        )}
                                    </View>

                                    {/* File Info */}
                                    <View style={tw`flex-1 mx-3`}>
                                        <Text style={tw`text-gray-800 font-bold text-sm mb-1`} numberOfLines={1}>
                                            {file.name}
                                        </Text>
                                        <Text style={tw`text-gray-400 text-xs`}>
                                            {file.date}
                                        </Text>
                                    </View>

                                    {/* File Size */}
                                    <Text style={tw`text-gray-400 text-xs mr-2`}>
                                        {file.size}
                                    </Text>

                                    {/* Options Menu */}
                                    <TouchableOpacity
                                        onPress={() => handleFileOptions(file.id)}
                                        style={tw`p-2`}
                                    >
                                        <MoreVertical size={20} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={tw`bg-gray-100 rounded-xl p-6 items-center`}>
                                <File size={40} color="#9CA3AF" />
                                <Text style={tw`text-gray-500 text-sm mt-2`}>
                                    هیچ فایلی آپلود نشده است
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Upload Button */}
                    <View style={tw`items-center mb-6`}>
                        <TouchableOpacity
                            style={tw`w-16 h-16 bg-blue-500 rounded-full items-center justify-center shadow-lg`}
                            onPress={handleUpload}
                            activeOpacity={0.8}
                        >
                            <Upload size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={tw`text-gray-600 text-sm mt-2`}>آپلود فایل جدید</Text>
                    </View>

                    {/* Cancel Request Button */}
                    <TouchableOpacity
                        style={tw`bg-red-500 py-4 rounded-xl shadow-lg mb-6`}
                        onPress={() => setIsCancelModalVisible(true)}
                        activeOpacity={0.8}
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
                onConfirm={handleCancelRequest}
                title="لغو درخواست"
                message="آیا از لغو این درخواست اطمینان دارید؟ این عمل قابل بازگشت نیست."
                confirmText="بله، لغو شود"
                cancelText="خیر، انصراف"
                isLoading={isCanceling}
            />
        </SafeAreaView>
    );
}