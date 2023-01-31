import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as ExpoDynamicAppIcon from "expo-dynamic-app-icon";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>변경</Text>
      <View
        style={{
          marginBottom: 16,
          marginTop: 8,
          flexDirection: "row",
          width: "80%",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            console.log(ExpoDynamicAppIcon.setAppIcon("red"));
          }}
        >
          <Text>red로 변경</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log(ExpoDynamicAppIcon.setAppIcon("gray"));
          }}
        >
          <Text>gray로 변경</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
