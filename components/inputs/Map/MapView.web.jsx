import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Modal, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { MapPin, ExternalLink, Edit2, Check, X } from 'lucide-react-native';

// Replace with your Geoapify API key - sign up for free at https://myprojects.geoapify.com
const GEOAPIFY_KEY = 'your_geoapify_api_key_here';

// تبدیل string "lat - lng" به object {latitude, longitude}
const parseLocationValue = (val) => {
    if (!val) return null;
    if (typeof val === 'object' && val.latitude) return val;
    if (typeof val === 'string') {
        const parts = val.split('-').map(s => parseFloat(s.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            return { latitude: parts[0], longitude: parts[1] };
        }
    }
    return null;
};

export default function MapViewComponent({ field, value, onChange, readOnly = false }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempLocation, setTempLocation] = useState(null);

    // Default location (Tehran)
    const defaultLocation = { latitude: 35.6892, longitude: 51.3890 };
    const location = parseLocationValue(value) || parseLocationValue(field.defaultValue) || defaultLocation;
    const mapHeight = field.height || 300;

    const handleOpenInMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
        window.open(url, '_blank');
    };

    const handleSelectLocation = () => {
        if (readOnly) return;
        setTempLocation(location);
        setIsEditing(true);
    };

    const handleSaveLocation = () => {
        if (tempLocation && onChange) {
            // فرمت خروجی: "lat - lng" (مثلاً "35.6892 - 51.389")
            const formatted = `${tempLocation.latitude} - ${tempLocation.longitude}`;
            onChange(formatted);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempLocation(null);
        setIsEditing(false);
    };

    const handleOpenMapPicker = () => {
        // باز کردن Google Maps در حالت انتخاب موقعیت
        const currentLat = tempLocation?.latitude || location.latitude;
        const currentLng = tempLocation?.longitude || location.longitude;
        const url = `https://www.google.com/maps/@${currentLat},${currentLng},15z`;
        window.open(url, '_blank');
    };

    // Generate static map image URL using Geoapify
    const getStaticMapUrl = (loc = location) => {
        const zoom = 15;
        const width = 600;
        const height = 400;
        return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&center=lonlat:${loc.longitude},${loc.latitude}&zoom=${zoom}&marker=lonlat:${loc.longitude},${loc.latitude};color:%23ff0000;size:medium&size=${width}x${height}&apiKey=${GEOAPIFY_KEY}`;
    };

    return (
        <View style={tw`mb-4`}>
            {field.title && (
                <Text style={tw`text-gray-800 font-bold text-sm mb-3 text-right`}>
                    {field.title}
                </Text>
            )}

            {field.description && (
                <Text style={tw`text-gray-600 text-xs mb-2 text-right`}>
                    {field.description}
                </Text>
            )}

            <View style={[tw`rounded-xl overflow-hidden border-2 border-gray-200`, { height: mapHeight }]}>
                {/* Static Map Image */}
                {location ? (
                    <TouchableOpacity
                        onPress={handleSelectLocation}
                        activeOpacity={readOnly ? 1 : 0.7}
                        disabled={readOnly}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <Image
                            source={{ uri: getStaticMapUrl() }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                        />

                        {/* نمایش آیکون ویرایش در حالت غیر readOnly */}
                        {!readOnly && (
                            <View style={tw`absolute top-2 left-2 bg-white rounded-full p-2 shadow-lg`}>
                                <Edit2 size={20} color="#3B82F6" />
                            </View>
                        )}
                    </TouchableOpacity>
                ) : (
                    <View style={tw`flex-1 bg-gray-100 items-center justify-center`}>
                        <MapPin size={40} color="#9CA3AF" />
                        <Text style={tw`text-gray-500 text-sm mt-2`}>
                            موقعیت مکانی موجود نیست
                        </Text>
                    </View>
                )}

                {/* Overlay with location info */}
                {location && (
                    <View style={tw`absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 px-4 py-3`}>
                        <View style={tw`flex-row items-center justify-between`}>
                            <View style={tw`flex-row items-center flex-1`}>
                                <MapPin size={20} color="#EF4444" />
                                <View style={tw`mr-2 flex-1`}>
                                    <Text style={tw`text-gray-800 text-xs font-bold`}>
                                        عرض: {location.latitude.toFixed(6)}
                                    </Text>
                                    <Text style={tw`text-gray-800 text-xs font-bold`}>
                                        طول: {location.longitude.toFixed(6)}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={tw`bg-blue-500 px-3 py-2 rounded-lg flex-row items-center`}
                                onPress={handleOpenInMaps}
                                activeOpacity={0.7}
                            >
                                <ExternalLink size={16} color="#FFFFFF" />
                                <Text style={tw`text-white font-bold text-xs mr-1`}>باز کردن</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {/* Modal for Location Editing */}
            <Modal
                visible={isEditing}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={tw`text-gray-800 font-bold text-lg mb-4 text-right`}>
                            انتخاب موقعیت مکانی
                        </Text>

                        {/* Preview Map */}
                        <View style={[tw`rounded-xl overflow-hidden border-2 border-gray-200 mb-4`, { height: 200 }]}>
                            {tempLocation && (
                                <Image
                                    source={{ uri: getStaticMapUrl(tempLocation) }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />
                            )}
                        </View>

                        {/* Latitude Input */}
                        <View style={tw`mb-3`}>
                            <Text style={tw`text-gray-700 text-sm mb-1 text-right`}>عرض جغرافیایی</Text>
                            <TextInput
                                style={tw`border border-gray-300 rounded-lg px-3 py-2 text-right`}
                                value={tempLocation?.latitude?.toString() || ''}
                                onChangeText={(text) => {
                                    const lat = parseFloat(text);
                                    if (!isNaN(lat) && tempLocation) {
                                        setTempLocation({ ...tempLocation, latitude: lat });
                                    }
                                }}
                                keyboardType="numeric"
                                placeholder="35.6892"
                            />
                        </View>

                        {/* Longitude Input */}
                        <View style={tw`mb-4`}>
                            <Text style={tw`text-gray-700 text-sm mb-1 text-right`}>طول جغرافیایی</Text>
                            <TextInput
                                style={tw`border border-gray-300 rounded-lg px-3 py-2 text-right`}
                                value={tempLocation?.longitude?.toString() || ''}
                                onChangeText={(text) => {
                                    const lng = parseFloat(text);
                                    if (!isNaN(lng) && tempLocation) {
                                        setTempLocation({ ...tempLocation, longitude: lng });
                                    }
                                }}
                                keyboardType="numeric"
                                placeholder="51.3890"
                            />
                        </View>

                        {/* Open Map Picker Button */}
                        <TouchableOpacity
                            style={tw`bg-gray-100 px-4 py-3 rounded-lg flex-row items-center justify-center mb-4`}
                            onPress={handleOpenMapPicker}
                            activeOpacity={0.7}
                        >
                            <MapPin size={20} color="#3B82F6" />
                            <Text style={tw`text-blue-500 font-bold text-sm mr-2`}>
                                انتخاب از نقشه
                            </Text>
                        </TouchableOpacity>

                        {/* Action Buttons */}
                        <View style={tw`flex-row justify-end`}>
                            <TouchableOpacity
                                style={tw`bg-gray-200 px-4 py-2 rounded-lg flex-row items-center ml-2`}
                                onPress={handleCancel}
                                activeOpacity={0.7}
                            >
                                <X size={18} color="#6B7280" />
                                <Text style={tw`text-gray-700 font-bold text-sm mr-1`}>انصراف</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={tw`bg-blue-500 px-4 py-2 rounded-lg flex-row items-center`}
                                onPress={handleSaveLocation}
                                activeOpacity={0.7}
                            >
                                <Check size={18} color="#FFFFFF" />
                                <Text style={tw`text-white font-bold text-sm mr-1`}>ذخیره</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 500,
    },
});