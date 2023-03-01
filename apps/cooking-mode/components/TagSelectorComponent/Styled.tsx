import { FC, PropsWithChildren } from "react";
import { View } from "react-native";

export const ComponentWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View style={{ marginVertical: 8 }}>{children}</View>;
};

interface TagComponentWrapperProps {
  availableTags: string[];
  index: number;
  item: string;
  selectedTags: string[];
  tags: string[];
}

export const TagComponentWrapper: FC<
  PropsWithChildren & TagComponentWrapperProps
> = ({ availableTags, children, index, item, selectedTags, tags }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderColor: selectedTags.includes(item)
          ? "green"
          : availableTags.includes(item)
          ? !!selectedTags.length
            ? "orange"
            : "white"
          : "grey",
        borderRadius: 5,
        borderWidth: 2,
        elevation: 2,
        marginLeft: index === 0 ? 8 : 2,
        marginRight: index === tags.length - 1 ? 8 : 2,
        padding: 8,
      }}
    >
      {children}
    </View>
  );
};
