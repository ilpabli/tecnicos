import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getTicketsAssign } from "@/utils/axios";
import { useTicketStore } from "../store/ticketStore";
import { useSession } from "./auth";
import { useLocation } from "./location";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const SocketNotificationContext = createContext<any>(null);

export const useSocketNotification = () =>
  useContext(SocketNotificationContext);

export const SocketNotificationProvider = ({ children }: any) => {
  const queryClient = useQueryClient();
  const websocketUrl = Constants?.expoConfig?.extra?.EXPO_PUBLIC_WEBSOCKET_URL;
  const websocketOrigin =
    Constants?.expoConfig?.extra?.EXPO_PUBLIC_WEBSOCKET_ORIGIN;
  const setAssignedTicketsCount = useTicketStore(
    (state: any) => state.setAssignedTicketsCount
  );
  const { session } = useSession();
  const { updateLocationNow } = useLocation();
  const previousTicketCountRef = useRef(0);

  const { data: ticketsAssign } = useQuery({
    queryKey: ["ticketsAssign"],
    enabled: !!session,
    queryFn: () => getTicketsAssign(),
    retry: true,
  });

  useEffect(() => {
    (async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
    })();
  }, []);

  useEffect(() => {
    const socket = io(websocketUrl, {
      transports: ["websocket"],
      extraHeaders: {
        Origin: websocketOrigin,
      },
    });
    socket.on("connect", () => {});
    socket.on("db-update", () => {
      queryClient.invalidateQueries({
        queryKey: ["ticketsAssign"],
        refetchType: "active",
      });
    });
    socket.on("locationUpdate", () => {
      updateLocationNow();
    });
    socket.on("notificationAlert", (data) => {
      alertNotification(data);
    });
    socket.on("priorityAlert", (data) => {
      const alert = {
        title: `${data?.priority} - ${data?.job_data.job_name}`,
        body: `${data?.ele_esc} #${data?.number_ele_esc} - ${data?.description}`,
      };
      alertNotification(alert);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (ticketsAssign) {
      const ticketCount = ticketsAssign.length;
      setAssignedTicketsCount(ticketCount);
      if (ticketCount > 0 && ticketCount !== previousTicketCountRef.current) {
        schedulePushNotification(ticketCount);
      }
      previousTicketCountRef.current = ticketCount;
    }
  }, [ticketsAssign, setAssignedTicketsCount]);

  const schedulePushNotification = async (totalTickets: number) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reclamo asignado",
        body: `Tenes ${totalTickets} reclamo${
          totalTickets !== 1 ? "s" : ""
        } asignado${totalTickets !== 1 ? "s" : ""}.`,
        data: { totalTickets: totalTickets },
      },
      trigger: null,
    });
  };

  const alertNotification = async (data: any) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${data?.title}`,
        body: `${data?.body}`,
      },
      trigger: null,
    });
  };

  return (
    <SocketNotificationContext.Provider value={ticketsAssign}>
      {children}
    </SocketNotificationContext.Provider>
  );
};
