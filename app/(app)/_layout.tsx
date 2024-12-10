import { Redirect, Tabs } from "expo-router";
import { useSession } from "@/contexts/auth";
import LoadingComponent from "@/components/loading";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useTicketStore } from "../../store/ticketStore";
import { SocketNotificationProvider } from "@/contexts/notification";
import { LocationProvider } from "@/contexts/location";
import { Logo } from "@/components/logo";

export default function AppLayout() {
  const { session, isLoading, isAdmin } = useSession();
  const assignedTicketsCount = useTicketStore(
    (state: any) => state.assignedTicketsCount
  );

  if (isLoading) {
    return <LoadingComponent />;
  }
  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <LocationProvider>
      <SocketNotificationProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#e91e63",
            headerTitle: () => <Logo />,
            headerTitleAlign: "center",
            headerStyle: {
              height: 100,
            },
            tabBarHideOnKeyboard: true,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Inicio",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "home" : "home-outline"}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="technical"
            options={{
              title: "Tickets",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "construct" : "construct-outline"}
                  color={color}
                />
              ),
              tabBarBadge:
                assignedTicketsCount > 0 ? assignedTicketsCount : undefined,
            }}
          />
          <Tabs.Screen
            name="supervisor"
            options={{
              title: "Supervisor",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "shield" : "shield-outline"}
                  color={color}
                />
              ),
              href: isAdmin ? "/supervisor" : null,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Perfil",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "person" : "person-outline"}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="tickets/[ticketId]"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </SocketNotificationProvider>
    </LocationProvider>
  );
}
