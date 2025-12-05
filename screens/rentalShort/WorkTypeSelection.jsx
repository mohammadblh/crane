import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Check, ChevronDown, Trash2 } from 'lucide-react-native';
import AddWorkScreen from '../../screens/rentalShort/AddWork';

export default function WorkTypeSelection({ jsonComp, onAddWork, workItems, onRemoveItem }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedWorkType, setSelectedWorkType] = useState('loading'); // Default to loading
    const [expandedCard, setExpandedCard] = useState(null);
    const [showAddWork, setShowAddWork] = useState(null);

    // const handleAddNewItem = (data) => {
    //     // setPendingWorkType(type);
    //     // setShowAddWork(true);
    //     console.log('handleAddWorkStart::data', data)
    //     // setWorkItems()
    // };


    // if (showAddWork) {
    //     return (
    //         <AddWorkScreen
    //             onBack={() => setShowAddWork(false)}
    //             onSubmit={handleAddNewItem}
    //             items={jsonComp.sections}
    //             addWorkName={showAddWork}
    //         />
    //     );
    // }

    return (
        <View style={tw`px-4`}>
            {/* Work Items */}
            {workItems.map((item) => {
                // Extract checked fields from formData
                const getCheckedFields = (formData) => {
                    if (!formData) return [];

                    const checkedFields = [];
                    Object.keys(formData).forEach(key => {
                        const value = formData[key];
                        // Check if it's a boolean true
                        if (value === true) {
                            checkedFields.push({ name: key, value: null });
                        }
                        // Check if it's an object with checked: true
                        else if (value && typeof value === 'object' && value.checked === true) {
                            checkedFields.push({ name: key, value: value.inputValue || null });
                        }
                    });
                    return checkedFields;
                };

                const checkedFields = getCheckedFields(item.formData);

                return (
                    <TouchableOpacity
                        key={item.id}
                        style={tw`${item.bgColor} border-2 ${item.borderColor} rounded-2xl p-4 mb-4`}
                        onPress={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
                        activeOpacity={0.8}
                    >
                        <View style={tw`flex-row items-center justify-between mb-3`}>
                            <TouchableOpacity onPress={() => onRemoveItem(item.id)}>
                                <Trash2 size={20} color="#EF4444" />
                            </TouchableOpacity>
                            <Text style={tw`text-gray-800 font-bold text-base`}>{item.title}</Text>
                        </View>

                        {/* Display checked fields */}
                        {checkedFields.length > 0 && (
                            <View style={tw`mb-3`}>
                                {checkedFields.map((field, index) => (
                                    <View key={index} style={tw`flex-row items-center mb-2`}>
                                        <View style={tw`w-2 h-2 rounded-full bg-gray-400 ml-2`} />
                                        <View style={tw`flex-1`}>
                                            <Text style={tw`text-gray-700 text-sm font-bold text-right`}>
                                                {field.name}
                                            </Text>
                                            {field.value && (
                                                <Text style={tw`text-gray-500 text-xs text-right`}>
                                                    {field.value}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Expandable section */}
                        {expandedCard === item.id && (
                            <View style={tw`pt-3 border-t border-gray-200`}>
                                <Text style={tw`text-gray-600 text-sm text-right mb-2`}>
                                    نوع کار: {item.type}
                                </Text>
                                {/* You can add more detailed info here */}
                            </View>
                        )}

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
                            <Text style={tw`text-gray-600 text-sm font-bold`}>
                                {expandedCard === item.id ? 'بستن' : 'توضیحات بیشتر'}
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                );
            })}

            {/* Add Work Button */}
            <View style={!workItems.length && tw`m-auto top-full`}>
                {!workItems.length && <Text style={tw`text-xl text-center font-bold mb-1`}>هیچ نوع کاری وجود ندارد</Text>}
                {!workItems.length && <Text style={tw`text-center mb-4`}>نوع کار مورد نظر خود را از دکمه زیر اضافه کنید</Text>}
                <TouchableOpacity
                    style={tw`bg-yellow-500 py-3 rounded-lg shadow-lg mb-4`}
                    activeOpacity={0.8}
                    onPress={() => setShowModal(true)}
                >
                    <Text style={tw`text-gray-900 font-bold text-center text-base`}>
                        افزودن کار
                    </Text>
                </TouchableOpacity>
            </View>

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
                            {jsonComp.workTypeItem.map((item, key) => (
                                <TouchableOpacity
                                    key={key}
                                    style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}
                                    onPress={() => setSelectedWorkType(item)}
                                >
                                    <View style={tw`w-6 h-6 rounded-full border-2 ${selectedWorkType === item ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'} items-center justify-center`}>
                                        {selectedWorkType === item && (
                                            <Check size={16} color="white" strokeWidth={3} />
                                        )}
                                    </View>
                                    <Text style={tw`text-gray-700 text-base flex-1 text-right mr-4`}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            style={tw`bg-yellow-500 py-3 rounded-lg`}
                            activeOpacity={0.8}
                            onPress={() => {
                                setShowModal(false);
                                // setShowAddWork(selectedWorkType);
                                if (onAddWork) onAddWork(selectedWorkType);
                            }}
                        >
                            <Text style={tw`text-gray-900 font-bold text-center text-base`}>
                                تایید و ادامه
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
