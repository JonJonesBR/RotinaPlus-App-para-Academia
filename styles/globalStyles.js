import { StyleSheet } from 'react-native';

// Cores globais
export const colors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  white: '#fff',
  black: '#000',
  gray: '#7f8c8d',
};

// Estilos globais
export const globalStyles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  // Título principal
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  // Estilo de botão
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginTop: 10,
  },
  // Texto do botão
  buttonText: {
    color: colors.white,
    fontSize: 18,
    marginLeft: 10,
  },
  // Estilo de texto padrão
  text: {
    fontSize: 16,
    color: colors.black,
  },
  // Estilo de entrada de texto
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  // Estilo de cabeçalho
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  // Estilo de subtítulo
  subtitle: {
    fontSize: 18,
    color: colors.secondary,
    marginBottom: 10,
  },
  // Estilo de lista
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  // Estilo de texto da lista
  listText: {
    fontSize: 16,
    color: colors.black,
  },
});
