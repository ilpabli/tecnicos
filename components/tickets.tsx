import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Avatar, Button, Card, Text } from "react-native-paper";

const LeftContent = ({ icon }: { icon: string }) => (
  <Avatar.Icon size={45} style={styles.color} icon={icon} />
);

const TicketsComponent = ({ tickets }: any) => {
  const getIconName = (ele_esc: any) => {
    if (ele_esc === "Ascensor") {
      return "elevator";
    } else if (ele_esc === "Escalera") {
      return "escalator";
    }
    return "help"; //
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
            subtitle={`${item?.job_data.job_address}`}
            subtitleVariant="titleMedium"
            left={() => <LeftContent icon={getIconName(item.ele_esc)} />}
          />
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.text}>
              Reclamo número: {item?.ticket_id}
            </Text>
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
            <Link
              href={{
                pathname: `/tickets/${item?.ticket_id}`,
              }}
            >
              <Button icon="contain" buttonColor="green" mode="contained">
                Ingresar
              </Button>
            </Link>
          </Card.Actions>
        </Card>
      )}
      estimatedItemSize={200}
    />
  );
};

export default TicketsComponent;

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
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  color: {
    backgroundColor: "#d60000",
  },
});
