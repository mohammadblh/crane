import React, { useState, useLayoutEffect, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Animated, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useApp } from '../../contexts/AppContext';
import { ArrowRight } from 'lucide-react-native';
import { useNavigation, useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkTypeSelection from '../../screens/rentalShort/WorkTypeSelection';
import WorkshopSelection from '../../screens/rentalShort/WorkshopSelection';
import AdditionalServicesSelection from '../../screens/rentalShort/AdditionalServicesSelection';
import Loading from '../../components/Loading';
import StepProgress from '../../components/StepProgress';
import { api } from '../../hooks/useApi';

const getHeaderTitle = (currentStep) => {
    switch (currentStep) {
        case 1: return 'پروژه';
        case 2: return 'نوع کار';
        case 3: return 'خدمات اضافی';
        default: return 'اجاره موردی';
    }
};

export default function RentalLongScreen() {
    const { rentalLong } = useApp();
    
    const [currentStep, setCurrentStep] = useState(1);
    const [showAddWork, setShowAddWork] = useState(null);
    const [nextDisabled, setNextDisabled] = useState(false);
    // const [rentalLong, setRentalLong] = useState(null);
    const [workItems, setWorkItems] = useState([]);
    const [pendingWorkType, setPendingWorkType] = useState(null);
    const [previousStep, setPreviousStep] = useState(1);

    const [additionalServices, setAdditionalServices] = useState({});

    const navigation = useNavigation();
    const router = useRouter();
    const scrollViewRef = useRef(null);
    const slideAnimation = useRef(new Animated.Value(0)).current;
    
    // scrool to up
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    }, [currentStep]);
    

    // get fields and load workItems from AsyncStorage
    // useEffect(() => {
    //     const loadData = async () => {
    //         // Load rental short data
    //         let res = await AsyncStorage.getItem('rentalLong');
    //         res = JSON.parse(res);

    //         if(!res) {
    //             const finger = await AsyncStorage.getItem('user_finger');
    //             res = await api.rentalLong(finger);
    //         }

    //         // setRentalLong(res.data);

    //         // Load workItems from AsyncStorage
    //         // const savedWorkItems = await AsyncStorage.getItem('workItems');
    //         // if (savedWorkItems) {
    //         //     const parsedWorkItems = JSON.parse(savedWorkItems);
    //         //     setWorkItems(parsedWorkItems);
    //         //     setFormData(prev => ({
    //         //         ...prev,
    //         //         works: parsedWorkItems
    //         //     }));
    //         // }
    //     };
    //     loadData();
    // }, []);

    // Hide tab bar when in this screen
    useLayoutEffect(() => {
        navigation.setOptions({
            tabBarStyle: { display: 'none' }
        });

        return () => { };
    }, [navigation]);
    
    
    const handleNext = () => {
        if (currentStep < rentalLong.steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit request on step 3
            submitRequest();
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            // Go back to home if at step 1
            router.push('/(tabs)');
        }
    };

    const handleBack = () => {
        // If at step 1, go back to home (tabs)
        // If at other steps, go to previous step
        if (currentStep === 1) {
            router.push('/(tabs)');
        } else {
            handlePrev();
        }
    };

    const renderSteps = () => {
        switch (currentStep) {
            case 1:
                return <WorkshopSelection jsonComp={rentalLong.steps[0]} />        

            case 2:
                return <WorkTypeSelection
                    onAddWork={handleAddWorkStart}
                    workItems={workItems}
                    jsonComp={rentalLong.steps[1]}
                    onRemoveItem={handleRemoveItem}
                />

            case 3:
                return <AdditionalServicesSelection
                    jsonComp={rentalLong.steps[2]}
                    onChange={(data) => setAdditionalServices(data)}
                />
        
            default:
                return <RenderForm data={rentalLong.steps[currentStep-1].sections} 
                // onChange={handleFormChange} 
                />
        }
    }

    if (!rentalLong) return <Loading />;

    return (
        <SafeAreaView style={tw`flex-1 bg-white`} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            <ScrollView
                ref={scrollViewRef}
                style={tw`flex-1`}
                contentContainerStyle={tw`pb-8`}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
                    <View style={tw`w-6`} />
                    <Text style={tw`text-lg font-bold text-gray-800`}>
                        {getHeaderTitle(currentStep)}
                    </Text>
                    <TouchableOpacity 
                    onPress={handleBack}
                    >
                        <ArrowRight size={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <View style={tw`h-full mt-6 mb-6`}>
                    {/* Progress Steps */}
                    <StepProgress currentStep={currentStep} steps={rentalLong.steps} />

                    {/* Step Content with Animation */}
                    <Animated.View
                        style={{
                            transform: [{ translateX: slideAnimation }],
                        }}
                    >
                        {renderSteps()}
                    </Animated.View>
                </View>
            </ScrollView>



            {/* دکمه ثابت در پایین صفحه */}
            <View
                style={tw`fixed flex flex-row justify-between bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4`}
            >
                {currentStep === 3 ? <TouchableOpacity
                    style={tw`flex-1 bg-yellow-500 py-3 rounded-lg shadow-lg`}
                    onPress={handleNext}
                >
                    <Text style={tw`text-gray-900 font-bold text-base text-center`}>
                        ثبت سفارش
                    </Text>
                </TouchableOpacity> :
                    <TouchableOpacity
                        style={[
                            tw`flex-1 bg-yellow-500 py-3 rounded-lg shadow-lg`,
                            nextDisabled && tw`bg-gray-300`
                        ]}
                        onPress={handleNext}
                        disabled={nextDisabled}
                    >
                        <Text style={tw`text-gray-900 font-bold text-base text-center`}>
                            مرحله بعدی
                        </Text>
                    </TouchableOpacity>
                }
                {currentStep !== 1 && <TouchableOpacity
                    style={tw`flex-1 border-gray-300 bg-white py-3 rounded-lg mr-2`}
                    activeOpacity={0.8}
                    onPress={handlePrev}
                >
                    <Text style={tw`text-gray-700 font-bold text-center text-base`}>
                        مرحله قبلی
                    </Text>
                </TouchableOpacity>}
            </View>
        </SafeAreaView>
    );
}
