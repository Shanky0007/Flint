import { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { useAuth } from "../../lib/AuthContext";
import apiClient from "../../lib/api-client";
import Loader from "../../components/Loader";
import { SkeletonCard } from "../../components/Skeleton";

interface CollegeRequest {
  id: string;
  name: string;
  location: string;
  emailDomain: string;
  requestedBy: string;
  createdAt: string;
}

export default function PendingRequestsScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [requests, setRequests] = useState<CollegeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    } else if (user) {
      fetchRequests();
    }
  }, [user, authLoading]);

  const fetchRequests = async () => {
    try {
      const response = await apiClient.get("/api/colleges/pending");
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApprove = async (id: string, name: string) => {
    Alert.alert("Approve College", `Approve ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: async () => {
          try {
            await apiClient.patch(`/api/colleges/${id}/approve`);
            Alert.alert("Success", "College approved!");
            fetchRequests();
          } catch (error: any) {
            Alert.alert(
              "Error",
              error.response?.data?.message || "Failed to approve"
            );
          }
        },
      },
    ]);
  };

  const handleReject = async (id: string, name: string) => {
    Alert.alert("Reject College", `Reject ${name}? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/api/colleges/${id}/reject`);
            Alert.alert("Success", "College request rejected");
            fetchRequests();
          } catch (error: any) {
            Alert.alert(
              "Error",
              error.response?.data?.message || "Failed to reject"
            );
          }
        },
      },
    ]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
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
      {requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No pending requests</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
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
                <Text style={styles.value}>{item.requestedBy}</Text>

                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.approveButton]}
                  onPress={() => handleApprove(item.id, item.name)}
                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleReject(item.id, item.name)}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
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
    marginBottom: 16,
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
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#335441",
  },
  rejectButton: {
    backgroundColor: "#DC2626",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
