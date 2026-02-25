// rental-request.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../hooks/useApi';
import ConfirmDialog from '../../components/ConfirmDialog';

const getStatusTheme = (status) => {
    switch (status) {
        case 'پرداخت شده':
            return {
                label: status,
                statusBg: "#D1FAE5",
                statusBorder: "#86EFAC",
                statusText: "#065F46",
            };
        case 'منتظر پرداخت':
            return {
                label: status,
                statusBg: "#FEE2E2",
                statusBorder: "#FCA5A5",
                statusText: "#991B1B",
            };
        case 'در حال بررسی':
        default:
            return {
                label: status || 'در حال بررسی',
                statusBg: "#FEF3C7",
                statusBorder: "#FDE68A",
                statusText: "#92400E",
            };
    }
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

    const parseRequestData = () => {
        if (!requestData || !requestData.fields) return null;

        const works = [];
        let workshopName = '';
        let mainDate = 'تاریخ نامشخص';
        let totalPrice = null;

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
                        workshopName = Array.isArray(fieldValue) && fieldValue[1] ? fieldValue[1] : '';
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
            status: requestData.status, // ✅ استفاده از status واقعی
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
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#EAB308" />
                    <Text style={styles.loadingText}>در حال بارگذاری...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!requestData) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
                    <Text style={styles.errorText}>درخواست یافت نشد</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>بازگشت</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const parsedData = parseRequestData();
    const statusTheme = getStatusTheme(parsedData.status);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerSpacer} />
                <Text style={styles.headerTitle}>اجاره موردی</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <Ionicons name="arrow-forward" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    {/* Status Header */}
                    <View style={[
                        styles.statusHeader,
                        {
                            backgroundColor: statusTheme.statusBg,
                            borderColor: statusTheme.statusBorder
                        }
                    ]}>
                        <View style={styles.statusHeaderTop}>
                            <Text style={styles.dateText}>{parsedData.mainDate}</Text>
                            <Text style={[
                                styles.statusLabel,
                                { color: statusTheme.statusText }
                            ]}>
                                {statusTheme.label}
                            </Text>
                        </View>
                        {parsedData.workshopName && (
                            <Text style={styles.workshopText}>
                                کارگاه: {parsedData.workshopName}
                            </Text>
                        )}
                    </View>

                    {/* Work Cards */}
                    {parsedData.works.map((work, index) => (
                        work.workType && (
                            <View key={index} style={styles.workCard}>
                                {/* Card Header */}
                                <View style={styles.workCardHeader}>
                                    <Text style={styles.workCounter}>
                                        {index + 1}/{parsedData.works.length}
                                    </Text>
                                    <Text style={styles.workType}>
                                        {work.workType}
                                    </Text>
                                </View>

                                {/* Details */}
                                <View style={styles.detailsContainer}>
                                    {work.materialType && (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailValue}>{work.materialType}</Text>
                                            <Text style={styles.detailLabel}>نوع مصالح:</Text>
                                        </View>
                                    )}

                                    {work.location && (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailValueMultiline} numberOfLines={2}>
                                                {work.location}
                                            </Text>
                                            <Text style={styles.detailLabel}>محل اجرا:</Text>
                                        </View>
                                    )}

                                    {work.date && (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailValue}>{work.date}</Text>
                                            <Text style={styles.detailLabel}>تاریخ:</Text>
                                        </View>
                                    )}

                                    {(work.tonnage || work.length || work.width) && (
                                        <View style={styles.detailRow}>
                                            <View style={styles.dimensionsContainer}>
                                                {work.tonnage && (
                                                    <Text style={styles.dimensionItem}>
                                                        تناژ: {work.tonnage}
                                                    </Text>
                                                )}
                                                {work.length && (
                                                    <Text style={styles.dimensionItem}>
                                                        طول: {work.length}
                                                    </Text>
                                                )}
                                                {work.width && (
                                                    <Text style={styles.dimensionItem}>
                                                        عرض: {work.width}
                                                    </Text>
                                                )}
                                            </View>
                                            <Text style={styles.detailLabel}>ابعاد:</Text>
                                        </View>
                                    )}

                                    {work.environmentalConditions && (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailValueMultiline} numberOfLines={2}>
                                                {work.environmentalConditions}
                                            </Text>
                                            <Text style={styles.detailLabel}>شرایط محیطی:</Text>
                                        </View>
                                    )}

                                    {work.insurance && (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailValue}>{work.insurance}</Text>
                                            <Text style={styles.detailLabel}>بیمه:</Text>
                                        </View>
                                    )}

                                    {work.additionalServices && (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailValue}>{work.additionalServices}</Text>
                                            <Text style={styles.detailLabel}>خدمات اضافی:</Text>
                                        </View>
                                    )}

                                    {work.prepaymentPercent && (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailValue}>{work.prepaymentPercent}</Text>
                                            <Text style={styles.detailLabel}>پیش پرداخت:</Text>
                                        </View>
                                    )}

                                    {work.executionPeriod && (
                                        <View style={[styles.detailRow, styles.lastDetailRow]}>
                                            <Text style={styles.detailValue}>{work.executionPeriod}</Text>
                                            <Text style={styles.detailLabel}>مدت اجرا:</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )
                    ))}

                    {/* Total Price */}
                    {parsedData.totalPrice && (
                        <View style={styles.priceCard}>
                            <Text style={styles.priceValue}>
                                {parsedData.totalPrice} تومان
                            </Text>
                            <Text style={styles.priceLabel}>قیمت کل:</Text>
                        </View>
                    )}

                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        activeOpacity={0.8}
                        onPress={() => setIsCancelModalVisible(true)}
                    >
                        <Text style={styles.cancelButtonText}>لغو درخواست</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    loadingText: {
        color: '#6B7280',
        marginTop: 16,
        fontSize: 14,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: '#EAB308',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 16,
    },
    backButtonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 14,
    },
    header: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    headerSpacer: {
        width: 24,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1F2937',
    },
    backIcon: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    statusHeader: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
    },
    statusHeaderTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dateText: {
        color: '#6B7280',
        fontSize: 13,
    },
    statusLabel: {
        fontWeight: '700',
        fontSize: 15,
    },
    workshopText: {
        color: '#374151',
        fontSize: 14,
        textAlign: 'right',
        marginTop: 8,
    },
    workCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    workCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    workCounter: {
        color: '#9CA3AF',
        fontSize: 13,
    },
    workType: {
        color: '#1F2937',
        fontWeight: '700',
        fontSize: 16,
    },
    detailsContainer: {
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    lastDetailRow: {
        borderBottomWidth: 0,
    },
    detailLabel: {
        color: '#6B7280',
        fontSize: 13,
        marginLeft: 8,
    },
    detailValue: {
        color: '#374151',
        fontSize: 13,
    },
    detailValueMultiline: {
        color: '#374151',
        fontSize: 13,
        flex: 1,
        textAlign: 'right',
    },
    dimensionsContainer: {
        flexDirection: 'row',
    },
    dimensionItem: {
        color: '#374151',
        fontSize: 13,
        marginLeft: 12,
    },
    priceCard: {
        backgroundColor: '#DBEAFE',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#93C5FD',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceLabel: {
        color: '#1E40AF',
        fontWeight: '700',
        fontSize: 14,
    },
    priceValue: {
        color: '#1E40AF',
        fontWeight: '700',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#EF4444',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cancelButtonText: {
        color: '#ffffff',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 15,
    },
});