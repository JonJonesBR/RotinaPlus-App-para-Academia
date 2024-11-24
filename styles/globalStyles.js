import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  white: '#fff',
  black: '#000',
  gray: '#7f8c8d',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    marginLeft: 10,
  },

});
