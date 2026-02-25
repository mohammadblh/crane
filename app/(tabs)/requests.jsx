// RequestsScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProjectReq from '../../components/cards/projectReq';
import RentalReq from '../../components/cards/rentalReq';
import { api } from '../../hooks/useApi';

const transformApiResponse = (apiResponse) => {
    if (!apiResponse || !apiResponse.forms) {
        return { requests: [], fullData: {} };
    }

    const requests = [];
    const fullData = {};

    Object.entries(apiResponse.forms).forEach(([formType, formData]) => {
        Object.entries(formData).forEach(([requestId, requestData]) => {
            const { name, status, fields } = requestData; // ✅ اضافه کردن status

            fullData[requestId] = {
                type: formType,
                name: name,
                status: status, // ✅ ذخیره status
                fields: fields,
                rawData: requestData
            };

            const tags = [];
            const workTypes = {};
            let date = 'تاریخ نامشخص';
            let workshopName = '';
            let description = '';

            if (fields) {
                if (formType === 'پروژه ای' || formType === 'اجاره طولانی مدت') {
                    const mainFields = fields['1'] || {};

                    if (mainFields['1211'] && Array.isArray(mainFields['1211']) && mainFields['1211'][0]) {
                        workshopName = mainFields['1211'][0];
                    }

                    if (mainFields['1221'] && Array.isArray(mainFields['1221']) && mainFields['1221'][0]) {
                        description = mainFields['1221'][0];
                    }

                    if (mainFields['1236'] && Array.isArray(mainFields['1236']) && mainFields['1236'][1]) {
                        tags.push(mainFields['1236'][1]);
                    }

                    if (mainFields['1223'] && Array.isArray(mainFields['1223']) && mainFields['1223'][1]) {
                        tags.push(mainFields['1223'][1]);
                    }

                    // تاریخ برای پروژه‌ای
                    if (mainFields['1198'] && Array.isArray(mainFields['1198']) && mainFields['1198'][0]) {
                        date = mainFields['1198'][0];
                    }
                } else {
                    Object.values(fields).forEach(fieldGroup => {
                        Object.entries(fieldGroup).forEach(([fieldId, fieldValue]) => {
                            if (fieldId === '1142' && Array.isArray(fieldValue) && fieldValue[0]) {
                                workshopName = fieldValue[0];
                            }
                            if (fieldId === '1147' && Array.isArray(fieldValue) && fieldValue[1]) {
                                const workType = fieldValue[1];
                                workTypes[workType] = (workTypes[workType] || 0) + 1;
                            }
                            if (fieldId === '1154' && Array.isArray(fieldValue) && fieldValue[1]) {
                                const materialType = fieldValue[1];
                                if (!tags.includes(materialType)) {
                                    tags.push(materialType);
                                }
                            }
                            if (fieldId === '1155' && Array.isArray(fieldValue) && fieldValue[0]) {
                                if (date === 'تاریخ نامشخص') {
                                    date = fieldValue[0];
                                }
                            }
                        });
                    });

                    Object.entries(workTypes).forEach(([type, count]) => {
                        if (count > 1) {
                            tags.unshift(`${count} ${type}`);
                        } else {
                            tags.unshift(type);
                        }
                    });
                }
            }

            console.log('workshopName || description || name', workshopName, description, name)
            let finalDescription = name || workshopName || description || 'بدون نام';

            if (!finalDescription || finalDescription === 'بدون نام') {
                if (fields && fields['1']) {
                    const locationField = fields['1']['1177'] || fields['1']['1221'];
                    if (locationField && Array.isArray(locationField) && locationField[0]) {
                        finalDescription = locationField[0];
                    }
                }
            }

            requests.push({
                id: parseInt(requestId),
                type: formType,
                date: date,
                description: finalDescription,
                status: status, // ✅ استفاده از status واقعی از سرور
                tags: tags.length > 0 ? tags : undefined
            });
        });
    });

    requests.sort((a, b) => {
        if (a.date === 'تاریخ نامشخص') return 1;
        if (b.date === 'تاریخ نامشخص') return -1;
        return b.date.localeCompare(a.date);
    });

    return { requests, fullData };
};


export default function RequestsScreen() {
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load requests from API
    const loadRequestsFromApi = async () => {
        try {
            setLoading(true);
            setError(null);

            const finger = await AsyncStorage.getItem('user_finger');
            const response = await api.getRequest(finger);

            if (response && response.success) {
                const { requests: transformedRequests, fullData } = transformApiResponse(response);
                console.log('📥 API Requests:', transformedRequests);
                setRequests(transformedRequests);

                // ذخیره هم لیست و هم داده‌های کامل
                await AsyncStorage.setItem('requests_cache', JSON.stringify(transformedRequests));
                await AsyncStorage.setItem('requests_full_data', JSON.stringify(fullData));
            } else {
                throw new Error(response?.message || 'خطا در دریافت درخواست‌ها');
            }
        } catch (error) {
            console.error('Error loading requests from API:', error);
            setError(error.message);
            await loadRequestsFromCache();
        } finally {
            setLoading(false);
        }
    };

    const loadRequestsFromCache = async () => {
        try {
            const cachedRequests = await AsyncStorage.getItem('requests_cache');
            if (cachedRequests) {
                const parsedRequests = JSON.parse(cachedRequests);
                console.log('📦 Loaded from cache:', parsedRequests);
                setRequests(parsedRequests);
            } else {
                setRequests([]);
            }
        } catch (error) {
            console.error('Error loading from cache:', error);
            setRequests([]);
        }
    };

    useEffect(() => {
        loadRequestsFromApi();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadRequestsFromApi();
        }, [])
    );

    const handleRequestClick = (type, id) => {
        if (type === 'اجاره موردی') {
            router.push(`/rental-request?id=${id}`);
        } else if (type === 'پروژه ای' || type === 'اجاره طولانی مدت') {
            router.push(`/project-request?id=${id}`);
        }
    };

    const clearCache = async () => {
        console.log('Clearing cache...');
        await AsyncStorage.removeItem('requests_cache');
        await AsyncStorage.removeItem('requests_full_data');
        setRequests([]);
        loadRequestsFromApi();
    };

    const retryLoading = () => {
        setError(null);
        loadRequestsFromApi();
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" />

            <View style={tw`bg-white border-b border-gray-200 px-4 py-4`}>
                <Text
                    style={tw`text-lg font-bold text-gray-800 text-center`}
                    onLongPress={() => clearCache()}
                >
                    درخواست‌ها
                </Text>
            </View>

            {loading && (
                <View style={tw`flex-1 items-center justify-center`}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={tw`text-gray-600 mt-4`}>در حال بارگذاری...</Text>
                </View>
            )}

            {!loading && error && (
                <View style={tw`flex-1 items-center justify-center px-4`}>
                    <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>
                    <TouchableOpacity
                        style={tw`bg-blue-500 px-6 py-3 rounded-lg`}
                        onPress={retryLoading}
                    >
                        <Text style={tw`text-white font-bold`}>تلاش مجدد</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!loading && !error && requests.length === 0 && (
                <View style={tw`flex-1 items-center justify-center px-4`}>
                    <Text style={tw`text-gray-500 text-center text-lg`}>
                        هیچ درخواستی یافت نشد
                    </Text>
                    <TouchableOpacity
                        style={tw`bg-blue-500 px-6 py-3 rounded-lg mt-4`}
                        onPress={retryLoading}
                    >
                        <Text style={tw`text-white font-bold`}>بارگذاری مجدد</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!loading && !error && requests.length > 0 && (
                <ScrollView
                    style={tw`flex-1`}
                    contentContainerStyle={[tw`px-4 py-4`, { paddingBottom: 100 }]}
                >
                    {requests.map((req) => {
                        if (req.type === 'اجاره موردی') {
                            return (
                                <RentalReq
                                    key={`${req.type}-${req.id}`}
                                    item={req}
                                    onPress={(id) => handleRequestClick(req.type, id)}
                                />
                            );
                        }
                        if (req.type === 'پروژه ای' || req.type === 'اجاره طولانی مدت') {
                            return (
                                <ProjectReq
                                    key={`${req.type}-${req.id}`}
                                    item={req}
                                    onPress={(id) => handleRequestClick(req.type, id)}
                                />
                            );
                        }
                        return null;
                    })}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}