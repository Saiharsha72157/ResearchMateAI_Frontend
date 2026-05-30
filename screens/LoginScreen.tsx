import React, { useState } from "react";
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

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Google authentication is simulated for now.");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}
        showsVerticalScrollIndicator={false}
      >
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
          <View style={[styles.inputContainer, { backgroundColor: themeColors.card }]}>
            <Ionicons name="mail-outline" size={24} color={themeColors.subText} style={styles.icon} />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={[styles.input, { color: themeColors.text }]}
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: themeColors.card }]}>
            <Ionicons name="lock-closed-outline" size={24} color={themeColors.subText} style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[styles.input, { color: themeColors.text }]}
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

          <View style={styles.dividerContainer}>
            <View style={[styles.line, { backgroundColor: themeColors.border }]} />
            <Text style={styles.orText}>{t("or")}</Text>
            <View style={[styles.line, { backgroundColor: themeColors.border }]} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, { backgroundColor: themeColors.card }]}
            onPress={handleGoogleLogin}
          >
            <Ionicons name="logo-google" size={24} color="#EA4335" />
            <Text style={[styles.googleText, { color: themeColors.text }]}>
              {t("continue_google")}
            </Text>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: "#6C3EF4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  textContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    marginBottom: 20,
    paddingHorizontal: 16,
    elevation: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#6C3EF4",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#6C3EF4",
    paddingVertical: 18,
    borderRadius: 18,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 16,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  googleButton: {
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    marginBottom: 30,
  },
  googleText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
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