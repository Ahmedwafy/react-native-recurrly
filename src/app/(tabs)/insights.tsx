import { colors } from "@/constants/theme";
import { useSubscriptions } from "@/lib/subscriptions";
import { formatCurrency } from "@/lib/utils";
import { styled } from "nativewind";
import { ScrollView, Text, View } from "react-native";
import { Circle, Svg } from "react-native-svg";
// import { SafeAreaView } from "react-native"; → Deprecated in React Native 0.70, use react-native-safe-area-context instead
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context"; // React Native docs

const SafeAreaView = styled(RNSafeAreaView);

const CATEGORY_COLORS = [
  "#ea7a53",
  "#8fd1bd",
  "#c7d9f5",
  "#e8def8",
  "#f5c542",
  "#f0b8c8",
];

const monthlyEquivalent = (subscription: Subscription) =>
  subscription.billing === "Yearly"
    ? subscription.price / 12
    : subscription.price;

const Insights = () => {
  const { subscriptions } = useSubscriptions();
  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "active",
  );
  const monthlySpend = activeSubscriptions.reduce(
    (total, subscription) => total + monthlyEquivalent(subscription),
    0,
  );
  const yearlySpend = monthlySpend * 12;
  const averageSpend = activeSubscriptions.length
    ? monthlySpend / activeSubscriptions.length
    : 0;

  const categorySpend = Object.entries(
    activeSubscriptions.reduce<Record<string, number>>(
      (totals, subscription) => {
        const category = subscription.category ?? "Other";
        totals[category] =
          (totals[category] ?? 0) + monthlyEquivalent(subscription);
        return totals;
      },
      {},
    ),
  )
    .sort(([, firstAmount], [, secondAmount]) => secondAmount - firstAmount)
    .map(([category, amount], index) => ({
      category,
      amount,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));
  const largestCategory = categorySpend[0];
  const chartTotal = categorySpend.reduce(
    (total, item) => total + item.amount,
    0,
  );
  const circumference = 2 * Math.PI * 46;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="insights-content"
        showsVerticalScrollIndicator={false}
      >
        <View className="insights-heading">
          <View>
            <Text className="insights-kicker">YOUR SUBSCRIPTION PULSE</Text>
            <Text className="insights-title">Money, in focus.</Text>
          </View>
          <View className="insights-date-pill">
            <Text className="insights-date-text">THIS MONTH</Text>
          </View>
        </View>

        <View className="insights-hero">
          <View className="insights-hero-copy">
            <Text className="insights-hero-label">Monthly commitment</Text>
            <Text className="insights-hero-amount">
              {formatCurrency(monthlySpend)}
            </Text>
            <Text className="insights-hero-note">
              {activeSubscriptions.length} active{" "}
              {activeSubscriptions.length === 1
                ? "subscription"
                : "subscriptions"}
            </Text>
          </View>
          <View className="insights-hero-mark">
            <Text className="insights-hero-mark-text">$</Text>
          </View>
        </View>

        <View className="insights-stat-row">
          <View className="insights-stat-card">
            <Text className="insights-stat-label">Annual outlook</Text>
            <Text className="insights-stat-value">
              {formatCurrency(yearlySpend)}
            </Text>
            <Text className="insights-stat-note">at today&apos;s pace</Text>
          </View>
          <View className="insights-stat-card insights-stat-card-warm">
            <Text className="insights-stat-label">Average service</Text>
            <Text className="insights-stat-value">
              {formatCurrency(averageSpend)}
            </Text>
            <Text className="insights-stat-note">per month</Text>
          </View>
        </View>

        <View className="insights-section-heading">
          <Text className="insights-section-title">Where it goes</Text>
          <Text className="insights-section-caption">MONTHLY SHARE</Text>
        </View>

        <View className="insights-chart-card">
          {categorySpend.length ? (
            <View className="insights-chart-layout">
              <View className="insights-donut-wrap">
                <Svg width={124} height={124} viewBox="0 0 124 124">
                  <Circle
                    cx="62"
                    cy="62"
                    r="46"
                    fill="none"
                    stroke={colors.muted}
                    strokeWidth="16"
                  />
                  {categorySpend.map((item, index) => {
                    const segmentLength =
                      (item.amount / chartTotal) * circumference;
                    const previousLength = categorySpend
                      .slice(0, index)
                      .reduce(
                        (total, previous) =>
                          total +
                          (previous.amount / chartTotal) * circumference,
                        0,
                      );

                    return (
                      <Circle
                        key={item.category}
                        cx="62"
                        cy="62"
                        r="46"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="16"
                        strokeDasharray={`${segmentLength} ${circumference}`}
                        strokeDashoffset={-previousLength}
                        rotation="-90"
                        origin="62, 62"
                      />
                    );
                  })}
                </Svg>
                <View className="insights-donut-label">
                  <Text className="insights-donut-total">
                    {formatCurrency(monthlySpend)}
                  </Text>
                  <Text className="insights-donut-caption">/ MONTH</Text>
                </View>
              </View>
              <View className="insights-legend">
                {categorySpend.slice(0, 4).map((item) => (
                  <View key={item.category} className="insights-legend-row">
                    <View className="insights-legend-name">
                      <View
                        className="insights-legend-dot"
                        style={{ backgroundColor: item.color }}
                      />
                      <Text className="insights-legend-text" numberOfLines={1}>
                        {item.category}
                      </Text>
                    </View>
                    <Text className="insights-legend-value">
                      {Math.round((item.amount / chartTotal) * 100)}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text className="insights-empty">
              Add a subscription to see your spending pattern.
            </Text>
          )}
        </View>

        <View className="insights-section-heading">
          <Text className="insights-section-title">Top spending zones</Text>
          {largestCategory ? (
            <Text className="insights-section-caption">
              {largestCategory.category.toUpperCase()} LEADS
            </Text>
          ) : null}
        </View>

        <View className="insights-bars-card">
          {categorySpend.length ? (
            categorySpend.map((item) => (
              <View key={item.category} className="insights-bar-row">
                <View className="insights-bar-label-row">
                  <Text className="insights-bar-label">{item.category}</Text>
                  <Text className="insights-bar-value">
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
                <View className="insights-bar-track">
                  <View
                    className="insights-bar-fill"
                    style={{
                      width: `${Math.max((item.amount / (largestCategory?.amount ?? 1)) * 100, 4)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </View>
              </View>
            ))
          ) : (
            <Text className="insights-empty">
              No active subscriptions to analyze yet.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
