import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Checkbox1 from './Checkbox1';

export default function MultiCheckboxGroup({
    label,
    options = {},          // {1187: "هزینه رفت و برگشت", ...}
    value,                 // "1239_1240"
    onChange,              // خروجی نهایی
    color = 'yellow-500'
}) {

    const isControlled = value !== undefined;

    const parseValue = (val) => {
        if (!val) return [];
        return val.toString().split('_');
    };

    const [selectedIds, setSelectedIds] = useState(
        isControlled ? parseValue(value) : []
    );

    // sync اگر controlled بود
    useEffect(() => {
        if (isControlled) {
            setSelectedIds(parseValue(value));
        }
    }, [value]);

    const toggleItem = (id) => {
        let updated;

        if (selectedIds.includes(id)) {
            updated = selectedIds.filter(item => item !== id);
        } else {
            updated = [...selectedIds, id];
        }

        if (!isControlled) {
            setSelectedIds(updated);
        }

        const finalValue = updated.join('_');
        onChange?.(finalValue);
    };

    return (
        <View>
            <Text style={tw`text-gray-800 text-base font-semibold text-right mb-2`}>{label}</Text>
            <View style={tw`border border-gray-200 rounded-xl p-3 bg-white shadow-sm`}>
                {Object.entries(options).map(([id, optionLabel]) => (
                    <Checkbox1
                        key={id}
                        label={optionLabel}
                        checked={selectedIds.includes(id)}
                        onPress={() => toggleItem(id)}
                        color={color}
                    />
                ))}
            </View>
        </View>
    );
}
