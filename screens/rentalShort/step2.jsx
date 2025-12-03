import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { ArrowRight, Check } from 'lucide-react-native';

export default function WorkTypeScreen() {
    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
                <TouchableOpacity>
                    <ArrowRight size={24} color="#374151" />
                </TouchableOpacity>
                <Text style={tw`text-lg font-bold text-gray-800`}>نوع کار</Text>
                <View style={tw`w-6`} />
            </View>

            <View style={tw`flex-1 px-4`}>
                {/* Progress Steps */}
                <View style={tw`items-center justify-center my-8`}>
                    <View style={tw`flex-row items-center`}>
                        {/* Step 1 - Completed */}
                        <View style={tw`w-12 h-12 rounded-full border-2 border-gray-300 bg-white items-center justify-center`}>
                            <View style={tw`w-3 h-3 rounded-full bg-gray-300`} />
                        </View>

                        {/* Line 1 */}
                        <View style={tw`w-16 h-0.5 bg-gray-300`} />

                        {/* Step 2 - Active */}
                        <View style={tw`w-12 h-12 rounded-full border-4 border-yellow-500 bg-white items-center justify-center`}>
                            <View style={tw`w-4 h-4 rounded-full bg-yellow-500`} />
                        </View>

                        {/* Line 2 */}
                        <View style={tw`w-16 h-0.5 bg-yellow-500`} />

                        {/* Step 3 - Completed with Check */}
                        <View style={tw`w-12 h-12 rounded-full bg-yellow-600 items-center justify-center`}>
                            <Check size={24} color="white" strokeWidth={3} />
                        </View>
                    </View>
                </View>

                <View style={tw`items-center mb-8`}>
                    <Text style={tw`text-yellow-600 font-bold text-base`}>مرحله دوم</Text>
                </View>

                {/* Empty State */}
                <View style={tw`flex-1 items-center justify-center px-6`}>
                    <Text style={tw`text-gray-800 font-bold text-xl text-center mb-3`}>
                        هیچ نوع کاری وجود ندارد
                    </Text>
                    <Text style={tw`text-gray-500 text-sm text-center mb-8`}>
                        نوع کار مورد نظر خود را از دکمه زیر اضافه کنید
                    </Text>

                    <TouchableOpacity
                        style={tw`bg-yellow-500 w-full py-4 rounded-lg shadow-lg`}
                        activeOpacity={0.8}
                    >
                        <Text style={tw`text-gray-900 font-bold text-center text-base`}>
                            افزودن نوع کار
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Buttons */}
                <View style={tw`flex-row pb-6 pt-4`}>
                    <TouchableOpacity
                        style={tw`flex-1 bg-gray-200 py-4 rounded-lg ml-2`}
                        activeOpacity={0.8}
                    >
                        <Text style={tw`text-gray-400 font-bold text-center text-base`}>
                            مرحله بعدی
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={tw`flex-1 border-2 border-gray-300 bg-white py-4 rounded-lg mr-2`}
                        activeOpacity={0.8}
                    >
                        <Text style={tw`text-gray-700 font-bold text-center text-base`}>
                            مرحله قبلی
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}