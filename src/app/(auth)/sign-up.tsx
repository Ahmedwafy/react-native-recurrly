import { useAuth, useClerk, useSignUp } from "@clerk/expo";
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

const SignUp = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp } = useSignUp();
  const { setActive } = useClerk();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");

  // Touched states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

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
      return "Create a password.";
    }

    return password.length >= 8 ? "" : "Use at least 8 characters.";
  }, [password]);

  const confirmPasswordError = useMemo(() => {
    if (!confirmPassword) {
      return "Confirm your password.";
    }

    return confirmPassword === password ? "" : "Passwords do not match.";
  }, [confirmPassword, password]);

  // Show errors only after the user interacted with the field
  const showEmailError = emailTouched && !!emailError;
  const showPasswordError = passwordTouched && !!passwordError;
  const showConfirmPasswordError =
    confirmPasswordTouched && !!confirmPasswordError;

  const canSubmit =
    !isSubmitting &&
    email.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError;

  const handleSignUp = async () => {
    if (!signUp || !canSubmit) {
      setError("Please check your details and try again.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { error: createError } = await signUp.create({
        emailAddress: email.trim(),
        password,
      });

      if (createError) {
        setError(createError.message || "We could not create your account.");
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();

      if (sendError) {
        setError(
          sendError.message || "We could not send your verification code.",
        );
        return;
      }

      setIsVerifying(true);
    } catch (err: any) {
      setError(
        err?.errors?.[0]?.message || "We could not create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!signUp || !setActive) {
      setError("Verification is not available right now.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode(
        {
          code: verificationCode.trim(),
        },
      );

      if (verifyError) {
        setError(
          verifyError.message || "That code is invalid. Please try again.",
        );
        return;
      }

      const { error: finalizeError } = await signUp.finalize();

      if (finalizeError) {
        setError(
          finalizeError.message || "We could not finish creating your account.",
        );
        return;
      }

      if (signUp.createdSessionId) {
        await setActive({ session: signUp.createdSessionId });
        router.replace("/(tabs)");
        return;
      }

      setError(
        "Your account was created, but we could not start your session.",
      );
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "We could not verify your email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!signUp || isResendingCode || resendCooldown > 0) {
      return;
    }

    setError("");
    setIsResendingCode(true);

    try {
      const { error: resendError } = await signUp.verifications.sendEmailCode();

      if (resendError) {
        setError(
          resendError.message || "We could not resend your verification code.",
        );
        return;
      }

      setVerificationCode("");
      setResendCooldown(30);
    } catch (err: any) {
      setError(
        err?.errors?.[0]?.message ||
          "We could not resend your verification code.",
      );
    } finally {
      setIsResendingCode(false);
    }
  };

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setResendCooldown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

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

          {!isVerifying ? (
            <>
              <Text className="auth-title mt-8 text-center">
                Create your account
              </Text>
              <Text className="auth-subtitle mt-2 text-center">
                Keep every subscription and renewal in one place.
              </Text>

              <View className="auth-card">
                <View className="auth-form">
                  {/* Email */}
                  <View className="auth-field">
                    <Text className="auth-label">Email</Text>
                    <TextInput
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        setEmailTouched(true);
                      }}
                      onBlur={() => setEmailTouched(true)}
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
                        placeholder="Create a password"
                        placeholderTextColor="#5f6470"
                        secureTextEntry={!showPassword}
                        className={[
                          "auth-input pr-12",
                          showPasswordError ? "auth-input-error" : "",
                        ].join(" ")}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword((value) => !value)}
                        className="absolute right-4 top-0 bottom-0 justify-center"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={22}
                          color="#5f6470"
                        />
                      </TouchableOpacity>
                    </View>
                    {showPasswordError ? (
                      <Text className="auth-error">{passwordError}</Text>
                    ) : null}
                  </View>

                  {/* Confirm Password */}
                  <View className="auth-field">
                    <Text className="auth-label">Confirm password</Text>
                    <View className="relative">
                      <TextInput
                        value={confirmPassword}
                        onChangeText={(text) => {
                          setConfirmPassword(text);
                          setConfirmPasswordTouched(true);
                        }}
                        onBlur={() => setConfirmPasswordTouched(true)}
                        placeholder="Confirm your password"
                        placeholderTextColor="#5f6470"
                        secureTextEntry={!showConfirmPassword}
                        className={[
                          "auth-input pr-12",
                          showConfirmPasswordError ? "auth-input-error" : "",
                        ].join(" ")}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        className="absolute right-4 top-0 bottom-0 justify-center"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons
                          name={
                            showConfirmPassword
                              ? "eye-off-outline"
                              : "eye-outline"
                          }
                          size={22}
                          color="#5f6470"
                        />
                      </TouchableOpacity>
                    </View>
                    {showConfirmPasswordError ? (
                      <Text className="auth-error">{confirmPasswordError}</Text>
                    ) : null}
                  </View>

                  {error ? <Text className="auth-error">{error}</Text> : null}

                  <TouchableOpacity
                    onPress={handleSignUp}
                    disabled={!canSubmit}
                    className={[
                      "auth-button",
                      !canSubmit ? "auth-button-disabled" : "",
                    ].join(" ")}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Create account</Text>
                    )}
                  </TouchableOpacity>

                  <View className="auth-link-row">
                    <Text className="auth-link-copy">
                      Already have an account?
                    </Text>
                    <Link href="/(auth)/sign-in" asChild>
                      <Text className="auth-link">Sign in</Text>
                    </Link>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View className="auth-card mt-8">
              <View className="auth-form">
                <Text className="auth-title text-center">
                  Verify your email
                </Text>
                <Text className="auth-subtitle mt-2 text-center">
                  We sent a 6-digit code to {email}
                </Text>

                <View className="auth-field">
                  <Text className="auth-label">Verification code</Text>
                  <TextInput
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="#5f6470"
                    keyboardType="number-pad"
                    maxLength={6}
                    className={[
                      "auth-input",
                      error ? "auth-input-error" : "",
                    ].join(" ")}
                  />
                </View>

                {error ? <Text className="auth-error">{error}</Text> : null}

                <TouchableOpacity
                  onPress={handleVerify}
                  disabled={isSubmitting || verificationCode.trim().length < 6}
                  className={[
                    "auth-button",
                    isSubmitting || verificationCode.trim().length < 6
                      ? "auth-button-disabled"
                      : "",
                  ].join(" ")}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Verify email</Text>
                  )}
                </TouchableOpacity>

                <View className="auth-link-row">
                  <Text className="auth-link-copy">
                    Didn’t receive the code?
                  </Text>
                  <TouchableOpacity
                    onPress={handleResendCode}
                    disabled={isResendingCode || resendCooldown > 0}
                  >
                    <Text className="auth-link">
                      {isResendingCode
                        ? "Sending..."
                        : resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : "Resend code"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => setIsVerifying(false)}
                  className="auth-secondary-button"
                >
                  <Text className="auth-secondary-button-text">
                    Edit details
                  </Text>
                </TouchableOpacity>

                <Link href="/(auth)/sign-in" asChild>
                  <Text className="auth-link text-center">Back to sign in</Text>
                </Link>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
