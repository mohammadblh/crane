import HomeScreen from "./screens/HomeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
  
  return (
      <SafeAreaProvider>
        <HomeScreen />
      </SafeAreaProvider>
  );
}
