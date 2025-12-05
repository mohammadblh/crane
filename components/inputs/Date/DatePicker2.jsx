import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';

// Persian months
const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const persianWeekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

// Convert numbers to Persian
const toPersianNumber = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (digit) => persianDigits[digit]);
};

// Get days in Persian month
const getDaysInMonth = (year, month) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    // Check leap year for Esfand
    return isLeapYear(year) ? 30 : 29;
};

const isLeapYear = (year) => {
    const breaks = [1, 5, 9, 13, 17, 22, 26, 30];
    const cycle = 33;
    const y = year - 474;
    const yearInCycle = ((y % cycle) + cycle) % cycle;
    return breaks.some(breakPoint => yearInCycle === breakPoint);
};

// Convert Jalaali to Gregorian
const jalaaliToGregorian = (jy, jm, jd) => {
    const gy = jy + 621;
    const gDayNo = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400) - 80;

    let jDayNo = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4);
    for (let i = 0; i < jm; i++) {
        jDayNo += getDaysInMonth(jy, i + 1);
    }
    jDayNo += jd;

    const totalDays = gDayNo + jDayNo;

    let year = Math.floor((totalDays - 1) / 365.2425) + 1;
    let dayOfYear = totalDays - (365 * year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400));

    while (dayOfYear <= 0) {
        year--;
        dayOfYear = totalDays - (365 * year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400));
    }

    const monthDays = [31, (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let month = 0;
    for (let i = 0; i < 12; i++) {
        if (dayOfYear <= monthDays[i]) {
            month = i + 1;
            break;
        }
        dayOfYear -= monthDays[i];
    }

    return { year, month, day: dayOfYear };
};

// Get day of week (0 = Saturday, 1 = Sunday, ..., 6 = Friday)
const getDayOfWeek = (jy, jm, jd) => {
    const g = jalaaliToGregorian(jy, jm, jd);
    const date = new Date(g.year, g.month - 1, g.day);
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    // Convert to Persian week (0 = Saturday)
    return (day + 1) % 7;
};


export default function DatePickerComponent2({ field, value, onChange }) {
    const [showPicker, setShowPicker] = useState(false);
    const [currentYear, setCurrentYear] = useState(1404);
    const [currentMonth, setCurrentMonth] = useState(8); // 0-indexed (Azar = 8)
    const [selectedDates, setSelectedDates] = useState(value || []);
    const isRange = field.mode === 'range';
    const isWeb = Platform.OS === 'web';

    const handleDateSelect = (day) => {
        const dateStr = `${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`;

        if (isRange) {
            if (selectedDates.length === 0) {
                setSelectedDates([dateStr]);
            } else if (selectedDates.length === 1) {
                const newDates = [selectedDates[0], dateStr].sort();
                setSelectedDates(newDates);
            } else {
                setSelectedDates([dateStr]);
            }
        } else {
            setSelectedDates([dateStr]);
        }
    };

    const handleConfirm = () => {
        if (onChange) {
            onChange(isRange ? selectedDates : selectedDates[0]);
        }
        setShowPicker(false);
    };

    const handleCancel = () => {
        setSelectedDates(value || []);
        setShowPicker(false);
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const formatDisplayDate = () => {
        if (!selectedDates || selectedDates.length === 0) return '';
        if (isRange && selectedDates.length === 2) {
            return `${toPersianNumber(selectedDates[0])} تا ${toPersianNumber(selectedDates[1])}`;
        }
        return toPersianNumber(selectedDates[0] || '');
    };

    const isDateSelected = (day) => {
        const dateStr = `${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
        return selectedDates.includes(dateStr);
    };

    const isDateInRange = (day) => {
        if (!isRange || selectedDates.length !== 2) return false;
        const dateStr = `${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
        return dateStr >= selectedDates[0] && dateStr <= selectedDates[1];
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth + 1);
        const firstDayOfWeek = getDayOfWeek(currentYear, currentMonth + 1, 1);
        const days = [];

        // Add empty cells for days before the first day of month
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(
                <View
                    key={`empty-${i}`}
                    style={{
                        width: '14.28%',
                        aspectRatio: 1,
                    }}
                />
            );
        }

        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = isDateSelected(day);
            const inRange = isDateInRange(day);

            // Check if this is the first or last date in range
            const dateStr = `${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
            const isFirstDate = isRange && dateStr === selectedDates[0];
            const isLastDate = isRange && selectedDates.length === 2 && dateStr === selectedDates[1];

            days.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        {
                            width: '14.28%', // 100% / 7 days
                            aspectRatio: 1,
                        },
                        tw`items-center justify-center`,

                    ]}
                    onPress={() => handleDateSelect(day)}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        tw`${isSelected ? 'text-white font-bold' : 'text-gray-800'} text-base m-auto w-full text-center py-1`,
                        inRange && tw`bg-yellow-500 `,
                        isSelected && selectedDates.length === 1 && tw`rounded-2xl bg-yellow-500`,
                        isSelected && !isLastDate && tw`rounded-tr-2xl rounded-br-2xl bg-yellow-500`,
                        isLastDate && tw`rounded-tl-2xl rounded-bl-2xl bg-yellow-500`,
                        !isWeb && { direction: 'ltr' }
                    ]}>
                        {toPersianNumber(day)}
                    </Text>
                </TouchableOpacity>
            );
        }

        return days;
    };

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
                    <Text style={tw`${selectedDates.length > 0 ? 'text-gray-800' : 'text-gray-400'} text-sm`}>
                        {formatDisplayDate() || field.placeholder || 'انتخاب تاریخ'}
                    </Text>
                </View>

                <Text style={tw`absolute right-4 -top-2 text-gray-500 text-xs bg-white px-1`}>
                    {field.label || 'مدت زمان'}
                </Text>
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                visible={showPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCancel}
            >
                <View style={tw`flex-1 bg-black bg-opacity-50 items-center justify-center px-4`}>
                    <View style={[tw`bg-gray-100 rounded-3xl p-6 w-full max-w-lg`, { direction: 'rtl' }]}>
                        {/* Header */}
                        <View style={tw`flex-row items-center justify-between mb-6`}>
                            <TouchableOpacity onPress={prevMonth} style={tw`p-2`}>
                                <ChevronRight size={24} color="#D97706" />
                            </TouchableOpacity>

                            <Text style={tw`text-gray-800 font-bold text-lg`}>
                                {persianMonths[currentMonth]} {toPersianNumber(currentYear)}
                            </Text>

                            <TouchableOpacity onPress={nextMonth} style={tw`p-2`}>
                                <ChevronLeft size={24} color="#D97706" />
                            </TouchableOpacity>
                        </View>

                        {/* Week Days */}
                        <View style={tw`flex-row mb-2`}>
                            {persianWeekDays.map((day, index) => (
                                <View key={index} style={{ width: '14.28%', alignItems: 'center' }}>
                                    <Text style={tw`text-yellow-600 font-bold text-sm`}>{day}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Calendar Grid */}
                        <View style={tw`flex-row flex-wrap`}>
                            {renderCalendar()}
                        </View>

                        {/* Buttons */}
                        <View style={tw`flex-row mt-6`}>
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
                </View>
            </Modal>
        </View>
    );
}