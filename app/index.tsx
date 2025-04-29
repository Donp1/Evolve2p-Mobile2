import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useLoadingStore } from "@/context";

const Index = () => {

  const [loaded, error] = useFonts({
    urbanist: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();

  useEffect(() => {
    const tiemout = setTimeout(() => {
      router.replace("/welcome");
    }, 3000);

    return () => clearTimeout(tiemout);


  }, []);
  return (
    <View style={styles.container}>
      <SplashScreen />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
