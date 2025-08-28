import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "./store";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";


// تم سفارشی برای RTL
const toastConfig = {
  info: ({ text1, text2 }:any) => (
    <View >
      <Text style={{textAlign: 'right'}}>{text1}</Text>
      {text2 && <Text >{text2}</Text>}
    </View>
  ),
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding": "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios'? -64: 0}
      >
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
          <Stack.Screen name="screens/MapScreen" options={{ title: 'Map', headerShown: false, presentation: 'fullScreenModal', animation: 'ios_from_right',}} />
          <Stack.Screen
            name="components/NavigateCard"
            options={{
              title: 'navigate',
              presentation: 'modal',
              headerShown: false,
              animation: 'ios_from_right',
            }}
          />
          <Stack.Screen
            name="components/RideOptionsCard"
            options={{
              title: 'rideOptions',
              presentation: 'transparentModal',
              headerShown: false,
              animation: 'ios_from_right',
            }}
          />
        </Stack>
      </KeyboardAvoidingView>
      <Toast 
        // config={toastConfig}
      />
    </Provider>
  );
  // return <Stack />;
}


// استایل‌ها
// const styles = StyleSheet.create({
//   toastContainer: {
//     padding: 15,
//     borderRadius: 10,
//     width: '80%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   rtlToast: {
//     direction: 'rtl', // تنظیم جهت متن به راست‌به‌چپ
//     textAlign: 'right', // متن راست‌چین
//   },
//   text1: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'right', // متن راست‌چین
//   },
//   text2: {
//     fontSize: 14,
//     color: 'white',
//     textAlign: 'right', // متن راست‌چین
//   },
// });
