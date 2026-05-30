import React, { useState, useRef } from "react";
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
import { useAppTheme } from "../services/ThemeContext";
import { useAuth } from "../services/AuthContext";

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const { darkMode, themeColors } = useAppTheme();
  const { register } = useAuth();
  const isDark = darkMode;

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const mobileRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleSignup = async () => {
    if (!email || !mobile || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    if (mobile.replace(/[^0-9]/g, "").length !== 10) {
      Alert.alert("Invalid Mobile", "Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      await register(email.trim(), mobile.trim(), password);
      Alert.alert("Success", "Account created successfully. You can now log in.");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
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
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeColors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: themeColors.subText }]}>
              Sign up to get started with ResearchMate AI
            </Text>
          </View>

          <View style={styles.form}>
            <View style={[styles.inputContainer, { backgroundColor: themeColors.card }]}>
              <Ionicons name="mail-outline" size={20} color={themeColors.subText} style={styles.icon} />
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
                onSubmitEditing={() => mobileRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: themeColors.card }]}>
              <Ionicons name="call-outline" size={20} color={themeColors.subText} style={styles.icon} />
              <TextInput
                ref={mobileRef}
                placeholder="Mobile Number"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={10}
                style={[styles.input, { color: themeColors.text }, Platform.OS === "web" && (styles as any).inputWeb]}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: themeColors.card }]}>
              <Ionicons name="lock-closed-outline" size={20} color={themeColors.subText} style={styles.icon} />
              <TextInput
                ref={passwordRef}
                placeholder="Password"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[styles.input, { color: themeColors.text }, Platform.OS === "web" && (styles as any).inputWeb]}
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: themeColors.card }]}>
              <Ionicons name="lock-closed-outline" size={20} color={themeColors.subText} style={styles.icon} />
              <TextInput
                ref={confirmPasswordRef}
                placeholder="Confirm Password"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={[styles.input, { color: themeColors.text }, Platform.OS === "web" && (styles as any).inputWeb]}
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSignup}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.8 }]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: themeColors.subText }]}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.footerLink}>Login</Text>
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
    paddingTop: Platform.OS === "web" ? 0 : 80,
    paddingBottom: 40,
    alignItems: Platform.OS === "web" ? "center" : undefined,
    justifyContent: Platform.OS === "web" ? "center" : undefined,
    minHeight: Platform.OS === "web" ? ("100vh" as any) : undefined,
  },
  formCard: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 460 : undefined,
  },
  header: {
    marginBottom: 40,
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
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  inputWeb: {
    outlineWidth: 0,
    outlineStyle: "none",
  } as any,
  button: {
    backgroundColor: "#6C3EF4",
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 10,
    marginBottom: 24,
    shadowColor: "#6C3EF4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
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
