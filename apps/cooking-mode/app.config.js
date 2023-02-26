module.exports = {
  expo: {
    expo: {
      name: "cooking-mode",
      slug: "cooking-mode",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      extra: { CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY },
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
      },
      web: {
        favicon: "./assets/favicon.png",
      },
    },
  },
};
