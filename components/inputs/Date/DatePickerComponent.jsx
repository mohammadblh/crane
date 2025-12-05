import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, TextInput } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Calendar, X } from 'lucide-react-native';

// Only import for web
let DatePicker, persian, persian_fa;
if (Platform.OS === 'web') {
    DatePicker = require('react-multi-date-picker').default;
    persian = require('react-date-object/calendars/persian').default;
    persian_fa = require('react-date-object/locales/persian_fa').default;
    require('react-multi-date-picker/styles/colors/yellow.css');
}

export default function DatePickerComponent({ field, value, onChange }) {
    const [showPicker, setShowPicker] = useState(false);
    const isWeb = Platform.OS === 'web';
    const isRange = field.mode === 'range';

    // For web: DatePicker values
    const [selectedDate, setSelectedDate] = useState(value || null);

    // For native: Text input values
    const parseNativeValue = () => {
        if (!value) return { start: '', end: '' };
        if (isRange && Array.isArray(value) && value.length === 2) {
            return { start: value[0] || '', end: value[1] || '' };
        } else if (!isRange && value) {
            return { start: value, end: '' };
        }
        return { start: '', end: '' };
    };

    const nativeDates = parseNativeValue();
    const [startDate, setStartDate] = useState(nativeDates.start);
    const [endDate, setEndDate] = useState(nativeDates.end);

    // Web handlers
    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (onChange) {
            if (isRange && date?.length === 2) {
                onChange(date);
            } else if (!isRange) {
                onChange(date);
            }
        }
    };

    const handleConfirm = () => {
        setShowPicker(false);
    };

    const handleCancel = () => {
        setSelectedDate(value);
        setShowPicker(false);
    };

    const formatDate = (date) => {
        if (!date) return '';
        if (isRange && Array.isArray(date) && date.length === 2) {
            return `${date[0].format('YYYY/MM/DD')} تا ${date[1].format('YYYY/MM/DD')}`;
        }
        return date.format ? date.format('YYYY/MM/DD') : '';
    };

    // Native handlers
    const handleStartDateChange = (text) => {
        setStartDate(text);
        if (isRange) {
            if (onChange) {
                onChange([text, endDate]);
            }
        } else {
            if (onChange) {
                onChange(text);
            }
        }
    };

    const handleEndDateChange = (text) => {
        setEndDate(text);
        if (onChange) {
            onChange([startDate, text]);
        }
    };

    const handleClear = () => {
        setStartDate('');
        setEndDate('');
        if (onChange) {
            onChange(isRange ? ['', ''] : '');
        }
    };

    const getNativeDisplayText = () => {
        if (isRange) {
            if (startDate && endDate) {
                return `${startDate} تا ${endDate}`;
            } else if (startDate) {
                return `از ${startDate}`;
            } else if (endDate) {
                return `تا ${endDate}`;
            }
            return field.placeholder || 'انتخاب بازه زمانی';
        } else {
            return startDate || field.placeholder || 'انتخاب تاریخ';
        }
    };

    // Render for Web
    if (isWeb) {
        return (
            <View style={tw`mb-4`}>
                {field.title && (
                    <Text style={tw`text-gray-800 font-bold text-sm mb-3 text-right`}>
                        {field.title}
                    </Text>
                )}

                {/* Input Display */}
                <TouchableOpacity
                    style={tw`bg-white border-2 border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between`}
                    onPress={() => setShowPicker(true)}
                    activeOpacity={0.7}
                >
                    <Calendar size={20} color="#9CA3AF" />

                    <View style={tw`flex-1 items-end mr-3`}>
                        <Text style={tw`${selectedDate ? 'text-gray-800' : 'text-gray-400'} text-sm`}>
                            {formatDate(selectedDate) || field.placeholder || 'انتخاب تاریخ'}
                        </Text>
                    </View>

                    <Text style={tw`absolute right-4 -top-2 text-gray-500 text-xs bg-white px-1`}>
                        {field.label || 'مدت زمان'}
                    </Text>
                </TouchableOpacity>

                {/* Inline for Web */}
                {showPicker && (
                    <View style={tw`mt-2 bg-gray-100 rounded-2xl p-4`}>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            calendar={persian}
                            locale={persian_fa}
                            range={isRange}
                            className="yellow"
                            inline
                        />

                        <View style={tw`flex-row mt-4`}>
                            <TouchableOpacity
                                style={tw`flex-1 bg-yellow-500 py-3 rounded-xl ml-2`}
                                onPress={handleConfirm}
                                activeOpacity={0.8}
                            >
                                <Text style={tw`text-gray-900 font-bold text-center text-base`}>
                                    تایید
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={tw`flex-1 border-2 border-gray-300 bg-white py-3 rounded-xl mr-2`}
                                onPress={handleCancel}
                                activeOpacity={0.8}
                            >
                                <Text style={tw`text-gray-700 font-bold text-center text-base`}>
                                    لغو
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    }

    // Render for Native (Mobile)
    return (
        <View style={tw`mb-4`}>
            {field.title && (
                <Text style={tw`text-gray-800 font-bold text-sm mb-3 text-right`}>
                    {field.title}
                </Text>
            )}

            {/* Single Date Input */}
            {!isRange && (
                <View style={tw`bg-white border-2 border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between`}>
                    <View style={tw`flex-row items-center`}>
                        <Calendar size={20} color="#9CA3AF" />
                        {startDate && (
                            <TouchableOpacity
                                onPress={handleClear}
                                style={tw`ml-2`}
                            >
                                <X size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <TextInput
                        style={tw`flex-1 text-gray-800 text-sm text-right mr-3`}
                        placeholder={field.placeholder || 'مثال: ۱۴۰۴/۰۹/۱۰'}
                        placeholderTextColor="#9CA3AF"
                        value={startDate}
                        onChangeText={handleStartDateChange}
                    />

                    <Text style={tw`absolute right-4 -top-2 text-gray-500 text-xs bg-white px-1`}>
                        {field.label || 'تاریخ'}
                    </Text>
                </View>
            )}

            {/* Range Date Input */}
            {isRange && (
                <View>
                    {/* Display Summary */}
                    <View style={tw`bg-white border-2 border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between mb-3`}>
                        <View style={tw`flex-row items-center`}>
                            <Calendar size={20} color="#9CA3AF" />
                            {(startDate || endDate) && (
                                <TouchableOpacity
                                    onPress={handleClear}
                                    style={tw`ml-2`}
                                >
                                    <X size={18} color="#9CA3AF" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <Text style={tw`flex-1 text-right mr-3 ${(startDate || endDate) ? 'text-gray-800' : 'text-gray-400'} text-sm`}>
                            {getNativeDisplayText()}
                        </Text>

                        <Text style={tw`absolute right-4 -top-2 text-gray-500 text-xs bg-white px-1`}>
                            {field.label || 'مدت زمان'}
                        </Text>
                    </View>

                    {/* Start Date */}
                    <View style={tw`bg-white border-2 border-gray-200 rounded-xl px-4 py-3 mb-2`}>
                        <Text style={tw`text-gray-600 text-xs mb-2 text-right`}>تاریخ شروع:</Text>
                        <TextInput
                            style={tw`text-gray-800 text-sm text-right`}
                            placeholder="مثال: ۱۴۰۴/۰۹/۱۰"
                            placeholderTextColor="#9CA3AF"
                            value={startDate}
                            onChangeText={handleStartDateChange}
                        />
                    </View>

                    {/* End Date */}
                    <View style={tw`bg-white border-2 border-gray-200 rounded-xl px-4 py-3`}>
                        <Text style={tw`text-gray-600 text-xs mb-2 text-right`}>تاریخ پایان:</Text>
                        <TextInput
                            style={tw`text-gray-800 text-sm text-right`}
                            placeholder="مثال: ۱۴۰۴/۰۹/۲۵"
                            placeholderTextColor="#9CA3AF"
                            value={endDate}
                            onChangeText={handleEndDateChange}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}