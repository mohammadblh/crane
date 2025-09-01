import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOrigin } from "../slices/navSlice";
import NavFavourites from "../components/NavFavourites";

const HomeScreen = () => {
  const [results, setResults]: any = useState([]);
  const [cancelToken, setCancelToken]: any = useState(null);
  const dispatch = useDispatch();

  const searchLocation = async (query: any) => {
    try {
      // کنسل کردن درخواست قبلی (اگر وجود دارد)
      if (cancelToken) {
        cancelToken.cancel("درخواست جدید ارسال شد.");
      }

      // ایجاد یک Cancel Token جدید
      const source = axios.CancelToken.source();
      setCancelToken(source);

      // const response = await axios.post("http://blhgroups.ir/api/places",
      //   {
      //     params: {
      //       q: query,
      //       format: 'json',
      //       limit: 5,
      //       viewbox: '44.109225,39.781758,63.316654,25.064083', // محدوده ایران
      //       bounded: 1, // فقط نتایج داخل محدوده
      //     },
      //     headers: {
      //       'accept-language': 'fa', // فارسی (فارسی)
      //     },
      //   }, {cancelToken: source.token,}
      // );
      // console.log("response", response.data)
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: query,
            format: "json",
            limit: 5,
            viewbox: "44.109225,39.781758,63.316654,25.064083", // محدوده ایران
            bounded: 1, // فقط نتایج داخل محدوده
          },
          headers: {
            "accept-language": "fa", // فارسی (فارسی)
            "User-Agent": "uber/1.0 (mohammadblhfacker@email.com)",
          },
          cancelToken: source.token,
        }
      );
      // if(response.data && response.data.length > 0){
      //   console.log('parsed>>>>>>>>>>>', JSON.parse(response.data))
      //   setResults(JSON.parse(response.data));
      // }
      setResults(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("درخواست کنسل شد:", error.message);
      } else {
        console.error("خطا در دریافت داده‌ها:", error);
      }
    }
  };

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <Image
          style={{ width: 100, height: 100, resizeMode: "contain" }}
          source={require("../../assets/images/Uber_logo.png")}
        />

        <TextInput
          placeholder="جستجوی مکان..."
          style={tw`border border-gray-300 rounded px-4`}
          onChangeText={async (text) => {
            if (!text) dispatch(setOrigin(null));
            else if (text.length >= 2) await searchLocation(text);
          }}
        />
        {/* نمایش نتایج */}
        {results.map((result: any, index: number) => (
          <View style={tw`bg-gray-300 p-5 my-2 mx-4 rounded-lg`}>
            <Text
              key={result.place_id}
              onPress={() => {
                dispatch(
                  setOrigin({
                    location: { lat: result.lat, lon: result.lon },
                    description: result.display_name,
                  })
                );
              }}
              style={tw`text-right text-xl`}
            >
              {result.display_name}
            </Text>
          </View>
        ))}

        <NavOptions />
        <NavFavourites />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
