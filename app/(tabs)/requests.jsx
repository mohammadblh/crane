import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProjectReq from '../../components/cards/projectReq';
import RentalReq from '../../components/cards/rentalReq';

const transformLoadedRequest = (loadedRequest) => {
    // تبدیل تاریخ به شمسی (فرضی)
    const convertToPersianDate = (dateString) => {
        const date = new Date(dateString);
        const persianDate = date.toLocaleDateString('fa-IR');
        return persianDate;
    };

    // استخراج تعداد هر نوع کار
    const extractWorkCounts = (works) => {
        const counts = {};
        works?.forEach(work => {
            if (work.type) {
                counts[work.type] = (counts[work.type] || 0) + 1;
            }
        });
        return counts;
    };

    // ساخت آرایه تگ‌ها
    const buildTags = (works, additionalServices) => {
        const tags = [];

        if (loadedRequest.type === 'اجاره موردی') {
            const workCounts = extractWorkCounts(works);
            Object.entries(workCounts).forEach(([type, count]) => {
                if (count > 1) {
                    tags.push(`${count} ${type}`);
                } else tags.push(type);
            });
        }

        // تگ‌های مربوط به نوع کارها
        // const workCounts = extractWorkCounts(works);
        // Object.entries(workCounts).forEach(([type, count]) => {
        //     tags.push(`${count} ${type}`);
        // });

        // // تگ‌های مربوط به خدمات اضافی
        // if (additionalServices) {
        //     if (additionalServices['بیمه'] && additionalServices['بیمه'] !== 'بدون بیمه') {
        //         tags.push('بیمه');
        //     }
        //     if (additionalServices['مدارک و مجوز ها']) {
        //         tags.push('مدارک');
        //     }
        //     if (additionalServices['هزینه رفت و برگشت']) {
        //         tags.push('رفت و برگشت');
        //     }
        // }

        return tags;
    };

    // تبدیل به فرمت مورد نظر
    const result = {
        id: loadedRequest.id || 0,
        type: loadedRequest.type || 'پروژه ای',
        date: convertToPersianDate(loadedRequest.timestamp) || '۱۴۰۳/۰۸/۲۷',
        description: loadedRequest.workshop?.name || 'آدرس',
        status: loadedRequest.status || 'pending',
        tags: buildTags(loadedRequest.works, loadedRequest.additionalServices)
    };

    return result;
};



export default function RequestsScreen() {
    const router = useRouter();
    const [requests, setRequests] = useState([]);

    // Load requests from AsyncStorage
    const loadRequests = async () => {
        try {
            const storedRequests = await AsyncStorage.getItem('requests');
            if (storedRequests) {
                const parsedRequests = JSON.parse(storedRequests);
                console.log('📥 Loaded requests:', parsedRequests);
                const transformedRequests = parsedRequests.map(transformLoadedRequest);
                console.log('📥 Transformed requests:', transformedRequests);
                setRequests(transformedRequests);
            } else {
                console.log('No requests found in AsyncStorage');
                setRequests([]);
            }
        } catch (error) {
            console.error('Error loading requests:', error);
            setRequests([]);
        }
    };
    console.log('requests', requests)

    // Load on mount
    useEffect(() => {
        loadRequests();
    }, []);

    // Reload when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadRequests();
        }, [])
    );

    const handleRequestClick = (type, id) => {
        if (type === 'اجاره موردی') {
            router.push(`/rental-request?id=${id}`);
        } else if (type === 'پروژه ای') {
            router.push(`/project-request?id=${id}`);
        }
    };
    // const requests = [
    //     {
    //         "id": 1,
    //         "type": "اجاره موردی",
    //         "date": "۱۴۰۳/۰۸/۲۷",
    //         "description": "کاشان بلوار مطهری میدان مدخل شهر خیابان نظیر",
    //         "status": "pending",
    //         "tags": [
    //             { "label": "۲ بارگیری" },
    //             { "label": "۱ نصب" },
    //             { "label": "۴ تخلیه" }
    //         ]
    //     },
    //     {
    //         "id": 2,
    //         "type": "اجاره موردی",
    //         "date": "۱۴۰۳/۰۸/۲۷",
    //         "description": "کاشان بلوار مطهری میدان مدخل شهر خیابان نظیر",
    //         "status": "paid",
    //         "tags": [
    //             { "label": "۱ جرثقیل" },
    //             { "label": "۴ تخلیه" }
    //         ]
    //     },
    //     {
    //         "id": 3,
    //         "type": "اجاره موردی",
    //         "date": "۱۴۰۳/۰۸/۲۷",
    //         "description": "کاشان بلوار مطهری میدان مدخل شهر خیابان نظیر",
    //         "status": "waiting",
    //         "tags": [
    //             { "label": "۲ بارگیری" },
    //             { "label": "۱ نصب" },
    //             { "label": "۴ تخلیه" },
    //             { "label": "۴ جرثقیل" }
    //         ]
    //     },
    //     {
    //         id: 4,
    //         type: 'پروژه ای',
    //         date: '۱۴۰۳/۰۸/۲۷',
    //         description: 'کاشان بلوار مطهری میدان مدخل شهر خیابان نظیر',
    //         status: 'pending',
    //     },
    //     {
    //         id: 5,
    //         type: 'پروژه ای',
    //         date: '۱۴۰۳/۰۸/۲۷',
    //         description: 'کاشان بلوار مطهری میدان مدخل شهر خیابان نظیر',
    //         status: 'paid',
    //         tags: ['۱ جرثقیل'],
    //     },
    //     {
    //         id: 6,
    //         type: 'پروژه ای',
    //         date: '۱۴۰۳/۰۸/۲۷',
    //         description: 'کاشان بلوار مطهری میدان مدخل شهر خیابان نظیر',
    //         status: 'waiting',
    //         tags: ['۴ جرثقیل'],
    //     }
    // ]

    const clearRequest = async () => {
        console.log('Clearing requests...');
        await AsyncStorage.removeItem('requests');
        loadRequests()
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-white`} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`bg-white border-b border-gray-200 px-4 py-4`}>
                <Text style={tw`text-lg font-bold text-gray-800 text-center`} onPress={() => clearRequest()}>درخواست‌ها</Text>
            </View>

            <ScrollView
                style={tw`flex-1`}
                contentContainerStyle={[tw`px-4 py-4`, { paddingBottom: 100 }]}
            >
                {requests.map((req) => {
                    if (req.type === 'اجاره موردی') return (
                        <RentalReq
                            key={req.id}
                            item={req}
                            onPress={(id) => handleRequestClick(req.type, id)}
                        />
                    );
                    if (req.type === 'پروژه ای') return (
                        <ProjectReq
                            key={req.id}
                            item={req}
                            onPress={(id) => handleRequestClick(req.type, id)}
                        />
                    );
                })}

            </ScrollView>
        </SafeAreaView>
    );
}
