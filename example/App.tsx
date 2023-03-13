import { Button, Text, View } from "react-native";

import { getAppIcon, setAppIcon } from "expo-dynamic-app-icon";
import { useState } from "react";

export default function App() {
  const [iconName, setIconName] = useState<string>();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ marginBottom: 16 }}>
        <Button title="get icon!" onPress={() => setIconName(getAppIcon())} />
        <Text>{iconName || "Press Button!"}</Text>
      </View>

      <View style={{ marginBottom: 16 }}>
        <Button
          title="change red icon"
          onPress={() => console.log(setAppIcon("red"))}
        />
      </View>

      <Button
        title="change gray icon"
        onPress={() => console.log(setAppIcon("gray"))}
      />
    </View>
  );
}
