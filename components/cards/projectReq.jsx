import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

const getStatusTheme = (status) => {
    // استفاده از همان status که از سرور می‌آید
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

export default function ProjectReq({ item, onPress }) {
    const theme = getStatusTheme(item.status);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress && onPress(item.id)}
            activeOpacity={0.8}
        >
            <View style={tw`flex-row items-center justify-between mb-3`}>
                <Ionicons name="chevron-back" size={20} color="#9CA3AF" />

                <View style={tw`flex-1 items-end mr-3`}>
                    <View style={tw`flex-row items-center mb-1`}>
                        <MaterialCommunityIcons
                            name="crane"
                            size={18}
                            color="#1F2937"
                            style={tw`ml-2`}
                        />
                        <Text style={tw`text-gray-900 font-bold text-base`}>
                            {item.type}
                        </Text>
                    </View>
                    <Text style={tw`text-gray-600 text-sm text-right`} numberOfLines={2}>
                        {item.description}
                    </Text>
                </View>
            </View>

            <View style={tw`flex-row items-center justify-between`}>
                {item.tags && item.tags.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={tw`flex-1 mr-3`}
                        contentContainerStyle={tw`flex-row-reverse`}
                    >
                        {item.tags.map((tag, index) => (
                            <View
                                key={index}
                                style={styles.tagBadge}
                            >
                                <Text style={tw`text-gray-700 text-xs font-medium`}>
                                    {tag}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                )}

                <View style={tw`items-end`}>
                    {item.date && (
                        <Text style={tw`text-xs text-gray-500 mb-2`}>
                            {item.date}
                        </Text>
                    )}
                    <View style={[
                        styles.statusBadge,
                        {
                            backgroundColor: theme.statusBg,
                            borderColor: theme.statusBorder
                        }
                    ]}>
                        <Text style={[
                            tw`text-xs font-bold`,
                            { color: theme.statusText }
                        ]}>
                            {theme.label}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    tagBadge: {
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginLeft: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    }
});