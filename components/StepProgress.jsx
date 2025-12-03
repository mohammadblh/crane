import React from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Check } from 'lucide-react-native';

export default function StepProgress({ currentStep }) {
    return (
        <View style={tw`items-center justify-center mb-8`}>
            <View style={tw`flex-row items-center`}>
                {/* Step 1 */}
                <View style={[
                    tw`w-12 h-12 rounded-full border-2 items-center justify-center`,
                    currentStep === 1 ? tw`border-yellow-500 bg-white` : (currentStep > 1 ? tw`border-yellow-500 bg-yellow-500` : tw`border-gray-300 bg-white`)
                ]}>
                    {currentStep > 1 ? (
                        <Check size={24} color="white" strokeWidth={3} />
                    ) : (
                        <View style={[
                            tw`w-3 h-3 rounded-full`,
                            currentStep === 1 ? tw`bg-yellow-500` : tw`bg-gray-300`
                        ]} />
                    )}
                </View>

                <View style={[
                    tw`w-16 h-0.5`,
                    currentStep > 1 ? tw`bg-yellow-500` : tw`bg-gray-300`
                ]} />

                {/* Step 2 */}
                <View style={[
                    tw`w-12 h-12 rounded-full border-2 items-center justify-center`,
                    currentStep === 2 ? tw`border-yellow-500 bg-white` : (currentStep > 2 ? tw`border-yellow-500 bg-yellow-500` : tw`border-gray-300 bg-white`)
                ]}>
                    {currentStep > 2 ? (
                        <Check size={24} color="white" strokeWidth={3} />
                    ) : (
                        <View style={[
                            tw`w-3 h-3 rounded-full`,
                            currentStep === 2 ? tw`bg-yellow-500` : tw`bg-gray-300`
                        ]} />
                    )}
                </View>

                {/* Line 2 */}
                <View style={[
                    tw`w-16 h-0.5`,
                    currentStep > 2 ? tw`bg-yellow-500` : tw`bg-gray-300`
                ]} />

                {/* Step 3 */}
                <View style={[
                    tw`w-12 h-12 rounded-full border-2 items-center justify-center`,
                    currentStep === 3 ? tw`border-yellow-500 bg-white` : (currentStep > 3 ? tw`border-yellow-500 bg-yellow-500` : tw`border-gray-300 bg-white`)
                ]}>
                    {currentStep > 3 ? (
                        <Check size={24} color="white" strokeWidth={3} />
                    ) : (
                        <View style={[
                            tw`w-3 h-3 rounded-full`,
                            currentStep === 3 ? tw`bg-yellow-500` : tw`bg-gray-300`
                        ]} />
                    )}
                </View>
            </View>

            <View style={tw`mt-4`}>
                <Text style={tw`text-yellow-600 font-bold text-base`}>
                    {currentStep === 1 && 'مرحله اول'}
                    {currentStep === 2 && 'مرحله دوم'}
                    {currentStep === 3 && 'مرحله سوم'}
                </Text>
            </View>
        </View>
    );
}
