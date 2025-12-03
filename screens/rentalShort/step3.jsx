import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { ArrowRight, Check, ChevronDown } from 'lucide-react-native';

export default function AdditionalServicesScreen() {
    const [showInsuranceDropdown, setShowInsuranceDropdown] = useState(false);
    const [selectedInsurance, setSelectedInsurance] = useState('');
    const [selectedServices, setSelectedServices] = useState({
        documents: true,
        transport: true,
        fuel: false,
        accommodation: false,
        service: true,
        breakfast: false,
        lighting: false
    });

    const insuranceOptions = ['بیمه نامه 1', 'بیمه نامه 2', 'بیمه نامه 3'];

    const toggleService = (serviceKey) => {
        setSelectedServices(prev => ({
            ...prev,
            [serviceKey]: !prev[serviceKey]
        }));
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
                <TouchableOpacity>
                    <ArrowRight size={24} color="#374151" />
                </TouchableOpacity>
                <Text style={tw`text-lg font-bold text-gray-800`}>خدمات اضافی</Text>
                <View style={tw`w-6`} />
            </View>

            <ScrollView style={tw`flex-1`}>
                <View style={tw`px-4`}>
                    {/* Progress Steps */}
                    <View style={tw`items-center justify-center my-8`}>
                        <View style={tw`flex-row items-center`}>
                            {/* Step 1 - Active */}
                            <View style={tw`w-12 h-12 rounded-full border-4 border-yellow-500 bg-white items-center justify-center`}>
                                <View style={tw`w-4 h-4 rounded-full bg-yellow-500`} />
                            </View>

                            {/* Line 1 */}
                            <View style={tw`w-16 h-0.5 bg-yellow-500`} />

                            {/* Step 2 - Completed */}
                            <View style={tw`w-12 h-12 rounded-full bg-yellow-600 items-center justify-center`}>
                                <Check size={24} color="white" strokeWidth={3} />
                            </View>

                            {/* Line 2 */}
                            <View style={tw`w-16 h-0.5 bg-yellow-500`} />

                            {/* Step 3 - Completed */}
                            <View style={tw`w-12 h-12 rounded-full bg-yellow-600 items-center justify-center`}>
                                <Check size={24} color="white" strokeWidth={3} />
                            </View>
                        </View>
                    </View>

                    <View style={tw`items-center mb-6`}>
                        <Text style={tw`text-yellow-600 font-bold text-base`}>مرحله آخر</Text>
                    </View>

                    {/* Insurance Selection */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-800 font-bold text-base mb-3 text-right`}>انتخاب بیمه:</Text>

                        <TouchableOpacity
                            style={tw`bg-white border-2 border-gray-200 rounded-xl px-4 py-4 flex-row items-center justify-between`}
                            onPress={() => setShowInsuranceDropdown(!showInsuranceDropdown)}
                            activeOpacity={0.8}
                        >
                            <ChevronDown
                                size={20}
                                color="#9CA3AF"
                                style={{
                                    transform: [{ rotate: showInsuranceDropdown ? '180deg' : '0deg' }]
                                }}
                            />
                            <View style={tw`flex-1 items-end mr-3`}>
                                <Text style={tw`${selectedInsurance ? 'text-gray-800' : 'text-gray-400'} text-base`}>
                                    {selectedInsurance || 'نوع بیمه خود را انتخاب کنید.'}
                                </Text>
                            </View>
                            <Text style={tw`text-gray-500 text-sm`}>بیمه</Text>
                        </TouchableOpacity>

                        {showInsuranceDropdown && (
                            <View style={tw`bg-white border-2 border-gray-200 rounded-xl mt-2 overflow-hidden`}>
                                {insuranceOptions.map((option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={tw`px-4 py-3 ${index !== insuranceOptions.length - 1 ? 'border-b border-gray-100' : ''}`}
                                        onPress={() => {
                                            setSelectedInsurance(option);
                                            setShowInsuranceDropdown(false);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={tw`text-gray-700 text-base text-right`}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Additional Services */}
                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-800 font-bold text-base mb-4 text-right`}>هزینه های اضافه:</Text>

                        {/* Service Item 1 */}
                        <TouchableOpacity
                            style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}
                            onPress={() => toggleService('documents')}
                            activeOpacity={0.8}
                        >
                            <View style={tw`w-6 h-6 rounded ${selectedServices.documents ? 'bg-yellow-500' : 'bg-white border-2 border-gray-300'} items-center justify-center`}>
                                {selectedServices.documents && (
                                    <Check size={16} color="white" strokeWidth={3} />
                                )}
                            </View>
                            <Text style={tw`flex-1 text-gray-700 text-base text-right mr-3`}>مدارک و مجوزها</Text>
                        </TouchableOpacity>

                        {/* Service Item 2 */}
                        <TouchableOpacity
                            style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}
                            onPress={() => toggleService('transport')}
                            activeOpacity={0.8}
                        >
                            <View style={tw`w-6 h-6 rounded ${selectedServices.transport ? 'bg-yellow-500' : 'bg-white border-2 border-gray-300'} items-center justify-center`}>
                                {selectedServices.transport && (
                                    <Check size={16} color="white" strokeWidth={3} />
                                )}
                            </View>
                            <Text style={tw`flex-1 text-gray-700 text-base text-right mr-3`}>هزینه حمل رفت و برگشت</Text>
                        </TouchableOpacity>

                        {/* Service Item 3 */}
                        <TouchableOpacity
                            style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}
                            onPress={() => toggleService('fuel')}
                            activeOpacity={0.8}
                        >
                            <View style={tw`w-6 h-6 rounded ${selectedServices.fuel ? 'bg-yellow-500' : 'bg-white border-2 border-gray-300'} items-center justify-center`}>
                                {selectedServices.fuel && (
                                    <Check size={16} color="white" strokeWidth={3} />
                                )}
                            </View>
                            <Text style={tw`flex-1 text-gray-700 text-base text-right mr-3`}>هزینه سوخت</Text>
                        </TouchableOpacity>

                        {/* Service Item 4 */}
                        <TouchableOpacity
                            style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}
                            onPress={() => toggleService('accommodation')}
                            activeOpacity={0.8}
                        >
                            <View style={tw`w-6 h-6 rounded ${selectedServices.accommodation ? 'bg-yellow-500' : 'bg-white border-2 border-gray-300'} items-center justify-center`}>
                                {selectedServices.accommodation && (
                                    <Check size={16} color="white" strokeWidth={3} />
                                )}
                            </View>
                            <Text style={tw`flex-1 text-gray-700 text-base text-right mr-3`}>خوابگاه</Text>
                        </TouchableOpacity>

                        {/* Service Item 5 */}
                        <TouchableOpacity
                            style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}
                            onPress={() => toggleService('service')}
                            activeOpacity={0.8}
                        >
                            <View style={tw`w-6 h-6 rounded ${selectedServices.service ? 'bg-yellow-500' : 'bg-white border-2 border-gray-300'} items-center justify-center`}>
                                {selectedServices.service && (
                                    <Check size={16} color="white" strokeWidth={3} />
                                )}
                            </View>
                            <Text style={tw`flex-1 text-gray-700 text-base text-right mr-3`}>سرویس ایاب و ذهاب</Text>
                        </TouchableOpacity>

                        {/* Service Item 6 */}
                        <TouchableOpacity
                            style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}
                            onPress={() => toggleService('breakfast')}
                            activeOpacity={0.8}
                        >
                            <View style={tw`w-6 h-6 rounded ${selectedServices.breakfast ? 'bg-yellow-500' : 'bg-white border-2 border-gray-300'} items-center justify-center`}>
                                {selectedServices.breakfast && (
                                    <Check size={16} color="white" strokeWidth={3} />
                                )}
                            </View>
                            <Text style={tw`flex-1 text-gray-700 text-base text-right mr-3`}>صبحانه، ناهار، شام</Text>
                        </TouchableOpacity>

                        {/* Service Item 7 */}
                        <TouchableOpacity
                            style={tw`flex-row items-center justify-between py-3`}
                            onPress={() => toggleService('lighting')}
                            activeOpacity={0.8}
                        >
                            <View style={tw`w-6 h-6 rounded ${selectedServices.lighting ? 'bg-yellow-500' : 'bg-white border-2 border-gray-300'} items-center justify-center`}>
                                {selectedServices.lighting && (
                                    <Check size={16} color="white" strokeWidth={3} />
                                )}
                            </View>
                            <Text style={tw`flex-1 text-gray-700 text-base text-right mr-3`}>لایتینگ پلن</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Buttons */}
                    <View style={tw`flex-row pb-6 pt-4`}>
                        <TouchableOpacity
                            style={tw`flex-1 bg-yellow-500 py-4 rounded-lg ml-2 shadow-lg`}
                            activeOpacity={0.8}
                        >
                            <Text style={tw`text-gray-900 font-bold text-center text-base`}>
                                ثبت سفارش
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
            </ScrollView>
        </SafeAreaView>
    );
}