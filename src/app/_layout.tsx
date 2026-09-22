import "@/global.css";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
// tokenCache : close and re-open the app → use stay logged in [ no re-authentication ]
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import { useEffect, useRef } from "react";

import { posthog } from "@/lib/posthog";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error(
    "Add your Clerk Publishable Key to the project-root .env file",
  );
}

export default function RootLayout() {
  const appShell = <AppShell />;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {posthog ? (
        <PostHogProvider client={posthog}>{appShell}</PostHogProvider>
      ) : (
        appShell
      )}
    </ClerkProvider>
  );
}

function AppShell() {
  const [fontsLoaded] = useFonts({
    "sans-regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("@/assets/fonts/PlusJakartaSans-Light.ttf"),
  });
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      identifiedUserId.current = null;
      return;
    }

    if (!isLoaded || !userId || !isUserLoaded || !user) {
      return;
    }

    if (identifiedUserId.current === userId) {
      return;
    }

    posthog?.identify(userId, {
      $set: user.primaryEmailAddress
        ? { email: user.primaryEmailAddress.emailAddress }
        : {},
    });
    identifiedUserId.current = userId;
  }, [isLoaded, isSignedIn, isUserLoaded, user, userId]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !isLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName={isSignedIn ? "(tabs)" : "(auth)/sign-in"}
    />
  );
}
