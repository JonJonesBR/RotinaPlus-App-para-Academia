/**
 * Configuração do Babel para o projeto Expo.
 * Inclui o preset do Expo e o plugin do react-native-reanimated.
 */
module.exports = function(api) {
  // Habilita o cache do Babel para melhorar o desempenho
  api.cache(true);
  return {
    // Presets do Babel
    presets: [
      'babel-preset-expo' // Preset do Expo
    ],
    // Plugins do Babel
    plugins: [
      'react-native-reanimated/plugin' // Plugin do react-native-reanimated
    ]
  };
};
