import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SessionProvider } from "@/contexts/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <Stack>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </PaperProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
