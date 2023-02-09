import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setSelectedWarehouseStorageLocation } from "@store";

import { ListItemHeading } from "./Styled";
import { LocationWithEvents } from "@/types";

export const WarehouseStorageListItem = ({
  index,
  item: location,
}: {
  index: number;
  item: string;
}) => {
  const dispatch = useAppDispatch();

  const { warehouseStorageLocations } = useAppSelector(
    ({ warehouse }) => warehouse
  );

  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [targetLocationData, setTargetLocationData] = useState<
    LocationWithEvents[]
  >([]);

  useEffect(() => {
    if (!!warehouseStorageLocations) {
      const targetLocationData = warehouseStorageLocations.filter(
        (loc) => loc.locationName === location
      );

      setTargetLocationData(() => targetLocationData);
    }
  }, [warehouseStorageLocations]);

  return (
    <Pressable
      onPressIn={() => setIsPressed(() => true)}
      onPressOut={() => setIsPressed(() => false)}
      onPress={() => {
        dispatch(setSelectedWarehouseStorageLocation(location));
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 5,
          borderWidth: 2,
          borderColor: !targetLocationData.length ? "green" : "white",
          elevation: isPressed ? 0 : 2,
          marginTop: index === 0 ? 3 : 0,
          marginBottom: 8,
          marginHorizontal: 8,
          padding: 8,
        }}
      >
        <ListItemHeading>{location}</ListItemHeading>
        {targetLocationData.map((locationData) => (
          <View key={locationData.id}>
            <Text>{locationData.description}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
};
