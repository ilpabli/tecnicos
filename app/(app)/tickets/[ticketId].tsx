import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getTicket } from "@/utils/axios";
import TicketComponent from "@/components/ticket";
import LoadingComponent from "@/components/loading";
import { View, StyleSheet } from "react-native";

export default function Ticket() {
  const { ticketId } = useLocalSearchParams();
  const {
    isLoading,
    error,
    isError,
    data: ticket,
  } = useQuery({
    queryKey: ["ticket", ticketId],
    enabled: !!ticketId,
    queryFn: () => getTicket(ticketId),
    retry: true,
  });

  if (isLoading) return <LoadingComponent />;
  else if (isError) return <div>{error.message}</div>;
  return (
    <View style={styles.container}>
      <TicketComponent ticket={ticket} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
});
