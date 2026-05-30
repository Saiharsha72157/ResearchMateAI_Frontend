import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import React, { useCallback } from "react";

import { useTranslation } from "../services/localization";

import { useAppTheme } from "../services/ThemeContext";

export default function DashboardScreen() {

  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { themeColors } = useAppTheme();

  const features = [
    {
      title: t("title_generator"),
      subtitle: t("generate_topics_desc"),
      icon: "bulb-outline",
      screen: "TitleGenerator",
      type: "stack",
      color: "#6C3EF4",
    },

    {
      title: t("datasets"),
      subtitle: t("explore_datasets"),
      icon: "server-outline",
      screen: "Datasets",
      type: "tab",
      color: "#06B6D4",
    },

    {
      title: t("analysis"),
      subtitle: t("analyze_csv_desc"),
      icon: "analytics-outline",
      screen: "Analysis",
      type: "tab",
      color: "#22C55E",
    },

    {
      title: t("tools"),
      subtitle: t("rewrite_content"),
      icon: "create-outline",
      screen: "Tools",
      type: "tab",
      color: "#EC4899",
    },
  ];

  const handleNavigate = useCallback((screenName: string, isTab: boolean = false, nestedScreen?: string) => {
    try {
      console.log(`[DashboardScreen] Navigating to: ${screenName}, isTab: ${isTab}, nestedScreen: ${nestedScreen}`);
      if (!navigation) {
        console.warn("[DashboardScreen] Navigation reference is missing!");
        return;
      }
      
      if (isTab) {
        navigation.navigate(screenName, {
          screen: nestedScreen,
        });
      } else {
        navigation.navigate(screenName);
      }
    } catch (err) {
      console.error(`[DashboardScreen] Central navigation failed to ${screenName}:`, err);
      Alert.alert("Navigation Error", "Failed to load the selected screen. Please try again.");
    }
  }, [navigation]);

  return (

    <View style={[styles.container, { backgroundColor: themeColors.background }]}>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>

          <View>
            <Text style={[styles.welcome, { color: themeColors.subText }]}>
              {t("welcome_back")}
            </Text>
            <Text style={[styles.name, { color: themeColors.text }]}>
              ResearchMate AI
            </Text>
          </View>

        </View>

        <View style={styles.banner}>

          <View style={styles.bannerContent}>

            <Text style={styles.bannerTitle}>
              {t("ai_research_assistant")}
            </Text>

            <Text style={styles.bannerSubtitle}>
              {t("smart_tools_desc")}
            </Text>

          </View>

          <Ionicons
            name="sparkles-outline"
            size={60}
            color="#fff"
          />

        </View>

        <Text style={[styles.sectionTitle, { color: themeColors.title }]}>
          {t("quick_access")}
        </Text>

        <View style={styles.grid}>

          {features.map((item, index) => (

            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: themeColors.card }]}
              onPress={() => {

                if (item.type === "tab") {

                  handleNavigate("MainApp", true, item.screen);

                } else {

                  handleNavigate(item.screen);

                }

              }}
            >

              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: item.color },
                ]}
              >

                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color="#fff"
                />

              </View>

              <Text style={[styles.cardTitle, { color: themeColors.text }]}>
                {item.title}
              </Text>

              <Text style={[styles.cardSubtitle, { color: themeColors.subText }]}>
                {item.subtitle}
              </Text>

            </TouchableOpacity>

          ))}

        </View>

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  welcome: {
    fontSize: 16,
    color: "#6B7280",
  },

  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 6,
  },



  banner: {
    backgroundColor: "#6C3EF4",
    borderRadius: 30,
    padding: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 34,
  },

  bannerContent: {
    flex: 1,
  },

  bannerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  bannerSubtitle: {
    color: "#E9D5FF",
    fontSize: 16,
    lineHeight: 24,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 22,
    marginBottom: 18,
  },

  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },

  cardSubtitle: {
    color: "#6B7280",
    lineHeight: 22,
  },

});