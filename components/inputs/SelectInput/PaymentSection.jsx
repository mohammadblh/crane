import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Minus } from 'lucide-react-native';
import Select1 from './Select1';
import Checkbox2 from '../CheckboxGroup/Checkbox2';

export default function PaymentSection({
    title = "پرداخت اول:",
    field,
    value,
    onChange,
    onRemove
}) {
    // Ensure value is always an object
    const safeValue = value && typeof value === 'object' ? value : {};

    // Initialize default value structure if empty
    useEffect(() => {
        if (!value || Object.keys(value).length === 0) {
            const initialValue = {};
            if (field?.fields) {
                field.fields.forEach(f => {
                    if (f.type === 5) { // Checkbox
                        initialValue[f.fieldId] = { checked: f.defaultValue || false, inputValue: "" };
                    } else {
                        initialValue[f.fieldId] = f.defaultValue || null;
                    }
                });
            }
            if (onChange) onChange(initialValue);
        }
    }, []);

    const handleFieldChange = (fieldId, newValue) => {
        if (onChange) {
            onChange({
                ...safeValue,
                [fieldId]: newValue
            });
        }
    };

    // Extract fields from field config
    const percentField = field?.fields?.find(f => f.fieldId === 'percent');
    const gracePeriodField = field?.fields?.find(f => f.fieldId === 'grace_period');
    const onReceiptField = field?.fields?.find(f => f.fieldId === 'on_receipt');

    return (
        <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100`}>
            {/* Header */}
            <View style={tw`flex-row items-center justify-between mb-4`}>
                {onRemove && (
                    <TouchableOpacity
                        style={tw`w-8 h-8 bg-red-500 rounded-full items-center justify-center`}
                        onPress={onRemove}
                        activeOpacity={0.8}
                    >
                        <Minus size={20} color="white" strokeWidth={2.5} />
                    </TouchableOpacity>
                )}
                <Text style={tw`text-gray-800 font-bold text-base`}>{title}</Text>
            </View>

            {/* Two Selects Row */}
            <View style={[tw`flex-row mb-4 gap-3`, {gap: 20}]}>
                {/* Grace Period Select */}
                {gracePeriodField && (
                    <View style={tw`flex-1 ml-2`}>
                        <Select1
                            label={gracePeriodField.title}
                            placeholder={gracePeriodField.placeholder}
                            options={gracePeriodField.options}
                            selectedValue={safeValue[gracePeriodField.fieldId] || null}
                            onSelect={(val) => handleFieldChange(gracePeriodField.fieldId, val)}
                            itemKey={gracePeriodField.fieldId}
                            maxVisibleItems={4}
                        />
                    </View>
                )}

                {/* Percent Select */}
                {percentField && (
                    <View style={tw`flex-1 mr-2`}>
                        <Select1
                            label={percentField.title}
                            placeholder={percentField.placeholder}
                            options={percentField.options}
                            selectedValue={safeValue[percentField.fieldId] || null}
                            onSelect={(val) => handleFieldChange(percentField.fieldId, val)}
                            itemKey={percentField.fieldId}
                            maxVisibleItems={5}
                        />
                    </View>
                )}
            </View>

            {/* Checkbox with Input */}
            {onReceiptField && (
                <Checkbox2
                    label={onReceiptField.title}
                    checked={safeValue[onReceiptField.fieldId]?.checked || false}
                    onPress={(newChecked) => {
                        const currentValue = safeValue[onReceiptField.fieldId] || {};
                        handleFieldChange(onReceiptField.fieldId, {
                            checked: newChecked,
                            inputValue: newChecked ? currentValue.inputValue : ""
                        });
                    }}
                    value={safeValue[onReceiptField.fieldId]?.inputValue || ""}
                    onChange={(newInputValue) => {
                        const currentValue = safeValue[onReceiptField.fieldId] || {};
                        handleFieldChange(onReceiptField.fieldId, {
                            checked: currentValue.checked,
                            inputValue: newInputValue
                        });
                    }}
                    placeholder={onReceiptField.placeholder}
                    color={onReceiptField.color || "yellow"}
                />
            )}
        </View>
    );
}