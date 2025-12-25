import React from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Check } from 'lucide-react-native';

export default function StepProgress({ currentStep, steps=[] }) {
    // const steps = [
    //     { id: 1, title: 'مرحله اول' },
    //     { id: 2, title: 'مرحله دوم' },
    //     { id: 3, title: 'مرحله سوم' },
    // ];

    return (
        <View style={tw`flex-row-reverse justify-center items-start mb-6 px-4`}>
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>

                    {/* Step Item */}
                    <View style={tw`items-center w-16`}>
                        <View
                            style={[
                                tw`w-10 h-10 rounded-full border-2 items-center justify-center mb-1`,
                                currentStep === step.stepNumber
                                    ? { borderColor: '#D19D00', backgroundColor: 'white' }
                                    : currentStep > step.stepNumber
                                        ? { borderColor: '#D19D00', backgroundColor: '#D19D00' }
                                        : tw`border-gray-300 bg-white`
                            ]}
                        >
                            {currentStep > step.stepNumber ? (
                                <Check size={18} color="white" strokeWidth={3} />
                            ) : (
                                <View
                                    style={[
                                        tw`w-2.5 h-2.5 rounded-full`,
                                        currentStep === step.stepNumber
                                            ? { backgroundColor: '#D19D00' }
                                            : tw`bg-gray-300`
                                    ]}
                                />
                            )}
                        </View>

                        <Text
                            style={[
                                tw`text-xs text-center font-medium px-1`,
                                currentStep >= step.id ? tw`text-gray-800` : tw`text-gray-400`,
                                { color: "#D19D00" }
                            ]}
                        >
                            {step.stepNumber === currentStep ? step.title : null}
                        </Text>
                    </View>

                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                        <View
                            style={[
                                tw`w-8 h-0.5 mt-5`,
                                currentStep > step.stepNumber
                                    ? { backgroundColor: '#D19D00' }
                                    : tw`bg-gray-300`
                            ]}
                        />
                    )}
                </React.Fragment>
            ))}
        </View>
    );
}
