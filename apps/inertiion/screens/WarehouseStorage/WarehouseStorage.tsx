import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
  ModalSectionWrapper,
  ModalWrapper,
  OuterModalWrapper,
  SearchBarWrapper,
  SearchTextInput,
  WarehouseStorageWrapper,
} from "./Styled";
import { LocationWithEvents } from "@/types";

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
        res: LocationWithEvents[],
        uniqueLocations: string[]
      ];

      if (!res) {
        const { locations, status } = (await getAllLocations()) as unknown as {
          locations: LocationWithEvents[];
          status: string;
        };

        if (status !== "OK") throw new Error();

        const uniqLocs = Array.from(
          new Set(locations.map((loc) => loc.locationName))
        );

        await setLSUniqueWarehouseLocations(uniqLocs);

        await setLSWarehouseStorageLocations(locations);

        dispatch(setWarehouseStorageLocations(locations));

        setUniqueWarehouseLocations(uniqLocs);
      } else {
        dispatch(setWarehouseStorageLocations(res));

        setUniqueWarehouseLocations(() => uniqueLocations || []);
      }
    } catch {
      showToast({});
    }

    setIsInitialLoadComplete(() => true);
  };

  const handleSetSearchTerm = (searchTerm: string) => {
    dispatch(setSearchTerm(searchTerm));
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

  const { mutateAsync: cleanDatabase } =
    trpc.warehouseStorageRouter.cleanDatabase.useMutation();
  const { mutateAsync: parseSpreadsheet } =
    trpc.warehouseStorageRouter.parseSpreadsheet.useMutation();

  // Handlers
  const handleCleanDatabase = async () => {
    await cleanDatabase();
  };

  const handleParseSpreadsheet = async () => {
    await parseSpreadsheet();
  };

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
        transparent
        visible={isModalOpen}
      >
        <Pressable
          onPress={() => {
            setIsModalOpen(() => false);
          }}
        >
          <OuterModalWrapper>
            <Pressable>
              <ModalWrapper>
                <Text style={{ fontSize: 16 * 1.25 }}>Local Storage</Text>
                <ModalSectionWrapper>
                  <Text>Clear LS</Text>
                  <Button
                    color="red"
                    onPress={handleDeepClean}
                    title="Clear LS"
                  />
                </ModalSectionWrapper>
                <Text style={{ fontSize: 16 * 1.25 }}>Database</Text>
                <ModalSectionWrapper>
                  <Text>Clear DB</Text>
                  <Button
                    color="red"
                    onPress={handleCleanDatabase}
                    title="Clear DB"
                  />
                </ModalSectionWrapper>
                <Text style={{ fontSize: 16 * 1.25 }}>Spreadsheet</Text>
                <ModalSectionWrapper>
                  <Text>Parse spreadsheet</Text>
                  <Button onPress={handleParseSpreadsheet} title="Parse" />
                </ModalSectionWrapper>
                <View
                  style={{
                    marginTop: 8,
                    flexDirection: "row",
                  }}
                >
                  <Button
                    onPress={() => setIsModalOpen(() => false)}
                    title="Cancel"
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
