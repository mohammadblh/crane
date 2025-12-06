import React, { useState, useLayoutEffect, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Animated,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRight } from 'lucide-react-native';
import tw from 'tailwind-react-native-classnames';
import { useNavigation, useRouter, useFocusEffect } from 'expo-router';
import Loading from '../../components/Loading';
import StepProgress from '../../components/StepProgress';
import WorkshopSelection from '../../screens/rentalShort/WorkshopSelection';
import WorkTypeSelection from '../../screens/rentalShort/WorkTypeSelection';
import AdditionalServicesSelection from '../../screens/rentalShort/AdditionalServicesSelection';
import AddWorkScreen from '../../screens/rentalShort/AddWork';
import { api } from '../../hooks/useApi';

export default function RentalShortScreen() {
    const [currentStep, setCurrentStep] = useState(1);
    const [showAddWork, setShowAddWork] = useState(null);
    const [nextDisabled, setNextDisabled] = useState(false);
    const [rentalShort, setRentalShort] = useState(null);
    const [workItems, setWorkItems] = useState([]);
    const [pendingWorkType, setPendingWorkType] = useState(null);
    const [previousStep, setPreviousStep] = useState(1);

    const [formData, setFormData] = useState({
        workshopName: '', cat1: '', cat2: '',
        works: []
    });
    const [additionalServices, setAdditionalServices] = useState({});

    console.log('workItems', workItems)

    const navigation = useNavigation();
    const router = useRouter();
    const rentalShortRef = useRef(null);
    const scrollViewRef = useRef(null);
    const slideAnimation = useRef(new Animated.Value(0)).current;

    // Reset state when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            setCurrentStep(1);
            setShowAddWork(null);
            // Optional: Reset workItems if you want a fresh start every time
            // setWorkItems([]); 
        }, [])
    );

    // get fields and load workItems from AsyncStorage
    useEffect(() => {
        const loadData = async () => {
            // Load rental short data
            let res = await AsyncStorage.getItem('rentalShort');
            res = JSON.parse(res);

            if (res)
                setRentalShort(res.data);

            // Load workItems from AsyncStorage
            const savedWorkItems = await AsyncStorage.getItem('workItems');
            if (savedWorkItems) {
                const parsedWorkItems = JSON.parse(savedWorkItems);
                setWorkItems(parsedWorkItems);
                setFormData(prev => ({
                    ...prev,
                    works: parsedWorkItems
                }));
            }
        };
        loadData();
    }, []);

    // Animate step transitions
    useEffect(() => {
        if (currentStep !== previousStep) {
            // Determine direction: if moving forward (next), slide from left to right
            // if moving backward (prev), slide from right to left
            const isMovingForward = currentStep > previousStep;
            const startValue = isMovingForward ? -300 : 300; // LTR for next, RTL for prev

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
        if (currentStep === 2) {
            // At step 2 (work type selection), need at least one work item
            setNextDisabled(workItems.length === 0);
        } else {
            // Other steps can proceed
            setNextDisabled(false);
        }
    }, [workItems, currentStep]);

    // Hide tab bar when in this screen
    useLayoutEffect(() => {
        navigation.setOptions({
            tabBarStyle: { display: 'none' }
        });

        return () => { };
    }, [navigation]);

    const submitRequest = async () => {
        try {
            // Create unified request payload
            const requestPayload = {
                workshop: {
                    name: formData.workshopName,
                    category1: formData.cat1,
                    category2: formData.cat2
                },
                works: workItems.map(item => ({
                    id: item.id,
                    type: item.type,
                    title: item.title,
                    data: item.formData
                })),
                additionalServices: additionalServices,
                timestamp: new Date().toISOString(),
                type: 'اجاره موردی'
            };

            console.log('📦 Submitting request:', requestPayload);

            // Send to API (uses AsyncStorage in DEV_MODE)
            const response = await api.addWork(requestPayload);

            if (response.success) {
                // Clear workItems from AsyncStorage
                await AsyncStorage.removeItem('workItems');

                // Reset all states
                setWorkItems([]);
                setFormData({
                    workshopName: '',
                    cat1: '',
                    cat2: '',
                    works: []
                });
                setAdditionalServices({});

                console.log('✅ States cleared for new request');

                Alert.alert(
                    'موفق',
                    response.message,
                    [
                        {
                            text: 'باشه',
                            onPress: () => {
                                // Reset to step 1 and go home
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
        if (currentStep < 3) {
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

    const handleAddWorkStart = (type) => {
        console.log('type handle add work:', type)
        setPendingWorkType(type);
        setShowAddWork(type);
    };

    const handleAddNewItem = async (data) => {
        console.log('handleAddNewItem data:', data);
        const newItem = {
            id: Date.now(),
            title: getTitleForType(pendingWorkType, workItems.length + 1),
            type: pendingWorkType,
            formData: data,
            ...getColorsForType(pendingWorkType)
        };

        const updatedWorkItems = [...workItems, newItem];
        setWorkItems(updatedWorkItems);
        setFormData(prev => ({
            ...prev,
            works: updatedWorkItems
        }));

        // Save to AsyncStorage
        await AsyncStorage.setItem('workItems', JSON.stringify(updatedWorkItems));

        setShowAddWork(false);
        setPendingWorkType(null);
    };

    const handleRemoveItem = async (id) => {
        const updatedWorkItems = workItems.filter(item => item.id !== id);
        setWorkItems(updatedWorkItems);
        setFormData(prev => ({
            ...prev,
            works: updatedWorkItems
        }));

        // Save to AsyncStorage
        await AsyncStorage.setItem('workItems', JSON.stringify(updatedWorkItems));
    };

    const getTitleForType = (type, index) => {
        switch (type) {
            case 'نصب': return `نصب شماره ${index}`;
            case 'بارگیری': return `بارگیری شماره ${index}`;
            case 'تخلیه': return `تخلیه شماره ${index}`;
            default: return `${type} شماره ${index}`;
        }
    };

    const getColorsForType = (type) => {
        switch (type) {
            case 'نصب':
                return { color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300' };
            case 'بارگیری':
                return { color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-300' };
            case 'تخلیه':
                return { color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-300' };
            default:
                return { color: 'gray', bgColor: 'bg-gray-50', borderColor: 'border-gray-300' };
        }
    };

    const getHeaderTitle = () => {
        switch (currentStep) {
            case 1: return 'انتخاب کارگاه';
            case 2: return 'نوع کار';
            case 3: return 'خدمات اضافی';
            default: return 'اجاره موردی';
        }
    };

    if (showAddWork) {
        const items = rentalShort.steps[1].sections;
        // const items = rentalShort.steps[1].sections[showAddWork];
        if (items && items[showAddWork] && items[showAddWork].length)
            return (
                <AddWorkScreen
                    onBack={() => setShowAddWork(false)}
                    onSubmit={handleAddNewItem}
                    items={items[showAddWork]}
                    addWorkName={showAddWork}
                // workType={pendingWorkType}
                />
            );
    }


    if (!rentalShort) return <Loading />;


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
                    <StepProgress currentStep={currentStep} />

                    {/* Step Content with Animation */}
                    <Animated.View
                        style={{
                            transform: [{ translateX: slideAnimation }],
                        }}
                    >
                        {currentStep === 1 && (
                            <WorkshopSelection jsonComp={rentalShort.steps[0]} />
                        )}

                        {currentStep === 2 && (
                            <WorkTypeSelection
                                onAddWork={handleAddWorkStart}
                                workItems={workItems}
                                jsonComp={rentalShort.steps[1]}
                                onRemoveItem={handleRemoveItem}
                            />
                        )}

                        {currentStep === 3 && (
                            <AdditionalServicesSelection
                                jsonComp={rentalShort.steps[2]}
                                onChange={(data) => setAdditionalServices(data)}
                            />
                        )}
                    </Animated.View>
                </View>
            </ScrollView>

            {/* دکمه ثابت در پایین صفحه */}
            <View
                style={tw`absolute flex flex-row justify-between bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4`}
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