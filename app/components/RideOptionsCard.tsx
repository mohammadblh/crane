import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import tw from 'tailwind-react-native-classnames';
import { Icon } from 'react-native-elements';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { selectTravelTimeInformation } from '../slices/navSlice';

const data = [
  {
    id: "Uber-X-123", title: "UberX", multiplier:1, image: require('../../assets/images/UberX.png')
  },{
    id: "Uber-X-456", title: "UberXL", multiplier:1.2, image: require('../../assets/images/UberXL.png')
  },{
    id: "Uber-X-789", title: "UberLUX", multiplier:1.75, image: require('../../assets/images/Lux.png')
  },
];

const SURGE_CHARGE_RATE = 1.5;

const timeFormatDuration = (minutes:number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  let result = '';
  if (hours > 0) {
    result += `${hours}hours `;
  }
  if (remainingMinutes > 0) {
    result += `${remainingMinutes}min`;
  }
  return result.trim();
};

const RideOptionsCard = () => {
  const isPresented = router.canGoBack();
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const [selected, setSelected]:any = useState(null)

  return (
    <SafeAreaView style={[tw`bg-white flex-grow`, styles.container]}>
      <View style={{position: 'relative'}}>
        <TouchableOpacity 
          onPress={() => isPresented && router.back()}
         style={[tw`top-3 left-5 p-3 rounded-full absolute`, { zIndex: 1 }]}
         >
          <Icon name="chevron-left" type='fontawesome' />
        </TouchableOpacity>
        <Text style={tw`text-center py-5 text-xl`}>Select a Ride - {travelTimeInformation?.distance.km} KM</Text>
      </View>

      <FlatList data={data} 
        keyExtractor={(item) => item.id}
        renderItem={({item: {id, title, multiplier, image}, item}:any) => (
          <TouchableOpacity 
            onPress={() => setSelected(item)}
            // @ts-ignore
            style={tw`flex-row justify-between items-center px-10 ${id === selected?.id && "bg-gray-200"}`}>
            <Image
              style={{width: 100, height:100, resizeMode:'contain'}}
              source={image}
            />
            <View style={tw`-ml-6`}>
              <Text style={tw`text-xl font-semibold`}>{title}</Text>
              <Text>{timeFormatDuration(travelTimeInformation?.duration.m)} Travel Time</Text>
            </View>
            <Text style={tw`text-xl`}>
              {/* {new Intl.NumberFormat('en-gb', {
                style: 'currency',
                currency: 'GBP'
              }).format(
                (travelTimeInformation?.duration.s * SURGE_CHARGE_RATE * multiplier) / 100
              )} */}
              {new Intl.NumberFormat('fa-ir', {
                style: 'currency',
                currency: 'IRR', 
                minimumFractionDigits: 0,
              }).format(
                (travelTimeInformation?.duration.s * SURGE_CHARGE_RATE * multiplier) * 500
              )}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={tw`mt-auto border-t border-gray-200`}>
        {/* @ts-ignore */}
        <TouchableOpacity disabled={!selected} style={tw`bg-black py-3 m-3 ${!selected && "bg-gray-300"}`}>
          <Text style={tw`text-center text-white text-xl`}>Choose {selected?.title}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default RideOptionsCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
        backgroundColor: '#fff',
        height: '50%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
})    
