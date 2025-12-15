module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Temporarily commented out until worklets is properly configured
      // 'react-native-reanimated/plugin',
    ],
  };
};
