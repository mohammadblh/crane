import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import tw from 'tailwind-react-native-classnames';
import RenderForm from '@/components/FormRenderer/RenderForm';

export default function WorkshopSelection({ jsonComp }) {
    const [selectedWorkshopType, setSelectedWorkshopType] = useState('existing');

    const Dropdown = ({ items, isVisible, onSelect, onClose, selectedValue }) => {
        return (
            <Modal
                visible={isVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={onClose}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={tw`flex-1 justify-end bg-black bg-opacity-40`}>
                        <TouchableWithoutFeedback>
                            <View style={tw`bg-white rounded-t-3xl overflow-hidden shadow-2xl pb-6`}>
                                <View style={tw`py-3 border-b border-gray-100`}>
                                    <View style={tw`w-12 h-1 bg-gray-300 rounded-full self-center`} />
                                </View>
                                {items.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            onSelect(item);
                                            onClose();
                                        }}
                                        style={tw`px-6 py-4`}
                                    >
                                        <Text style={tw`text-right text-gray-700 text-base`}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    };

    return (
        <View style={tw`px-4 pt-4`}>
            {/* Workshop Type Selection */}
            <View style={tw`mb-6 px-4`}>
                <Text style={tw`text-gray-800 font-bold text-lg mb-4 text-right`}>
                    انتخاب کارگاه:
                </Text>

                <View style={tw`flex-row justify-between`}>
                    <TouchableOpacity
                        onPress={() => setSelectedWorkshopType('existing')}
                        style={[
                            tw`py-3 px-5 rounded-lg flex-1 mx-2`,
                            selectedWorkshopType === 'existing'
                                ? tw`bg-yellow-500 shadow-lg`
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

                    {/* دکمه کارگاه جدید */}
                    <TouchableOpacity
                        onPress={() => setSelectedWorkshopType('new')}
                        style={[
                            tw`py-3 px-5 rounded-lg flex-1 mx-2`,
                            selectedWorkshopType === 'new'
                                ? tw`bg-yellow-500 shadow-lg`
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

            <RenderForm
                data={selectedWorkshopType === 'new' ? jsonComp.sections2 : jsonComp.sections}
                onChange={(formData) => console.log("FORM:", formData)}
            />
        </View>
    );
}