module.exports = {
  expo: {
    name: "inertiion",
    slug: "inertiion",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    extra: {
      API_URL: process.env.API_URL,
      eas: {
        projectId: "e2246684-a24b-4574-a761-7069c2291cb0",
      },
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.ozahnitko.inertiion",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};
