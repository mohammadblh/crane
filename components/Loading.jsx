import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const Loading = () => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FBC02D" />
            <Text style={styles.loadingText}>در حال بارگذاری...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
        // fontFamily: Platform.OS === 'ios' ? 'System' : 'Vazir',
    },
});

export default Loading;