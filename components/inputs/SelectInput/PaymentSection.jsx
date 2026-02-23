import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, I18nManager } from 'react-native';
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
    // فعال‌سازی RTL (اگه کل اپ RTL نیست، این خطو بردار)
    // I18nManager.forceRTL(true);

    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = useState({});

    const safeValue = isControlled && value && typeof value === 'object'
        ? value
        : internalValue;

    // Initialize default value structure if empty
    useEffect(() => {
        if (!safeValue || Object.keys(safeValue).length === 0) {
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

            if (!isControlled) {
                setInternalValue(initialValue);
            }

            onChange?.(initialValue);
        }
    }, [field]);

    const handleFieldChange = (fieldId, newValue) => {
        const updated = {
            ...safeValue,
            [fieldId]: newValue
        };

        if (!isControlled) {
            setInternalValue(updated);
        }

        onChange?.(updated);
    };

    // Extract fields from field config
    const percentField = field?.fields?.find(f => f.fieldId === 'percent');
    const gracePeriodField = field?.fields?.find(f => f.fieldId === 'grace_period');
    const onReceiptField = field?.fields?.find(f => f.fieldId === 'on_receipt');

    return (
        <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm`}>
            {/* Header */}
            <View style={tw`flex-row-reverse items-center justify-between mb-4`}>
                <Text style={tw`text-gray-900 font-bold text-base`}>
                    {title}
                </Text>

                {onRemove && (
                    <TouchableOpacity
                        style={tw`w-8 h-8 bg-red-500 rounded-full items-center justify-center`}
                        onPress={onRemove}
                        activeOpacity={0.8}
                    >
                        <Minus size={18} color="white" strokeWidth={2.5} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Two Selects Row */}
            <View style={tw`flex-row-reverse mb-4 gap-3`}>
                {/* Grace Period Select */}
                {gracePeriodField && (
                    <View style={tw`flex-1`}>
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
                    <View style={tw`flex-1`}>
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
                <View style={tw`mt-2`}>
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
                </View>
            )}
        </View>
    );
}
