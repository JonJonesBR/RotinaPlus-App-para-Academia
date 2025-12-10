/**
 * WelcomeScreen - Tela inicial premium do RotinaPlus
 * 
 * Features:
 * - Design moderno e profissional
 * - Cards de ação com ícones
 * - Stats resumidos
 * - Toggle de tema
 * - Modal redesenhado
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme/ThemeContext';
import {
  PremiumCard,
  PremiumButton,
  ThemeToggle,
  SectionHeader,
} from '../components/common';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const { colors, styles: globalStyles, isDark, spacing, borderRadius } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stats, setStats] = useState({ students: 0, series: 0 });

  // Animações
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadStats();
    startAnimations();
  }, []);

  // Recarrega stats quando a tela recebe foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStats();
    });
    return unsubscribe;
  }, [navigation]);

  const loadStats = async () => {
    try {
      const [studentsData, plansData] = await Promise.all([
        AsyncStorage.getItem('@students'),
        AsyncStorage.getItem('@customPlans'),
      ]);

      setStats({
        students: studentsData ? JSON.parse(studentsData).length : 0,
        series: plansData ? JSON.parse(plansData).length : 0,
      });
    } catch (error) {
      console.warn('Erro ao carregar estatísticas:', error);
    }
  };

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleNavigate = (screen, params = {}) => {
    closeModal();
    navigation.navigate(screen, params);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: colors.text.secondary }]}>
                Bem-vindo ao
              </Text>
              <Text style={[styles.appName, { color: colors.text.primary }]}>
                Rotina<Text style={{ color: colors.primary }}>+</Text>
              </Text>
            </View>
            <ThemeToggle size="md" />
          </View>

          <Text style={[styles.tagline, { color: colors.text.secondary }]}>
            Gerencie seus alunos e treinos de forma profissional
          </Text>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <PremiumCard
            style={[styles.statCard, { borderLeftColor: colors.primary, borderLeftWidth: 4 }]}
            padding="md"
          >
            <View style={styles.statContent}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.primarySurface }]}>
                <Icon name="people" size={24} color={colors.primary} />
              </View>
              <View style={styles.statInfo}>
                <Text style={[styles.statNumber, { color: colors.text.primary }]}>
                  {stats.students}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  Alunos
                </Text>
              </View>
            </View>
          </PremiumCard>

          <PremiumCard
            style={[styles.statCard, { borderLeftColor: colors.secondary, borderLeftWidth: 4 }]}
            padding="md"
          >
            <View style={styles.statContent}>
              <View style={[styles.statIconContainer, { backgroundColor: isDark ? '#1E3A5F' : '#DBEAFE' }]}>
                <Icon name="fitness-center" size={24} color={colors.secondary} />
              </View>
              <View style={styles.statInfo}>
                <Text style={[styles.statNumber, { color: colors.text.primary }]}>
                  {stats.series}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  Séries
                </Text>
              </View>
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Menu Section */}
        <SectionHeader title="Menu Principal" icon="apps" />

        {/* Action Cards */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <PremiumCard
            onPress={openModal}
            style={styles.actionCard}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primarySurface }]}>
                <Icon name="group" size={28} color={colors.primary} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, { color: colors.text.primary }]}>
                  Gerenciar Alunos
                </Text>
                <Text style={[styles.actionDescription, { color: colors.text.secondary }]}>
                  Cadastre e gerencie seus alunos
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color={colors.text.disabled} />
            </View>
          </PremiumCard>

          <PremiumCard
            onPress={() => navigation.navigate('ExerciseLog')}
            style={styles.actionCard}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: isDark ? '#1E3A5F' : '#DBEAFE' }]}>
                <Icon name="fitness-center" size={28} color={colors.secondary} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, { color: colors.text.primary }]}>
                  Registro de Exercícios
                </Text>
                <Text style={[styles.actionDescription, { color: colors.text.secondary }]}>
                  Crie e gerencie séries de treino
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color={colors.text.disabled} />
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Quick Tips */}
        <SectionHeader title="Dica Rápida" icon="lightbulb" />

        <PremiumCard
          variant="outlined"
          style={[styles.tipCard, { borderColor: colors.accent }]}
        >
          <View style={styles.tipContent}>
            <Icon name="tips-and-updates" size={20} color={colors.accent} />
            <Text style={[styles.tipText, { color: colors.text.secondary }]}>
              Cadastre um aluno primeiro, depois vincule séries de exercícios personalizadas!
            </Text>
          </View>
        </PremiumCard>
      </ScrollView>

      {/* Modal Premium */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                Gerenciar Alunos
              </Text>
              <PremiumButton
                icon="close"
                variant="ghost"
                size="sm"
                onPress={closeModal}
                style={styles.closeButton}
                title=""
              />
            </View>

            <Text style={[styles.modalSubtitle, { color: colors.text.secondary }]}>
              O que você deseja fazer?
            </Text>

            <View style={styles.modalActions}>
              <PremiumButton
                title="Novo Aluno"
                icon="person-add"
                variant="primary"
                fullWidth
                onPress={() => handleNavigate('StudentRegistration')}
                style={styles.modalButton}
              />

              <PremiumButton
                title="Alunos Cadastrados"
                icon="people"
                variant="outline"
                fullWidth
                onPress={() => handleNavigate('StudentManagement')}
                style={styles.modalButton}
              />
            </View>

            <PremiumButton
              title="Cancelar"
              variant="ghost"
              onPress={closeModal}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 48,
  },

  // Header
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    lineHeight: 22,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    marginBottom: 0,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Action Cards
  actionCard: {
    marginBottom: 12,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
  },

  // Tip Card
  tipCard: {
    marginBottom: 32,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeButton: {
    marginRight: -8,
  },
  modalSubtitle: {
    fontSize: 15,
    marginBottom: 24,
  },
  modalActions: {
    gap: 12,
  },
  modalButton: {
    marginBottom: 0,
  },
  cancelButton: {
    marginTop: 16,
  },
});
