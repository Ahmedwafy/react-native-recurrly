import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { styled } from "nativewind";
import { FlatList, Image, Text, View } from "react-native";
// import { SafeAreaView } from "react-native"; → Deprecated in React Native 0.70, use react-native-safe-area-context instead
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import "@/global.css";
import dayjs from "dayjs";
import { useState } from "react";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context"; // React Native docs
import { formatCurrency } from "../../lib/utils";

// Wrap the SafeAreaView component with the styled function to let NativeWind handle the styling
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avatar} className="home-avatar"></Image>
                {/* // TODO: use dynamic name. */}
                <Text className="home-user-name">{HOME_USER.name}</Text>
              </View>

              <Image source={icons.add} className="home-add-icon" />
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {/* ex: $2,155 */}
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {/* ex: 03/18 */}
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                // renderItem={({ item }) => <UpcomingSubscriptionCard items={items} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No Upcoming renewals yet
                  </Text>
                }
              />
            </View>

            <ListHeading title="All Subscription" />
          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscription yet</Text>
        }
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
}
