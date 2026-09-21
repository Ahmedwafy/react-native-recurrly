import { useAuth, useClerk, useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SignIn = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const { setActive } = useClerk();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn]);

  const emailError = useMemo(() => {
    if (!email.trim()) {
      return "Enter your email.";
    }

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    return valid ? "" : "Enter a valid email address.";
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) {
      return "Enter your password.";
    }

    return password.length >= 8 ? "" : "Use at least 8 characters.";
  }, [password]);

  const showEmailError = emailTouched && !!emailError;
  const showPasswordError = passwordTouched && !!passwordError;

  const canSubmit =
    !isSubmitting &&
    email.trim().length > 0 &&
    password.length > 0 &&
    !emailError &&
    !passwordError;

  const handleSubmit = async () => {
    if (!signIn || !setActive || !canSubmit) {
      setError("Please check your details and try again.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { error: createError } = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (createError) {
        setError(createError.message || "We could not sign you in.");
        return;
      }

      const { error: passwordErrorResult } = await signIn.password({
        identifier: email.trim(),
        password,
      });

      if (passwordErrorResult) {
        setError(passwordErrorResult.message || "Incorrect email or password.");
        return;
      }

      if (signIn.status === "complete" && signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId });
        router.replace("/(tabs)");
        return;
      }

      setError("Your account needs an additional verification step.");
    } catch (err: any) {
      setError(
        err?.errors?.[0]?.message || "We could not sign you in right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <View className="auth-screen items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#ea7a53" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="auth-safe-area"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="auth-scroll"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="auth-content">
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <Text className="auth-wordmark">Recurly</Text>
            </View>
            <Text className="auth-wordmark-sub">SMART BILLING</Text>
          </View>

          <Text className="auth-title mt-8 text-center">Welcome back</Text>
          <Text className="auth-subtitle mt-2 text-center">
            Sign in to continue managing your subscriptions
          </Text>

          <View className="auth-card">
            <View className="auth-form">
              {/* Email */}
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  value={email}
                  // onChangeText={setEmail}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailTouched(true);
                  }}
                  onBlur={() => setEmailTouched(true)}
                  //
                  placeholder="Enter your email"
                  placeholderTextColor="#5f6470"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className={[
                    "auth-input",
                    showEmailError ? "auth-input-error" : "",
                  ].join(" ")}
                />
                {showEmailError ? (
                  <Text className="auth-error">{emailError}</Text>
                ) : null}
              </View>

              {/* Password */}
              <View className="auth-field">
                <Text className="auth-label">Password</Text>

                <View className="relative">
                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setPasswordTouched(true);
                    }}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="Enter your password"
                    placeholderTextColor="#5f6470"
                    secureTextEntry={!showPassword}
                    className={[
                      "auth-input pr-12", // ← نسيب مساحة لليمين عشان الأيقونة
                      showPasswordError ? "auth-input-error" : "",
                    ].join(" ")}
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-0 bottom-0 justify-center"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#5f6470"
                    />
                  </TouchableOpacity>
                </View>

                {showPasswordError ? (
                  <Text className="auth-error">{passwordError}</Text>
                ) : null}
              </View>

              {error ? <Text className="auth-error">{error}</Text> : null}

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!canSubmit}
                className={[
                  "auth-button",
                  !canSubmit ? "auth-button-disabled" : "",
                ].join(" ")}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#081126" />
                ) : (
                  <Text className="auth-button-text">Sign in</Text>
                )}
              </TouchableOpacity>

              <View className="auth-link-row">
                <Text className="auth-link-copy">New to Recurlly?</Text>
                <Link href="/(auth)/sign-up" asChild>
                  <Text className="auth-link">Create an account</Text>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
