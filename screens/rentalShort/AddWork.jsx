import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import RenderForm from '@/components/FormRenderer/RenderForm';
import { ArrowRight, Check, X } from 'lucide-react-native';
import Input2 from '@/components/inputs/TextInput/Input2';
import { colorMap } from '@/config/config';
import DatePickerComponent2 from '@/components/inputs/Date/DatePicker2';

export default function AddLoadingScreen({ addWorkName, items, onBack, onSubmit }) {
    const [formData, setFormData] = useState({});

    console.log(', items', items,)
    console.log('addWorkName,', addWorkName)

    const handleSubmit = () => {
        console.log('Submitting formData:', formData);
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
                <View style={tw`w-6`} />
                <Text style={tw`text-lg font-bold text-gray-800`}>افزودن {addWorkName}</Text>
                <TouchableOpacity onPress={onBack}>
                    <ArrowRight size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            <ScrollView style={tw`flex-1`}>
                <View style={tw`px-4 py-6`}>
                    <Text style={tw`text-gray-800 font-bold text-lg mb-6 text-right`}>شرایط کار:</Text>

                    <RenderForm
                        data={items}
                        onChange={(data) => {
                            console.log("FORM:", data);
                            setFormData(data);
                        }}
                    />

                    <DatePickerComponent2
                        field={{
                            "sectionId": "time_duration",
                            "title": "مدت زمان:",
                            "label": "مدت زمان",
                            "placeholder": "۱۴۰۴/۰۹/۱۰ تا ۱۴۰۴/۰۹/۲۵",
                            "type": 7,
                            "style": 1,
                            "required": false,
                            "mode": "range",
                            "defaultValue": null
                        }}
                        value={null}
                        onChange={(value) => console.log('Selected value:', value)}
                    />

                    {/* Bottom Buttons */}
                    <View style={tw`flex-row justify-between`}>
                        <TouchableOpacity
                            style={[
                                tw`py-3 px-5 rounded-lg flex-1 mx-2`,
                                {
                                    backgroundColor: colorMap[items[0]?.color] || colorMap['yellow'],
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }
                            ]}
                            activeOpacity={0.8}
                            onPress={handleSubmit}
                        >
                            <Text style={tw`text-white font-bold text-center text-sm`}>
                                ثبت
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                tw`py-3 px-5 rounded-lg flex-1 mx-2`,
                                tw`bg-white border-2 border-gray-300`
                            ]}
                            activeOpacity={0.8}
                            onPress={onBack}
                        >
                            <Text style={tw`text-gray-700 font-bold text-center text-sm`}>
                                تغییر
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}