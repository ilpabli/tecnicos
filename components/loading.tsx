import * as React from "react";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

const LoadingComponent = () => (
  <ActivityIndicator animating={true} color={MD2Colors.red800} size={"small"} />
);

export default LoadingComponent;
