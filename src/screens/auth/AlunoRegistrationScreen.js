/**
 * AlunoRegistrationScreen - Cadastro de Aluno
 * 
 * Formulário para cadastro do aluno com vinculação ao professor
 */
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import {
    createAluno,
    createProfessorRef,
    UserRole,
    validators
} from '../../models/dataModels';
import {
    AlunoService,
    ProfessorService,
    UserService
} from '../../services/storageService';
import { PremiumButton } from '../../components/common';

const GOALS = [
    { value: 'hipertrofia', label: 'Hipertrofia', icon: 'fitness-center' },
    { value: 'emagrecimento', label: 'Emagrecimento', icon: 'trending-down' },
    { value: 'condicionamento', label: 'Condicionamento', icon: 'directions-run' },
    { value: 'saude', label: 'Saúde', icon: 'favorite' },
    { value: 'forca', label: 'Força', icon: 'bolt' },
    { value: 'flexibilidade', label: 'Flexibilidade', icon: 'self-improvement' },
];

// InputField definido FORA do componente principal para evitar re-renderização
const InputField = ({
    label,
    value,
    onChangeText,
    error,
    placeholder,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    inputRef,
    onSubmitEditing,
    returnKeyType = 'next',
    icon,
    success,
    colors,
}) => (
    <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text.secondary }]}>
            {label}
        </Text>
        <View
            style={[
                styles.inputWrapper,
                {
                    backgroundColor: colors.surface,
                    borderColor: error
                        ? colors.danger
                        : success
                            ? colors.success
                            : colors.border,
                },
            ]}
        >
            {icon && (
                <Icon
                    name={icon}
                    size={20}
                    color={success ? colors.success : colors.text.disabled}
                    style={styles.inputIcon}
                />
            )}
            <TextInput
                ref={inputRef}
                style={[styles.input, { color: colors.text.primary }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.text.hint}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                onSubmitEditing={onSubmitEditing}
                returnKeyType={returnKeyType}
            />
            {success && (
                <Icon name="check-circle" size={20} color={colors.success} />
            )}
        </View>
        {error && (
            <Text style={[styles.errorText, { color: colors.danger }]}>
                {error}
            </Text>
        )}
    </View>
);

export default function AlunoRegistrationScreen({ navigation }) {
    const { colors, shadows } = useTheme();

    // Form state
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        goal: '',
        professorCode: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [professorFound, setProfessorFound] = useState(null);

    // Refs for focus
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const birthRef = useRef(null);
    const codeRef = useRef(null);

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }

        // Buscar professor quando código mudar
        if (field === 'professorCode' && value.length === 11) { // PROF-XXXXXX
            searchProfessor(value);
        }
    };

    const searchProfessor = async (code) => {
        if (!validators.isValidProfessorCode(code)) {
            setProfessorFound(null);
            return;
        }

        const professor = await ProfessorService.getById(code);
        setProfessorFound(professor);

        if (!professor) {
            setErrors(prev => ({
                ...prev,
                professorCode: 'Professor não encontrado. Verifique o código.'
            }));
        } else {
            setErrors(prev => ({ ...prev, professorCode: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!form.email.trim()) {
            newErrors.email = 'E-mail é obrigatório';
        } else if (!validators.isValidEmail(form.email)) {
            newErrors.email = 'E-mail inválido';
        }

        if (!form.phone.trim()) {
            newErrors.phone = 'Telefone é obrigatório';
        } else if (!validators.isValidPhone(form.phone)) {
            newErrors.phone = 'Telefone inválido';
        }

        if (!form.goal) {
            newErrors.goal = 'Selecione um objetivo';
        }

        if (!form.professorCode.trim()) {
            newErrors.professorCode = 'Código do professor é obrigatório';
        } else if (!validators.isValidProfessorCode(form.professorCode)) {
            newErrors.professorCode = 'Código inválido. Use o formato PROF-XXXXXX';
        } else if (!professorFound) {
            newErrors.professorCode = 'Professor não encontrado';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Cria referência do professor
            const professorRef = createProfessorRef(professorFound);

            // Cria o aluno
            const aluno = createAluno({
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                birthDate: form.birthDate.trim() || null,
                goal: form.goal,
                professors: [professorRef],
            });

            // Salva no storage
            await AlunoService.save(aluno);

            // Vincula aluno ao professor
            await ProfessorService.addStudent(professorFound.id, aluno.id);

            // Define como usuário atual
            await UserService.setCurrentUser(aluno, UserRole.ALUNO);

            // Navega para o dashboard
            Alert.alert(
                'Bem-vindo(a)!',
                `Cadastro realizado com sucesso!\n\nVocê está vinculado ao professor ${professorFound.name}.`,
                [
                    {
                        text: 'Começar',
                        onPress: () => navigation.reset({
                            index: 0,
                            routes: [{ name: 'AlunoDashboard' }],
                        }),
                    },
                ]
            );
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            Alert.alert('Erro', 'Não foi possível completar o cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
                        <Icon name="directions-run" size={32} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        Cadastro de Aluno
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                        Preencha seus dados para começar
                    </Text>
                </View>

                {/* Professor Code Section - First */}
                <View style={[styles.professorSection, { backgroundColor: colors.surface, ...shadows.small }]}>
                    <View style={styles.professorHeader}>
                        <Icon name="link" size={24} color={colors.primary} />
                        <View style={styles.professorHeaderText}>
                            <Text style={[styles.professorTitle, { color: colors.text.primary }]}>
                                Vincular ao Professor
                            </Text>
                            <Text style={[styles.professorSubtitle, { color: colors.text.secondary }]}>
                                Digite o código recebido do seu professor
                            </Text>
                        </View>
                    </View>

                    <InputField
                        label="Código do Professor"
                        value={form.professorCode}
                        onChangeText={(v) => updateField('professorCode', v.toUpperCase())}
                        error={errors.professorCode}
                        placeholder="PROF-XXXXXX"
                        autoCapitalize="characters"
                        icon="qr-code"
                        colors={colors}
                        inputRef={codeRef}
                        success={!!professorFound}
                    />

                    {professorFound && (
                        <View style={[styles.professorCard, { backgroundColor: colors.successLight }]}>
                            <Icon name="check-circle" size={20} color={colors.success} />
                            <View style={styles.professorInfo}>
                                <Text style={[styles.professorName, { color: colors.success }]}>
                                    {professorFound.name}
                                </Text>
                                {professorFound.academyName && (
                                    <Text style={[styles.academyName, { color: colors.text.secondary }]}>
                                        {professorFound.academyName}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <InputField
                        label="Nome completo"
                        value={form.name}
                        onChangeText={(v) => updateField('name', v)}
                        error={errors.name}
                        placeholder="Seu nome"
                        icon="person"
                        colors={colors}
                        onSubmitEditing={() => emailRef.current?.focus()}
                    />

                    <InputField
                        label="E-mail"
                        value={form.email}
                        onChangeText={(v) => updateField('email', v)}
                        error={errors.email}
                        placeholder="seu@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        icon="email"
                        colors={colors}
                        inputRef={emailRef}
                        onSubmitEditing={() => phoneRef.current?.focus()}
                    />

                    <InputField
                        label="Telefone"
                        value={form.phone}
                        onChangeText={(v) => updateField('phone', v)}
                        error={errors.phone}
                        placeholder="(00) 00000-0000"
                        keyboardType="phone-pad"
                        icon="phone"
                        colors={colors}
                        inputRef={phoneRef}
                        onSubmitEditing={() => birthRef.current?.focus()}
                    />

                    <InputField
                        label="Data de nascimento (opcional)"
                        value={form.birthDate}
                        onChangeText={(v) => updateField('birthDate', v)}
                        placeholder="DD/MM/AAAA"
                        keyboardType="number-pad"
                        icon="cake"
                        colors={colors}
                        inputRef={birthRef}
                    />

                    {/* Goal Selection */}
                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.text.secondary }]}>
                            Objetivo
                        </Text>
                        <View style={styles.goalsContainer}>
                            {GOALS.map((goal) => (
                                <Pressable
                                    key={goal.value}
                                    style={[
                                        styles.goalButton,
                                        {
                                            backgroundColor: form.goal === goal.value
                                                ? colors.primarySurface
                                                : colors.surface,
                                            borderColor: form.goal === goal.value
                                                ? colors.primary
                                                : colors.border,
                                        },
                                    ]}
                                    onPress={() => updateField('goal', goal.value)}
                                >
                                    <Icon
                                        name={goal.icon}
                                        size={20}
                                        color={form.goal === goal.value
                                            ? colors.primary
                                            : colors.text.disabled}
                                    />
                                    <Text
                                        style={[
                                            styles.goalLabel,
                                            {
                                                color: form.goal === goal.value
                                                    ? colors.primary
                                                    : colors.text.secondary,
                                            },
                                        ]}
                                    >
                                        {goal.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                        {errors.goal && (
                            <Text style={[styles.errorText, { color: colors.danger }]}>
                                {errors.goal}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Submit Button */}
                <View style={styles.footer}>
                    <PremiumButton
                        title="Criar minha conta"
                        onPress={handleSubmit}
                        loading={loading}
                        icon="check"
                        disabled={!professorFound}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
    },
    professorSection: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    professorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    professorHeaderText: {
        flex: 1,
    },
    professorTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    professorSubtitle: {
        fontSize: 13,
    },
    professorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginTop: 12,
        gap: 10,
    },
    professorInfo: {
        flex: 1,
    },
    professorName: {
        fontSize: 15,
        fontWeight: '600',
    },
    academyName: {
        fontSize: 13,
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 14,
        minHeight: 52,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 14,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    },
    goalsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    goalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1.5,
        gap: 6,
    },
    goalLabel: {
        fontSize: 13,
        fontWeight: '500',
    },
    footer: {
        marginTop: 32,
    },
});
