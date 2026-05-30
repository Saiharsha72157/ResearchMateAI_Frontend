import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  CommonActions,
  useNavigation,
} from "@react-navigation/native";

import { useState } from "react";
import { useTranslation, setCurrentLanguage } from "../services/localization";
import { useAppTheme } from "../services/ThemeContext";
import { useAuth } from "../services/AuthContext";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const { darkMode, setDarkMode, themeColors } = useAppTheme();
  const { user, logout: contextLogout } = useAuth();
  const isDark = darkMode;

  const logout = async () => {
    await contextLogout();
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.header, { color: themeColors.text }]}>
          {t("profile_header")}
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              RS
            </Text>
          </View>

          <Text style={styles.name}>
            {user?.username || "Researcher"}
          </Text>

          <Text style={styles.phone}>
            {user?.mobile ? `+91 ${user.mobile}` : user?.email || "No details"}
          </Text>

        </View>

        <Text style={[styles.sectionTitle, { color: themeColors.title }]}>
          {t("preferences")}
        </Text>

        <View style={[styles.sectionCard, { backgroundColor: themeColors.card }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="moon-outline"
                size={22}
                color="#6366F1"
              />

              <Text style={[styles.rowText, { color: themeColors.text }]}>
                {t("dark_mode")}
              </Text>

            </View>

            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#D1D5DB", true: "#818CF8" }}
              thumbColor={darkMode ? "#6366F1" : "#F4F3F4"}
            />

          </View>

        </View>

        <Text style={[styles.sectionTitle, { color: themeColors.title }]}>
          {t("quick_actions")}
        </Text>

        <View style={[styles.actionCard, { backgroundColor: themeColors.card }]}>
          <TouchableOpacity style={[styles.actionRow, { borderBottomColor: themeColors.border }]}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="person-outline"
                size={22}
                color="#6C3EF4"
              />

              <Text style={[styles.rowText, { color: themeColors.text }]}>
                {t("edit_profile")}
              </Text>

            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#9CA3AF" : "#9CA3AF"}
            />

          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionRow, { borderBottomColor: themeColors.border }]}
            onPress={() => navigation.navigate("LanguageSettings")}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="language-outline"
                size={22}
                color="#8B5CF6"
              />

              <Text style={[styles.rowText, { color: themeColors.text }]}>
                {t("language")}
              </Text>

            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#9CA3AF" : "#9CA3AF"}
            />

          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionRow, { borderBottomColor: themeColors.border }]}
            onPress={() => navigation.navigate("HelpSupport")}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="help-circle-outline"
                size={22}
                color="#F59E0B"
              />

              <Text style={[styles.rowText, { color: themeColors.text }]}>
                {t("help_support")}
              </Text>

            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#9CA3AF" : "#9CA3AF"}
            />

          </TouchableOpacity>

        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#fff"
          />

          <Text style={styles.logoutText}>
            {t("logout")}
          </Text>

        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F3F1FF",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 24,
  },

  profileCard: {
    backgroundColor: "#6C3EF4",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  avatarText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#6C3EF4",
  },

  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },

  phone: {
    color: "#E9D5FF",
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 18,
  },

  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginBottom: 30,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowText: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 26,
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  logoutButton: {
    backgroundColor: "#EF4444",
    borderRadius: 20,
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 40,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 17,
  },

  // Premium Modal & Settings styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  settingsGroup: {
    marginBottom: 20,
  },
  settingsGroupTitle: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  langGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  langButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  cacheContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  cacheText: {
    fontSize: 14,
    fontWeight: "500",
  },
  clearCacheBtn: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  clearCacheText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  faqCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  formInput: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  typeSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  typeBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  detailsCloseBtn: {
    backgroundColor: "#6C3EF4",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  detailsCloseBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

});