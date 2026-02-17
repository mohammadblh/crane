// InputRender.js
import React from 'react';
import { Text } from 'react-native';
import Style1Input from '../inputs/TextInput/Style1Input';
import Input2 from '../inputs/TextInput/Input2';
import TextArea from '../inputs/TextInput/TextArea';
// import Style2Input from './styles/Style2Input';
// ... هر چی اضافه کردی همینجا ایمپورت کن

export default function InputRender({ field, value, onChange }) {
    switch (field.style) {
        case 1:
            return <Style1Input field={field} value={value} onChange={onChange} />;

        case 2:
            return <Input2 field={field} value={value} onChange={onChange} />;

        case 3:
            return <TextArea field={field} value={value} onChange={onChange} />;
 
        case 4:
            return <Input2 field={field} value={value} onChange={onChange} type='number' />;
        default:
            return (
                <Text>استایل ورودی پشتیبانی نمی‌شود: {field.style}</Text>
            );
    }
}
