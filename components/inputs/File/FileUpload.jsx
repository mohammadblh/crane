import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Upload, X } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export default function FileUpload({ field, value, onChange }) {
    const [files, setFiles] = useState(value || []);
    const maxFiles = field.size || 20;
    const acceptedFormats = field.acceptedFormats || ['image/*', 'application/pdf'];
    const formatDescription = field.formatDescription || `فرمت پشتیبانی باید PDF باشد`;

    const handleFilePick = async () => {
        try {
            if (files.length >= maxFiles) {
                alert(`حداکثر ${maxFiles} فایل قابل آپلود است`);
                return;
            }

            // Check if we should pick images or documents
            const isImageOnly = acceptedFormats.every(format => format.includes('image'));

            if (isImageOnly) {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsMultipleSelection: true,
                    quality: 1,
                });

                if (!result.canceled) {
                    const newFiles = result.assets.map((asset, index) => ({
                        uri: asset.uri,
                        name: asset.fileName || `image_${Date.now()}_${index}.jpg`,
                        type: asset.type || 'image/jpeg',
                        size: asset.fileSize,
                    }));

                    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
                    setFiles(updatedFiles);
                    if (onChange) onChange(updatedFiles);
                }
            } else {
                const result = await DocumentPicker.getDocumentAsync({
                    type: acceptedFormats,
                    multiple: true,
                });

                if (result.type !== 'cancel') {
                    const newFiles = Array.isArray(result.assets) ? result.assets : [result];
                    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
                    setFiles(updatedFiles);
                    if (onChange) onChange(updatedFiles);
                }
            }
        } catch (error) {
            console.error('Error picking file:', error);
        }
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        if (onChange) onChange(updatedFiles);
    };

    const isImage = (file) => {
        return file.type?.includes('image') || file.uri?.match(/\.(jpg|jpeg|png|gif)$/i);
    };

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
            >
                <View style={tw`w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4`}>
                    <Upload size={28} color="#9CA3AF" />
                </View>

                <Text style={tw`text-yellow-600 font-bold text-base mb-2`}>
                    برای آپلود فایل کلیک کنید
                </Text>

                <Text style={tw`text-gray-500 text-xs text-center`}>
                    {formatDescription}
                </Text>
            </TouchableOpacity>

            {/* Files Preview */}
            {files.length > 0 && (
                <View style={tw`mt-4`}>
                    <Text style={tw`text-gray-700 font-bold text-sm mb-3 text-right`}>
                        فایل‌های انتخاب شده ({files.length}/{maxFiles})
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={tw`flex-row`}>
                            {files.map((file, index) => (
                                <View
                                    key={index}
                                    style={tw`bg-white border-2 border-gray-200 rounded-xl p-2 ml-3 relative`}
                                >
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
                                            source={{ uri: file.uri }}
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