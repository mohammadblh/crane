import React, { useState, useLayoutEffect, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Animated,
    Alert,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useNavigation, useRouter, useFocusEffect } from 'expo-router';
import Loading from '../Loading';
import StepProgress from '../StepProgress';
import MultiFormRender from './MultiFormRender';
import { api } from '../../hooks/useApi';
import RenderForm from '@/components/FormRenderer/RenderForm';

export default function RentalRender({ rental }) {
    const insets = useSafeAreaInsets();
    const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 16);

    const [currentStep, setCurrentStep] = useState(1);
    const [nextDisabled, setNextDisabled] = useState(false);
    const [workItems, setWorkItems] = useState([]);
    const [previousStep, setPreviousStep] = useState(1);
    const [formData, setFormData] = useState({});

    const navigation = useNavigation();
    const router = useRouter();
    const scrollViewRef = useRef(null);
    const slideAnimation = useRef(new Animated.Value(0)).current;

    console.log('rental', rental);
    console.log('formData>><>>', formData);

    // Check workItems to enable/disable next button
    useEffect(() => {
        console.log('workItems', workItems);

        const currentStepData = rental.steps[currentStep - 1];

        // اگر این استپ numrow > 1 داره، باید حداقل یک آیتم برای این استپ خاص داشته باشیم
        if (currentStepData?.numrow && currentStepData.numrow > 1) {
            const currentStepItems = workItems.filter(item => item.stepId === currentStepData.stepId);
            setNextDisabled(currentStepItems.length === 0);
        } else {
            setNextDisabled(false);
        }
    }, [workItems, currentStep, rental]);

    // Reset state when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            setCurrentStep(1);
            // Optional: Reset workItems if you want a fresh start every time
            // setWorkItems([]);
        }, [])
    );

    // Animation on step change
    useEffect(() => {
        if (currentStep !== previousStep) {
            const isMovingForward = currentStep > previousStep;
            const startValue = isMovingForward ? -300 : 300;

            slideAnimation.setValue(startValue);

            Animated.timing(slideAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();

            setPreviousStep(currentStep);
        }
    }, [currentStep, previousStep]);

    // Scroll to top when step changes
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    }, [currentStep]);

    // Check workItems to enable/disable next button
    useEffect(() => {
        console.log('workItems', workItems);

        const currentStepData = rental.steps[currentStep - 1];

        // اگر این استپ numrow > 1 داره، باید حداقل یک آیتم داشته باشیم
        if (currentStepData?.numrow && currentStepData.numrow > 1) {
            setNextDisabled(workItems.length === 0);
        } else {
            setNextDisabled(false);
        }
    }, [workItems, currentStep, rental]);

    // Hide tab bar when in this screen
    useLayoutEffect(() => {
        navigation.setOptions({
            tabBarStyle: { display: 'none' }
        });

        return () => { };
    }, [navigation]);

    // console.log('formData', formData);

    const submitRequest = async () => {
        try {
            const finger = await AsyncStorage.getItem('user_finger');

            // Send to API
            const response = await api.Sendform(finger, formData);
            console.log('response', response);

            if (response.success) {
                // Clear workItems from AsyncStorage
                await AsyncStorage.removeItem('workItems');

                // Reset all states
                setWorkItems([]);
                setFormData({});

                console.log('✅ States cleared for new request');

                Alert.alert(
                    'موفق',
                    response.message,
                    [
                        {
                            text: 'باشه',
                            onPress: () => {
                                setCurrentStep(1);
                                router.push('/(tabs)');
                            }
                        }
                    ]
                );
            } else {
                Alert.alert('خطا', response.message);
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            Alert.alert('خطا', 'خطا در ارسال درخواست');
        }
    };

    const handleNext = () => {
        if (currentStep < rental.steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit request on last step
            submitRequest();
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            router.push('/(tabs)');
        }
    };

    const handleBack = () => {
        if (currentStep === 1) {
            router.push('/(tabs)');
        } else {
            handlePrev();
        }
    };

    // تابع برای افزودن آیتم جدید از MultiFormRender
    const handleAddWorkItem = async (items) => {
        console.log('handleAddWorkItem:', items);

        // اگر آرایه است (در حالت ویرایش)
        if (Array.isArray(items)) {
            setWorkItems(items);
            await AsyncStorage.setItem('workItems', JSON.stringify(items));
        } else {
            // آیتم جدید
            const updatedWorkItems = [...workItems, items];
            setWorkItems(updatedWorkItems);
            await AsyncStorage.setItem('workItems', JSON.stringify(updatedWorkItems));
        }
    };

    const handleRemoveItem = async (id) => {
        const updatedWorkItems = workItems.filter(item => item.id !== id);
        setWorkItems(updatedWorkItems);

        // Save to AsyncStorage
        await AsyncStorage.setItem('workItems', JSON.stringify(updatedWorkItems));
    };

    const getHeaderTitle = () => {
        if (rental.steps[currentStep - 1]?.title) {
            return rental.steps[currentStep - 1].title;
        }
        return rental.name || 'فرم';
    };

    const onFormChange = (data) => {
        console.log('onFormChange data:', data);

        // اضافه کردن formId در اولین بار
        if (!formData.formId) {
            data.formId = rental.formId;
        }

        setFormData(prev => ({
            ...prev,
            ...data
        }));
    };

    const renderSteps = () => {
        const currentStepData = rental.steps[currentStep - 1];
        console.log('renderSteps - currentStep:', currentStep, 'stepData:', currentStepData);

        // بررسی اینکه آیا این استپ باید مالتی فرم باشه
        if (currentStepData?.numrow && currentStepData.numrow > 1) {
            return (
                <MultiFormRender
                    onFormChange={onFormChange}
                    onAddWork={handleAddWorkItem}
                    workItems={workItems}
                    jsonComp={currentStepData}
                    onRemoveItem={handleRemoveItem}
                />
            );
        }

        // در غیر این صورت، فرم معمولی
        return (
            <RenderForm
                data={currentStepData?.sections || []}
                onChange={onFormChange}
            />
        );
    };

    if (!rental) return <Loading />;

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
                        {getHeaderTitle()}
                    </Text>
                    <TouchableOpacity onPress={handleBack}>
                        <ArrowRight size={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <View style={tw`h-full mt-6 mb-6`}>
                    {/* Progress Steps */}
                    <StepProgress currentStep={currentStep} steps={rental.steps} />

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
                style={[tw`fixed flex flex-row justify-between bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4`, { bottom: bottomInset }]}
            >
                {currentStep === rental.steps.length ? (
                    <TouchableOpacity
                        style={tw`flex-1 bg-yellow-500 py-3 rounded-lg shadow-lg`}
                        onPress={handleNext}
                    >
                        <Text style={tw`text-gray-900 font-bold text-base text-center`}>
                            ثبت سفارش
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[
                            tw`flex-1 bg-yellow-500 py-3 rounded-lg shadow-lg`,
                            nextDisabled && tw`bg-gray-300`,
                        ]}
                        onPress={handleNext}
                        disabled={nextDisabled}
                    >
                        <Text style={tw`text-gray-900 font-bold text-base text-center`}>
                            مرحله بعدی
                        </Text>
                    </TouchableOpacity>
                )}

                {currentStep !== 1 && (
                    <TouchableOpacity
                        style={tw`flex-1 border-gray-300 bg-white py-3 rounded-lg mr-2`}
                        activeOpacity={0.8}
                        onPress={handlePrev}
                    >
                        <Text style={tw`text-gray-700 font-bold text-center text-base`}>
                            مرحله قبلی
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}