import * as React from "react";
import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

const IndustrialAccidentComponent = () => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const photos = [
    {
      source: require("../assets/images/electrico.png"),
      description: "Siempre trabaja sin energía!",
    },
    {
      source: require("../assets/images/atrapamiento.png"),
      description: "En el pasadizo, cuidado con el contrapeso!",
    },
    {
      source: require("../assets/images/apertura-1.png"),
      description: "Cuidado al abrir puertas!",
    },
    {
      source: require("../assets/images/apertura-2.png"),
      description: "Confirma que este la cabina!",
    },
    {
      source: require("../assets/images/caida.png"),
      description: "Usa la escalera!",
    },
    {
      source: require("../assets/images/caida-objetos.png"),
      description: "Usa siempre casco!",
    },
    {
      source: require("../assets/images/comunicacion.png"),
      description: "Confirma antes de mover un equipo!",
    },
    {
      source: require("../assets/images/atrapamiento-contrapeso.png"),
      description: "En el pasadizo, cuidado con el contrapeso!",
    },
    {
      source: require("../assets/images/atrapamiento-escalera.png"),
      description: "No hagas pruebas inseguras!",
    },
    {
      source: require("../assets/images/punto-apoyo.png"),
      description: "Usa 3 puntos de apoyo!",
    },
    {
      source: require("../assets/images/resbalamiento.png"),
      description: "Confirma donde vas a pisar!",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Carousel
        loop
        width={width}
        height={height / 1.5}
        autoPlay={true}
        autoPlayInterval={5000}
        data={photos}
        scrollAnimationDuration={2000}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={item.source}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
  },
  textContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
  },
  descriptionText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default IndustrialAccidentComponent;
