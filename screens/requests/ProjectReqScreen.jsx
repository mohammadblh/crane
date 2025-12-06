import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { ArrowRight, FileText, MoreVertical, Upload } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ProjectReqScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    console.log('📍 ProjectReqScreen - Request ID:', id);

    const uploadedFiles = [
        {
            id: 1,
            name: 'Textproject.pdf',
            date: 'April 19, 2020',
            size: '300kb'
        },
        {
            id: 2,
            name: 'Textproject.pdf',
            date: 'April 19, 2020',
            size: '300kb'
        }
    ];

    const handleFileOptions = (fileId) => {
        // Handle file options (view, download, delete)
        console.log('File options:', fileId);
    };

    const handleUpload = () => {
        // Handle new file upload
        console.log('Upload new file');
    };

    const handleCancelRequest = () => {
        // Handle cancel request
        console.log('Cancel request');
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowRight size={24} color="#374151" />
                </TouchableOpacity>
                <Text style={tw`text-lg font-bold text-gray-800`}>اجاره پروژه‌ای - #{id}</Text>
                <View style={tw`w-6`} />
            </View>

            <ScrollView style={tw`flex-1`}>
                <View style={tw`px-4 py-6`}>
                    {/* Title Section */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-800 font-bold text-xl text-center mb-2`}>
                            آپلود فایل
                        </Text>
                        <Text style={tw`text-gray-600 text-sm text-center`}>
                            شما میتوانید تا حداکثر ۲۰ مکاتبات قابل آپلود کنید.
                        </Text>
                    </View>

                    {/* Uploaded Files List */}
                    <View style={tw`mb-6`}>
                        {uploadedFiles.map((file) => (
                            <View
                                key={file.id}
                                style={tw`bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between shadow-sm border border-gray-100`}
                            >
                                {/* File Icon */}
                                <View style={tw`w-12 h-12 bg-red-50 rounded-lg items-center justify-center`}>
                                    <FileText size={24} color="#EF4444" />
                                </View>

                                {/* File Info */}
                                <View style={tw`flex-1 mx-3`}>
                                    <Text style={tw`text-gray-800 font-bold text-base mb-1`}>
                                        {file.name}
                                    </Text>
                                    <Text style={tw`text-gray-400 text-xs`}>
                                        {file.date}
                                    </Text>
                                </View>

                                {/* File Size */}
                                <Text style={tw`text-gray-400 text-sm mr-3`}>
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
                        ))}
                    </View>

                    {/* Upload Button - Floating */}
                    <View style={tw`items-center mb-6`}>
                        <TouchableOpacity
                            style={tw`w-16 h-16 bg-yellow-700 rounded-full items-center justify-center shadow-lg`}
                            onPress={handleUpload}
                            activeOpacity={0.8}
                        >
                            <Upload size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Cancel Request Button */}
                    <TouchableOpacity
                        style={tw`bg-red-500 py-4 rounded-xl shadow-lg mb-6`}
                        onPress={handleCancelRequest}
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