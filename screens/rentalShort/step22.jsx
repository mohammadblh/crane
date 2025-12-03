import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Modal, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { ArrowRight, Check, ChevronDown } from 'lucide-react-native';

export default function WorkTypeScreen() {
    const [showModal, setShowModal] = useState(false);
    const [selectedWorkType, setSelectedWorkType] = useState('installation');
    const [expandedCard, setExpandedCard] = useState(null);

    const workItems = [
        {
            id: 1,
            title: 'نصب شماره 1',
            type: 'متوسط',
            size: '۵۵ متر',
            description: 'سیم برق هوایی - درختان بلند',
            color: 'yellow',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-300'
        },
        {
            id: 2,
            title: 'بارگیری شماره 1',
            type: 'خیابان اصلی',
            size: '۵ تن',
            description: 'آزاد بتن آماده',
            color: 'blue',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-300'
        },
        {
            id: 3,
            title: 'تخلیه شماره 1',
            type: 'مستقیم کنار جرثقیل',
            size: 'بلافاصله',
            description: 'زمین صاف',
            color: 'green',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-300'
        }
    ];

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

            <ScrollView style={tw`flex-1`}>
                <View style={tw`px-4`}>
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

                    <View style={tw`items-center mb-6`}>
                        <Text style={tw`text-yellow-600 font-bold text-base`}>مرحله دوم</Text>
                    </View>

                    {/* Work Items */}
                    {workItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={tw`${item.bgColor} border-2 ${item.borderColor} rounded-2xl p-4 mb-4`}
                            onPress={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
                            activeOpacity={0.8}
                        >
                            <View style={tw`flex-row items-center justify-between mb-3`}>
                                <Text style={tw`text-gray-800 font-bold text-base`}>{item.title}</Text>
                            </View>

                            <View style={tw`flex-row items-center justify-between mb-3`}>
                                <Text style={tw`text-gray-600 text-sm`}>{item.type}</Text>
                                <Text style={tw`text-gray-600 text-sm`}>{item.size}</Text>
                            </View>

                            <Text style={tw`text-gray-500 text-xs mb-2`}>{item.description}</Text>

                            <TouchableOpacity
                                style={tw`flex-row items-center justify-between pt-2`}
                                onPress={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
                            >
                                <ChevronDown
                                    size={20}
                                    color="#6B7280"
                                    style={{
                                        transform: [{ rotate: expandedCard === item.id ? '180deg' : '0deg' }]
                                    }}
                                />
                                <Text style={tw`text-gray-600 text-sm font-bold`}>توضیحات بیشتر</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}

                    {/* Add Work Button */}
                    <TouchableOpacity
                        style={tw`bg-yellow-500 py-4 rounded-lg shadow-lg mb-4`}
                        activeOpacity={0.8}
                        onPress={() => setShowModal(true)}
                    >
                        <Text style={tw`text-gray-900 font-bold text-center text-base`}>
                            افزودن کار
                        </Text>
                    </TouchableOpacity>

                    {/* Bottom Buttons */}
                    <View style={tw`flex-row pb-6 pt-2`}>
                        <TouchableOpacity
                            style={tw`flex-1 bg-yellow-500 py-4 rounded-lg ml-2`}
                            activeOpacity={0.8}
                        >
                            <Text style={tw`text-gray-900 font-bold text-center text-base`}>
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
            </ScrollView>

            {/* Modal */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={tw`flex-1 bg-black bg-opacity-50 items-center justify-center px-4`}>
                    <View style={tw`bg-white rounded-3xl p-6 w-full max-w-lg`}>
                        <Text style={tw`text-gray-800 font-bold text-xl text-center mb-3`}>
                            افزودن نوع کار
                        </Text>
                        <Text style={tw`text-gray-500 text-sm text-center mb-6`}>
                            نوع کار و تاریخ را از گزینه های زیر انتخاب کنید.
                        </Text>

                        {/* Radio Options */}
                        <View style={tw`mb-6`}>
                            <TouchableOpacity
                                style={tw`flex-row items-center justify-between py-4 border-b border-gray-100`}
                                onPress={() => setSelectedWorkType('installation')}
                            >
                                <View style={tw`w-6 h-6 rounded-full border-2 ${selectedWorkType === 'installation' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'} items-center justify-center`}>
                                    {selectedWorkType === 'installation' && (
                                        <Check size={16} color="white" strokeWidth={3} />
                                    )}
                                </View>
                                <Text style={tw`text-gray-700 text-base flex-1 text-right mr-4`}>بارگیری</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={tw`flex-row items-center justify-between py-4 border-b border-gray-100`}
                                onPress={() => setSelectedWorkType('evacuation')}
                            >
                                <View style={tw`w-6 h-6 rounded-full border-2 ${selectedWorkType === 'evacuation' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'} items-center justify-center`}>
                                    {selectedWorkType === 'evacuation' && (
                                        <Check size={16} color="white" strokeWidth={3} />
                                    )}
                                </View>
                                <Text style={tw`text-gray-700 text-base flex-1 text-right mr-4`}>تخلیه</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={tw`flex-row items-center justify-between py-4`}
                                onPress={() => setSelectedWorkType('setup')}
                            >
                                <View style={tw`w-6 h-6 rounded-full border-2 ${selectedWorkType === 'setup' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'} items-center justify-center`}>
                                    {selectedWorkType === 'setup' && (
                                        <Check size={16} color="white" strokeWidth={3} />
                                    )}
                                </View>
                                <Text style={tw`text-gray-700 text-base flex-1 text-right mr-4`}>نصب</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            style={tw`bg-yellow-500 py-4 rounded-lg`}
                            activeOpacity={0.8}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={tw`text-gray-900 font-bold text-center text-base`}>
                                تایید و ادامه
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}