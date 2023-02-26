import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { Picker } from "@react-native-picker/picker";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

export const SettingsScreen = () => {
  const [selectedTempUnit, setSelectedTempUnit] = useState("celsius");

  const pickerRef = useRef<Picker<string> | null>(null);

  return (
    <ScreenWrapper isPadded>
      <Text style={{ fontWeight: "700", fontSize: 16 * 2 }}>Settings</Text>
      <Text style={{ fontWeight: "600", fontSize: 16 * 1.5 }}>General</Text>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 5,
          elevation: 2,
          padding: 8,
        }}
      >
        <Text style={{ fontWeight: "500", fontSize: 16 * 1.25 }}>Units</Text>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>Temperature</Text>
          <Pressable
            onPress={() => {
              pickerRef.current?.focus();
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 5,
                padding: 8,
              }}
            >
              <Text style={{ fontWeight: "500" }}>{selectedTempUnit}</Text>
            </View>
          </Pressable>
        </View>
        <Picker
          onValueChange={(selectedItem) => {
            setSelectedTempUnit(() => selectedItem);
          }}
          prompt="Temperature Units"
          ref={pickerRef}
          selectedValue={selectedTempUnit}
          style={{ display: "none" }}
        >
          <Picker.Item label="Celsius" value="C" />
          <Picker.Item label="Fahrenheit" value="F" />
          <Picker.Item label="Kelvin" value="K" />
        </Picker>
      </View>
    </ScreenWrapper>
  );
};
