import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const SubscriptionDetails = () => {
  //   const { id } = useLocalSearchParams();
  const { id } = useLocalSearchParams<{ id: string }>();

  console.log(id); //spotify

  return (
    <View>
      <Text>Subscription Details for ID: {id}</Text>
      <Link href="/">Go Back</Link>
    </View>
  );
};

export default SubscriptionDetails;
