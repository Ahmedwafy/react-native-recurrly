import { useAuth, useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { router } from "expo-router";
import { styled } from "nativewind";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import images from "@/constants/images";
import { posthog } from "@/lib/posthog";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { isLoaded, signOut } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();

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

  if (!isLoaded || !isUserLoaded) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#ea7a53" />
      </SafeAreaView>
    );
  }

  const displayName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "Your profile";
  const email = user?.primaryEmailAddress?.emailAddress || "No email address";
  const memberSince = user?.createdAt
    ? dayjs(user.createdAt).format("MMMM YYYY")
    : "Not available";
  const emailIsVerified =
    user?.primaryEmailAddress?.verification?.status === "verified";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="flex-1">
        <View>
          <Text className="settings-title">Settings</Text>
          <Text className="settings-subtitle">Your account details</Text>

          <View className="settings-profile-card">
            {user?.imageUrl ? (
              // <Image
              //   source={{ uri: user.imageUrl }}
              //   className="settings-avatar"
              // />
              <Image source={images.avatar} className="home-avatar"></Image>
            ) : (
              <View className="settings-avatar settings-avatar-fallback">
                <Text className="settings-avatar-text">
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View className="settings-profile-copy">
              <Text className="settings-profile-name" numberOfLines={1}>
                {displayName}
              </Text>
              <Text className="settings-profile-email" numberOfLines={1}>
                {email}
              </Text>
              <View className="settings-status-row">
                <View
                  className={
                    emailIsVerified
                      ? "settings-status-dot"
                      : "settings-status-dot settings-status-dot-muted"
                  }
                />
                <Text className="settings-status-text">
                  {emailIsVerified ? "Email verified" : "Email not verified"}
                </Text>
              </View>
            </View>
          </View>

          <View className="settings-details-card">
            <View className="settings-detail-row">
              <Text className="settings-detail-label">Username</Text>
              <Text className="settings-detail-value" numberOfLines={1}>
                {user?.username || "Not set"}
              </Text>
            </View>
            <View className="settings-detail-divider" />
            <View className="settings-detail-row">
              <Text className="settings-detail-label">Member since</Text>
              <Text className="settings-detail-value">{memberSince}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          className="settings-logout-button"
        >
          <Text className="auth-button-text">Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
