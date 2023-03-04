import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setSelectedTags } from "@store";
import { ComponentWrapper, TagComponentWrapper } from "./Styled";

export const TagSelectorComponent = () => {
  const dispatch = useAppDispatch();

  const { recipes, selectedTags } = useAppSelector(({ recipes }) => recipes);

  const [tags] = useState(() =>
    Array.from(
      new Set(
        recipes.reduce((acc, { tags }) => [...acc, ...tags], [] as string[])
      )
    ).sort((a, b) => a.localeCompare(b))
  );

  const [availableTags, setAvailableTags] = useState<string[]>(tags);
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef<FlatList<string>>(null);

  useEffect(() => {
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

    setAvailableTags(() => availableTags);
  }, [selectedTags]);

  const handleIsLoadingChange = async () => {
    setTimeout(() => {
      setIsLoading(() => false);
    }, 1);
  };

  useEffect(() => {
    if (!!isLoading) {
      handleIsLoadingChange();
    }
  }, [isLoading]);

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

      const remTags = availableTags.filter(
        (tag) => !selectedTags.includes(tag)
      );

      return [...selectedTags, ...remTags];
    },
    [selectedTags]
  );

  return (
    <ComponentWrapper>
      {isLoading ? (
        <PlaceholderComponent />
      ) : (
        <FlatList
          data={sortTags(tags)}
          horizontal
          ref={flatListRef}
          renderItem={({ item, index }) => (
            <Pressable
              disabled={!availableTags.includes(item)}
              onPress={() => {
                dispatch(
                  setSelectedTags(
                    selectedTags.includes(item)
                      ? selectedTags.filter((tag) => tag !== item)
                      : [...selectedTags, item]
                  )
                );

                setIsLoading(() => true);
              }}
            >
              <TagComponentWrapper
                availableTags={availableTags}
                index={index}
                item={item}
                selectedTags={selectedTags}
                tags={tags}
              >
                <Text style={{ fontSize: 12 }}>{item}</Text>
              </TagComponentWrapper>
            </Pressable>
          )}
        />
      )}
    </ComponentWrapper>
  );
};

const PlaceholderComponent = () => {
  return (
    <View
      style={{
        borderColor: "white",
        borderWidth: 2,
        marginTop: 2,
        marginBottom: 4,
        padding: 8,
        width: 0,
      }}
    >
      <Text style={{ fontSize: 12 }} />
    </View>
  );
};
