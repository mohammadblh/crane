import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Modal, TextInput, Platform } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { MapPin, ExternalLink, Edit2, Check, X, Search } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapViewComponent({ field, value, onChange, readOnly = false }) {
    const mapRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tempLocation, setTempLocation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Default location (Tehran)
    const defaultLocation = { latitude: 35.6892, longitude: 51.3890 };

    // Parse location from string or object
    const parseLocation = (val) => {
        if (typeof val === 'object' && val?.latitude && val?.longitude) {
            return { latitude: parseFloat(val.latitude), longitude: parseFloat(val.longitude) };
        }
        if (typeof val === 'string' && val.includes(' - ')) {
            const [latStr, lngStr] = val.split(' - ');
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            if (!isNaN(lat) && !isNaN(lng)) {
                return { latitude: lat, longitude: lng };
            }
        }
        return defaultLocation;
    };

    const location = parseLocation(value || field?.defaultValue);
    const mapHeight = field?.height || 300;

    useEffect(() => {
        // Animate to region when location changes
        if (mapRef.current && location) {
            mapRef.current.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    }, [location.latitude, location.longitude]); // Depend on specific values to avoid unnecessary re-renders

    const handleOpenInMaps = () => {
        const url = Platform.select({
            ios: `maps:0,0?q=${location.latitude},${location.longitude}`,
            android: `geo:0,0?q=${location.latitude},${location.longitude}`,
            default: `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
        });
        Linking.openURL(url);
    };

    const handleEditLocation = () => {
        if (readOnly) return;
        setTempLocation(location);
        setIsEditing(true);
    };

    const handleMapPress = (event) => {
        if (!isEditing) return;
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setTempLocation({ latitude, longitude });
    };

    const handleSaveLocation = () => {
        if (tempLocation && onChange) {
            // Format output: "lat - lng" (e.g., "35.6892 - 51.3890")
            const formatted = `${tempLocation.latitude} - ${tempLocation.longitude}`;
            onChange(formatted);
        }
        setIsEditing(false);
        setSearchQuery('');
    };

    const handleCancel = () => {
        setTempLocation(null);
        setIsEditing(false);
        setSearchQuery('');
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            // Use Nominatim Geocoding API (no API key needed)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
            );
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newLocation = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
                setTempLocation(newLocation);
                // Move map to new location
                if (mapRef.current) {
                    mapRef.current.animateToRegion({
                        ...newLocation,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('خطا در جستجو:', error);
        }
    };

    return (
        <View style={tw`w-full`}>
            {field?.title && (
                <Text style={tw`text-lg font-bold mb-2 text-right`}>{field.title}</Text>
            )}
            {field?.description && (
                <Text style={tw`text-sm text-gray-600 mb-4 text-right`}>{field.description}</Text>
            )}
            {location ? (
                <View style={{ height: mapHeight, width: '100%', position: 'relative' }}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={location}
                            title="موقعیت فعلی"
                        />
                    </MapView>
                    {/* Edit Button - only if not readOnly */}
                    {!readOnly && (
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={handleEditLocation}
                        >
                            <Edit2 color="#000" size={24} />
                        </TouchableOpacity>
                    )}
                    {/* Overlay with location info */}
                    <View style={tw`absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-md flex-row justify-between items-center`}>
                        <Text style={tw`text-sm text-gray-800`}>
                            عرض: {location.latitude.toFixed(6)} طول: {location.longitude.toFixed(6)}
                        </Text>
                        <TouchableOpacity onPress={handleOpenInMaps} style={tw`flex-row items-center`}>
                            <ExternalLink color="#000" size={16} />
                            <Text style={tw`ml-1 text-blue-600`}>باز کردن</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Text style={tw`text-red-500`}>موقعیت مکانی موجود نیست</Text>
            )}

            {/* Modal for Location Editing */}
            <Modal
                visible={isEditing}
                animationType="slide"
                onRequestClose={handleCancel}
            >
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={handleCancel}>
                            <X color="#000" size={24} />
                        </TouchableOpacity>
                        <Text style={tw`text-lg font-bold`}>انتخاب موقعیت مکانی</Text>
                        <TouchableOpacity onPress={handleSaveLocation}>
                            <Check color="#000" size={24} />
                        </TouchableOpacity>
                    </View>
                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={[tw`flex-1 border border-gray-300 rounded-md px-4 py-2 text-right`, { marginRight: 8 }]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="جستجو"
                        />
                        <TouchableOpacity onPress={handleSearch}>
                            <Search color="#000" size={24} />
                        </TouchableOpacity>
                    </View>
                    {/* Map */}
                    <View style={styles.editMapContainer}>
                        <MapView
                            ref={mapRef}
                            style={styles.map}
                            onPress={handleMapPress}
                            initialRegion={{
                                latitude: tempLocation?.latitude || defaultLocation.latitude,
                                longitude: tempLocation?.longitude || defaultLocation.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            {tempLocation && (
                                <Marker
                                    coordinate={tempLocation}
                                    draggable
                                    onDragEnd={(e) => {
                                        const { latitude, longitude } = e.nativeEvent.coordinate;
                                        setTempLocation({ latitude, longitude });
                                    }}
                                    title="موقعیت انتخابی"
                                />
                            )}
                        </MapView>
                        {/* Crosshair in center */}
                        <View style={styles.crosshair}>
                            <MapPin color="red" size={32} />
                        </View>
                    </View>
                    {/* Coordinates Display */}
                    {tempLocation && (
                        <View style={styles.coordinatesContainer}>
                            <Text style={tw`text-sm text-gray-800 text-right`}>
                                موقعیت انتخابی: {tempLocation.latitude.toFixed(6)}, {tempLocation.longitude.toFixed(6)}
                            </Text>
                        </View>
                    )}
                    {/* Manual Input */}
                    <View style={styles.manualInputContainer}>
                        <Text style={tw`text-sm text-gray-600 mb-2 text-right`}>یا وارد کردن دستی مختصات:</Text>
                        <TextInput
                            style={[styles.input, { marginBottom: 8 }]}
                            value={tempLocation?.latitude?.toString() || ''}
                            onChangeText={(text) => {
                                const lat = parseFloat(text);
                                if (!isNaN(lat)) {
                                    setTempLocation({ ...tempLocation, latitude: lat });
                                }
                            }}
                            keyboardType="numeric"
                            placeholder="35.6892"
                        />
                        <Text style={tw`text-xs text-gray-500 mb-2 text-right`}>عرض جغرافیایی</Text>
                        <TextInput
                            style={styles.input}
                            value={tempLocation?.longitude?.toString() || ''}
                            onChangeText={(text) => {
                                const lng = parseFloat(text);
                                if (!isNaN(lng)) {
                                    setTempLocation({ ...tempLocation, longitude: lng });
                                }
                            }}
                            keyboardType="numeric"
                            placeholder="51.3890"
                        />
                        <Text style={tw`text-xs text-gray-500 text-right`}>طول جغرافیایی</Text>
                    </View>
                    {/* Instructions */}
                    <View style={tw`p-4 bg-gray-100`}>
                        <Text style={tw`text-sm text-gray-600 text-right`}>
                            روی نقشه کلیک کنید یا مارکر را بکشید تا موقعیت را انتخاب کنید
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
    editButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    editMapContainer: {
        flex: 1,
        position: 'relative',
    },
    crosshair: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -16,
        marginLeft: -16,
        pointerEvents: 'none',
    },
    coordinatesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    manualInputContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        textAlign: 'right',
        fontSize: 14,
    },
});