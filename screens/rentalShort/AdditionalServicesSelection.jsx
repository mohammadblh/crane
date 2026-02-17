import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import RenderForm from '@/components/FormRenderer/RenderForm';
import { Check, ChevronDown } from 'lucide-react-native';

export default function AdditionalServicesSelection({ jsonComp, onFormChange }) {
    // const [showInsuranceDropdown, setShowInsuranceDropdown] = useState(false);
    // const [selectedInsurance, setSelectedInsurance] = useState('');
    // const [selectedServices, setSelectedServices] = useState({
    //     documents: true,
    //     transport: true,
    //     fuel: false,
    //     accommodation: false,
    //     service: true,
    //     breakfast: false,
    //     lighting: false
    // });

    // const insuranceOptions = ['بیمه نامه 1', 'بیمه نامه 2', 'بیمه نامه 3'];

    // const toggleService = (serviceKey) => {
    //     setSelectedServices(prev => ({
    //         ...prev,
    //         [serviceKey]: !prev[serviceKey]
    //     }));
    // };

    // const handleFormChange = (formData) => {
    //     console.log("FORM:", formData);
    //     if (onChange) {
    //         onChange(formData);
    //     }
    // };

    return (
        <View style={tw`px-4`}>
            <RenderForm
                data={jsonComp.sections}
                onChange={onFormChange}
            />

            {/* Additional Services */}
            {/* <Text style={tw`text-gray-800 font-bold text-base mb-4 text-right`}>هزینه های اضافه:</Text> */}
        </View>
    );
}
