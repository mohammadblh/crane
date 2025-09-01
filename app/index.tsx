import Login from "./screens/Login";

import Otp from "./screens/Otp";

import { useFonts } from "expo-font";
import Font from "./screens/Font";
import Main from "./screens/Main";
import HomeScreen from "./screens/HomeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
  const [loaded, error] = useFonts({
    Vazir: require("../assets/fonts/Vazir.ttf"),
  });
  return (
    <SafeAreaProvider>
      {/* <Otp /> */}
      {/* <Font /> */}
      <Main />
      {/* <Login /> */}
      {/* <HomeScreen /> */}
    </SafeAreaProvider>
  );
}
