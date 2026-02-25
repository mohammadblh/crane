// MultiFormRender.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { ChevronDown, Trash2, Plus, Edit2 } from 'lucide-react-native';
import AddWorkScreen from './AddWork';

export default function MultiFormRender({ jsonComp, onAddWork, workItems, onRemoveItem, onFormChange }) {
    const [expandedCard, setExpandedCard] = useState(null);
    const [showAddWork, setShowAddWork] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // استخراج اطلاعات کلیدی از jsonComp
    const maxItems = jsonComp.numrow || 10;
    const stepTitle = jsonComp.title || 'موارد';
    const stepId = jsonComp.stepId; // برای جدا کردن آیتم‌های هر استپ
    const sections = jsonComp.sections || [];

    // فیلتر کردن workItems برای این استپ خاص
    const currentStepItems = workItems.filter(item => item.stepId === stepId);

    // تابع برای افزودن/ویرایش آیتم
    const handleSubmitItem = (formData, selectedOptions = {}) => {
        const currentIndex = editingItem ? editingItem.index : currentStepItems.length + 1;

        // ساخت sectionId یونیک
        const baseSectionId = sections[0]?.sectionId || 'form';
        const match = baseSectionId?.match(/^f_(\d+)_\d+$/);
        let sectionId;

        if (match) {
            sectionId = `f_${match[1]}_${currentIndex}`;
        } else if (baseSectionId && !baseSectionId.startsWith('f_')) {
            sectionId = `f_${baseSectionId}_${currentIndex}`;
        } else {
            sectionId = `${baseSectionId}_${currentIndex}`;
        }

        // ساخت عنوان از اولین فیلد انتخابی یا پیش‌فرض
        let title = `${stepTitle} ${currentIndex}`;
        const firstSelectSection = sections.find(s => s.type === 4 || s.type === 28);
        if (firstSelectSection && selectedOptions[firstSelectSection.sectionId]) {
            const selectedKey = selectedOptions[firstSelectSection.sectionId];
            const selectedValue = firstSelectSection.options?.[selectedKey];
            if (selectedValue) {
                title = selectedValue;
            }
        }

        const newItem = {
            id: editingItem ? editingItem.id : `item_${stepId}_${Date.now()}_${currentIndex}`,
            stepId: stepId, // ذخیره stepId برای جداسازی
            index: currentIndex,
            title: title,
            sectionId: sectionId,
            formData: formData,
            selectedOptions: selectedOptions,
        };

        if (editingItem) {
            // ویرایش آیتم موجود
            const updatedItems = workItems.map(item =>
                item.id === editingItem.id ? newItem : item
            );
            onAddWork(updatedItems);
        } else {
            // افزودن آیتم جدید
            onAddWork([...workItems, newItem]);
        }

        // آپدیت formData در والد
        if (onFormChange) {
            const formDataWithId = {
                [sectionId]: formData,
                ...selectedOptions
            };
            onFormChange(formDataWithId);
        }

        setShowAddWork(false);
        setEditingItem(null);
    };

    // تابع برای استخراج خلاصه اطلاعات
    const getItemSummary = (item) => {
        const summary = [];
        const { formData, selectedOptions } = item;

        sections.forEach(section => {
            if (section.type === 4 || section.type === 5 || section.type === 28) { // Radio/Checkbox/Select
                const value = formData?.[section.sectionId] || selectedOptions?.[section.sectionId];
                if (value) {
                    const label = section.options?.[value] || value;
                    summary.push({ label: section.title, value: label });
                }
            } else if (section.type === 0 || section.type === 1) { // Text/Textarea
                const value = formData?.[section.sectionId];
                if (value && value.toString().trim()) {
                    summary.push({ label: section.title, value: value });
                }
            } else if (section.type === 3) { // Number
                const value = formData?.[section.sectionId];
                if (value) {
                    summary.push({
                        label: section.title,
                        value: `${value} ${section.placeholder || ''}`.trim()
                    });
                }
            } else if (section.type === 6) { // Date
                const value = formData?.[section.sectionId];
                if (value) {
                    summary.push({ label: section.title, value: value });
                }
            }
        });

        return summary;
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowAddWork(true);
    };

    const handleRemove = (itemId) => {
        if (onRemoveItem) {
            onRemoveItem(itemId);
        }
    };

    return (
        <>
            <View style={tw`px-4 mb-4`}>
                {/* Work Items */}
                {currentStepItems.map((item, idx) => {
                    const summary = getItemSummary(item);
                    const isExpanded = expandedCard === item.id;
                    const displayedSummary = summary.slice(0, 3);
                    const hiddenSummary = summary.slice(3);

                    return (
                        <View
                            key={item.id}
                            style={tw`bg-white border-2 border-gray-900 rounded-xl p-4 mb-3 shadow-sm`}
                        >
                            {/* Header */}
                            <View style={tw`flex-row items-center justify-between mb-3`}>
                                <View style={tw`flex-row items-center`}>
                                    <TouchableOpacity
                                        onPress={() => handleRemove(item.id)}
                                        style={tw`ml-3`}
                                    >
                                        <Trash2 size={18} color="#EF4444" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleEdit(item)}
                                        style={tw`ml-2`}
                                    >
                                        <Edit2 size={18} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>

                                <View style={tw`flex-row items-center`}>
                                    <Text style={tw`text-gray-900 font-bold text-base ml-2`}>
                                        {item.title}
                                    </Text>
                                    <View style={tw`bg-yellow-500 rounded-full w-6 h-6 items-center justify-center`}>
                                        <Text style={tw`text-gray-900 text-xs font-bold`}>
                                            {item.index}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Summary */}
                            {displayedSummary.length > 0 && (
                                <View style={tw`mb-2`}>
                                    {displayedSummary.map((field, index) => (
                                        <View key={index} style={tw`flex-row items-start mb-2`}>
                                            <View style={tw`w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 ml-2`} />
                                            <View style={tw`flex-1`}>
                                                <Text style={tw`text-gray-700 text-xs font-bold text-right`}>
                                                    {field.label}:
                                                </Text>
                                                <Text style={tw`text-gray-900 text-sm text-right`}>
                                                    {field.value}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Expandable Details */}
                            {isExpanded && hiddenSummary.length > 0 && (
                                <View style={tw`pt-3 border-t border-gray-200 mt-2`}>
                                    {hiddenSummary.map((field, index) => (
                                        <View key={index} style={tw`flex-row items-start mb-2`}>
                                            <View style={tw`w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 ml-2`} />
                                            <View style={tw`flex-1`}>
                                                <Text style={tw`text-gray-700 text-xs font-bold text-right`}>
                                                    {field.label}:
                                                </Text>
                                                <Text style={tw`text-gray-900 text-sm text-right`}>
                                                    {field.value}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Toggle Button */}
                            {hiddenSummary.length > 0 && (
                                <TouchableOpacity
                                    style={tw`flex-row items-center justify-center pt-2 mt-1`}
                                    onPress={() => setExpandedCard(isExpanded ? null : item.id)}
                                >
                                    <ChevronDown
                                        size={18}
                                        color="#6B7280"
                                        style={{
                                            transform: [{ rotate: isExpanded ? '180deg' : '0deg' }]
                                        }}
                                    />
                                    <Text style={tw`text-gray-600 text-xs font-bold mr-1`}>
                                        {isExpanded ? 'بستن' : 'مشاهده بیشتر'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}

                {/* Empty State + Add Button */}
                <View style={tw`${currentStepItems.length === 0 ? 'items-center py-8' : ''}`}>
                    {currentStepItems.length === 0 && (
                        <>
                            <Text style={tw`text-xl text-center font-bold text-gray-800 mb-2`}>
                                هیچ {stepTitle} ثبت نشده
                            </Text>
                            <Text style={tw`text-center text-gray-600 mb-6`}>
                                برای افزودن {stepTitle} جدید، دکمه زیر را بزنید
                            </Text>
                        </>
                    )}

                    {currentStepItems.length < maxItems && (
                        <TouchableOpacity
                            style={tw`bg-yellow-500 py-3.5 px-6 rounded-xl shadow-lg flex-row items-center justify-center`}
                            activeOpacity={0.8}
                            onPress={() => {
                                setEditingItem(null);
                                setShowAddWork(true);
                            }}
                        >
                            <Plus size={20} color="#1F2937" style={tw`ml-2`} />
                            <Text style={tw`text-gray-900 font-bold text-base`}>
                                افزودن {stepTitle}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {currentStepItems.length >= maxItems && (
                        <View style={tw`bg-gray-100 py-3 px-4 rounded-lg mt-2`}>
                            <Text style={tw`text-gray-600 text-center text-sm`}>
                                حداکثر {maxItems} {stepTitle} قابل ثبت است
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Modal for AddWorkScreen */}
            <Modal
                visible={showAddWork}
                animationType="slide"
                onRequestClose={() => {
                    setShowAddWork(false);
                    setEditingItem(null);
                }}
            >
                <AddWorkScreen
                    indexKeys={editingItem ? editingItem.index : currentStepItems.length + 1}
                    onBack={() => {
                        setShowAddWork(false);
                        setEditingItem(null);
                    }}
                    onSubmit={handleSubmitItem}
                    items={sections}
                    initialData={editingItem?.formData}
                    initialSelections={editingItem?.selectedOptions}
                    title={editingItem ? `ویرایش ${stepTitle}` : `افزودن ${stepTitle}`}
                    isEditing={!!editingItem}
                />
            </Modal>
        </>
    );
}