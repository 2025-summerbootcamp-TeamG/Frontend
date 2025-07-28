module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    "nativewind/babel",
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
      },
    ],
    "react-native-worklets/plugin",
    "@babel/plugin-transform-typescript",
    [
      "@babel/plugin-transform-runtime",
      {
        useESModules: true,
      },
    ],
  ],
};
