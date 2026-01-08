/**
 * ProfessorRegistrationScreen - Cadastro de Professor
 * 
 * Formulário completo para cadastro do professor
 * com geração de ID único e configuração de PIX
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
    Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import {
    createProfessor,
    PixKeyType,
    UserRole,
    validators
} from '../../models/dataModels';
import { ProfessorService, UserService } from '../../services/storageService';
import { PremiumButton } from '../../components/common';

const PIX_KEY_OPTIONS = [
    { value: PixKeyType.CPF, label: 'CPF', icon: 'badge' },
    { value: PixKeyType.CNPJ, label: 'CNPJ', icon: 'business' },
    { value: PixKeyType.EMAIL, label: 'E-mail', icon: 'email' },
    { value: PixKeyType.PHONE, label: 'Telefone', icon: 'phone' },
    { value: PixKeyType.RANDOM, label: 'Aleatória', icon: 'vpn-key' },
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
                    borderColor: error ? colors.danger : colors.border,
                },
            ]}
        >
            {icon && (
                <Icon
                    name={icon}
                    size={20}
                    color={colors.text.disabled}
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
        </View>
        {error && (
            <Text style={[styles.errorText, { color: colors.danger }]}>
                {error}
            </Text>
        )}
    </View>
);

export default function ProfessorRegistrationScreen({ navigation }) {
    const { colors, shadows } = useTheme();

    // Form state
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        academyName: '',
        pixKey: '',
        pixKeyType: PixKeyType.CPF,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Refs for focus
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const academyRef = useRef(null);
    const pixRef = useRef(null);

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // Clear error when typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
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

        if (!form.pixKey.trim()) {
            newErrors.pixKey = 'Chave PIX é obrigatória';
        } else {
            // Validar conforme tipo
            if (form.pixKeyType === PixKeyType.CPF && !validators.isValidCPF(form.pixKey)) {
                newErrors.pixKey = 'CPF inválido';
            } else if (form.pixKeyType === PixKeyType.CNPJ && !validators.isValidCNPJ(form.pixKey)) {
                newErrors.pixKey = 'CNPJ inválido';
            } else if (form.pixKeyType === PixKeyType.EMAIL && !validators.isValidEmail(form.pixKey)) {
                newErrors.pixKey = 'E-mail inválido';
            } else if (form.pixKeyType === PixKeyType.PHONE && !validators.isValidPhone(form.pixKey)) {
                newErrors.pixKey = 'Telefone inválido';
            }
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
            // Cria o professor com ID único
            const professor = createProfessor({
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                academyName: form.academyName.trim(),
                pixKey: form.pixKey.trim(),
                pixKeyType: form.pixKeyType,
            });

            // Salva no storage
            await ProfessorService.save(professor);

            // Define como usuário atual
            await UserService.setCurrentUser(professor, UserRole.PROFESSOR);

            // Navega para o dashboard
            Alert.alert(
                'Cadastro realizado!',
                `Seu ID de professor é:\n\n${professor.id}\n\nCompartilhe este código com seus alunos!`,
                [
                    {
                        text: 'Continuar',
                        onPress: () => navigation.reset({
                            index: 0,
                            routes: [{ name: 'ProfessorDashboard' }],
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
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                        <Icon name="school" size={32} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        Cadastro de Professor
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                        Preencha seus dados para começar
                    </Text>
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
                        onSubmitEditing={() => academyRef.current?.focus()}
                    />

                    <InputField
                        label="Nome da Academia (opcional)"
                        value={form.academyName}
                        onChangeText={(v) => updateField('academyName', v)}
                        placeholder="Minha Academia"
                        icon="fitness-center"
                        colors={colors}
                        inputRef={academyRef}
                        onSubmitEditing={() => pixRef.current?.focus()}
                    />

                    {/* PIX Section */}
                    <View style={styles.pixSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                            Dados PIX para pagamentos
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
                            Seus alunos receberão esta chave para pagamentos
                        </Text>

                        {/* PIX Type Selector */}
                        <View style={styles.pixTypeContainer}>
                            {PIX_KEY_OPTIONS.map((option) => (
                                <Pressable
                                    key={option.value}
                                    style={[
                                        styles.pixTypeButton,
                                        {
                                            backgroundColor: form.pixKeyType === option.value
                                                ? colors.primarySurface
                                                : colors.surface,
                                            borderColor: form.pixKeyType === option.value
                                                ? colors.primary
                                                : colors.border,
                                        },
                                    ]}
                                    onPress={() => updateField('pixKeyType', option.value)}
                                >
                                    <Icon
                                        name={option.icon}
                                        size={18}
                                        color={form.pixKeyType === option.value
                                            ? colors.primary
                                            : colors.text.disabled}
                                    />
                                    <Text
                                        style={[
                                            styles.pixTypeLabel,
                                            {
                                                color: form.pixKeyType === option.value
                                                    ? colors.primary
                                                    : colors.text.secondary,
                                            },
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <InputField
                            label="Chave PIX"
                            value={form.pixKey}
                            onChangeText={(v) => updateField('pixKey', v)}
                            error={errors.pixKey}
                            placeholder={
                                form.pixKeyType === PixKeyType.CPF ? '000.000.000-00' :
                                    form.pixKeyType === PixKeyType.CNPJ ? '00.000.000/0000-00' :
                                        form.pixKeyType === PixKeyType.EMAIL ? 'pix@email.com' :
                                            form.pixKeyType === PixKeyType.PHONE ? '(00) 00000-0000' :
                                                'Chave aleatória'
                            }
                            keyboardType={
                                form.pixKeyType === PixKeyType.EMAIL ? 'email-address' :
                                    form.pixKeyType === PixKeyType.PHONE ||
                                        form.pixKeyType === PixKeyType.CPF ||
                                        form.pixKeyType === PixKeyType.CNPJ ? 'number-pad' :
                                        'default'
                            }
                            autoCapitalize="none"
                            icon="pix"
                            colors={colors}
                            inputRef={pixRef}
                            returnKeyType="done"
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <View style={styles.footer}>
                    <PremiumButton
                        title="Criar minha conta"
                        onPress={handleSubmit}
                        loading={loading}
                        icon="check"
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
        marginBottom: 32,
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
    pixSection: {
        marginTop: 12,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 13,
        marginBottom: 16,
    },
    pixTypeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    pixTypeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1.5,
        gap: 6,
    },
    pixTypeLabel: {
        fontSize: 13,
        fontWeight: '500',
    },
    footer: {
        marginTop: 32,
    },
});
