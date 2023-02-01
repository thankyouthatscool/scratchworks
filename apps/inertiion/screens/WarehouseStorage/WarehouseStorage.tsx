import type { WarehouseStorageLocation } from "@scratchworks/inertiion-services";
import { useEffect, useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
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
            <Button
              disabled={!searchTerm}
              onPress={() => {
                dispatch(setSearchTerm(""));
              }}
              title="clear"
            />
          </View>
          <ScrollView>
            {Object.keys(warehouseStorageLocations)
              .sort((a, b) => a.localeCompare(b))
              .filter((location) => {
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
              })
              .map((location) => (
                <LocationCard key={location} location={location} />
              ))}
          </ScrollView>
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

  return (
    <Pressable
      onPress={() => {
        dispatch(setSelectedWarehouseStorageLocation(location));
      }}
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 1,
        margin: 8,
        padding: 8,
      }}
    >
      <Text style={{ fontSize: 16 * 1.25, fontWeight: "500" }}>{location}</Text>
      {warehouseStorageLocations[location].map((innerLocation) => {
        if (!!innerLocation.Description) {
          return (
            <View
              key={`${location} - ${innerLocation.Description}`}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>{innerLocation.Description}</Text>
              <Text>{innerLocation.Cartons}</Text>
              <Text>{innerLocation.Pieces}</Text>
              <Text>{innerLocation.Date}</Text>
              <Text>{innerLocation.Initials}</Text>
            </View>
          );
        }

        return null;
      })}
    </Pressable>
  );
};

// export const WarehouseStorageLocationComponent = () => {
//   const dispatch = useAppDispatch();

//   const { selectedWarehouseStorageLocation, warehouseStorageLocations } =
//     useAppSelector(({ warehouse }) => warehouse);

//   const [formData, setFormData] = useState<{
//     Description: string;
//     Cartons: string;
//     Pieces: string;
//     Initials: string;
//   }>({
//     Description: "",
//     Cartons: "",
//     Pieces: "",
//     Initials: "",
//   });

//   return (
//     <View style={{ paddingHorizontal: 8 }}>
//       {!!selectedWarehouseStorageLocation &&
//       warehouseStorageLocations[selectedWarehouseStorageLocation].some(
//         (loc) => !!loc.Description
//       ) ? (
//         <View>
//           {warehouseStorageLocations[selectedWarehouseStorageLocation].map(
//             (loc, index) => (
//               <View
//                 key={loc.Description}
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   marginTop: index !== 0 ? 8 : 0,
//                 }}
//               >
//                 <Text>{loc.Description}</Text>
//                 <Text>{loc.Cartons}</Text>
//                 <Text>{loc.Pieces}</Text>
//                 <Text>{loc.Date}</Text>
//                 <Text>{loc.Initials}</Text>
//               </View>
//             )
//           )}
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "flex-end",
//               marginTop: 8,
//             }}
//           >
//             <View style={{ marginRight: 8 }}>
//               <Button
//                 onPress={() => {
//                   dispatch(setSelectedWarehouseStorageLocation(null));
//                 }}
//                 title="cancel"
//               />
//             </View>
//             <Button
// onPress={async () => {
//   const res = await removePallet(
//     selectedWarehouseStorageLocation
//   );

//   dispatch(setWarehouseStorageLocations(res));

//   dispatch(setSelectedWarehouseStorageLocation(null));
// }}
//               title="Remove Pallet"
//             />
//           </View>
//         </View>
//       ) : (
//         <View style={{ marginTop: 8 }}>
//           <TextInput
//             onChangeText={(e) =>
//               setFormData((formData) => ({ ...formData, Description: e }))
//             }
//             placeholder="Description"
//             style={{ backgroundColor: "white", padding: 8 }}
//             value={formData.Description}
//           />
//           <View style={{ flexDirection: "row", marginTop: 8 }}>
//             <TextInput
//               keyboardType="numeric"
//               onChangeText={(e) =>
//                 setFormData((formData) => ({ ...formData, Cartons: e }))
//               }
//               placeholder="Cartons"
//               style={{
//                 backgroundColor: "white",
//                 flex: 1,
//                 marginRight: 8,
//                 padding: 8,
//               }}
//               value={formData.Cartons}
//             />
//             <TextInput
//               keyboardType="numeric"
//               onChangeText={(e) =>
//                 setFormData((formData) => ({ ...formData, Pieces: e }))
//               }
//               placeholder="Pieces"
//               style={{
//                 backgroundColor: "white",
//                 flex: 1,
//                 marginRight: 8,
//                 padding: 8,
//               }}
//               value={formData.Pieces}
//             />
//             <TextInput
//               onChangeText={(e) =>
//                 setFormData((formData) => ({ ...formData, Initials: e }))
//               }
//               placeholder="Initials"
//               style={{ backgroundColor: "white", flex: 1, padding: 8 }}
//               value={formData.Initials}
//             />
//           </View>
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "flex-end",
//               marginTop: 8,
//             }}
//           >
//             <View style={{ marginRight: 8 }}>
//               <Button
//                 onPress={() => {
//                   dispatch(setSelectedWarehouseStorageLocation(null));
//                 }}
//                 title="Cancel"
//               />
//             </View>
//             <Button
//               onPress={async () => {
//                 const currentDate = new Date();

//                 const dateString = `${currentDate.getHours()}:${currentDate
//                   .getMinutes()
//                   .toString()
//                   .padStart(
//                     2,
//                     "0"
//                   )} ${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`;

//                 const res = await savePallet(
//                   selectedWarehouseStorageLocation!,
//                   {
//                     ...formData,
//                     Cartons: parseInt(formData.Cartons || "0"),
//                     Date: dateString,
//                     Pieces: parseInt(formData.Pieces || "0"),
//                   }
//                 );

//                 dispatch(setWarehouseStorageLocations(res));

//                 dispatch(setSelectedWarehouseStorageLocation(null));
//               }}
//               title="Save"
//             />
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };
