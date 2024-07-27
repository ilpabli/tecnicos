import { View, StyleSheet, Image, Text } from "react-native";
import { TextInput, Button, Card, Chip, Icon } from "react-native-paper";
import * as React from "react";
import { useSession } from "@/contexts/auth";
import { useForm, Controller } from "react-hook-form";

export default function SignIn() {
  const { signIn, err } = useSession();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user: "",
      password: "",
    },
  });

  const onSubmit = (data: any) => {
    try {
      signIn({
        user: data.user.toLowerCase(),
        password: data.password.toLowerCase(),
      });
    } catch (error) {
      error;
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Image
            source={require("@/assets/images/tecky.png")}
            style={styles.image}
          />
          {err && (
            <Chip selectedColor="white" mode="flat" style={styles.chip}>
              <Icon source="information" color="white" size={20} />
              {err}
            </Chip>
          )}
          <Controller
            control={control}
            rules={{
              required: "Usuario es requerido",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="flat"
                textColor="black"
                outlineColor="black"
                label="Usuario"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                error={!!errors.user}
              />
            )}
            name="user"
          />
          {errors.user && (
            <Text style={styles.errorText}>{errors.user.message}</Text>
          )}

          <Controller
            control={control}
            rules={{
              required: "Contraseña es requerida",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                secureTextEntry
                error={!!errors.password}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            style={styles.button}
            icon="login-variant"
            mode="contained"
            onPress={handleSubmit(onSubmit)}
          >
            Conectar!
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
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  input: {
    width: "80%",
    marginVertical: 5,
    fontSize: 15,
  },
  card: {
    width: "90%",
  },
  cardContent: {
    alignItems: "center",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#d60000",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  chip: {
    backgroundColor: "red",
  },
});
