// AddWorkScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import RenderForm from '@/components/FormRenderer/RenderForm';
import { ArrowRight, Check } from 'lucide-react-native';

export default function AddWorkScreen({
    indexKeys,
    items,
    onBack,
    onSubmit,
    initialData = {},
    initialSelections = {},
    title = 'افزودن مورد جدید',
    isEditing = false
}) {
    const [formData, setFormData] = useState(initialData);
    const [selectedOptions, setSelectedOptions] = useState(initialSelections);

    useEffect(() => {
        if (isEditing && initialData) {
            setFormData(initialData);
        }
        if (isEditing && initialSelections) {
            setSelectedOptions(initialSelections);
        }
    }, [isEditing, initialData, initialSelections]);

    const handleFormChange = (data) => {
        console.log("FORM DATA CHANGED:", data);

        const newSelectedOptions = {};
        const newFormData = {};

        Object.keys(data).forEach(key => {
            const section = items.find(s => s.sectionId === key);
            if (section && (section.type === 4 || section.type === 5 || section.type === 28)) {
                newSelectedOptions[key] = data[key];
            } else {
                newFormData[key] = data[key];
            }
        });

        setFormData(prev => ({
            ...prev,
            ...newFormData
        }));

        setSelectedOptions(prev => ({
            ...prev,
            ...newSelectedOptions
        }));
    };

    const handleSubmit = () => {
        const requiredFields = items.filter(item => item.required);
        const missingFields = requiredFields.filter(field => {
            const value = formData[field.sectionId] || selectedOptions[field.sectionId];
            return !value || value === '';
        });

        if (missingFields.length > 0) {
            const fieldNames = missingFields.map(f => f.title).join('، ');
            alert(`لطفاً فیلدهای زیر را پر کنید:\n${fieldNames}`);
            return;
        }

        console.log('Submitting:', { formData, selectedOptions });

        if (onSubmit) {
            onSubmit(formData, selectedOptions);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
                <View style={tw`w-6`} />
                <Text style={tw`text-lg font-bold text-gray-800`}>{title}</Text>
                <TouchableOpacity onPress={onBack}>
                    <ArrowRight size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            <ScrollView style={tw`flex-1`}>
                <View style={tw`px-4 py-6`}>
                    {/* Index Badge */}
                    <View style={tw`flex-row items-center justify-center mb-4`}>
                        <View style={tw`bg-yellow-500 rounded-full px-4 py-2`}>
                            <Text style={tw`text-gray-900 font-bold text-sm`}>
                                شماره {indexKeys}
                            </Text>
                        </View>
                    </View>

                    {/* Form Fields */}
                    <RenderForm
                        index={indexKeys}
                        data={items}
                        onChange={handleFormChange}
                        initialValues={{ ...formData, ...selectedOptions }}
                    />

                    {/* Bottom Buttons */}
                    <View style={tw`flex-row justify-between mt-6`}>
                        <TouchableOpacity
                            style={tw`py-3.5 px-6 rounded-xl flex-1 mx-2 bg-yellow-500 shadow-lg flex-row items-center justify-center`}
                            activeOpacity={0.8}
                            onPress={handleSubmit}
                        >
                            <Check size={20} color="#1F2937" style={tw`ml-2`} />
                            <Text style={tw`text-gray-900 font-bold text-base`}>
                                {isEditing ? 'ذخیره تغییرات' : 'ثبت'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={tw`py-3.5 px-6 rounded-xl flex-1 mx-2 bg-white border-2 border-gray-300`}
                            activeOpacity={0.8}
                            onPress={onBack}
                        >
                            <Text style={tw`text-gray-700 font-bold text-center text-base`}>
                                انصراف
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}