const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Support complet pour .mjs et .cjs
config.resolver.sourceExts.push("mjs", "cjs");

// Transformer les modules node_modules problématiques
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

module.exports = withNativeWind(config, { input: "./global.css" });
