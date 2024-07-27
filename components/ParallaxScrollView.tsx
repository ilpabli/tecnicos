import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import Animated from "react-native-reanimated";
import { ThemedView } from "@/components/ThemedView";

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? "light";

  return <ThemedView style={styles.header}>{headerImage}</ThemedView>;
}

const styles = StyleSheet.create({
  header: {
    height: 130,
    overflow: "hidden",
  },
});
