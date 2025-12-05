import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { MapPin, ExternalLink } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapViewComponent({ field, value, onChange }) {
    const mapRef = useRef(null);

    // Default location (Tehran)
    const defaultLocation = {
        latitude: 35.6892,
        longitude: 51.3890
    };

    const location = value || field.defaultValue || defaultLocation;
    const mapHeight = field.height || 300;

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
    }, [location]);

    const handleOpenInMaps = () => {
        const url = `geo:0,0?q=${location.latitude},${location.longitude}`;
        Linking.openURL(url);
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
                {location ? (
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        scrollEnabled={field.scrollEnabled !== false}
                        zoomEnabled={field.zoomEnabled !== false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            title={field.markerTitle || "موقعیت"}
                            description={field.markerDescription}
                        />
                    </MapView>
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
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});
