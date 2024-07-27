import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getTicketsAssign } from "@/utils/axios";
import TicketsComponent from "@/components/tickets";
import LoadingComponent from "@/components/loading";

export default function Technical() {
  const {
    isLoading,
    isError,
    error,
    data: ticketsAssign,
  } = useQuery({
    queryKey: ["ticketsAssign"],
    queryFn: () => getTicketsAssign(),
    retry: true,
  });

  if (isLoading)
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
  return <TicketsComponent tickets={ticketsAssign} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
});
