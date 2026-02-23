import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Upload, X, CheckCircle } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../../hooks/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FileUpload({ field, value, onChange }) {
    field.multiple = false;
    const [files, setFiles] = useState(value || []);
    const [uploading, setUploading] = useState(false);
    const isMultiple = field.multiple === true;     // false = تک فایل (پیش‌فرض) | true = چند فایل
    const maxFiles = isMultiple ? (field.size || 20) : 1;
    const acceptedFormats = field.acceptedFormats || ['image/*', 'application/pdf'];
    const formatDescription = field.placeholder || `فرمت پشتیبانی باید تصویر یا PDF باشد`;

    if (files && !Array.isArray(files)) {
        setFiles([files]);
    }
    const uploadFileToServer = async (file) => {
        try {
            const finger = await AsyncStorage.getItem('user_finger');

            if (!finger) {
                console.error('Finger not found');
                return null;
            }

            const fileName = file.name || `file_${Date.now()}.jpg`;
            const fileType = file.type || 'image/jpeg';

            console.log('Uploading file:', { fileName, fileType, uri: file.uri });

            const response = await api.uploadFile(finger, file.uri, fileName, fileType);
            console.log('Upload result:', response);

            if (response?.success && response?.file) {
                // response.file = نام فایل روی سرور (مثلاً "6303391.png")
                // response.fileUrl = آدرس کامل برای پریویو
                return {
                    ...file,
                    serverFileName: response.file,          // نامی که به onChange میدیم
                    serverUrl: response.fileUrl,            // URL کامل برای پریویو
                    uploaded: true
                };
            } else {
                console.error('Upload failed:', response);
                alert(response?.message || 'خطا در آپلود فایل');
                return null;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('خطا در آپلود فایل');
            return null;
        }
    };

    const handleFilePick = async () => {
        try {
            // وقتی single mode است و فایل داریم، ادامه نده
            if (!isMultiple && files.length >= 1) {
                alert('برای تغییر فایل، ابتدا فایل فعلی را حذف کنید');
                return;
            }
            if (isMultiple && files.length >= maxFiles) {
                alert(`حداکثر ${maxFiles} فایل قابل آپلود است`);
                return;
            }

            const isImageOnly = acceptedFormats.every(format => format.includes('image'));
            let selectedFiles = [];

            if (isImageOnly) {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsMultipleSelection: isMultiple,    // فقط وقتی multiple=true چند تا مجازه
                    quality: 0.8,
                });

                if (!result.canceled) {
                    selectedFiles = result.assets.map((asset, index) => ({
                        uri: asset.uri,
                        name: asset.fileName || `image_${Date.now()}_${index}.jpg`,
                        type: asset.type || 'image/jpeg',
                        size: asset.fileSize,
                        uploaded: false
                    }));
                }
            } else {
                const result = await DocumentPicker.getDocumentAsync({
                    type: acceptedFormats,
                    multiple: isMultiple,                   // فقط وقتی multiple=true چند تا مجازه
                });

                if (result.type !== 'cancel') {
                    selectedFiles = (Array.isArray(result.assets) ? result.assets : [result]).map(file => ({
                        ...file,
                        uploaded: false
                    }));
                }
            }

            if (selectedFiles.length > 0) {
                setUploading(true);

                // آپلود تک تک فایل‌ها
                const uploadPromises = selectedFiles.map(file => uploadFileToServer(file));
                const uploadedFiles = await Promise.all(uploadPromises);

                // فیلتر کردن فایل‌هایی که با موفقیت آپلود شدند
                const successfulUploads = uploadedFiles.filter(file => file !== null);

                if (successfulUploads.length > 0) {
                    // در single mode، فایل جدید جایگزین قبلی میشه
                    const base = isMultiple ? files : [];
                    const updatedFiles = [...base, ...successfulUploads].slice(0, maxFiles);
                    setFiles(updatedFiles);

                    const serverFileNames = updatedFiles
                        .filter(f => f.uploaded && f.serverFileName)
                        .map(f => f.serverFileName);

                    // در single mode، یک رشته برمی‌گردونه؛ در multiple mode، آرایه
                    if (onChange) onChange(isMultiple ? serverFileNames : serverFileNames[0] || null);
                }

                setUploading(false);
            }
        } catch (error) {
            console.error('Error picking file:', error);
            setUploading(false);
            alert('خطا در انتخاب فایل');
        }
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);

        // به onChange فقط نام فایل روی سرور رو میدیم
        const serverFileNames = updatedFiles
            .filter(f => f.uploaded && f.serverFileName)
            .map(f => f.serverFileName);

        if (onChange) onChange(serverFileNames);
    };

    const isImage = (file) => {
        return file.type?.includes('image') || file.uri?.match(/\.(jpg|jpeg|png|gif)$/i);
    };

    if (!Array.isArray(files)) return null
    return (
        <View style={tw`mb-4`}>
            {/* Title */}
            <Text style={tw`text-gray-800 font-bold text-lg mb-2 text-right`}>
                {field.title}
            </Text>

            {/* Description */}
            {field.description && (
                <Text style={tw`text-gray-600 text-sm mb-4 text-right`}>
                    {field.description}
                </Text>
            )}

            {/* Upload Area */}
            <TouchableOpacity
                style={tw`bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 items-center justify-center min-h-64`}
                onPress={handleFilePick}
                activeOpacity={0.7}
                disabled={uploading}
            >
                {uploading ? (
                    <>
                        <ActivityIndicator size="large" color="#EAB308" />
                        <Text style={tw`text-gray-600 font-bold text-base mt-4`}>
                            در حال آپلود...
                        </Text>
                    </>
                ) : (
                    <>
                        <View style={tw`w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4`}>
                            <Upload size={28} color="#9CA3AF" />
                        </View>

                        <Text style={tw`text-yellow-600 font-bold text-base mb-2`}>
                            برای آپلود فایل کلیک کنید
                        </Text>

                        <Text style={tw`text-gray-500 text-xs text-center`}>
                            {formatDescription}
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Files Preview */}
            {files.length > 0 && (
                <View style={tw`mt-4`}>
                    <Text style={tw`text-gray-700 font-bold text-sm mb-3 text-right`}>
                        فایل‌های آپلود شده ({files.length}/{maxFiles})
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={tw`flex-row mt-2`}>
                            {files.map((file, index) => (
                                <View
                                    key={index}
                                    style={tw`bg-white border-2 border-gray-200 rounded-xl p-2 ml-3 relative`}
                                >
                                    {/* Upload Status Badge */}
                                    {file.uploaded && (
                                        <View style={tw`absolute -top-2 -left-2 w-6 h-6 bg-green-500 rounded-full items-center justify-center z-10`}>
                                            <CheckCircle size={14} color="white" />
                                        </View>
                                    )}

                                    {/* Remove Button */}
                                    <TouchableOpacity
                                        style={tw`absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center z-10`}
                                        onPress={() => handleRemoveFile(index)}
                                    >
                                        <X size={14} color="white" strokeWidth={3} />
                                    </TouchableOpacity>

                                    {/* File Preview */}
                                    {isImage(file) ? (
                                        <Image
                                            source={{ uri: file.serverUrl || file.uri }}
                                            style={{ width: 80, height: 80, borderRadius: 8 }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={tw`w-20 h-20 bg-gray-100 rounded-lg items-center justify-center`}>
                                            <Text style={tw`text-gray-500 text-xs font-bold`}>
                                                PDF
                                            </Text>
                                        </View>
                                    )}

                                    {/* File Name */}
                                    <Text
                                        style={tw`text-gray-700 text-xs mt-2 text-center`}
                                        numberOfLines={1}
                                    >
                                        {file.name?.length > 12
                                            ? `${file.name.substring(0, 12)}...`
                                            : file.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
}