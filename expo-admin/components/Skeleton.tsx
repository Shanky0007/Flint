import { View, StyleSheet, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";

export default function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style = {},
}: {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Skeleton width="70%" height={24} style={{ marginBottom: 8 }} />
        <Skeleton width="40%" height={16} />
      </View>

      <View style={styles.cardBody}>
        <Skeleton
          width="30%"
          height={12}
          style={{ marginTop: 12, marginBottom: 4 }}
        />
        <Skeleton width="60%" height={16} style={{ marginBottom: 12 }} />

        <Skeleton width="30%" height={12} style={{ marginBottom: 4 }} />
        <Skeleton width="50%" height={16} style={{ marginBottom: 12 }} />

        <Skeleton width="30%" height={12} style={{ marginBottom: 4 }} />
        <Skeleton width="45%" height={16} />
      </View>

      <View style={styles.actions}>
        <Skeleton width="48%" height={44} borderRadius={8} />
        <Skeleton width="48%" height={44} borderRadius={8} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E4D7B4",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E4D7B4",
    paddingBottom: 12,
  },
  cardBody: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
