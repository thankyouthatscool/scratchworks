import { WarehouseStorageLocation } from "@scratchworks/inertiion-services";
import type { Event } from "@scratchworks/inertiion-services";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  BackHandler,
  Button,
  NativeEventSubscription,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAppDispatch, useAppSelector } from "@hooks";
import {
  setSelectedWarehouseStorageLocation,
  setWarehouseStorageLocations,
} from "@store";
import { savePallet, trpc } from "@utils";

export const WarehouseStorageLocationComponent = () => {
  const dispatch = useAppDispatch();

  const { selectedWarehouseStorageLocation, warehouseStorageLocations } =
    useAppSelector(({ warehouse }) => warehouse);

  const { mutateAsync: addLocationEvent } =
    trpc.warehouseStorageRouter.addLocationEvent.useMutation();

  const [formData, setFormData] = useState<WarehouseStorageLocation[]>([]);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [isLocationEdit, setIsLocationEdit] = useState<boolean>(false);
  const [locationHistory, setLocationHistory] = useState<
    { type: "locationUpdate"; description: string }[]
  >([]);

  const [itemToEdit, setItemToEdit] = useState<{
    Description?: string;
    Cartons?: string;
    Pieces?: string;
    Initials?: string;
    Index?: number;
  }>({});

  useEffect(() => {
    if (selectedWarehouseStorageLocation) {
      setFormData(
        () => warehouseStorageLocations[selectedWarehouseStorageLocation]
      );
    }
  }, [selectedWarehouseStorageLocation]);

  useEffect(() => {
    let backHandler: NativeEventSubscription;

    if (isLocationEdit) {
      backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        setIsLocationEdit(() => false);

        return true;
      });
    } else {
      backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        dispatch(setSelectedWarehouseStorageLocation(null));

        return true;
      });
    }

    return () => backHandler.remove();
  }, [isLocationEdit]);

  return !isLocationEdit ? (
    <View
      style={{
        marginHorizontal: 8,
        padding: 8,
      }}
    >
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16 * 1.5, fontWeight: "500" }}>
          {selectedWarehouseStorageLocation}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginRight: 8 }}>
            <Button
              onPress={() => {
                dispatch(setSelectedWarehouseStorageLocation(null));
              }}
              title="Back"
            />
          </View>
          <View style={{ marginRight: 8 }}>
            <Button
              color="orange"
              onPress={() => {
                setIsLocationEdit(() => true);
              }}
              title="Edit Location"
            />
          </View>
          <Button
            color="#16A34A"
            onPress={async () => {
              if (!!locationHistory.length) {
                await Promise.all(
                  locationHistory.map((item) => {
                    const { description, type } = item;

                    return addLocationEvent({
                      description,
                      target: selectedWarehouseStorageLocation!,
                      type,
                    });
                  })
                );
              }

              const res = await savePallet(
                selectedWarehouseStorageLocation!,
                formData.map((item) => ({
                  ...item,
                  Date: new Date().toISOString(),
                }))
              );

              dispatch(setWarehouseStorageLocations(res));

              dispatch(setSelectedWarehouseStorageLocation(null));
            }}
            title="save"
          />
        </View>
      </View>
      <View>
        <Text>Height: Medium</Text>
      </View>
      {!!formData[0]?.Description &&
        formData.map((loc, index) => {
          return (
            <PalletItemCard
              index={index}
              key={loc.Description}
              loc={loc}
              onDelete={setLocationHistory}
              setFormData={setFormData}
              setFormMode={setFormMode}
              setItemToEdit={setItemToEdit}
            />
          );
        })}
      <View style={{ marginTop: 8 }}>
        <TextInput
          defaultValue={itemToEdit.Description}
          onChangeText={(e) =>
            setItemToEdit((item) => ({ ...item, Description: e }))
          }
          placeholder="Description"
          style={{ backgroundColor: "white", padding: 8 }}
        />
      </View>
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TextInput
          defaultValue={itemToEdit.Cartons}
          keyboardType="numeric"
          onChangeText={(e) =>
            setItemToEdit((item) => ({ ...item, Cartons: e }))
          }
          placeholder="Cartons"
          style={{
            backgroundColor: "white",
            flex: 1,
            marginRight: 8,
            padding: 8,
          }}
        />
        <TextInput
          defaultValue={itemToEdit.Pieces}
          keyboardType="numeric"
          onChangeText={(e) =>
            setItemToEdit((item) => ({ ...item, Pieces: e }))
          }
          placeholder="Pieces"
          style={{
            backgroundColor: "white",
            flex: 1,
            marginRight: 8,
            padding: 8,
          }}
        />
        <TextInput
          autoCapitalize="characters"
          defaultValue={itemToEdit.Initials}
          onChangeText={(e) =>
            setItemToEdit((item) => ({ ...item, Initials: e }))
          }
          placeholder="Initials"
          style={{
            backgroundColor: "white",
            flex: 1,
            padding: 8,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 8,
        }}
      >
        <View style={{ marginRight: 8 }}>
          <Button
            disabled={!Object.keys(itemToEdit).length}
            onPress={() => {
              setItemToEdit(() => ({}));

              setFormMode(() => "add");
            }}
            title="Cancel"
          />
        </View>
        <Button
          color="orange"
          disabled={!itemToEdit.Description || !itemToEdit.Initials}
          onPress={async () => {
            setLocationHistory((locationHistory) => [
              ...locationHistory,
              {
                description: `${
                  itemToEdit.Initials
                } ${formMode} ${selectedWarehouseStorageLocation} ${JSON.stringify(
                  itemToEdit
                )}`,
                type: "locationUpdate",
              },
            ]);

            if (formMode === "edit") {
              setFormData(() => {
                return [
                  ...formData.slice(0, itemToEdit.Index),
                  {
                    ...itemToEdit,
                    Location: selectedWarehouseStorageLocation!,
                    Cartons: parseInt(itemToEdit.Cartons! || "0"),
                    Pieces: parseInt(itemToEdit.Pieces! || "0"),
                    Initials: itemToEdit.Initials?.toUpperCase(),
                  },
                  ...formData.slice(itemToEdit.Index! + 1),
                ];
              });

              setItemToEdit(() => ({}));

              setFormMode(() => "add");
            } else {
              if (!formData[0]?.Description) {
                setFormData(() => [
                  {
                    ...itemToEdit,
                    Location: selectedWarehouseStorageLocation!,
                    Cartons: parseInt(itemToEdit.Cartons! || "0"),
                    Pieces: parseInt(itemToEdit.Pieces! || "0"),
                    Initials: itemToEdit.Initials?.toUpperCase(),
                  },
                ]);
              } else {
                setFormData((formData) => [
                  ...formData,
                  {
                    ...itemToEdit,
                    Location: selectedWarehouseStorageLocation!,
                    Cartons: parseInt(itemToEdit.Cartons! || "0"),
                    Pieces: parseInt(itemToEdit.Pieces! || "0"),
                    Initials: itemToEdit.Initials?.toUpperCase(),
                  },
                ]);

                setItemToEdit(() => ({}));

                setFormMode(() => "add");
              }
            }
          }}
          title={formMode === "edit" ? "Update" : "Add"}
        />
      </View>
    </View>
  ) : (
    <LocationEditComponent />
  );
};

interface PalletItemCardProps {
  index: number;
  loc: WarehouseStorageLocation;
  onDelete: React.Dispatch<
    React.SetStateAction<
      {
        type: "locationUpdate";
        description: string;
      }[]
    >
  >;
  setFormMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setItemToEdit: React.Dispatch<
    React.SetStateAction<{
      Description?: string | undefined;
      Cartons?: string | undefined;
      Pieces?: string | undefined;
      Initials?: string | undefined;
      Index?: number | undefined;
    }>
  >;
  setFormData: React.Dispatch<React.SetStateAction<WarehouseStorageLocation[]>>;
}

export const PalletItemCard = ({
  index,
  loc,
  onDelete,
  setFormData,
  setFormMode,
  setItemToEdit,
}: PalletItemCardProps) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <Pressable
      onPressIn={() => {
        setIsPressed(() => true);
      }}
      onPressOut={() => {
        setIsPressed(() => false);
      }}
      onPress={() => {
        setFormMode(() => "edit");

        setItemToEdit(() => ({
          Description: loc.Description,
          Cartons: loc.Cartons?.toString(),
          Pieces: loc.Pieces?.toString(),
          Initials: loc.Initials,
          Index: index,
        }));
      }}
      onLongPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        onDelete((locationHistory) => [
          ...locationHistory,
          {
            description: `deleted ${JSON.stringify(loc)}`,
            type: "locationUpdate",
          },
        ]);

        setFormData((formData) => [
          ...formData.slice(0, index),
          ...formData.slice(index + 1),
        ]);
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 5,
          elevation: isPressed ? 0 : 2,
          marginTop: 8,
          padding: 8,
        }}
      >
        <Text>{loc.Description}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text>{loc.Cartons}</Text>
          <Text>{loc.Pieces}</Text>
          <Text>{loc.Initials}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const LocationEditComponent = () => {
  const { selectedWarehouseStorageLocation } = useAppSelector(
    ({ warehouse }) => warehouse
  );

  const [locationEventHistory, setLocationEventHistory] = useState<Event[]>([]);

  const { mutateAsync: getLocationEventHistory } =
    trpc.warehouseStorageRouter.getLocationEventHistory.useMutation();

  const handleGetLocationEventHistory = async () => {
    const res = await getLocationEventHistory(
      selectedWarehouseStorageLocation!
    );

    setLocationEventHistory(() => res.events);
  };

  useEffect(() => {
    handleGetLocationEventHistory();
  }, []);

  return (
    <View style={{ padding: 8 }}>
      <Text>Edit {selectedWarehouseStorageLocation}</Text>
      <TextInput keyboardType="numeric" placeholder="Height" />
      <Text style={{ fontSize: 16 * 1.25, fontWeight: "500" }}>
        Location History
      </Text>
      {locationEventHistory.map((loc) => {
        return (
          <View key={loc.id}>
            <Text>{loc.description}</Text>
            <View style={{ borderTopWidth: 1 }} />
          </View>
        );
      })}
    </View>
  );
};
