import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { updateLocation } from "../utils/axios";
import { useSession } from "./auth";
import { useMutation } from "@tanstack/react-query";

const LOCATION_TASK_NAME = "background-location-task";
const BACKGROUND_FETCH_TASK_NAME = "background-fetch-task";
const UPDATE_INTERVAL = 5 * 60 * 1000;

interface LocationContextType {
  currentLocation: Location.LocationObject | null;
  errorMsg: string;
  startLocationTracking: () => Promise<void>;
  stopLocationTracking: () => Promise<void>;
  getCurrentLocation: () => Location.LocationObject | null;
  updateLocationNow: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { user } = useSession();

  const isLocationDifferent = (
    loc1: Location.LocationObject | null,
    loc2: Location.LocationObject
  ): boolean => {
    if (!loc1) return true;
    const threshold = 0.0001;
    return (
      Math.abs(loc1.coords.latitude - loc2.coords.latitude) > threshold ||
      Math.abs(loc1.coords.longitude - loc2.coords.longitude) > threshold
    );
  };

  const updateLocationMutation = useMutation({
    mutationFn: (newLocation: any) => updateLocation(user, newLocation),
  });

  const updateLocationData = async (newLocation: Location.LocationObject) => {
    try {
      if (isLocationDifferent(currentLocation, newLocation)) {
        setCurrentLocation(newLocation);
        await updateLocationMutation.mutateAsync({
          gps_point: {
            lat: newLocation.coords.latitude,
            lng: newLocation.coords.longitude,
          },
        });
        console.log("Ubicación actualizada:", newLocation.coords);
      } else {
        console.log(
          "Ubicación no ha cambiado significativamente, no se actualiza."
        );
      }
    } catch (error) {
      console.error("Error al actualizar la ubicación:", error);
    }
  };

  TaskManager.defineTask(
    LOCATION_TASK_NAME,
    async ({ data, error }: TaskManager.TaskManagerTaskBody) => {
      if (error) {
        console.error("Error en la tarea de ubicación:", error);
        return;
      }
      if (data) {
        const { locations } = data as { locations: Location.LocationObject[] };
        const newLocation = locations[0];
        if (newLocation) {
          await updateLocationData(newLocation);
        }
      }
    }
  );

  TaskManager.defineTask(BACKGROUND_FETCH_TASK_NAME, async () => {
    try {
      const newLocation = await Location.getCurrentPositionAsync({});
      await updateLocationData(newLocation);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      console.error("Error en la tarea de fondo:", error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });

  const startLocationTracking = async (): Promise<void> => {
    try {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus === "granted") {
        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === "granted") {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 0,
            timeInterval: UPDATE_INTERVAL,
          });
        }
      }

      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK_NAME, {
        minimumInterval: UPDATE_INTERVAL,
        stopOnTerminate: false,
        startOnBoot: true,
      });

      const initialLocation = await Location.getCurrentPositionAsync({});
      await updateLocationData(initialLocation);
    } catch (error) {
      console.error("Error al iniciar el seguimiento de ubicación:", error);
      setErrorMsg("Error al iniciar el seguimiento de ubicación");
    }
  };

  const stopLocationTracking = async (): Promise<void> => {
    try {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK_NAME);
    } catch (error) {
      console.error("Error al detener el seguimiento de ubicación:", error);
    }
  };

  const getCurrentLocation = (): Location.LocationObject | null => {
    return currentLocation;
  };

  const updateLocationNow = async (): Promise<void> => {
    try {
      const newLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      await updateLocationData(newLocation);
    } catch (error) {
      console.error("Error al actualizar la ubicación inmediatamente:", error);
      setErrorMsg("Error al actualizar la ubicación");
    }
  };

  useEffect(() => {
    startLocationTracking();
    return () => {
      stopLocationTracking();
    };
  }, []);

  const contextValue: LocationContextType = {
    currentLocation,
    errorMsg,
    startLocationTracking,
    stopLocationTracking,
    getCurrentLocation,
    updateLocationNow,
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
