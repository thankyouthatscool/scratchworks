import { WarehouseStorageLocation } from "@scratchworks/inertiion-services";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  BackHandler,
  Button,
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
import { removePallet, savePallet } from "@utils";

export const WarehouseStorageLocationComponent = () => {
  const dispatch = useAppDispatch();

  const { selectedWarehouseStorageLocation, warehouseStorageLocations } =
    useAppSelector(({ warehouse }) => warehouse);

  const [formData, setFormData] = useState<WarehouseStorageLocation[]>([]);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

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
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        dispatch(setSelectedWarehouseStorageLocation(null));

        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
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
          <Button
            onPress={async () => {
              const currentDate = new Date();

              const dateString = `${currentDate.getHours()}:${currentDate
                .getMinutes()
                .toString()
                .padStart(
                  2,
                  "0"
                )} ${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`;

              const res = await savePallet(
                selectedWarehouseStorageLocation!,
                formData.map((item) => ({ ...item, Date: dateString }))
              );

              dispatch(setWarehouseStorageLocations(res));

              dispatch(setSelectedWarehouseStorageLocation(null));
            }}
            title="save"
          />
        </View>
      </View>
      {!!formData[0]?.Description &&
        formData.map((loc, index) => {
          return (
            <PalletItemCard
              index={index}
              key={loc.Description}
              loc={loc}
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
            onPress={() => {
              setItemToEdit(() => ({}));
            }}
            title="Cancel"
          />
        </View>
        <Button
          onPress={() => {
            if (formMode === "edit") {
              setFormData(() => {
                return [
                  ...formData.slice(0, itemToEdit.Index),
                  {
                    ...itemToEdit,
                    Location: selectedWarehouseStorageLocation!,
                    Cartons: parseInt(itemToEdit.Cartons!),
                    Pieces: parseInt(itemToEdit.Pieces!),
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
                    Cartons: parseInt(itemToEdit.Cartons!),
                    Pieces: parseInt(itemToEdit.Pieces!),
                  },
                ]);
              } else {
                setFormData((formData) => [
                  ...formData,
                  {
                    ...itemToEdit,
                    Location: selectedWarehouseStorageLocation!,
                    Cartons: parseInt(itemToEdit.Cartons!),
                    Pieces: parseInt(itemToEdit.Pieces!),
                  },
                ]);

                setItemToEdit(() => ({}));

                setFormMode(() => "add");
              }
            }
          }}
          title={formMode === "edit" ? "Save" : "Add"}
        />
      </View>
    </View>
  );
};

interface PalletItemCardProps {
  index: number;
  loc: WarehouseStorageLocation;
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
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
          padding: 8,
        }}
      >
        <Text>{loc.Description}</Text>
        <Text>{loc.Cartons}</Text>
        <Text>{loc.Pieces}</Text>
        <Text>{loc.Initials}</Text>
      </View>
    </Pressable>
  );
};
