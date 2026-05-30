import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "../services/localization";
import { useAppTheme } from "../services/ThemeContext";
import { useAuth } from "../services/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { darkMode, themeColors } = useAppTheme();
  const { login, resetPassword } = useAuth();
  const isDark = darkMode;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      // AuthContext will handle navigation via AppNavigator
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert(
        "Enter Email First",
        "Please type your email address in the input box below first, then tap 'Forgot Password?' to receive your reset link."
      );
      return;
    }

    Alert.alert(
      "Reset Password",
      `Would you like to send a password reset link to ${email.trim()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Link",
          onPress: async () => {
            try {
              setLoading(true);
              await resetPassword(email.trim());
              Alert.alert(
                "Reset Link Sent",
                "A password reset link has been sent to your email. Please check your inbox (and spam folder)."
              );
            } catch (err: any) {
              Alert.alert("Reset Failed", err.message || "Could not send reset link.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      >
        <View style={styles.formCard}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="bulb-outline" size={36} color="#fff" />
            </View>
            <Text style={[styles.logoText, { color: themeColors.primary }]}>
              ResearchMate AI
            </Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: themeColors.text }]}>
              {t("welcome_back")}
            </Text>
            <Text style={[styles.subtitle, { color: themeColors.subText }]}>
              Sign in with your email address
            </Text>
          </View>

          <View style={styles.form}>
            {/* Email Input */}
            <View style={[
              styles.inputContainer,
              { backgroundColor: themeColors.card },
            ]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={themeColors.subText}
                style={styles.icon}
              />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={[styles.input, { color: themeColors.text }, Platform.OS === "web" && (styles as any).inputWeb]}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            {/* Password Input */}
            <View style={[
              styles.inputContainer,
              { backgroundColor: themeColors.card },
            ]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={themeColors.subText}
                style={styles.icon}
              />
              <TextInput
                ref={passwordRef}
                placeholder="Password"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[styles.input, { color: themeColors.text }, Platform.OS === "web" && (styles as any).inputWeb]}
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword} disabled={loading}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.8 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>


            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: themeColors.subText }]}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "web" ? 0 : 60,
    paddingBottom: 40,
    alignItems: Platform.OS === "web" ? "center" : undefined,
    justifyContent: Platform.OS === "web" ? "center" : undefined,
    minHeight: Platform.OS === "web" ? ("100vh" as any) : undefined,
  },
  formCard: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 460 : undefined,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: "#6C3EF4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#6C3EF4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  logoText: {
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  textContainer: {
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
  },

  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 17,
    fontSize: 15,
  },
  // Web-only: removes the browser's default blue outline on <input>
  inputWeb: {
    outlineWidth: 0,
    outlineStyle: "none",
  } as any,
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 22,
  },
  forgotPasswordText: {
    color: "#6C3EF4",
    fontWeight: "600",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#6C3EF4",
    paddingVertical: 17,
    borderRadius: 16,
    marginBottom: 28,
    shadowColor: "#6C3EF4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#6C3EF4",
  },
});