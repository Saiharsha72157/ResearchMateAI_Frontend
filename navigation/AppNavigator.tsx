import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../services/AuthContext";

import SplashScreen from "../screens/SplashScreen";
import LanguageScreen from "../screens/LanguageScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import OnboardingOne from "../screens/OnboardingOne";
import OnboardingThree from "../screens/OnboardingThree";
import OnboardingTwo from "../screens/OnboardingTwo";
import TitleGeneratorScreen from "../screens/TitleGeneratorScreen";
import LanguageSettingsScreen from "../screens/LanguageSettingsScreen";
import HelpSupportScreen from "../screens/HelpSupportScreen";

import BottomTabs from "./BottomTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        // Auth Stack
        <>
          <Stack.Screen name="Language" component={LanguageScreen} />
          <Stack.Screen name="OnboardingOne" component={OnboardingOne} />
          <Stack.Screen name="OnboardingTwo" component={OnboardingTwo} />
          <Stack.Screen name="OnboardingThree" component={OnboardingThree} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen name="MainApp" component={BottomTabs} />
          <Stack.Screen name="TitleGenerator" component={TitleGeneratorScreen} />
          <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}