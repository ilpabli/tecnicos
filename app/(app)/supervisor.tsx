import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTechnicians, getTickets } from "@/utils/axios";
import SupervisorComponent from "@/components/supervisor";
import LoadingComponent from "@/components/loading";
import { io } from "socket.io-client";
import Constants from "expo-constants";

export default function Supervisor() {
  const queryClient = useQueryClient();
  const websocketUrl = Constants?.expoConfig?.extra?.EXPO_PUBLIC_WEBSOCKET_URL;
  const websocketOrigin =
    Constants?.expoConfig?.extra?.EXPO_PUBLIC_WEBSOCKET_ORIGIN;
  const {
    isLoading,
    error,
    isError,
    data: tickets,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => getTickets(),
    retry: true,
  });

  const { isLoading: isLoadingTech, data: technicians } = useQuery({
    queryKey: ["technicians"],
    queryFn: () => getTechnicians(),
    retry: true,
  });

  useEffect(() => {
    const socket = io(websocketUrl, {
      transports: ["websocket"],
      extraHeaders: {
        Origin: websocketOrigin,
      },
    });
    socket.on("connect", () => {});
    socket.on("db-update", () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
        refetchType: "active",
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  if (isLoading || isLoadingTech)
    return (
      <View style={styles.container}>
        <LoadingComponent />
      </View>
    );
  else if (isError)
    return (
      <View style={styles.container}>
        <Text>{error.message}</Text>
      </View>
    );

  return <SupervisorComponent tickets={tickets} technicians={technicians} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
});
