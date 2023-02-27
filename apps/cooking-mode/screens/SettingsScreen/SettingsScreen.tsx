import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { Picker } from "@react-native-picker/picker";
import { useRef } from "react";
import { Pressable, Text, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setAppSettings } from "@store";
import { TempUnits } from "@types";
import { setLocalStorageSettings } from "@utils";

export const SettingsScreen = () => {
  const dispatch = useAppDispatch();

  const {
    appSettings: { tempUnit },
  } = useAppSelector(({ app }) => app);

  const pickerRef = useRef<Picker<TempUnits> | null>(null);

  const handleChangeTempUnit = async (newTempUnit: TempUnits) => {
    dispatch(setAppSettings({ tempUnit: newTempUnit }));

    try {
      const res = await setLocalStorageSettings({ tempUnit: newTempUnit });

      if (!res) throw new Error();
    } catch (err) {
      console.log(err);
    }
  };

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
              <Text style={{ fontWeight: "500" }}>{tempUnit}</Text>
            </View>
          </Pressable>
        </View>
        <Picker
          onValueChange={(selectedItem: TempUnits) => {
            handleChangeTempUnit(selectedItem);
          }}
          prompt="Temperature Units"
          ref={pickerRef}
          selectedValue={tempUnit}
          style={{ display: "none" }}
        >
          <Picker.Item label="Celsius" value="celsius" />
          <Picker.Item label="Fahrenheit" value="fahrenheit" />
          <Picker.Item label="Kelvin" value="kelvin" />
        </Picker>
      </View>
    </ScreenWrapper>
  );
};
