import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function Loader({
  size = "large",
  color = "#335441",
}: {
  size?: "small" | "large";
  color?: string;
}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
