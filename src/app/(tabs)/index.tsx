import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
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
    </View>
  );
}
