import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { ArrowRight, Check, X } from 'lucide-react-native';

export default function AddLoadingScreen({ onBack, onSubmit }) {
    const [conditions, setConditions] = useState({
        location: true,
        weight: true,
        type: true,
        carAccess: true
    });

    const [locationValue, setLocationValue] = useState('');
    const [weightValue, setWeightValue] = useState('');
    const [typeValue, setTypeValue] = useState('');
    const [accessValue, setAccessValue] = useState('');

    const toggleCondition = (key) => {
        setConditions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const clearInput = (setter) => {
        setter('');
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
                <TouchableOpacity onPress={onBack}>
                    <ArrowRight size={24} color="#374151" />
                </TouchableOpacity>
                <Text style={tw`text-lg font-bold text-gray-800`}>افزودن بارگیری</Text>
                <View style={tw`w-6`} />
            </View>

            <ScrollView style={tw`flex-1`}>
                <View style={tw`px-4 py-6`}>
                    <Text style={tw`text-gray-800 font-bold text-lg mb-6 text-right`}>شرایط کار:</Text>

                    {/* Condition 1: Location */}
                    <View style={tw`mb-6`}>
                        <View style={tw`flex-row items-center justify-between mb-3`}>
                            <TouchableOpacity
                                style={tw`w-7 h-7 rounded ${conditions.location ? 'bg-blue-500' : 'bg-white border-2 border-gray-300'} items-center justify-center`}
                                onPress={() => toggleCondition('location')}
                                activeOpacity={0.8}
                            >
                                {conditions.location && (
                                    <Check size={18} color="white" strokeWidth={3} />
                                )}
                            </TouchableOpacity>
                            <Text style={tw`flex-1 text-gray-700 font-bold text-base text-right mr-3`}>محل بارگیری:</Text>
                        </View>

                        <View style={tw`bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5 flex-row items-center justify-between`}>
                            {locationValue ? (
                                <TouchableOpacity onPress={() => clearInput(setLocationValue)}>
                                    <X size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            ) : (
                                <View style={tw`w-5`} />
                            )}
                            <TextInput
                                style={tw`flex-1 text-gray-800 text-base text-right mr-3`}
                                placeholder="خیابان اصلی"
                                placeholderTextColor="#9CA3AF"
                                value={locationValue}
                                onChangeText={setLocationValue}
                            />
                            <Text style={tw`text-gray-500 text-sm`}>محل بارگیری</Text>
                        </View>
                    </View>

                    {/* Condition 2: Weight */}
                    <View style={tw`mb-6`}>
                        <View style={tw`flex-row items-center justify-between mb-3`}>
                            <TouchableOpacity
                                style={tw`w-7 h-7 rounded ${conditions.weight ? 'bg-blue-500' : 'bg-white border-2 border-gray-300'} items-center justify-center`}
                                onPress={() => toggleCondition('weight')}
                                activeOpacity={0.8}
                            >
                                {conditions.weight && (
                                    <Check size={18} color="white" strokeWidth={3} />
                                )}
                            </TouchableOpacity>
                            <Text style={tw`flex-1 text-gray-700 font-bold text-base text-right mr-3`}>وزن بار:</Text>
                        </View>

                        <View style={tw`bg-white border-2 border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between`}>
                            {weightValue ? (
                                <TouchableOpacity onPress={() => clearInput(setWeightValue)}>
                                    <X size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            ) : (
                                <View style={tw`w-5`} />
                            )}
                            <TextInput
                                style={tw`flex-1 text-gray-800 text-base text-right mr-3`}
                                placeholder="۵ تن"
                                placeholderTextColor="#9CA3AF"
                                value={weightValue}
                                onChangeText={setWeightValue}
                                keyboardType="numeric"
                            />
                            <Text style={tw`text-gray-500 text-sm`}>وزن بار</Text>
                        </View>
                    </View>

                    {/* Condition 3: Type */}
                    <View style={tw`mb-6`}>
                        <View style={tw`flex-row items-center justify-between mb-3`}>
                            <TouchableOpacity
                                style={tw`w-7 h-7 rounded ${conditions.type ? 'bg-blue-500' : 'bg-white border-2 border-gray-300'} items-center justify-center`}
                                onPress={() => toggleCondition('type')}
                                activeOpacity={0.8}
                            >
                                {conditions.type && (
                                    <Check size={18} color="white" strokeWidth={3} />
                                )}
                            </TouchableOpacity>
                            <Text style={tw`flex-1 text-gray-700 font-bold text-base text-right mr-3`}>نوع بار:</Text>
                        </View>

                        <View style={tw`bg-white border-2 border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between`}>
                            {typeValue ? (
                                <TouchableOpacity onPress={() => clearInput(setTypeValue)}>
                                    <X size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            ) : (
                                <View style={tw`w-5`} />
                            )}
                            <TextInput
                                style={tw`flex-1 text-gray-800 text-base text-right mr-3`}
                                placeholder="بتن آماده"
                                placeholderTextColor="#9CA3AF"
                                value={typeValue}
                                onChangeText={setTypeValue}
                            />
                            <Text style={tw`text-gray-500 text-sm`}>نوع بار</Text>
                        </View>
                    </View>

                    {/* Condition 4: Car Access */}
                    <View style={tw`mb-8`}>
                        <View style={tw`flex-row items-center justify-between mb-3`}>
                            <TouchableOpacity
                                style={tw`w-7 h-7 rounded ${conditions.carAccess ? 'bg-blue-500' : 'bg-white border-2 border-gray-300'} items-center justify-center`}
                                onPress={() => toggleCondition('carAccess')}
                                activeOpacity={0.8}
                            >
                                {conditions.carAccess && (
                                    <Check size={18} color="white" strokeWidth={3} />
                                )}
                            </TouchableOpacity>
                            <Text style={tw`flex-1 text-gray-700 font-bold text-base text-right mr-3`}>دسترسی خودرو به محل بارگیری:</Text>
                        </View>

                        <View style={tw`bg-white border-2 border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between`}>
                            {accessValue ? (
                                <TouchableOpacity onPress={() => clearInput(setAccessValue)}>
                                    <X size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            ) : (
                                <View style={tw`w-5`} />
                            )}
                            <TextInput
                                style={tw`flex-1 text-gray-800 text-base text-right mr-3`}
                                placeholder="آزاد"
                                placeholderTextColor="#9CA3AF"
                                value={accessValue}
                                onChangeText={setAccessValue}
                            />
                            <Text style={tw`text-gray-500 text-sm`}>دسترسی خودرو</Text>
                        </View>
                    </View>

                    {/* Bottom Buttons */}
                    <View style={tw`flex-row pb-6`}>
                        <TouchableOpacity
                            style={tw`flex-1 bg-blue-500 py-3 rounded-xl ml-2 shadow-lg`}
                            activeOpacity={0.8}
                            onPress={onSubmit}
                        >
                            <Text style={tw`text-white font-bold text-center text-base`}>
                                ثبت
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={tw`flex-1 border-2 border-gray-300 bg-white py-3 rounded-xl mr-2`}
                            activeOpacity={0.8}
                            onPress={onBack}
                        >
                            <Text style={tw`text-gray-700 font-bold text-center text-base`}>
                                تغییر
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}