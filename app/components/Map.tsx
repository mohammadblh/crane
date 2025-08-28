import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import tw from 'tailwind-react-native-classnames'
// import MapView from 'react-native-web-maps';
import MapView, { Marker, Polyline } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import { selectDestination, selectOrigin, setTravelTimeInformation } from '../slices/navSlice'
import axios from 'axios'

const Map = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const dispatch = useDispatch();
  const [coordinates, setCoordinates] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    if(!origin || !destination) return
    fetchDirections();


  }, [origin, destination]);

  useEffect(() => {
    // تنظیم زوم نقشه پس از دریافت مختصات
    if (coordinates.length > 0 && mapRef.current) {
      //@ts-ignore
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, // فاصله از لبه‌ها
        animated: true,
      });
    }
  }, [coordinates]);

  const fetchDirections = async () => {
    const start = `${origin.location.lon},${origin.location.lat}`; // مختصات مبدا (تهران)
    // const start = "51.3890,35.6892"; // مختصات مبدا (تهران)
    const end = `${destination.location.lon},${destination.location.lat}`; // مختصات مقصد (یک نقطه نزدیک به تهران)
    // const end = "51.4190,35.7292"; // مختصات مقصد (یک نقطه نزدیک به تهران)

    try {
      const response = await axios.get(
        `http://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`
      );
      
      const route = response.data.routes[0];
      const coordinates = route.geometry.coordinates.map((coord:any) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));

      dispatch(setTravelTimeInformation({
        distance: {
          km: (route.distance / 1000).toFixed(2),
          m: route.distance
        },
        duration: {
          m: (route.duration / 60).toFixed(0),
          s: route.duration
        }
      }))
      setCoordinates(coordinates);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  return (
    <View style={styles.container}>
      {origin?
      <MapView style={styles.map} 
      ref={mapRef}
        initialRegion={{
            latitude: Number(origin.location.lat),
            longitude: Number(origin.location.lon),
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        }}
      >
        {origin && destination ? (
          <>
            {/* نمایش مسیر روی نقشه */}
            {coordinates.length > 0 && (
              <Polyline
                coordinates={coordinates}
                strokeWidth={6}
                strokeColor="black"
              />
            )}
    
            {/* نمایش مارکرهای مبدا و مقصد */}
            {coordinates.length > 0 && (
              <>
                <Marker coordinate={coordinates[0]} title="مبدا" />
                <Marker coordinate={coordinates[coordinates.length - 1]} title="مقصد" />
              </>
            )}
            </>
          ):
          origin?.location && (
            <Marker 
              coordinate={{
                latitude: Number(origin.location.lat),
                longitude: Number(origin.location.lon),
              }}
              title='Origin'
              description={origin.description}
              identifier='origin'
            />
        )}
      </MapView>: null}
    </View>
  )
}

export default Map
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });