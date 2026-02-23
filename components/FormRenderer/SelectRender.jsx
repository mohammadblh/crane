// InputRender.js
import React from 'react';
import { Text } from 'react-native';
import Select1 from '../inputs/SelectInput/Select1';
import SelectDual from '../inputs/SelectInput/SelectDual';
import PaymentSection from '../inputs/SelectInput/PaymentSection';
import MultiSelectTags from '../inputs/SelectInput/MultiSelectTags';
import StarRating from '../inputs/SelectInput/StarRating';
import ButtonSelect from '../inputs/SelectInput/ButtonSelect';
import SelectWithAdd from '../inputs/SelectInput/SelectWithAdd';
import MultiSelectWithAdd from '../inputs/SelectInput/MultiSelectWithAdd';


export default function SelectRender({ field, value, onChange }) {
    const sendkey = (options, val) => {
        return Object.entries(options).find(([key, value]) => value === val)?.[0]
    }

    switch (field.style) {
        case 1:
            return <Select1
                label={field.title}
                placeholder={field.placeholder}
                options={Object.values(field.options)}
                // options={field.options}
                // selectedValue={value}
                selectedValue={field.options[value]}
                onSelect={(val) => onChange(sendkey(field.options, val))}
                // onSelect={onChange}
                // itemKey={field.title}
                itemKey={field.sectionId}
                maxVisibleItems={3}
            />;

        case 2:
            return <MultiSelectTags
                label={field.title}
                placeholder={field.placeholder}
                options={Object.values(field.options)}
                selectedValues={value || field.defaultValue}
                onSelect={onChange}
                itemKey={field.sectionId}
                maxVisibleItems={field.maxVisibleItems || 3}
                disabled={field.disabled}
            />

        case 3:
            console.log('field.sections', field)
            return <SelectWithAdd
                label={field.title}
                placeholder={field.placeholder}
                options={Object.values(field.options)}
                sections={field.section}
                selectedValue={field.options[value]}
                // selectedValue={value}
                formId={field.option} // id form
                onSelect={(val) => onChange(sendkey(field.options, val))}
                // onSelect={onChange}
                itemKey={field.sectionId}
                maxVisibleItems={field.maxVisibleItems || 3}
                disabled={field.disabled}
            />

        case 328:
            // console.log('field.sections', field)
            // console.log('value', value)
            return <MultiSelectWithAdd
                label={field.title}
                placeholder={field.placeholder}
                options={Object.values(field.options)}
                sections={field.sections}
                selectedValues={value || []}
                // selectedValues={value ? value.split(',') : []}
                // selectedValues={value ? value.split(',') : []}
                formId={field.option} // id form
                onSelect={(val) => onChange(sendkey(field.options, val))}
                // onSelect={(values) => onChange(sendkey(field.options, values.join(',')))}
                itemKey={field.title}
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

        case 10:
            if (!field.options || !field.options2) return
            return (
                <SelectDual
                    label={field.title}
                    placeholder={field.placeholder}
                    options={Object.values(field.options)}
                    options2={field.options2}
                    selectedValue={value}
                    onSelect={onChange}
                    itemKey={field.title}
                    // itemKey={field.sectionId}
                    maxVisibleItems={3}
                />
            )

        default:
            return (
                <Text>استایل ورودی پشتیبانی نمی‌شود: {field.style}</Text>
            );
    }
}
