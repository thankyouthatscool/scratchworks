import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Event, Location } from "@scratchworks/inertiion-services";
import * as Haptics from "expo-haptics";
import { FC, useEffect, useState } from "react";
import { Button, FlatList, Modal, Pressable, Text, View } from "react-native";

import { WarehouseStorageListItem } from "@components/WarehouseStorageListItem";
import { WarehouseStorageItem } from "@components/WarehouseStorageItem";
import { useAppDispatch, useAppSelector, useToast } from "@hooks";
import { setSearchTerm, setWarehouseStorageLocations } from "@store";
import {
  clearLSWarehouseStorageLocations,
  getLSWarehouseStorageLocations,
  getLSUniqueWarehouseStorageLocations,
  setLSWarehouseStorageLocations,
  setLSUniqueWarehouseLocations,
  trpc,
} from "@utils";

import {
  ButtonWrapper,
  SearchBarWrapper,
  SearchTextInput,
  WarehouseStorageWrapper,
} from "./Styled";

export const WarehouseStorage = () => {
  // Hooks
  const dispatch = useAppDispatch();

  const {
    searchTerm,
    selectedWarehouseStorageLocation,
    warehouseStorageLocations,
  } = useAppSelector(
    ({
      app: { searchTerm },
      warehouse: {
        selectedWarehouseStorageLocation,
        warehouseStorageLocations,
      },
    }) => ({
      searchTerm,
      selectedWarehouseStorageLocation,
      warehouseStorageLocations,
    })
  );

  const { mutateAsync: getAllLocations } =
    trpc.warehouseStorageRouter.getAllLocations.useMutation();
  const { mutateAsync: cleanDatabase } =
    trpc.warehouseStorageRouter.cleanDatabase.useMutation();
  const { mutateAsync: parseSpreadsheet } =
    trpc.warehouseStorageRouter.parseSpreadsheet.useMutation();

  const { showToast } = useToast();

  // State
  const [isInitialLodeComplete, setIsInitialLoadComplete] =
    useState<boolean>(false);
  const [uniqueWarehouseLocations, setUniqueWarehouseLocations] = useState<
    string[]
  >([]);

  // Handlers
  const handleInitialLoad = async () => {
    try {
      const allPromiseRes = await Promise.all(
        [
          getLSWarehouseStorageLocations,
          getLSUniqueWarehouseStorageLocations,
        ].map(async (func) => await func())
      );

      const [res, uniqueLocations] = allPromiseRes as [
        res: (Location & { events: Event[] })[],
        uniqueLocations: string[]
      ];

      setUniqueWarehouseLocations(() => uniqueLocations || []);

      if (!res) {
        const { locations, status } = (await getAllLocations()) as unknown as {
          locations: (Location & { events: Event[] })[];
          status: string;
        };

        if (status !== "OK") throw new Error();

        const uniqLocs = Array.from(
          new Set(locations.map((loc) => loc.locationName))
        );

        await setLSUniqueWarehouseLocations(uniqLocs);

        await setLSWarehouseStorageLocations(locations);

        dispatch(setWarehouseStorageLocations(locations));
      } else {
        dispatch(setWarehouseStorageLocations(res));
      }
    } catch {
      showToast({});
    }

    setIsInitialLoadComplete(() => true);
  };

  const handleSetSearchTerm = (searchTerm: string) => {
    dispatch(setSearchTerm(searchTerm));
  };

  const handleCleanDB = async () => {
    await cleanDatabase();
  };

  const handleParseSpreadsheet = async () => {
    await parseSpreadsheet();
  };

  const handleClearSearchTerm = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    dispatch(setSearchTerm(""));
  };

  const handleDeepClean = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    await clearLSWarehouseStorageLocations();

    handleInitialLoad();
  };

  // Effects
  useEffect(() => {
    handleInitialLoad();
  }, []);

  useEffect(() => {
    if (!!isInitialLodeComplete) {
      setLSWarehouseStorageLocations(warehouseStorageLocations);
    }
  }, [isInitialLodeComplete, warehouseStorageLocations]);

  return !!selectedWarehouseStorageLocation ? (
    <WarehouseStorageItem />
  ) : (
    <WarehouseStorageWrapper>
      <SearchBarWrapper>
        <SearchTextInput
          onChangeText={handleSetSearchTerm}
          placeholder="Search"
          value={searchTerm}
        />
        <ButtonWrapper>
          <Button title="All" />
        </ButtonWrapper>
        <ClearPressable
          handleClearSearchTerm={handleClearSearchTerm}
          handleDeepClean={handleDeepClean}
        />
      </SearchBarWrapper>
      <FlatList
        data={uniqueWarehouseLocations
          .map((loc) => ({ loc, key: loc }))
          .filter(({ loc }) => {
            if (!searchTerm) return true;

            return warehouseStorageLocations
              .filter((loc) =>
                loc.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((loc) => loc.locationName)
              .includes(loc);
          })}
        keyExtractor={({ key }) => key}
        overScrollMode="never"
        renderItem={({ index, item: { loc: item } }) => (
          <WarehouseStorageListItem index={index} item={item} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </WarehouseStorageWrapper>
  );
};

interface ClearPressableProps {
  handleClearSearchTerm: () => void;
  handleDeepClean: () => void;
}

const ClearPressable: FC<ClearPressableProps> = ({
  handleClearSearchTerm,
  handleDeepClean,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(() => true)}
      onPressOut={() => setIsPressed(() => false)}
      onPress={handleClearSearchTerm}
      onLongPress={() => setIsModalOpen(() => true)}
    >
      <MaterialIcons
        color={isPressed ? "orange" : "black"}
        name="clear-all"
        size={30}
      />
      <Modal
        animationType="slide"
        hardwareAccelerated
        style={{ alignItems: "center", justifyContent: "center" }}
        transparent
        visible={isModalOpen}
      >
        <Pressable
          onPress={() => {
            setIsModalOpen(() => false);
          }}
        >
          <View
            style={{
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Pressable>
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 5,
                  borderWidth: 2,
                  borderColor: "red",
                  padding: 8,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <ButtonWrapper>
                    <Button
                      onPress={() => setIsModalOpen(() => false)}
                      title="Cancel"
                    />
                  </ButtonWrapper>
                  <Button color="red" onPress={handleDeepClean} title="deep" />
                </View>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </Pressable>
  );
};
