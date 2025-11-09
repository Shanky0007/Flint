import { useEffect, useState } from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { useAuth } from "../../lib/AuthContext";
import apiClient from "../../lib/api-client";
import { SkeletonCard } from "../../components/Skeleton";

interface College {
  id: string;
  name: string;
  location: string;
  emailDomain: string;
  isApproved: boolean;
  requestedBy: string;
  createdAt: string;
}

export default function HistoryScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    } else if (user) {
      fetchColleges();
    }
  }, [user, authLoading]);

  const fetchColleges = async () => {
    try {
      const response = await apiClient.get("/api/colleges/approved");
      setColleges(response.data);
    } catch (error) {
      console.error("Failed to fetch colleges", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchColleges();
  };

  if (authLoading || loading) {
    return (
      <View style={styles.container}>
        <View style={styles.list}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {colleges.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No approved colleges yet</Text>
        </View>
      ) : (
        <FlatList
          data={colleges}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.collegeName}>{item.name}</Text>
                <Text style={styles.location}>{item.location}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.label}>Email Domain:</Text>
                <Text style={styles.value}>@{item.emailDomain}</Text>

                <Text style={styles.label}>Requested By:</Text>
                <Text style={styles.value}>{item.requestedBy || "N/A"}</Text>

                <Text style={styles.label}>Approved On:</Text>
                <Text style={styles.value}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>✓ Approved</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
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
  collegeName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#335441",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#6B8F60",
  },
  cardBody: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#6B8F60",
    marginTop: 8,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  badge: {
    backgroundColor: "#D1FAE5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#065F46",
    fontSize: 14,
    fontWeight: "600",
  },
});
