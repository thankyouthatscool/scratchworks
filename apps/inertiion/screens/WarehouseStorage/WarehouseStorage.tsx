import type { WarehouseStorageLocation } from "@scratchworks/inertiion-services";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { WarehouseStorageLocationComponent } from "@components/WarehouseStorageLocationComponent";
import { useAppDispatch, useAppSelector } from "@hooks";
import {
  setSearchTerm,
  setSelectedWarehouseStorageLocation,
  setWarehouseStorageLocations,
} from "@store";
import {
  getLSWarehouseStorageLocations,
  removePallet,
  savePallet,
  setLSWarehouseStorageLocations,
  trpc,
} from "@utils";

export const WarehouseStorage = () => {
  const dispatch = useAppDispatch();

  const [isShowEmptyOnly, setIsShowEmptyOnly] = useState(false);

  const { searchTerm } = useAppSelector(({ app }) => app);

  const { selectedWarehouseStorageLocation, warehouseStorageLocations } =
    useAppSelector(({ warehouse }) => warehouse);

  const { mutateAsync: getAllLocations } =
    trpc.warehouseStorageRouter.getAllLocations.useMutation();

  const handleInitialLoad = async () => {
    const res = await getLSWarehouseStorageLocations();

    if (!res) {
      const res: { [key: string]: WarehouseStorageLocation[] } =
        await getAllLocations();

      await setLSWarehouseStorageLocations(res);

      dispatch(setWarehouseStorageLocations(res));
    } else {
      dispatch(setWarehouseStorageLocations(res));
    }
  };

  const flatListRef = useRef<FlatList<string>>(null);

  useEffect(() => {
    handleInitialLoad();
  }, []);

  return (
    <View style={{ height: "100%" }}>
      {!!selectedWarehouseStorageLocation ? (
        <WarehouseStorageLocationComponent />
      ) : (
        <View style={{ height: "100%" }}>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              marginRight: 8,
            }}
          >
            <TextInput
              onChangeText={(e) => dispatch(setSearchTerm(e))}
              placeholder="Search"
              style={{ flex: 1, padding: 8 }}
              value={searchTerm}
            />
            <View style={{ marginRight: 8 }}>
              <Button
                color={isShowEmptyOnly ? "orange" : ""}
                onPress={() => {
                  setIsShowEmptyOnly((isShowEmptyOnly) => !isShowEmptyOnly);
                }}
                title={isShowEmptyOnly ? "All" : "Available"}
              />
            </View>
            <Button
              disabled={!searchTerm}
              onPress={() => {
                dispatch(setSearchTerm(""));
              }}
              title="clear"
            />
          </View>
          <FlatList
            data={Object.keys(warehouseStorageLocations)
              .sort((a, b) => a.localeCompare(b))
              .filter((location) => {
                if (isShowEmptyOnly) {
                  return (
                    !warehouseStorageLocations[location].length ||
                    warehouseStorageLocations[location].every(
                      (item) => !item.Description
                    )
                  );
                }

                if (searchTerm === "") {
                  return true;
                }

                return warehouseStorageLocations[location]
                  .map((location) => location.Description)
                  .some((description) =>
                    description
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
              })}
            keyExtractor={(location) => location}
            ref={flatListRef}
            renderItem={({ item: location }) => (
              <LocationCard location={location} />
            )}
          />
        </View>
      )}
    </View>
  );
};

export const LocationCard = ({ location }: { location: string }) => {
  const dispatch = useAppDispatch();

  const { warehouseStorageLocations } = useAppSelector(
    ({ warehouse }) => warehouse
  );

  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <Pressable
      onPressIn={() => {
        setIsPressed(() => true);
      }}
      onPressOut={() => {
        setIsPressed(() => false);
      }}
      onPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        dispatch(setSelectedWarehouseStorageLocation(location));
      }}
      onLongPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        setIsPressed(() => false);

        setIsModalVisible(() => true);
      }}
      style={{
        backgroundColor: "white",
        borderWidth: 2,
        borderColor:
          warehouseStorageLocations[location].length &&
          warehouseStorageLocations[location].every(
            (item) => !!item.Description
          )
            ? "white"
            : "green",
        borderRadius: 10,
        elevation: isPressed ? 0 : 2,
        margin: 8,
        padding: 8,
      }}
    >
      <Modal
        animationType="slide"
        hardwareAccelerated
        transparent
        visible={isModalVisible}
      >
        <Pressable
          onPress={() => {
            setIsModalVisible(() => false);
          }}
          style={{
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Pressable
            style={{
              backgroundColor: "white",
              borderColor: "red",
              borderRadius: 15,
              borderWidth: 2,
              padding: 8,
            }}
          >
            <Text
              style={{
                color: "red",
                fontSize: 16 * 1.5,
                fontWeight: "500",
                marginBottom: 8,
              }}
            >
              Are you sure you want to remove the pallet?
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <View style={{ marginRight: 8 }}>
                <Button
                  onPress={() => {
                    setIsModalVisible(() => false);
                  }}
                  title="Cancel"
                />
              </View>
              <Button
                color="red"
                onPress={async () => {
                  const res = await removePallet(location);

                  dispatch(setWarehouseStorageLocations(res));

                  await setLSWarehouseStorageLocations(res);

                  setIsModalVisible(() => false);
                }}
                title="Remove"
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      <Text style={{ fontSize: 16 * 1.25, fontWeight: "500" }}>{location}</Text>
      {warehouseStorageLocations[location].map((innerLocation, index) => {
        if (!!innerLocation.Description) {
          return (
            <View
              key={`${location} - ${innerLocation.Description}`}
              style={{
                justifyContent: "space-between",
                marginTop: index === 0 ? 0 : 8,
              }}
            >
              <Text>{innerLocation.Description}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>
                  {innerLocation.Cartons === 0 ? "" : innerLocation.Cartons}
                </Text>
                <Text>
                  {innerLocation.Pieces === 0 ? "" : innerLocation.Pieces}
                </Text>
                <Text>{innerLocation.Date}</Text>
                <Text>{innerLocation.Initials?.toUpperCase()}</Text>
              </View>
              {/* <View style={{ borderTopWidth: 1, marginVertical: 8 }} /> */}
            </View>
          );
        }

        return null;
      })}
    </Pressable>
  );
};
