import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import RenderForm from '@/components/FormRenderer/RenderForm';
import { Check, ChevronDown } from 'lucide-react-native';

export default function UploadFile({ jsonComp, onChange }) {

    const handleFormChange = (formData) => {
        console.log("FORM:", formData);
        if (onChange) {
            onChange(formData);
        }
    };

    return (
        <View style={tw`px-4`}>

            <RenderForm
                data={jsonComp.sections}
                onChange={handleFormChange}
            />
        </View>
    );
}
