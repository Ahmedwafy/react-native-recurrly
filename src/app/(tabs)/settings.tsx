import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { styled } from "nativewind";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { posthog } from "@/lib/posthog";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { isLoaded, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      posthog?.capture("sign_out_completed");
      posthog?.reset();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#ea7a53" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="mb-20 flex-1 justify-between">
        <View>
          <Text className="text-2xl font-bold text-foreground">Settings</Text>
        </View>

        <TouchableOpacity onPress={handleSignOut} className="auth-button">
          <Text className="auth-button-text">Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
