// InputRender.js
import React from 'react';
import { Text } from 'react-native';
import Checkbox1 from '../inputs/CheckboxGroup/Checkbox1';
import Checkbox2 from '../inputs/CheckboxGroup/Checkbox2';
import ToggleSwitch from '../inputs/CheckboxGroup/ToggleSwitch';
// import Style2Input from './styles/Style2Input';
// ... هر چی اضافه کردی همینجا ایمپورت کن

export default function CheckboxRender({ field, value, onChange }) {
    switch (field.style) {
        case 1:
            return <Checkbox1
                label={field.title}
                checked={value || false}
                onPress={() => onChange(!value)}
                color={field.color}
            />;

        case 2:
            // For Checkbox2, value should be an object: { checked: boolean, inputValue: string }
            const checkbox2Value = value || { checked: false, inputValue: "" };
            return (
                <Checkbox2
                    label={field.title}
                    checked={checkbox2Value.checked || false}
                    color={field.color}
                    onPress={(newChecked) => {
                        onChange({
                            checked: newChecked,
                            inputValue: newChecked ? checkbox2Value.inputValue : ""
                        });
                    }}
                    value={checkbox2Value.inputValue || ""}
                    onChange={(newInputValue) => {
                        onChange({
                            checked: checkbox2Value.checked,
                            inputValue: newInputValue
                        });
                    }}
                    placeholder={field.placeholder || "وارد کنید..."}
                />
            );

        case 4:
            return <ToggleSwitch
                field={field}
                value={value || false}
                onChange={onChange}
            />;

        default:
            return (
                <Text>استایل ورودی پشتیبانی نمی‌شود: {field.style}</Text>
            );
    }
}
