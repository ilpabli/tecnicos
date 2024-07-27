import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Avatar, Card, Text, Button } from "react-native-paper";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { assignTicket } from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LeftContent = ({ icon }: { icon: string }) => (
  <Avatar.Icon size={45} style={styles.color} icon={icon} />
);

const SupervisorComponent = ({ tickets, technicians }: any) => {
  const [isFocus, setIsFocus] = useState(false);
  const queryClient = useQueryClient();

  const getIconName = (ele_esc: any) => {
    if (ele_esc === "Ascensor") {
      return "elevator";
    } else if (ele_esc === "Escalera") {
      return "escalator";
    }
    return "help"; //
  };

  const assignTicketMutation = useMutation({
    mutationFn: ({ ticketId, technicianUser }: any) =>
      assignTicket(ticketId, technicianUser),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
        refetchType: "active",
      });
    },
  });

  const handleSelectChange = (ticketId: number, technicianUser: string) => {
    assignTicketMutation.mutate({ ticketId, technicianUser });
  };

  const renderLabel = () => {
    if (isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "black" }]}>
          Tecnico:
        </Text>
      );
    }
    return null;
  };

  return (
    <FlashList
      data={tickets}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }: any) => (
        <Card style={styles.card}>
          <Card.Title
            title={`Cliente ${item?.job_data.job_number} - ${item?.job_data.job_name}`}
            titleVariant="titleLarge"
            subtitle={`Reclamo: ${item?.ticket_id}`}
            subtitleVariant="titleSmall"
            left={() => <LeftContent icon={getIconName(item.ele_esc)} />}
          />
          <Card.Content style={styles.cardContent}>
            <Text variant="titleLarge" style={styles.text}>
              {item?.ele_esc} #{item?.number_ele_esc} - {item?.status_ele_esc}
            </Text>
            <Text variant="bodyLarge" style={styles.text}>
              Descripción: {item?.description}
            </Text>
            <Text variant="bodyLarge" style={styles.text}>
              Contacto: {item?.contact}
            </Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            {item?.assigned_to ? (
              <View>
                <Text style={styles.text_assigned}>
                  Asignado a: {item?.assigned_to.user}
                </Text>
                <Button
                  icon="account-edit"
                  buttonColor="purple"
                  mode="contained"
                  disabled={assignTicketMutation.isPending}
                  onPress={() => handleSelectChange(item?.ticket_id, "refresh")}
                >
                  {assignTicketMutation.isPending
                    ? "Procesando..."
                    : "Reasignar"}
                </Button>
              </View>
            ) : (
              <View style={styles.dropdownContainer}>
                {renderLabel()}
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "red" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={technicians}
                  maxHeight={300}
                  labelField="user"
                  valueField="user"
                  placeholder={!isFocus ? "Asignar" : "..."}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(selectedTechnician: any) => {
                    handleSelectChange(
                      item?.ticket_id,
                      selectedTechnician.user
                    );
                    setIsFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color={isFocus ? "red" : "black"}
                      name="user"
                      size={20}
                    />
                  )}
                />
              </View>
            )}
          </Card.Actions>
        </Card>
      )}
      estimatedItemSize={200}
    />
  );
};

export default SupervisorComponent;

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
  text_assigned: {
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  cardActions: {
    flexDirection: "column",
    alignItems: "center",
    padding: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  color: {
    backgroundColor: "#d60000",
  },
  dropdownContainer: {
    width: "100%",
    paddingHorizontal: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
