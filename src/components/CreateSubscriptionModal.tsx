import { icons } from "@/constants/icons";
import "@/global.css";
import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;
// "Entertainment" | "AI Tools" | "Developer Tools" | "Design" | "Productivity" | "Cloud" | "Music" | "Other"
const CATEGORY_COLORS: Record<(typeof CATEGORIES)[number], string> = {
  Entertainment: "#f5c542",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#b8e8d0",
  Productivity: "#f4c7ab",
  Cloud: "#c7d9f5",
  Music: "#f0b8c8",
  Other: "#d9d2c3",
};

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
}

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]>("Other");

  const parsedPrice = Number(price);
  const canSubmit = name.trim().length > 0 && parsedPrice > 0;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Other");
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    const startDate = dayjs();
    const renewalDate = startDate
      .add(
        frequency === "Monthly" ? 1 : 1,
        frequency === "Monthly" ? "month" : "year",
      )
      .toISOString();

    onCreate({
      id: `${name.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: name.trim(),
      price: parsedPrice,
      currency: "USD",
      frequency,
      billing: frequency,
      category,
      status: "active",
      startDate: startDate.toISOString(),
      renewalDate,
      icon: icons.add,
      color: CATEGORY_COLORS[category],
    });
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        className="modal-overlay"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="modal-container">
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable
              accessibilityLabel="Close new subscription form"
              onPress={handleClose}
              className="modal-close"
            >
              <Text className="modal-close-text">X</Text>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="modal-body"
            showsVerticalScrollIndicator={false}
          >
            <View className="auth-field">
              <Text className="auth-label">Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Netflix"
                placeholderTextColor="#5f6470"
                autoCapitalize="words"
                className="auth-input"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Price</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="e.g. 14.99"
                placeholderTextColor="#5f6470"
                keyboardType="decimal-pad"
                className="auth-input"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Frequency</Text>
              <View className="picker-row">
                {(["Monthly", "Yearly"] as const).map((option) => {
                  const isActive = frequency === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => setFrequency(option)}
                      className={clsx(
                        "picker-option",
                        isActive && "picker-option-active",
                      )}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          isActive && "picker-option-text-active",
                        )}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="auth-field">
              <Text className="auth-label">Category</Text>
              <View className="category-scroll">
                {CATEGORIES.map((option) => {
                  const isActive = category === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => setCategory(option)}
                      className={clsx(
                        "category-chip",
                        isActive && "category-chip-active",
                      )}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          isActive && "picker-option-text-active",
                        )}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              className={clsx(
                "auth-button",
                !canSubmit && "auth-button-disabled",
              )}
            >
              <Text className="auth-button-text">Create Subscription</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;
