import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { ComponentWrapper } from "./Styled";

const recipes = [
  { tags: ["air fryer", "vegetables"] },
  { tags: ["air fryer", "meats"] },
  { tags: ["meats", "big health"] },
  { tags: ["vegetables", "big health", "baked"] },
  { tags: ["vegetables", "narsty", "baked"] },
  { tags: ["baked", "indulge"] },
];

const tags = Array.from(
  new Set(recipes.reduce((acc, { tags }) => [...acc, ...tags], [] as string[]))
);

export const TagSelectorComponent = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const sortTags = useCallback(
    (tags: string[]) => {
      if (!selectedTags.length) {
        return tags;
      }

      const possibleRecipes = recipes.filter((recipe) =>
        selectedTags.every((tag) => recipe.tags.includes(tag))
      );

      const availableTags = Array.from(
        new Set(
          possibleRecipes.reduce(
            (acc, { tags }) => [...acc, ...tags],
            [] as string[]
          )
        )
      );

      return availableTags;
    },
    [selectedTags]
  );

  return (
    <ComponentWrapper>
      <FlatList
        data={sortTags(tags)}
        horizontal
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              setSelectedTags((selectedTags) => {
                if (selectedTags.includes(item)) {
                  return selectedTags.filter((ex) => ex !== item);
                } else {
                  return [...selectedTags, item];
                }
              });
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderColor: selectedTags.includes(item) ? "black" : "white",
                borderRadius: 5,
                borderWidth: 2,
                elevation: 2,
                marginLeft: !index ? 8 : 2,
                marginRight: 2,
                marginVertical: 2,
                padding: 8,
              }}
            >
              <Text style={{ fontSize: 12 }}>{item}</Text>
            </View>
          </Pressable>
        )}
      />
    </ComponentWrapper>
  );
};
