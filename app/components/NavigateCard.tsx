import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'tailwind-react-native-classnames'
import axios from 'axios'
import { selectTravelTimeInformation, setDestination, setTravelTimeInformation } from '../slices/navSlice'
import { useDispatch, useSelector} from 'react-redux'
import { router } from 'expo-router'
import NavFavourites from './NavFavourites'
import { Icon } from 'react-native-elements'
import Toast from 'react-native-toast-message'


const NavigateCard = () => {
    const [results, setResults]:any = useState([]);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const [cancelToken, setCancelToken]:any = useState(null);
  const dispatch = useDispatch();
  
  const searchLocation = async (query:any) => {
    try {
      // کنسل کردن درخواست قبلی (اگر وجود دارد)
      if (cancelToken) {
        cancelToken.cancel('درخواست جدید ارسال شد.');
      }

      // ایجاد یک Cancel Token جدید
      const source = axios.CancelToken.source();
      setCancelToken(source);
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: query,
            format: 'json',
            limit: 5,
            viewbox: '44.109225,39.781758,63.316654,25.064083', // محدوده ایران
            bounded: 1, // فقط نتایج داخل محدوده
          },
          headers: {
            'accept-language': 'fa', // فارسی (فارسی)
            'User-Agent': 'uber/1.0 (mohammadblhfacker@email.com)',
          },
          cancelToken: source.token,
        }
      );
      setResults(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('درخواست کنسل شد:', error.message);
      } else {
        console.error('خطا در دریافت داده‌ها:', error);
      }
    }
  };
  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
        <Text style={tw`text-center py-5 text-xl`}>Good Morning, Sonny</Text>
        <View style={tw`border-t border-gray-200 flex-shrink`}>
            <View>
                <TextInput
                    placeholder="جستجوی مقصد..."
                    style={tw`border border-gray-300 bg-gray-300 rounded mx-4`}                    
                    onChangeText={async (text) => {
                        if(!text) dispatch(setDestination(null)) && dispatch(setTravelTimeInformation(null))
                        else if(text.length >= 2)
                        await searchLocation(text);
                    }}
                />
                {/* نمایش نتایج */}
                {results.map((result:any, index:number) => (
                  <View style={tw`bg-gray-300 p-5 my-2 mx-4 rounded-lg`}>  
                      <Text key={result.place_id} 
                          onPress={() => {
                          dispatch(setDestination({
                              location:{lat: result.lat, lon: result.lon},
                              description: result.display_name 
                          }))
                          router.push('/components/RideOptionsCard');
                        }} 
                      style={tw`text-right text-xl`}>{result.display_name}</Text>  
                  </View> 
                ))}
            </View>

        <NavFavourites />
        </View>
        <View style={tw`flex-row bg-white justify-evenly py-2 mt-auto border-t border-gray-100`}>
          <TouchableOpacity
            onPress={() => {
              if(travelTimeInformation)
                router.push('/components/RideOptionsCard')
              else 
              Toast.show({
                type: 'info',
                text1: 'به کجا چنین شتابان؟',
                text2: 'ابتدا مقصد را تعیین کنید',
              });
              // Notifications.scheduleNotificationAsync({
              //   content: {
              //     title: 'Look at that notification',
              //     body: "I'm so proud of myself!",
              //   },
              //   trigger: null,
              // });
            }}
           style={tw`flex flex-row justify-between bg-black w-24 px-4 py-3 rounded-full`}>
            <Icon name="car" type='font-awesome' color="white" size={16}/>
            <Text style={tw`text-white text-center`}>Rides</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex flex-row justify-between w-24 px-4 py-3 rounded-full`}>
            <Icon name="fast-food-outline" type='ionicon' color="black" size={16}/>
            <Text style={tw`text-center`}>Eats</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default NavigateCard
