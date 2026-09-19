import { styled } from "nativewind";
import { Text } from "react-native";
// import { SafeAreaView } from "react-native"; → Deprecated in React Native 0.70, use react-native-safe-area-context instead
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context"; // React Native docs

// Wrap the SafeAreaView component with the styled function to let NativeWind handle the styling
const SafeAreaView = styled(RNSafeAreaView);

const settings = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>settings</Text>
    </SafeAreaView>
  );
};

export default settings;
