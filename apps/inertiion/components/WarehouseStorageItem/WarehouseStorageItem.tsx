import { FC, useCallback, useEffect, useState } from "react";
import { Button, FlatList, Modal, Pressable, Text, View } from "react-native";

import {
  ButtonWrapper,
  ModalWrapper,
  OuterModalWrapper,
} from "@components/shared";
import { useAppDispatch, useAppSelector, useToast } from "@hooks";
import {
  addWarehouseStorageItem as reduxAddWarehouseStorageItem,
  editWarehouseStorageItem,
  removeWarehouseStorageItem,
  setSelectedWarehouseStorageLocation,
} from "@store";
import type { LocationWithEvents } from "@types";
import { trpc } from "@utils";

import {
  HeaderButtonContainer,
  HeaderText,
  HeaderWrapper,
  LocationItemFormTextInput,
  LocationItemWrapper,
  LocationItemFormWrapper,
} from "./Styled";

export const WarehouseStorageItem = () => {
  const dispatch = useAppDispatch();

  const { selectedWarehouseStorageLocation, warehouseStorageLocations } =
    useAppSelector(({ warehouse }) => warehouse);

  const [isAddMode, setIsAddMode] = useState<boolean>(false);
  const [locationContent, setLocationContent] = useState<LocationWithEvents[]>(
    []
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Handlers
  const handleToggleAddOn = () => setIsAddMode(() => true);
  const handleToggleAddOff = () => setIsAddMode(() => false);

  useEffect(() => {
    if (!!selectedWarehouseStorageLocation) {
      setLocationContent(() =>
        warehouseStorageLocations.filter(
          (loc) => loc.locationName === selectedWarehouseStorageLocation
        )
      );
    }
  }, [selectedWarehouseStorageLocation, warehouseStorageLocations]);

  useEffect(() => {
    if (!!selectedItem) setIsAddMode(() => false);
  }, [selectedItem]);

  return (
    <View>
      <HeaderWrapper>
        <HeaderText>{selectedWarehouseStorageLocation}</HeaderText>
        <HeaderButtonContainer>
          <ButtonWrapper>
            <Button
              disabled={isAddMode || !!selectedItem}
              onPress={handleToggleAddOn}
              color="green"
              title="Add"
            />
          </ButtonWrapper>
          <Button
            onPress={() => {
              dispatch(setSelectedWarehouseStorageLocation(null));
            }}
            title="Back"
          />
        </HeaderButtonContainer>
      </HeaderWrapper>
      {!!selectedItem ? (
        <LocationItemForm
          itemId={selectedItem}
          onClearSelectedItem={() => {
            setSelectedItem(() => null);
          }}
        />
      ) : isAddMode ? (
        <AddLocationItemForm onCancel={handleToggleAddOff} />
      ) : null}
      <FlatList
        data={locationContent}
        keyExtractor={(loc) => loc.id}
        renderItem={({ index, item }) => (
          <LocationItem
            index={index}
            locationData={item}
            onItemPress={setSelectedItem}
          />
        )}
      />
    </View>
  );
};

interface LocationItemProps {
  index: number;
  locationData: LocationWithEvents;
  onItemPress: React.Dispatch<React.SetStateAction<string | null>>;
}

const LocationItem: FC<LocationItemProps> = ({
  index,
  locationData,
  onItemPress,
}) => {
  const dispatch = useAppDispatch();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(() => true)}
      onPressOut={() => setIsPressed(() => false)}
      onPress={() => onItemPress(locationData.id)}
      onLongPress={() => {
        setIsModalVisible(() => true);
      }}
    >
      <LocationItemWrapper index={index} isPressed={isPressed}>
        <Text>{locationData.description}</Text>
      </LocationItemWrapper>
      <Modal
        animationType="slide"
        hardwareAccelerated
        transparent
        visible={isModalVisible}
      >
        <Pressable onPress={() => setIsModalVisible(() => false)}>
          <OuterModalWrapper>
            <Pressable>
              <ModalWrapper>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <Text style={{ fontSize: 16 * 1.5 }}>Delete </Text>
                  <Text
                    style={{
                      color: "red",
                      fontSize: 16 * 1.5,
                      fontWeight: "500",
                    }}
                  >
                    {locationData.description}
                  </Text>
                  <Text style={{ fontSize: 16 * 1.5 }}>?</Text>
                </View>
                <Text>Cartons: {locationData.cartons}</Text>
                <Text>Pieces: {locationData.piecesTotal}</Text>
                <Text>
                  Date:{" "}
                  {!!locationData.date
                    ? new Date(locationData.date).toDateString()
                    : ""}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 8,
                  }}
                >
                  <ButtonWrapper>
                    <Button
                      onPress={() => setIsModalVisible(() => false)}
                      title="Cancel"
                    />
                  </ButtonWrapper>
                  <Button
                    color="red"
                    onPress={() => {
                      dispatch(removeWarehouseStorageItem(locationData.id));
                    }}
                    title="Delete"
                  />
                </View>
              </ModalWrapper>
            </Pressable>
          </OuterModalWrapper>
        </Pressable>
      </Modal>
    </Pressable>
  );
};

interface LocationItemFormProps {
  itemId: string;
  onClearSelectedItem: () => void;
}

const LocationItemForm: FC<LocationItemFormProps> = ({
  itemId,
  onClearSelectedItem,
}) => {
  const dispatch = useAppDispatch();

  const { selectedWarehouseStorageLocation, warehouseStorageLocations } =
    useAppSelector(({ warehouse }) => warehouse);

  const { showToast } = useToast();

  const [formData, setFormData] = useState(
    warehouseStorageLocations.find((loc) => loc.id === itemId)!
  );

  const { mutateAsync: updateWarehouseStorageItem } =
    trpc.warehouseStorageRouter.editWarehouseStorageItem.useMutation();

  // Handlers
  const handleUpdateItem = useCallback(async () => {
    const { description, initials } = formData;

    try {
      if (!!description && !!initials) {
        const { status, updateRes } = (await updateWarehouseStorageItem({
          ...formData,
          locationName: selectedWarehouseStorageLocation!,
          cartons: !!formData.cartons ? formData.cartons : 0,
          date: new Date().toString(),
          piecesPer: !!formData.piecesPer ? formData.piecesPer : 0,
          piecesTotal: !!formData.piecesTotal ? formData.piecesTotal : 0,
        })) as { status: string; updateRes: LocationWithEvents };

        if (status !== "OK") throw new Error();

        dispatch(editWarehouseStorageItem(updateRes));

        onClearSelectedItem();
      } else {
        showToast({ message: "Invalid input" });
      }
    } catch {
      showToast({});
    }
  }, [formData]);

  useEffect(() => {
    const targetItem = warehouseStorageLocations.find(
      (loc) => loc.id === itemId
    )!;

    setFormData(() => targetItem);
  }, [itemId]);

  return (
    <LocationItemFormWrapper>
      <LocationItemFormTextInput
        defaultValue={formData?.description}
        onChangeText={(e) =>
          setFormData((fData) => ({ ...fData, description: e }))
        }
        placeholder="Description"
        value={formData.description}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <LocationItemFormTextInput
          defaultValue={formData?.cartons?.toString() || "0"}
          keyboardType="numeric"
          onChangeText={(e) =>
            setFormData((fData) => ({
              ...fData,
              cartons: !!e ? parseInt(e) : 0,
            }))
          }
          placeholder="Cartons"
        />
        <LocationItemFormTextInput
          defaultValue={formData?.piecesTotal?.toString() || "0"}
          keyboardType="numeric"
          onChangeText={(e) =>
            setFormData((fData) => ({
              ...fData,
              piecesTotal: !!e ? parseInt(e) : 0,
            }))
          }
          placeholder="Pieces"
        />
        <LocationItemFormTextInput
          defaultValue={
            formData?.date ? new Date(formData.date).toDateString() : ""
          }
          placeholder="Date"
        />
        <LocationItemFormTextInput
          autoCapitalize="characters"
          defaultValue={formData?.initials}
          onChangeText={(e) => {
            if (e.length < 5) {
              setFormData((fData) => ({ ...fData, initials: e }));
            }
          }}
          placeholder="Initials"
          textAlign="right"
          value={formData.initials}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          padding: 8,
        }}
      >
        <View style={{ marginRight: 8 }}>
          <Button color="orange" onPress={onClearSelectedItem} title="Cancel" />
        </View>
        <Button onPress={handleUpdateItem} title="Update" />
      </View>
    </LocationItemFormWrapper>
  );
};

interface AddLocationItemForm {
  onCancel: () => void;
}

const AddLocationItemForm: FC<AddLocationItemForm> = ({ onCancel }) => {
  const dispatch = useAppDispatch();

  const { selectedWarehouseStorageLocation } = useAppSelector(
    ({ warehouse }) => warehouse
  );

  const [newItemFormData, setNewItemFormData] = useState<{
    description: string;
    cartons?: string;
    pieces?: string;
    date?: string;
    initials?: string;
  }>({
    description: "",
    cartons: "",
    pieces: "",
    date: "",
    initials: "",
  });

  const { mutateAsync: addWarehouseStorageItem } =
    trpc.warehouseStorageRouter.addWarehouseStorageItem.useMutation();

  const { showToast } = useToast();

  // Handlers
  const handleAddNewItem = useCallback(async () => {
    try {
      const { description, initials } = newItemFormData;

      if (!description || !initials) throw new Error("Invalid input");

      const { newLocation, status } = await addWarehouseStorageItem({
        ...newItemFormData,
        locationName: selectedWarehouseStorageLocation!,
        cartons: !!newItemFormData.cartons
          ? parseInt(newItemFormData.cartons)
          : 0,
        piecesTotal: !!newItemFormData.pieces
          ? parseInt(newItemFormData.pieces)
          : 0,
        initials: newItemFormData.initials || "N/A",
        date: new Date().toDateString(),
      });

      if (status !== "OK") throw new Error();

      if (!!newLocation) {
        const newLoc = newLocation as unknown as LocationWithEvents;

        dispatch(reduxAddWarehouseStorageItem(newLoc));
      }

      showToast({ message: "New loc added" });

      onCancel();
    } catch (e) {
      if (e instanceof Error) return showToast({ message: e.message });

      showToast({});
    }
  }, [newItemFormData]);

  return (
    <LocationItemFormWrapper>
      <LocationItemFormTextInput
        defaultValue={newItemFormData.description}
        onChangeText={(e) =>
          setNewItemFormData((fData) => ({ ...fData, description: e }))
        }
        placeholder="Description"
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <LocationItemFormTextInput
          defaultValue={newItemFormData.cartons}
          keyboardType="numeric"
          onChangeText={(e) =>
            setNewItemFormData((fData) => ({ ...fData, cartons: e }))
          }
          placeholder="Cartons"
        />
        <LocationItemFormTextInput
          defaultValue={newItemFormData.pieces}
          keyboardType="numeric"
          onChangeText={(e) =>
            setNewItemFormData((fData) => ({ ...fData, pieces: e }))
          }
          placeholder="Pieces"
        />
        <LocationItemFormTextInput
          defaultValue={newItemFormData.date}
          onChangeText={(e) =>
            setNewItemFormData((fData) => ({ ...fData, date: e }))
          }
          placeholder="Date"
        />
        <LocationItemFormTextInput
          defaultValue={newItemFormData.initials}
          autoCapitalize="characters"
          onChangeText={(e) =>
            setNewItemFormData((fData) => ({ ...fData, initials: e }))
          }
          placeholder="Initials"
          textAlign="right"
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          padding: 8,
        }}
      >
        <ButtonWrapper>
          <Button color="orange" onPress={onCancel} title="Cancel" />
        </ButtonWrapper>
        <Button onPress={handleAddNewItem} title="Add" />
      </View>
    </LocationItemFormWrapper>
  );
};
