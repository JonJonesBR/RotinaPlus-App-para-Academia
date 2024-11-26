import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { WebView } from 'react-native-webview';

export default function YouTubeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={styles.container}>
      {loading && !error && (
        <ActivityIndicator
          size="large"
          style={styles.loading}
          animating={true}
          color="#3498db"
        />
      )}
      {error && (
        <Text style={styles.errorText}>
          Ocorreu um erro ao carregar o YouTube. Por favor, tente novamente mais tarde.
        </Text>
      )}
      <WebView
        source={{ uri: 'https://www.youtube.com' }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  webview: {
    flex: 1,
  },
  errorText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -50 }],
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
