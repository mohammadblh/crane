import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'tailwind-react-native-classnames';

export default function ConfirmDialog({
    visible,
    onClose,
    onConfirm,
    title = 'تایید عملیات',
    message = 'آیا از انجام این کار اطمینان دارید؟',
    confirmText = 'تایید',
    cancelText = 'لغو',
    isLoading = false,
}) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                <View style={tw`bg-white w-5/6 rounded-3xl p-6 shadow-xl`}>
                    <Text style={tw`text-xl font-bold text-gray-800 text-center mb-4`}>
                        {title}
                    </Text>
                    <Text style={tw`text-base text-gray-600 text-center mb-8 leading-6`}>
                        {message}
                    </Text>

                    <View style={tw`flex-row justify-between mt-2`}>
                        <TouchableOpacity
                            style={tw`flex-1 bg-gray-100 py-3.5 rounded-xl mr-2 border border-gray-200`}
                            onPress={onClose}
                            disabled={isLoading}
                        >
                            <Text style={tw`text-gray-700 font-bold text-center text-base`}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={tw`flex-1 bg-red-500 py-3.5 rounded-xl ml-2 flex-row justify-center items-center shadow-md`}
                            onPress={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text style={tw`text-white font-bold text-center text-base`}>{confirmText}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
