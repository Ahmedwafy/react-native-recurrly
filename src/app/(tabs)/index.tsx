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
      <Text className="text-7xl font-sans-extrabold">Home</Text>

      <Link
        href="/onboarding"
        className="mt-4 bg-primary text-white px-4 font-sans-bold py-2 rounded"
      >
        Go to Onboarding
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 bg-primary text-white px-4 font-sans-bold py-2 rounded"
      >
        Go to Sign In
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 bg-primary text-white px-4 font-sans-bold py-2 rounded"
      >
        Go to Sign Up
      </Link>
    </SafeAreaView>
  );
}
