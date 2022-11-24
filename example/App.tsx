import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as ExpoDynamicAppIcon from "expo-dynamic-app-icon";

export default function App() {
  // ExpoDynamicAppIcon.setAppIconWithoutAlert;

  return (
    <View style={styles.container}>
      <Text>{ExpoDynamicAppIcon.getIconName()}</Text>

      <View>
        <TouchableOpacity
          onPress={() => console.log(ExpoDynamicAppIcon.getIconName())}
        >
          <Text>다시 가져오기</Text>
        </TouchableOpacity>
      </View>

      <Text>알림없이 변경</Text>
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
            console.log(ExpoDynamicAppIcon.setAppIconWithoutAlert("red"));
          }}
        >
          <Text>red로 변경</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log(ExpoDynamicAppIcon.setAppIconWithoutAlert("gray"));
          }}
        >
          <Text>gray로 변경</Text>
        </TouchableOpacity>
      </View>

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
