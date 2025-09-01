import React from "react";
import { View, Text, StyleSheet } from "react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.vazirRegular}>متن با فونت وزیر معمولی</Text>
      <Text style={styles.vazirBold}>متن با فونت وزیر بولد</Text>
      <Text style={styles.vazirMedium}>متن با فونت وزیر مدیوم</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  vazirRegular: {
    fontFamily: "Vazir-Regular",
    fontSize: 18,
    marginVertical: 5,
  },
  vazirBold: {
    fontFamily: "Vazir",
    fontSize: 18,
    marginVertical: 5,
  },
  vazirMedium: {
    fontFamily: "Vazir-Medium",
    fontSize: 18,
    marginVertical: 5,
  },
});

export default App;
