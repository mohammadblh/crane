// InputRender.js
import React from 'react';
import { Text } from 'react-native';
import Select1 from '../inputs/SelectInput/Select1';
import PaymentSection from '../inputs/SelectInput/PaymentSection';
import MultiSelectTags from '../inputs/SelectInput/MultiSelectTags';
import StarRating from '../inputs/SelectInput/StarRating';
import ButtonSelect from '../inputs/SelectInput/ButtonSelect';

export default function SelectRender({ field, value, onChange }) {
    switch (field.style) {
        case 1:
            return <Select1
                label={field.title}
                placeholder={field.placeholder}
                options={field.options}
                selectedValue={value}
                onSelect={onChange}
                itemKey={field.sectionId}
                maxVisibleItems={3}
            />;

        case 2: return <MultiSelectTags
            label={field.title}
            placeholder={field.placeholder}
            options={field.options}
            selectedValues={value || field.defaultValue}
            onSelect={onChange}
            itemKey={field.sectionId}
            maxVisibleItems={field.maxVisibleItems || 3}
            disabled={field.disabled}
        />

        case 4:
            return <StarRating
                field={field}
                value={value || 0}
                onChange={onChange}
            />

        case 5:
            return <PaymentSection
                title={field.title}
                field={field}
                value={value}
                onChange={onChange}
                onRemove={field.removable ? () => onChange(null) : undefined}
            />;

        case 6:
            return <ButtonSelect
                field={field}
                value={value}
                onChange={onChange}
            />;

        default:
            return (
                <Text>استایل ورودی پشتیبانی نمی‌شود: {field.style}</Text>
            );
    }
}
