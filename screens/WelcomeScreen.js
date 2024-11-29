import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalStyles } from '../styles/globalStyles';

export default function WelcomeScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Bem-vindo ao Rotina+</Text>

      <Button
        mode="contained"
        icon="account-group"
        onPress={openModal}
        style={styles.button}
      >
        Gerenciar Alunos
      </Button>

      <Button
        mode="contained"
        icon="dumbbell"
        onPress={() => navigation.navigate('ExerciseLog')}
        style={styles.button}
      >
        Registro de Exercícios
      </Button>

      <Button
        mode="contained"
        icon="cash"
        onPress={() => navigation.navigate('FinancialManagement')}
        style={styles.button}
      >
        Gerenciamento Financeiro
      </Button>

      {/* Modal para opções de Cadastro de Alunos */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Escolha uma Opção</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                closeModal();
                navigation.navigate('StudentRegistration');
              }}
            >
              <Text style={styles.modalButtonText}>Novo Aluno</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                closeModal();
                navigation.navigate('StudentManagement');
              }}
            >
              <Text style={styles.modalButtonText}>Gerenciar Alunos Cadastrados</Text>
            </TouchableOpacity>
            <Button onPress={closeModal} style={styles.closeButton}>
              Fechar
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
  },
});
