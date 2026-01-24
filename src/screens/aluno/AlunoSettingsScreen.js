/**
 * AlunoSettingsScreen - Configurações do Aluno
 * 
 * Gerenciamento de perfil, professores vinculados e preferências
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
import { UserService, AlunoService } from '../../services/storageService';
import { NotificationService } from '../../services/notificationService';
import { validators } from '../../models/dataModels';
import { PremiumCard, PremiumButton, Avatar } from '../../components/common';

export default function AlunoSettingsScreen({ navigation }) {
    const { colors, shadows, isDark, toggleTheme } = useTheme();

    const [aluno, setAluno] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        goal: '',
    });
    const [notifications, setNotifications] = useState({
        workouts: true,
        payments: true,
    });
    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const user = await UserService.getCurrentUser();
        setAluno(user);

        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                birthDate: user.birthDate || '',
                goal: user.goal || '',
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
            const updatedAluno = {
                ...aluno,
                ...form,
                updatedAt: Date.now(),
            };

            await AlunoService.save(updatedAluno);
            await UserService.setCurrentUser(updatedAluno, 'ALUNO');

            setHasChanges(false);
            Alert.alert('Sucesso', 'Dados atualizados!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            Alert.alert('Erro', 'Não foi possível salvar as alterações');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationToggle = async (type, value) => {
        setNotifications(prev => ({ ...prev, [type]: value }));

        if (type === 'workouts') {
            if (value) {
                await NotificationService.scheduleWorkoutReminder(aluno.id, {
                    hour: 7,
                    minute: 0,
                });
            } else {
                await NotificationService.cancelWorkoutReminder(aluno.id);
            }
        }
    };

    const handleUnlinkProfessor = (professor) => {
        Alert.alert(
            'Desvincular Professor',
            `Deseja se desvincular de ${professor.name}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Desvincular',
                    style: 'destructive',
                    onPress: async () => {
                        await AlunoService.unlinkProfessor(aluno.id, professor.id);
                        loadData();
                    },
                },
            ],
        );
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
            ],
        );
    };

    const SettingRow = ({ icon, title, subtitle, right, onPress, danger }) => (
        <Pressable
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={[styles.settingIcon, { backgroundColor: danger ? colors.dangerLight : colors.surfaceVariant }]}>
                <Icon name={icon} size={20} color={danger ? colors.danger : colors.primary} />
            </View>
            <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: danger ? colors.danger : colors.text.primary }]}>
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

    const GOALS = [
        { value: 'hipertrofia', label: 'Hipertrofia' },
        { value: 'emagrecimento', label: 'Emagrecimento' },
        { value: 'condicionamento', label: 'Condicionamento' },
        { value: 'saude', label: 'Saúde' },
        { value: 'forca', label: 'Força' },
        { value: 'flexibilidade', label: 'Flexibilidade' },
    ];

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
                    <Text style={[styles.label, { color: colors.text.secondary }]}>Objetivo</Text>
                    <View style={styles.goalsContainer}>
                        {GOALS.map((goal) => (
                            <Pressable
                                key={goal.value}
                                style={[
                                    styles.goalButton,
                                    {
                                        backgroundColor: form.goal === goal.value
                                            ? colors.primarySurface
                                            : colors.surfaceVariant,
                                        borderColor: form.goal === goal.value
                                            ? colors.primary
                                            : 'transparent',
                                    },
                                ]}
                                onPress={() => updateField('goal', goal.value)}
                            >
                                <Text
                                    style={[
                                        styles.goalLabel,
                                        { color: form.goal === goal.value ? colors.primary : colors.text.secondary },
                                    ]}
                                >
                                    {goal.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
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

            {/* Professors */}
            {aluno?.professors?.length > 0 && (
                <>
                    <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                        MEUS PROFESSORES
                    </Text>
                    <PremiumCard style={styles.settingsCard}>
                        {aluno.professors.map((prof, index) => (
                            <View
                                key={prof.id}
                                style={[
                                    styles.professorRow,
                                    { borderBottomColor: colors.border },
                                    index === aluno.professors.length - 1 && { borderBottomWidth: 0 },
                                ]}
                            >
                                <Avatar name={prof.name} size={40} />
                                <View style={styles.professorInfo}>
                                    <Text style={[styles.professorName, { color: colors.text.primary }]}>
                                        {prof.name}
                                    </Text>
                                    {prof.academyName && (
                                        <Text style={[styles.professorAcademy, { color: colors.text.secondary }]}>
                                            {prof.academyName}
                                        </Text>
                                    )}
                                </View>
                                <Pressable
                                    style={[styles.unlinkButton, { backgroundColor: colors.dangerLight }]}
                                    onPress={() => handleUnlinkProfessor(prof)}
                                >
                                    <Icon name="link-off" size={18} color={colors.danger} />
                                </Pressable>
                            </View>
                        ))}
                    </PremiumCard>
                </>
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
                    icon="fitness-center"
                    title="Lembretes de treino"
                    subtitle="Receber notificações diárias"
                    right={
                        <Switch
                            value={notifications.workouts}
                            onValueChange={(v) => handleNotificationToggle('workouts', v)}
                            trackColor={{ true: colors.primary }}
                        />
                    }
                />
                <SettingRow
                    icon="payments"
                    title="Lembretes de pagamento"
                    subtitle="Avisar sobre vencimentos"
                    right={
                        <Switch
                            value={notifications.payments}
                            onValueChange={(v) => handleNotificationToggle('payments', v)}
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
                    icon="qr-code"
                    title="Vincular novo professor"
                    right={<Icon name="chevron-right" size={24} color={colors.text.disabled} />}
                    onPress={() => navigation.navigate('AlunoQRImport')}
                />
                <SettingRow
                    icon="logout"
                    title="Sair da conta"
                    right={<Icon name="chevron-right" size={24} color={colors.text.disabled} />}
                    onPress={handleLogout}
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
    goalsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    goalButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1.5,
    },
    goalLabel: {
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
    professorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        gap: 12,
    },
    professorInfo: {
        flex: 1,
    },
    professorName: {
        fontSize: 15,
        fontWeight: '600',
    },
    professorAcademy: {
        fontSize: 13,
        marginTop: 2,
    },
    unlinkButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 32,
    },
});
