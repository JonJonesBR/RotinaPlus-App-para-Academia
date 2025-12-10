/**
 * NotificationService - Serviço de Notificações Locais
 * 
 * Gerencia lembretes de treino e pagamentos
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuração padrão de notificações
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export const NotificationService = {
    /**
     * Solicita permissões de notificação
     * @returns {Promise<boolean>} Se tem permissão
     */
    async requestPermissions() {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Permissão de notificação negada');
                return false;
            }

            // Configuração Android
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'Rotina+',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#0D9488',
                });
            }

            return true;
        } catch (error) {
            console.error('Erro ao solicitar permissões:', error);
            return false;
        }
    },

    /**
     * Agenda lembrete de treino
     * @param {object} workout - Dados do treino
     * @param {number} hour - Hora do lembrete (0-23)
     * @param {number} minute - Minuto do lembrete
     * @returns {Promise<string>} ID da notificação
     */
    async scheduleWorkoutReminder(workout, hour = 8, minute = 0) {
        try {
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '🏋️ Hora do Treino!',
                    body: `Seu treino "${workout.name}" está te esperando!`,
                    data: { workoutId: workout.id, type: 'workout_reminder' },
                    sound: true,
                },
                trigger: {
                    hour,
                    minute,
                    repeats: true,
                },
            });

            return notificationId;
        } catch (error) {
            console.error('Erro ao agendar lembrete de treino:', error);
            return null;
        }
    },

    /**
     * Agenda lembrete de pagamento (3 dias antes)
     * @param {object} payment - Dados do pagamento
     * @returns {Promise<string>} ID da notificação
     */
    async schedulePaymentReminder(payment) {
        try {
            // Calcula data 3 dias antes do vencimento
            const now = new Date();
            const [year, month] = payment.month.split('-').map(Number);
            const dueDate = new Date(year, month - 1, payment.dueDay);
            const reminderDate = new Date(dueDate);
            reminderDate.setDate(reminderDate.getDate() - 3);

            // Se já passou, não agenda
            if (reminderDate <= now) {
                return null;
            }

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '💰 Lembrete de Pagamento',
                    body: `Sua mensalidade de R$ ${payment.amount.toFixed(2)} vence em 3 dias!`,
                    data: { paymentId: payment.id, type: 'payment_reminder' },
                    sound: true,
                },
                trigger: {
                    date: reminderDate,
                },
            });

            return notificationId;
        } catch (error) {
            console.error('Erro ao agendar lembrete de pagamento:', error);
            return null;
        }
    },

    /**
     * Agenda notificação de pagamento em atraso
     * @param {object} payment - Dados do pagamento
     * @returns {Promise<string>} ID da notificação
     */
    async schedulePaymentOverdue(payment) {
        try {
            const now = new Date();
            const [year, month] = payment.month.split('-').map(Number);
            const dueDate = new Date(year, month - 1, payment.dueDay, 9, 0); // 9h da manhã

            // Se já passou, não agenda
            if (dueDate <= now) {
                return null;
            }

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '⚠️ Pagamento Vencendo Hoje',
                    body: `Sua mensalidade de R$ ${payment.amount.toFixed(2)} vence hoje!`,
                    data: { paymentId: payment.id, type: 'payment_due' },
                    sound: true,
                },
                trigger: {
                    date: dueDate,
                },
            });

            return notificationId;
        } catch (error) {
            console.error('Erro ao agendar notificação de vencimento:', error);
            return null;
        }
    },

    /**
     * Cancela uma notificação específica
     * @param {string} notificationId - ID da notificação
     */
    async cancelNotification(notificationId) {
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (error) {
            console.error('Erro ao cancelar notificação:', error);
        }
    },

    /**
     * Cancela todas as notificações agendadas
     */
    async cancelAll() {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (error) {
            console.error('Erro ao cancelar notificações:', error);
        }
    },

    /**
     * Lista todas as notificações agendadas
     * @returns {Promise<Array>} Lista de notificações
     */
    async getScheduled() {
        try {
            return await Notifications.getAllScheduledNotificationsAsync();
        } catch (error) {
            console.error('Erro ao listar notificações:', error);
            return [];
        }
    },

    /**
     * Adiciona listener para notificações recebidas
     * @param {function} callback - Função a chamar
     * @returns {object} Subscription para remover depois
     */
    addNotificationListener(callback) {
        return Notifications.addNotificationReceivedListener(callback);
    },

    /**
     * Adiciona listener para quando usuário toca na notificação
     * @param {function} callback - Função a chamar
     * @returns {object} Subscription para remover depois
     */
    addNotificationResponseListener(callback) {
        return Notifications.addNotificationResponseReceivedListener(callback);
    },
};

export default NotificationService;
