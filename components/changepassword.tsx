import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { changePassword } from "@/utils/axios";
import {
  Button,
  Text,
  Checkbox,
  TextInput,
  Chip,
  Icon,
  HelperText,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";

export default function ChangePasswordComponent() {
  const [checked, setChecked] = React.useState(false);
  const [error, setError] = React.useState<String | undefined>("");

  const handleCheckboxPress = () => {
    setChecked(!checked);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: any) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword.toLowerCase(),
        newPassword: data.newPassword.toLowerCase(),
      });
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(undefined);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <View style={styles.Container}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          color="red"
          uncheckedColor="green"
          status={checked ? "checked" : "unchecked"}
          onPress={handleCheckboxPress}
        />
        <Text variant="bodyMedium">Cambiar password?</Text>
      </View>
      <View>
        {error && (
          <Chip selectedColor="white" mode="flat" style={styles.chip}>
            <Icon source="information" color="white" size={20} />
            {error}
          </Chip>
        )}
      </View>
      <View style={styles.passwords}>
        {checked && (
          <>
            <Controller
              control={control}
              rules={{
                required: "Contraseña es requerida",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Ingrese su contraseña actual"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  secureTextEntry
                  error={!!errors.currentPassword}
                />
              )}
              name="currentPassword"
            />
            {errors.currentPassword && (
              <HelperText
                type="error"
                visible={!!errors.currentPassword}
                style={styles.helperText}
              >
                Error: {errors.currentPassword?.message}
              </HelperText>
            )}
            <Controller
              control={control}
              rules={{
                required: "La nueva contraseña es requerida",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Ingrese su nueva contraseña"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  secureTextEntry
                  error={!!errors.newPassword}
                />
              )}
              name="newPassword"
            />
            {errors.newPassword && (
              <HelperText
                type="error"
                visible={!!errors.newPassword}
                style={styles.helperText}
              >
                Error: {errors.newPassword?.message}
              </HelperText>
            )}
            <Controller
              control={control}
              rules={{
                required: "Confirmación de contraseña es requerida",
                validate: (value) =>
                  value === newPassword || "Las contraseñas no coinciden",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Confirme su nueva contraseña"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  secureTextEntry
                  error={!!errors.confirmNewPassword}
                />
              )}
              name="confirmNewPassword"
            />
            {errors.confirmNewPassword && (
              <HelperText
                type="error"
                visible={!!errors.confirmNewPassword}
                style={styles.helperText}
              >
                Error: {errors.confirmNewPassword?.message}
              </HelperText>
            )}
            <View style={styles.cardActions}>
              <Button
                icon="refresh"
                buttonColor="green"
                textColor="white"
                mode="contained"
                onPress={handleSubmit(onSubmit)}
              >
                Cambiar!
              </Button>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "80%",
    marginVertical: 3,
    fontSize: 15,
  },
  passwords: {
    width: "100%",
    alignItems: "center",
  },
  Container: {
    width: "100%",
    alignItems: "center",
  },
  cardActions: {
    flexDirection: "column",
    alignItems: "center",
  },
  chip: {
    backgroundColor: "red",
  },
  helperText: {
    marginLeft: 0,
  },
});
