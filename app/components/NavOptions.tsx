import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import tw from 'tailwind-react-native-classnames';
import { Icon } from 'react-native-elements';
import { Link } from 'expo-router';
import { useSelector } from 'react-redux';
import { selectOrigin } from '../slices/navSlice';

const data = [
    {
        id: '123',
        title: 'get a ride',
        image: require('../../assets/images/UberX.png'),
        screen: 'MapScreen',
    },
    {
        id: '456',
        title: 'order food',
        image: require('../../assets/images/Uber_food.png'),
        screen: 'EatsScreen',
    },
]

export default function NavOptions() {
  const origin = useSelector(selectOrigin);

  return (
    <FlatList 
        data={data}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
            <TouchableOpacity 
                style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 m-2 w-40`}
                disabled={!origin}
            >
                {/* @ts-ignore */}
                <Link href={`/screens/${item.screen}`}>
                {/* @ts-ignore */}
                <View style={tw`${!origin && "opacity-20"}`}>
                    <Image 
                        style={{width: 120, height: 120, resizeMode: 'contain'}}
                        source={item.image}
                    />
                    <Text style={tw`ml-2 text-lg font-semibold`}>{item.title}</Text>
                    <Icon
                        style={tw`p-2 bg-black rounded-full w-10 mt-4`}
                        name="arrowright"
                        color="white"
                        type="antdesign"
                    />
                </View>
            </Link>
            </TouchableOpacity>
        )}
    />
  )
}