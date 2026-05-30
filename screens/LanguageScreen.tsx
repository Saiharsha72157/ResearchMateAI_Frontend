import { useNavigation } from "@react-navigation/native";

import React, { useState, useCallback } from "react";

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

import { setCurrentLanguage } from "../services/localization";
import { useAppTheme } from "../services/ThemeContext";


export default function LanguageScreen() {

  const navigation = useNavigation<any>();
  const { themeColors } = useAppTheme();

  const [selected, setSelected] = useState(1);

  const languages = [
    { id: 1, name: "English", sub: "English", icon: "E" },
    { id: 2, name: "हिंदी", sub: "Hindi", icon: "ह" },
    { id: 3, name: "తెలుగు", sub: "Telugu", icon: "త" },
    { id: 4, name: "தமிழ்", sub: "Tamil", icon: "த" },
    { id: 5, name: "മലയാളം", sub: "Malayalam", icon: "മ" },
  ];

  const handleContinue = useCallback(() => {
    try {
      console.log("[LanguageScreen] Selected language ID:", selected);
      const selectedLang = languages.find((lang) => lang.id === selected);
      if (selectedLang) {
        console.log("[LanguageScreen] Setting active language:", selectedLang.sub);
        setCurrentLanguage(selectedLang.sub);
      } else {
        console.warn("[LanguageScreen] No language matching the selection found");
      }

      if (navigation) {
        console.log("[LanguageScreen] Navigating to OnboardingOne");
        navigation.navigate("OnboardingOne");
      } else {
        console.error("[LanguageScreen] Navigation object is undefined");
        Alert.alert("Error", "Navigation failed. Please restart the app.");
      }
    } catch (err) {
      console.error("[LanguageScreen] Error during language selection transition:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  }, [selected, navigation]);

  return (

    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>

      <View style={styles.header}>

        <Text style={styles.title}>
          Choose Your Language
        </Text>

      </View>

      <Text style={[styles.subtitle, { color: themeColors.subText }]}>
        Select your preferred language to continue
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>

        {Array.isArray(languages) && languages.map((item) => (

          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: themeColors.card }]}
            onPress={() => setSelected(item.id)}
          >

            <View style={styles.leftSection}>

              <View style={styles.iconCircle}>

                <Text style={styles.iconText}>
                  {item.icon}
                </Text>

              </View>

              <View>

                <Text style={[styles.languageText, { color: themeColors.text }]}>
                  {item.name}
                </Text>

                <Text style={[styles.subText, { color: themeColors.subText }]}>
                  {item.sub}
                </Text>

              </View>

            </View>

            <View
              style={[
                styles.radio,
                { borderColor: themeColors.border },
                selected === item.id && { backgroundColor: themeColors.primary, borderColor: themeColors.primary },
              ]}
            />

          </TouchableOpacity>

        ))}

      </ScrollView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeColors.primary }]}
        onPress={handleContinue}
      >

        <Text style={styles.buttonText}>
          Continue
        </Text>

      </TouchableOpacity>

    </SafeAreaView>

  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ECEBFA",
    padding: 20,
  },

  header: {
    backgroundColor: "#6C3EF4",
    paddingVertical: 30,
    borderRadius: 16,
    marginTop: 20,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6C3EF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  iconText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  languageText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
  },

  subText: {
    color: "#777",
    marginTop: 2,
  },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
  },

  radioSelected: {
    backgroundColor: "#6C3EF4",
    borderColor: "#6C3EF4",
  },

  button: {
    backgroundColor: "#6C3EF4",
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

});