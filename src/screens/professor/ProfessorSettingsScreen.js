/**
 * ProfessorSettingsScreen - Configurações do Professor
 * 
 * Gerenciamento de perfil, PIX e preferências
 */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
    Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { UserService, ProfessorService } from '../../services/storageService';
import { NotificationService } from '../../services/notificationService';
import { AuthService } from '../../services/authService';
import { PixKeyType, validators } from '../../models/dataModels';
import { PremiumCard, PremiumButton } from '../../components/common';

const PIX_KEY_OPTIONS = [
    { value: PixKeyType.CPF, label: 'CPF', icon: 'badge' },
    { value: PixKeyType.CNPJ, label: 'CNPJ', icon: 'business' },
    { value: PixKeyType.EMAIL, label: 'E-mail', icon: 'email' },
    { value: PixKeyType.PHONE, label: 'Telefone', icon: 'phone' },
    { value: PixKeyType.RANDOM, label: 'Aleatória', icon: 'vpn-key' },
];

export default function ProfessorSettingsScreen({ navigation }) {
    const { colors, shadows, isDark, toggleTheme } = useTheme();

    const [professor, setProfessor] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        academyName: '',
        pixKey: '',
        pixKeyType: PixKeyType.CPF,
    });
    const [notifications, setNotifications] = useState({
        payments: true,
        newStudents: true,
    });
    const [pinEnabled, setPinEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const user = await UserService.getCurrentUser();
        setProfessor(user);

        // Check PIN status
        const isPinOn = await AuthService.isPinEnabled();
        setPinEnabled(isPinOn);

        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                academyName: user.academyName || '',
                pixKey: user.pixKey || '',
                pixKeyType: user.pixKeyType || PixKeyType.CPF,
            });
        }
    };

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            Alert.alert('Erro', 'Nome é obrigatório');
            return;
        }

        if (form.email && !validators.isValidEmail(form.email)) {
            Alert.alert('Erro', 'E-mail inválido');
            return;
        }

        setLoading(true);
        try {
            const updatedProfessor = {
                ...professor,
                ...form,
                updatedAt: Date.now(),
            };

            await ProfessorService.save(updatedProfessor);
            await UserService.setCurrentUser(updatedProfessor, 'PROFESSOR');

            setHasChanges(false);
            Alert.alert('Sucesso', 'Dados atualizados!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            Alert.alert('Erro', 'Não foi possível salvar as alterações');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Sair da conta',
            'Deseja realmente sair? Seus dados locais serão mantidos.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        await UserService.logout();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'RoleSelection' }],
                        });
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Excluir conta',
            'Esta ação é irreversível. Todos os seus dados serão apagados.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            'Confirmar exclusão',
                            'Digite "EXCLUIR" para confirmar',
                            [{ text: 'Cancelar' }]
                        );
                    },
                },
            ]
        );
    };

    const SettingRow = ({ icon, title, subtitle, right, onPress }) => (
        <Pressable
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={[styles.settingIcon, { backgroundColor: colors.surfaceVariant }]}>
                <Icon name={icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                    {title}
                </Text>
                {subtitle && (
                    <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {right}
        </Pressable>
    );

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* Profile Section */}
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                PERFIL
            </Text>
            <PremiumCard>
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text.secondary }]}>Nome</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text.primary }]}
                        value={form.name}
                        onChangeText={(v) => updateField('name', v)}
                        placeholder="Seu nome"
                        placeholderTextColor={colors.text.hint}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text.secondary }]}>E-mail</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text.primary }]}
                        value={form.email}
                        onChangeText={(v) => updateField('email', v)}
                        placeholder="seu@email.com"
                        placeholderTextColor={colors.text.hint}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text.secondary }]}>Telefone</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text.primary }]}
                        value={form.phone}
                        onChangeText={(v) => updateField('phone', v)}
                        placeholder="(00) 00000-0000"
                        placeholderTextColor={colors.text.hint}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text.secondary }]}>Academia</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text.primary }]}
                        value={form.academyName}
                        onChangeText={(v) => updateField('academyName', v)}
                        placeholder="Nome da academia"
                        placeholderTextColor={colors.text.hint}
                    />
                </View>
            </PremiumCard>

            {/* PIX Section */}
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                DADOS PIX
            </Text>
            <PremiumCard>
                <View style={styles.pixTypes}>
                    {PIX_KEY_OPTIONS.map((option) => (
                        <Pressable
                            key={option.value}
                            style={[
                                styles.pixTypeButton,
                                {
                                    backgroundColor: form.pixKeyType === option.value
                                        ? colors.primarySurface
                                        : colors.surfaceVariant,
                                    borderColor: form.pixKeyType === option.value
                                        ? colors.primary
                                        : 'transparent',
                                },
                            ]}
                            onPress={() => updateField('pixKeyType', option.value)}
                        >
                            <Text
                                style={[
                                    styles.pixTypeLabel,
                                    { color: form.pixKeyType === option.value ? colors.primary : colors.text.secondary },
                                ]}
                            >
                                {option.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text.primary }]}
                    value={form.pixKey}
                    onChangeText={(v) => updateField('pixKey', v)}
                    placeholder="Sua chave PIX"
                    placeholderTextColor={colors.text.hint}
                />
            </PremiumCard>

            {hasChanges && (
                <PremiumButton
                    title="Salvar Alterações"
                    onPress={handleSave}
                    loading={loading}
                    icon="save"
                    style={styles.saveButton}
                />
            )}

            {/* Preferences */}
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                PREFERÊNCIAS
            </Text>
            <PremiumCard style={styles.settingsCard}>
                <SettingRow
                    icon="dark-mode"
                    title="Tema escuro"
                    subtitle={isDark ? 'Ativado' : 'Desativado'}
                    right={
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ true: colors.primary }}
                        />
                    }
                />
                <SettingRow
                    icon="notifications"
                    title="Notificações de pagamento"
                    right={
                        <Switch
                            value={notifications.payments}
                            onValueChange={(v) => setNotifications(prev => ({ ...prev, payments: v }))}
                            trackColor={{ true: colors.primary }}
                        />
                    }
                />
            </PremiumCard>

            {/* Security */}
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                SEGURANÇA
            </Text>
            <PremiumCard style={styles.settingsCard}>
                <SettingRow
                    icon="lock"
                    title="Bloqueio por PIN"
                    subtitle={pinEnabled ? 'Ativado' : 'Desativado'}
                    right={
                        <Switch
                            value={pinEnabled}
                            onValueChange={async (enabled) => {
                                if (enabled) {
                                    // Navigate to PIN setup
                                    navigation.navigate('PinSetup');
                                } else {
                                    // Disable PIN
                                    await AuthService.removePin();
                                    setPinEnabled(false);
                                }
                            }}
                            trackColor={{ true: colors.primary }}
                        />
                    }
                />
            </PremiumCard>

            {/* Account */}
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                CONTA
            </Text>
            <PremiumCard style={styles.settingsCard}>
                <SettingRow
                    icon="badge"
                    title="Seu código"
                    subtitle={professor?.id || 'PROF-XXXXXX'}
                />
                <SettingRow
                    icon="logout"
                    title="Sair da conta"
                    right={<Icon name="chevron-right" size={24} color={colors.text.disabled} />}
                    onPress={handleLogout}
                />
                <SettingRow
                    icon="delete-forever"
                    title="Excluir conta"
                    subtitle="Esta ação é irreversível"
                    right={<Icon name="chevron-right" size={24} color={colors.danger} />}
                    onPress={handleDeleteAccount}
                />
            </PremiumCard>

            {/* Version */}
            <Text style={[styles.version, { color: colors.text.disabled }]}>
                RotinaPlus v2.0.0
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 10,
        marginTop: 20,
        marginLeft: 4,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 6,
    },
    input: {
        padding: 14,
        borderRadius: 10,
        fontSize: 16,
    },
    pixTypes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    pixTypeButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1.5,
    },
    pixTypeLabel: {
        fontSize: 13,
        fontWeight: '500',
    },
    saveButton: {
        marginTop: 16,
    },
    settingsCard: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        gap: 12,
    },
    settingIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingInfo: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '500',
    },
    settingSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 32,
    },
});
