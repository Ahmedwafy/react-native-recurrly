import { posthog } from "@/lib/posthog";
import { useSubscriptions } from "@/lib/subscriptions";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
// import { SafeAreaView } from "react-native"; → Deprecated in React Native 0.70, use react-native-safe-area-context instead
import SubscriptionCard from "@/components/SubscriptionCard";
import "@/global.css";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context"; // React Native docs

// Wrap the SafeAreaView component with the styled function to let NativeWind handle the styling
const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const { subscriptions } = useSubscriptions();

  const filteredSubscriptions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return subscriptions;
    }

    return subscriptions.filter((subscription) =>
      //  {
      //   return (
      //   subscription.name?.toLowerCase().includes(normalizedQuery) ||
      //   subscription.category?.toLowerCase().includes(normalizedQuery) ||
      //   subscription.plan?.toLowerCase().includes(normalizedQuery)
      // );
      // });
      // or
      [subscription.name, subscription.category, subscription.plan] // returns Array → [ .. , .. , .. ].filter(Boolean)
        .filter(Boolean) // will not return any falsy value → 0 , "" , null , undifiend [ careful if have numeric values ]
        .some((value) => value!.toLowerCase().includes(normalizedQuery)),
    );
  }, [searchQuery, subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => {
              const isExpanded = expandedSubscriptionId !== item.id;
              posthog?.capture("subscription_details_toggled", {
                is_expanded: isExpanded,
                subscription_category: item.category ?? null,
                billing_period: item.billing,
              });
              setExpandedSubscriptionId(isExpanded ? item.id : null);
            }}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-20"
        ListHeaderComponent={
          <View>
            <Text className="list-title mb-5">Subscriptions</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search subscriptions"
              placeholderTextColor="rgba(0, 0, 0, 0.45)"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              className="subscription-search"
            />
          </View>
        }
        ListEmptyComponent={
          <Text className="home-empty-state">
            {searchQuery.trim()
              ? "No subscriptions match your search"
              : "No subscriptions yet"}
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
