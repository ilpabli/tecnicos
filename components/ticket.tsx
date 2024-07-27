import React from "react";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View, Linking } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Text,
  Checkbox,
  TextInput,
  IconButton,
} from "react-native-paper";
import { workingTicket } from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LeftContent = ({ icon }: { icon: string }) => (
  <Avatar.Icon size={45} style={styles.color} icon={icon} />
);

const TicketComponent = ({ ticket }: any) => {
  const router = useRouter();
  const { ticketId } = useLocalSearchParams();
  const [checked, setChecked] = React.useState(false);
  const [solution, setSolution] = React.useState("");
  const [state, setState] = React.useState("En servicio");
  const queryClient = useQueryClient();

  const getIconName = (ele_esc: any) => {
    if (ele_esc === "Ascensor") {
      return "elevator";
    } else if (ele_esc === "Escalera") {
      return "escalator";
    }
    return "help"; //
  };

  const handleCheckboxPress = () => {
    setChecked(!checked);
    if (!checked) {
      setState("Fuera de servicio");
    } else {
      setState("En servicio");
    }
  };

  const workingTicketMutation = useMutation({
    mutationFn: ({ ticketId, updateData }: any) =>
      workingTicket(ticketId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticket", ticketId],
        refetchType: "active",
      });
    },
  });

  const handleWorkingTicket = (ticketId: any, updateData: any) => {
    workingTicketMutation.mutate({ ticketId, updateData });
  };

  const openGoogleMapsWithAddress = (address: any) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    Linking.openURL(url);
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={`Cliente ${ticket?.job_data.job_number} - ${ticket?.job_data.job_name}`}
        titleVariant="titleLarge"
        subtitle={`${ticket?.job_data.job_address}`}
        subtitleVariant="titleMedium"
        left={() => <LeftContent icon={getIconName(ticket?.ele_esc)} />}
      />
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" style={styles.text}>
          Reclamo número: {ticket?.ticket_id}
        </Text>
        <Text variant="titleLarge" style={styles.text}>
          {ticket?.ele_esc} #{ticket?.number_ele_esc} - {ticket?.status_ele_esc}
        </Text>
        <Text variant="bodyLarge" style={styles.text}>
          Descripción: {ticket?.description}
        </Text>
        <IconButton
          icon="google-maps"
          iconColor="blue"
          size={30}
          onPress={() =>
            openGoogleMapsWithAddress(ticket?.job_data.job_address)
          }
        />
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        {ticket?.ticket_workingAt === "" && (
          <View style={styles.actionContainer}>
            <Button
              icon="wrench"
              buttonColor="red"
              mode="contained"
              disabled={workingTicketMutation.isPending}
              onPress={() =>
                handleWorkingTicket(ticket?.ticket_id, {
                  ticket_workingAt: "true",
                  ticket_status: "En proceso",
                })
              }
            >
              {workingTicketMutation.isPending
                ? "Procesando..."
                : "Comenzar Atención!"}
            </Button>
          </View>
        )}
        {ticket?.solution === "" && ticket?.ticket_workingAt !== "" && (
          <View style={styles.actionContainer}>
            <TextInput
              label="Descripción del reclamo"
              multiline={true}
              numberOfLines={3}
              value={solution}
              cursorColor="black"
              activeUnderlineColor="green"
              onChangeText={(solution) => setSolution(solution)}
              style={styles.textInput}
            />
            <View style={styles.checkboxContainer}>
              <Checkbox
                color="red"
                uncheckedColor="green"
                status={checked ? "checked" : "unchecked"}
                onPress={handleCheckboxPress}
              />
              <Text style={styles.checkboxLabel}>Fuera de servicio?</Text>
            </View>
            <Button
              icon="check-outline"
              buttonColor="green"
              mode="contained"
              disabled={workingTicketMutation.isPending}
              onPress={() =>
                handleWorkingTicket(ticket?.ticket_id, {
                  ticket_closedAt: "true",
                  ticket_status: "Cerrado",
                  solution: solution,
                  status_ele_esc: state,
                })
              }
            >
              {workingTicketMutation.isPending
                ? "Procesando..."
                : "Finalizar Reclamo"}
            </Button>
          </View>
        )}
        {ticket?.ticket_closedAt !== "" && (
          <View style={styles.actionContainer}>
            <Text variant="titleMedium">Solución: {ticket?.solution}</Text>
            <Text variant="titleMedium">
              Tecnico: {ticket?.assigned_to.user}
            </Text>
            <Text variant="titleMedium">Fecha: {ticket?.ticket_closedAt}</Text>
            <Button
              icon="home"
              buttonColor="green"
              mode="contained"
              onPress={() => router.push("/")}
            >
              Volver
            </Button>
          </View>
        )}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 7,
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
  actionContainer: {
    width: "100%",
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  button: {
    width: "100%",
    marginHorizontal: 5,
  },
  color: {
    backgroundColor: "#d60000",
  },
});

export default TicketComponent;
