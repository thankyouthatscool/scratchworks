import { ComponentPropsWithoutRef, FC, PropsWithChildren } from "react";
import { TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const RootWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <SafeAreaView>{children}</SafeAreaView>;
};

export const MainCardWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 5,
        elevation: 2,
        margin: 8,
        padding: 8,
      }}
    >
      {children}
    </View>
  );
};

export const HeaderWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {children}
    </View>
  );
};

export const StyledTextInput: FC<
  ComponentPropsWithoutRef<typeof TextInput> & {
    isFlex?: boolean;
    isHeading?: boolean;
    isMargin?: boolean;
  }
> = ({ isFlex, isHeading, isMargin, ...props }) => (
  <TextInput
    {...props}
    style={{
      color: "black",
      fontSize: !!isHeading ? 20 : 14,
      fontWeight: !!isHeading ? "500" : "400",
      maxHeight: 200,
      ...(!!isFlex && { flex: 1 }),
      ...(!!isMargin && { marginVertical: 8 }),
    }}
  />
);

export const BigTagWrapper: FC<
  PropsWithChildren & { isSelectedTag: boolean }
> = ({ children, isSelectedTag }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderColor: !!isSelectedTag ? "green" : "white",
        borderRadius: 5,
        borderWidth: 1,
        elevation: 2,
        padding: 2,
        marginRight: 4,
      }}
    >
      {children}
    </View>
  );
};

export const OuterModalContainerWrapper: FC<
  PropsWithChildren & { backgroundDimmed?: boolean }
> = ({ children, backgroundDimmed: isBackgroundDimmed }) => {
  return (
    <View
      style={{
        alignItems: "center",
        ...(isBackgroundDimmed && { backgroundColor: "rgba(0,0,0,0.6)" }),
        height: "100%",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
};

export const InnerModalContainerWrapper: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 5,
        elevation: 10,
        padding: 8,
        width: "80%",
      }}
    >
      {children}
    </View>
  );
};

export const RecipeStepTypeSelectorWrapper: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 8,
      }}
    >
      {children}
    </View>
  );
};

export const RecipeStepTypeWrapper: FC<
  PropsWithChildren & { isSelected: boolean }
> = ({ children, isSelected }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderColor: isSelected ? "green" : "white",
        borderRadius: 5,
        borderWidth: 2,
        elevation: 2,
        padding: 4,
      }}
    >
      {children}
    </View>
  );
};

export const RecipeStepWrapper: FC<
  PropsWithChildren & { isFirst: boolean; isLast: boolean }
> = ({ children, isFirst, isLast }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 5,
        elevation: 2,
        marginVertical: 4,
        marginTop: isFirst ? 0 : 4,
        marginBottom: isLast ? 8 : 4,
        padding: 8,
      }}
    >
      {children}
    </View>
  );
};

export const RecipeStepTextWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {children}
    </View>
  );
};

export const RecipeActionButtonWrapper: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 8,
      }}
    >
      {children}
    </View>
  );
};

export const RecipeTagsWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 4,
      }}
    >
      {children}
    </View>
  );
};

export const ExpandedRecipeCardFooterWrapper: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        borderWidth: 2,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {children}
    </View>
  );
};
