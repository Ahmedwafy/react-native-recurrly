import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
// import { SafeAreaView } from "react-native"; → Deprecated in React Native 0.70, use react-native-safe-area-context instead
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context"; // React Native docs

// Wrap the SafeAreaView component with the styled function to let NativeWind handle the styling
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 bg-primary text-white px-4 py-2 rounded"
      >
        Go to Sign In
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 bg-primary text-white px-4 py-2 rounded"
      >
        Go to Sign Up
      </Link>

      {/* <Link
        href="/subscriptions/spotify"
        className="mt-4 bg-primary text-white px-4 py-2 rounded"
      >
        Spotify Subscription
      </Link> */}

      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "spotify" },
        }}
        className="mt-4 bg-primary text-white px-4 py-2 rounded"
      >
        Spotify
      </Link>

      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "claude" },
        }}
        className="mt-4 bg-primary text-white px-4 py-2 rounded"
      >
        Claude Max Subscription
      </Link>
    </SafeAreaView>
  );
}
