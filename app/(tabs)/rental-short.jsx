import React, { useState, useLayoutEffect, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import tw from 'tailwind-react-native-classnames';
import { useNavigation, useRouter, useFocusEffect } from 'expo-router';
import StepProgress from '../../components/StepProgress';
import WorkshopSelection from '../../screens/rentalShort/WorkshopSelection';
import WorkTypeSelection from '../../screens/rentalShort/WorkTypeSelection';
import AdditionalServicesSelection from '../../screens/rentalShort/AdditionalServicesSelection';
import AddWorkScreen from '../../screens/rentalShort/AddWork';

export default function RentalShortScreen() {
    const [currentStep, setCurrentStep] = useState(1);
    const [showAddWork, setShowAddWork] = useState(false);
    const [workItems, setWorkItems] = useState([]);
    const [pendingWorkType, setPendingWorkType] = useState(null);

    const navigation = useNavigation();
    const router = useRouter();
    const scrollViewRef = useRef(null);

    // Reset state when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            setCurrentStep(1);
            setShowAddWork(false);
            // Optional: Reset workItems if you want a fresh start every time
            // setWorkItems([]); 
        }, [])
    );

    // Scroll to top when step changes
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    }, [currentStep]);

    // Hide tab bar when in this screen
    useLayoutEffect(() => {
        navigation.setOptions({
            tabBarStyle: { display: 'none' }
        });

        return () => { };
    }, [navigation]);

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // Finish flow - redirect to home
            router.push('/(tabs)');
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
        setPendingWorkType(type);
        setShowAddWork(true);
    };

    const handleAddNewItem = (data) => {
        const newItem = {
            id: Date.now(),
            title: getTitleForType(pendingWorkType, workItems.length + 1),
            type: pendingWorkType, // 'installation', 'loading', 'unloading'
            ...data,
            // Determine colors based on type
            ...getColorsForType(pendingWorkType)
        };

        setWorkItems([...workItems, newItem]);
        setShowAddWork(false);
        setPendingWorkType(null);
    };

    const handleRemoveItem = (id) => {
        setWorkItems(workItems.filter(item => item.id !== id));
    };

    const getTitleForType = (type, index) => {
        switch (type) {
            case 'installation': return `نصب شماره ${index}`; // This numbering might need to be per-type
            case 'loading': return `بارگیری شماره ${index}`;
            case 'unloading': return `تخلیه شماره ${index}`;
            default: return `آیتم شماره ${index}`;
        }
    };

    const getColorsForType = (type) => {
        switch (type) {
            case 'installation':
                return { color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300' };
            case 'loading':
                return { color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-300' };
            case 'unloading':
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
        return (
            <AddWorkScreen
                onBack={() => setShowAddWork(false)}
                onSubmit={handleAddNewItem}
                workType={pendingWorkType}
            />
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            <ScrollView
                ref={scrollViewRef}
                style={tw`flex-1`}
                contentContainerStyle={tw`pb-8`}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={tw`bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between`}>
                    <TouchableOpacity onPress={handleBack}>
                        <ChevronRight size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text style={tw`text-lg font-bold text-gray-800`}>
                        {getHeaderTitle()}
                    </Text>
                    <View style={tw`w-6`} />
                </View>

                <View style={tw`py-6`}>
                    {/* Progress Steps */}
                    <StepProgress currentStep={currentStep} />

                    {/* Step Content */}
                    {currentStep === 1 && (
                        <WorkshopSelection onNext={handleNext} />
                    )}

                    {currentStep === 2 && (
                        <WorkTypeSelection
                            onNext={handleNext}
                            onPrev={handlePrev}
                            onAddWork={handleAddWorkStart}
                            workItems={workItems}
                            onRemoveItem={handleRemoveItem}
                        />
                    )}

                    {currentStep === 3 && (
                        <AdditionalServicesSelection onNext={handleNext} onPrev={handlePrev} />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}