import React, { useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

export default function SplashScreen() {

  const navigation = useNavigation<any>();

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(() => {
      try {
        console.log("[SplashScreen] Navigating to Language screen");
        if (isMounted && navigation) {
          navigation.replace("Language");
        }
      } catch (err) {
        console.error("[SplashScreen] Navigation replace failed:", err);
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [navigation]);

  return (

    <View style={styles.container}>

      <View style={styles.logoCircle}>

        <Ionicons
          name="bulb-outline"
          size={60}
          color="#fff"
        />

      </View>

      <Text style={styles.title}>
        ResearchMate AI
      </Text>

      <Text style={styles.subtitle}>
        Smart AI Research Assistant
      </Text>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F3F1FF",
    justifyContent: "center",
    alignItems: "center",
  },

  logoCircle: {
    width: 130,
    height: 130,
    borderRadius: 30,
    backgroundColor: "#6C3EF4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 17,
    color: "#6B7280",
  },

});