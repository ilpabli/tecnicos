import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";

export default function Banner() {
  return (
    <Card style={styles.header}>
      <Card.Cover source={require("@/assets/images/fujitec.png")} />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 150,
    overflow: "hidden",
  },
});
