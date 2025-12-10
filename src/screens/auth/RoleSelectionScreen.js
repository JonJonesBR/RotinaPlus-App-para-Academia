/**
 * RoleSelectionScreen - Tela de seleção de papel (Professor/Aluno)
 * 
 * Primeira tela exibida ao usuário não autenticado
 */
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Pressable,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { UserRole } from '../../models/dataModels';

const { width } = Dimensions.get('window');

export default function RoleSelectionScreen({ navigation }) {
    const { colors, isDark, shadows } = useTheme();

    // Animações
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const professorScale = useRef(new Animated.Value(0.8)).current;
    const alunoScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
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
            Animated.spring(professorScale, {
                toValue: 1,
                delay: 200,
                useNativeDriver: true,
            }),
            Animated.spring(alunoScale, {
                toValue: 1,
                delay: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleSelect = (role) => {
        if (role === UserRole.PROFESSOR) {
            navigation.navigate('ProfessorRegistration');
        } else {
            navigation.navigate('AlunoRegistration');
        }
    };

    const RoleCard = ({
        role,
        icon,
        title,
        description,
        scaleAnim,
        gradient
    }) => (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                style={({ pressed }) => [
                    styles.card,
                    {
                        backgroundColor: colors.surface,
                        ...shadows.medium,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                ]}
                onPress={() => handleSelect(role)}
            >
                <View style={[styles.iconContainer, { backgroundColor: gradient }]}>
                    <Icon name={icon} size={48} color="#FFFFFF" />
                </View>
                <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                    {title}
                </Text>
                <Text style={[styles.cardDescription, { color: colors.text.secondary }]}>
                    {description}
                </Text>
                <View style={[styles.arrow, { backgroundColor: colors.primarySurface }]}>
                    <Icon name="arrow-forward" size={20} color={colors.primary} />
                </View>
            </Pressable>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
                    <Icon name="fitness-center" size={40} color="#FFFFFF" />
                </View>
                <Text style={[styles.title, { color: colors.text.primary }]}>
                    Rotina+
                </Text>
                <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                    Gerencie treinos e mensalidades{'\n'}de forma simples e eficiente
                </Text>
            </Animated.View>

            {/* Role Cards */}
            <View style={styles.cardsContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                    Eu sou...
                </Text>

                <RoleCard
                    role={UserRole.PROFESSOR}
                    icon="school"
                    title="Professor / Personal"
                    description="Gerencie seus alunos, crie treinos personalizados e controle mensalidades"
                    scaleAnim={professorScale}
                    gradient={colors.primary}
                />

                <RoleCard
                    role={UserRole.ALUNO}
                    icon="directions-run"
                    title="Aluno"
                    description="Acompanhe seus treinos, veja evolução e mantenha pagamentos em dia"
                    scaleAnim={alunoScale}
                    gradient={colors.secondary}
                />
            </View>

            {/* Footer */}
            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                <Text style={[styles.footerText, { color: colors.text.disabled }]}>
                    Seus dados ficam armazenados apenas no seu dispositivo
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    cardsContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        lineHeight: 20,
        paddingRight: 40,
    },
    arrow: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        textAlign: 'center',
    },
});
