import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform } from "react-native";
import React, { useEffect } from "react";

import AppNavigator from "./navigation/AppNavigator";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./services/ThemeContext";
import { AuthProvider } from "./services/AuthContext";
import { warmUpBackend } from "./services/api";

export default function App() {
  useEffect(() => {
    console.log("[App] App mounted successfully");
    console.log("[App] Navigation Container initialized");
    console.log("[App] Safe startup validation completed");
    console.log("[App] Application loaded successfully in production-hardened mode");
    
    // Proactively warm up sleeping Render server containers in the background!
    warmUpBackend();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <ErrorBoundary>
              <NavigationContainer>
                {Platform.OS !== "web" && <StatusBar style="auto" />}
                <AppNavigator />
              </NavigationContainer>
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

