import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as ExpoDynamicAppIcon from "expo-dynamic-app-icon";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoDynamicAppIcon.getIconName()}</Text>
      <TouchableOpacity
        onPress={() => {
          console.log(ExpoDynamicAppIcon.setAppIcon("1"));
        }}
      >
        <Text>1로 변경</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log(ExpoDynamicAppIcon.setAppIcon("2"));
        }}
      >
        <Text>2로 변경</Text>
      </TouchableOpacity>
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
