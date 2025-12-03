import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { ChevronRight, ChevronDown } from 'lucide-react-native';
import tw from 'tailwind-react-native-classnames';

export default function WorkshopSelectionScreen() {
    const [selectedWorkshopType, setSelectedWorkshopType] = useState('existing');
    const [selectedWorkshop, setSelectedWorkshop] = useState('');
    const [showWorkshopDropdown, setShowWorkshopDropdown] = useState(false);
    const [selectedCategory1, setSelectedCategory1] = useState('');
    const [showCategory1Dropdown, setShowCategory1Dropdown] = useState(false);
    const [selectedCategory2, setSelectedCategory2] = useState('');
    const [showCategory2Dropdown, setShowCategory2Dropdown] = useState(false);

    const workshops = ['کارگاه شماره هفت', 'کارگاه شماره پنج'];
    const categories1 = ['دسته اول الف', 'دسته اول ب', 'دسته اول ج'];
    const categories2 = ['دسته دوم الف', 'دسته دوم ب', 'دسته دوم ج'];

    const Dropdown = ({ items, isVisible, onSelect, onClose, selectedValue }) => {
        return (
            <Modal
                visible={isVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={onClose}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={tw`flex-1 bg-black bg-opacity-50 justify-center px-4`}>
                        <View style={tw`bg-white rounded-xl overflow-hidden`}>
                            {items.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        onSelect(item);
                                        onClose();
                                    }}
                                    style={[
                                        tw`px-4 py-4 border-b border-gray-100`,
                                        index === items.length - 1 && tw`border-b-0`
                                    ]}
                                >
                                    <Text style={tw`text-right text-gray-700 text-base`}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            <ScrollView
                style={tw`flex-1`}
                contentContainerStyle={tw`pb-8`}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
                    <ChevronRight size={24} color="#374151" />
                    <Text style={tw`text-lg font-bold text-gray-800`}>انتخاب کارگاه</Text>
                    <View style={tw`w-6`} />
                </View>

                <View style={tw`px-4 py-6`}>
                    {/* Progress Steps */}
                    <View style={tw`flex-row items-center justify-center mb-8`}>
                        <View style={tw`flex-row items-center`}>
                            <View style={tw`w-12 h-12 rounded-full border-2 border-gray-300 bg-white items-center justify-center`}>
                                <View style={tw`w-3 h-3 rounded-full bg-gray-300`} />
                            </View>
                            <View style={tw`w-16 h-0.5 bg-gray-300`} />
                            <View style={tw`w-12 h-12 rounded-full border-2 border-gray-300 bg-white items-center justify-center`}>
                                <View style={tw`w-3 h-3 rounded-full bg-gray-300`} />
                            </View>
                            <View style={tw`w-16 h-0.5 bg-gray-300`} />
                            <View style={tw`w-12 h-12 rounded-full border-4 border-yellow-500 bg-white items-center justify-center`}>
                                <View style={tw`w-4 h-4 rounded-full bg-yellow-500`} />
                            </View>
                        </View>
                    </View>

                    <View style={tw`items-center mb-8`}>
                        <Text style={tw`text-yellow-600 font-bold text-base`}>مرحله اول</Text>
                    </View>

                    {/* Workshop Type Selection */}
                    <View style={tw`mb-8`}>
                        <Text style={tw`text-gray-800 font-bold text-base mb-4 text-right`}>انتخاب کارگاه:</Text>
                        <View style={tw`flex-row gap-3`}>
                            <TouchableOpacity
                                onPress={() => setSelectedWorkshopType('existing')}
                                style={[
                                    tw`flex-1 py-2.5 px-4 rounded-lg`,
                                    selectedWorkshopType === 'existing'
                                        ? tw`bg-yellow-500 shadow-md`
                                        : tw`bg-gray-100`
                                ]}
                            >
                                <Text style={[
                                    tw`font-bold text-sm text-center`,
                                    selectedWorkshopType === 'existing'
                                        ? tw`text-gray-900`
                                        : tw`text-gray-600`
                                ]}>
                                    کارگاه قبلی
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setSelectedWorkshopType('new')}
                                style={[
                                    tw`flex-1 py-3 px-4 rounded-lg`,
                                    selectedWorkshopType === 'new'
                                        ? tw`bg-yellow-500 shadow-md`
                                        : tw`bg-gray-100`
                                ]}
                            >
                                <Text style={[
                                    tw`font-bold text-sm text-center`,
                                    selectedWorkshopType === 'new'
                                        ? tw`text-gray-900`
                                        : tw`text-gray-600`
                                ]}>
                                    کارگاه جدید
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Workshop Name Dropdown */}
                    <View style={tw`mb-8`}>
                        <Text style={tw`text-gray-800 font-bold text-base mb-4 text-right`}>انتخاب کارگاه:</Text>
                        <TouchableOpacity
                            onPress={() => setShowWorkshopDropdown(true)}
                            style={tw`w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-between`}
                        >
                            <ChevronDown size={20} color="#9CA3AF" />
                            <Text style={selectedWorkshop ? tw`text-gray-800 text-base` : tw`text-gray-400 text-base`}>
                                {selectedWorkshop || 'نام کارگاه خود را انتخاب کنید.'}
                            </Text>
                            <Text style={tw`text-gray-500 text-sm`}>نام کارگاه</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Category 1 Dropdown */}
                    <View style={tw`mb-8`}>
                        <Text style={tw`text-gray-800 font-bold text-base mb-4 text-right`}>دسته اول:</Text>
                        <TouchableOpacity
                            onPress={() => setShowCategory1Dropdown(true)}
                            style={tw`w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-4 flex-row items-center justify-between`}
                        >
                            <ChevronDown size={20} color="#9CA3AF" />
                            <Text style={selectedCategory1 ? tw`text-gray-800 text-base` : tw`text-gray-400 text-base`}>
                                {selectedCategory1 || 'دسته اول خود را انتخاب کنید.'}
                            </Text>
                            <Text style={tw`text-gray-500 text-sm`}>دسته اول</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Category 2 Dropdown */}
                    <View style={tw`mb-8`}>
                        <Text style={tw`text-gray-800 font-bold text-base mb-4 text-right`}>دسته دوم:</Text>
                        <TouchableOpacity
                            onPress={() => setShowCategory2Dropdown(true)}
                            style={tw`w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-4 flex-row items-center justify-between`}
                        >
                            <ChevronDown size={20} color="#9CA3AF" />
                            <Text style={selectedCategory2 ? tw`text-gray-800 text-base` : tw`text-gray-400 text-base`}>
                                {selectedCategory2 || 'دسته دوم خود را انتخاب کنید.'}
                            </Text>
                            <Text style={tw`text-gray-500 text-sm`}>دسته دوم</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Next Button */}
                    <TouchableOpacity
                        style={tw`w-full bg-yellow-500 py-3 rounded-lg shadow-lg`}
                        onPress={() => console.log('Next step')}
                    >
                        <Text style={tw`text-gray-900 font-bold text-base text-center`}>
                            مرحله بعدی
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Dropdown Modals */}
            <Dropdown
                items={workshops}
                isVisible={showWorkshopDropdown}
                onSelect={setSelectedWorkshop}
                onClose={() => setShowWorkshopDropdown(false)}
                selectedValue={selectedWorkshop}
            />

            <Dropdown
                items={categories1}
                isVisible={showCategory1Dropdown}
                onSelect={setSelectedCategory1}
                onClose={() => setShowCategory1Dropdown(false)}
                selectedValue={selectedCategory1}
            />

            <Dropdown
                items={categories2}
                isVisible={showCategory2Dropdown}
                onSelect={setSelectedCategory2}
                onClose={() => setShowCategory2Dropdown(false)}
                selectedValue={selectedCategory2}
            />
        </SafeAreaView>
    );
}