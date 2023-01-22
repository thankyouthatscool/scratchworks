module.exports = {
  expo: {
    name: "controllarr",
    slug: "controllarr",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    extra: {
      API_URL: process.env.API_URL,
      "CF-Access-Client-Id": process.env["CF-Access-Client-Id"],
      "CF-Access-Client-Secret": process.env["CF-Access-Client-Secret"],
      eas: {
        projectId: "18f23632-a900-4e7a-ac67-4ea4432c1673",
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
      package: "com.ozahnitko.controllarr",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};
