import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { createContext, useContext, useState, type ReactNode } from "react";

interface SubscriptionsContextValue {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
}

const SubscriptionsContext = createContext<
  SubscriptionsContextValue | undefined
>(undefined);

export const SubscriptionsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  const addSubscription = (subscription: Subscription) => {
    setSubscriptions((currentSubscriptions) => [
      subscription,
      ...currentSubscriptions,
    ]);
  };

  return (
    <SubscriptionsContext.Provider value={{ subscriptions, addSubscription }}>
      {children}
    </SubscriptionsContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionsContext);

  if (!context) {
    throw new Error(
      "useSubscriptions must be used inside a SubscriptionsProvider",
    );
  }

  return context;
};
