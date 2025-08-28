import { TouchableOpacity, View } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'
import Map from '../components/Map'
import NavigateCard from '../components/NavigateCard';
import { Icon } from 'react-native-elements';
import { router } from 'expo-router';

const MapScreen = () => {
  return (
    <View>
      <TouchableOpacity 
      onPress={() => router.back()}
      style={[tw`bg-gray-100 absolute top-16 left-8 z-50 p-3 rounded-full shadow-lg`, { zIndex: 1 }]}>
        <Icon name="menu" />
      </TouchableOpacity>

      <View style={tw`h-1/2`}>
        <Map />
      </View>
      <View style={tw`h-1/2`}>
        <NavigateCard />
        {/* {dist?<RideOptionsCard />:<NavigateCard />} */}
        
      </View>
    </View>
  )
}

export default MapScreen
