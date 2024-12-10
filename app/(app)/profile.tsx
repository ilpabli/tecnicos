import { useSession } from "@/contexts/auth";
import React from "react";
import { View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/utils/axios";
import LoadingComponent from "@/components/loading";
import { Avatar, Button, Card, Text } from "react-native-paper";
import ChangePasswordComponent from "@/components/changepassword";

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="account" />;

export default function Profile() {
  const { user, signOut } = useSession();

  const {
    isLoading,
    error,
    isError,
    data: profile,
  } = useQuery({
    queryKey: ["profile"],
    enabled: !!user,
    queryFn: () => getMyProfile(),
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
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={`${profile.first_name} ${profile.last_name}`}
          titleVariant="titleLarge"
          subtitleVariant="titleMedium"
          subtitle={`${profile.user} `}
          left={LeftContent}
        />
        <Card.Content style={styles.cardContent}>
          <Text variant="bodyMedium">
            {profile.role === "technician"
              ? "Técnico"
              : profile.role === "admin"
              ? "Admin"
              : profile.role === "supervisor"
              ? "Supervisor"
              : profile.role}
          </Text>
          <ChangePasswordComponent />
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            icon="account-off"
            buttonColor="red"
            textColor="white"
            mode="contained"
            onPress={() => signOut()}
          >
            Desconectar
          </Button>
        </Card.Actions>
      </Card>
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
  card: {
    width: "95%",
  },
  cardContent: {
    alignItems: "center",
  },
  text: {
    marginBottom: 8,
    textAlign: "center",
  },
  cardActions: {
    flexDirection: "column",
    alignItems: "center",
    padding: 8,
  },
});
