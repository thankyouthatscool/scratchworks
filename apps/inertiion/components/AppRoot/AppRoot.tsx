import { SafeAreaView } from "react-native-safe-area-context";

import { WarehouseStorage } from "@screens/WarehouseStorage";

export const AppRoot = () => {
  return (
    <SafeAreaView>
      <WarehouseStorage />
    </SafeAreaView>
  );
};
