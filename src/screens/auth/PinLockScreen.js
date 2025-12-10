/**
 * PinLockScreen - Tela de autenticação por PIN
 * 
 * Permite configurar e validar PIN para acesso ao app
 */
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Vibration,
    Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { CryptoService } from '../../services/cryptoService';

const PIN_LENGTH = 4;

export default function PinLockScreen({
    navigation,
    route,
    isSetup = false, // true = configurar, false = validar
    onSuccess,
    onCancel,
}) {
    const { colors } = useTheme();

    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [step, setStep] = useState(isSetup ? 'create' : 'verify'); // create, confirm, verify
    const [error, setError] = useState('');
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const mode = route?.params?.mode || (isSetup ? 'setup' : 'verify');

    useEffect(() => {
        // Reset quando muda o step
        setPin('');
        setError('');
    }, [step]);

    const handleNumberPress = async (num) => {
        if (pin.length >= PIN_LENGTH) return;

        Vibration.vibrate(30);
        const newPin = pin + num;
        setPin(newPin);
        setError('');

        // Verifica quando completar
        if (newPin.length === PIN_LENGTH) {
            if (step === 'create') {
                setConfirmPin(newPin);
                setStep('confirm');
            } else if (step === 'confirm') {
                if (newPin === confirmPin) {
                    // Salva o PIN
                    await CryptoService.saveUserKey(newPin);
                    onSuccess?.();
                } else {
                    shake();
                    setError('Os PINs não coincidem');
                    setStep('create');
                    setConfirmPin('');
                }
            } else if (step === 'verify') {
                const savedPin = await CryptoService.getUserKey();
                if (savedPin === newPin) {
                    onSuccess?.();
                } else {
                    shake();
                    setError('PIN incorreto');
                    setPin('');
                }
            }
        }
    };

    const handleDelete = () => {
        if (pin.length > 0) {
            Vibration.vibrate(30);
            setPin(pin.slice(0, -1));
            setError('');
        }
    };

    const shake = () => {
        Vibration.vibrate([0, 50, 50, 50]);
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const getTitle = () => {
        switch (step) {
            case 'create': return 'Crie seu PIN';
            case 'confirm': return 'Confirme seu PIN';
            case 'verify': return 'Digite seu PIN';
            default: return 'PIN';
        }
    };

    const getSubtitle = () => {
        switch (step) {
            case 'create': return 'Escolha um PIN de 4 dígitos';
            case 'confirm': return 'Digite novamente para confirmar';
            case 'verify': return 'Para acessar o aplicativo';
            default: return '';
        }
    };

    const PinDot = ({ filled }) => (
        <View
            style={[
                styles.pinDot,
                {
                    backgroundColor: filled ? colors.primary : 'transparent',
                    borderColor: filled ? colors.primary : colors.border,
                },
            ]}
        />
    );

    const NumberButton = ({ num, letters }) => (
        <Pressable
            style={({ pressed }) => [
                styles.numberButton,
                {
                    backgroundColor: pressed ? colors.surfaceVariant : colors.surface,
                },
            ]}
            onPress={() => handleNumberPress(num)}
        >
            <Text style={[styles.numberText, { color: colors.text.primary }]}>
                {num}
            </Text>
            {letters && (
                <Text style={[styles.lettersText, { color: colors.text.disabled }]}>
                    {letters}
                </Text>
            )}
        </Pressable>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                {onCancel && (
                    <Pressable style={styles.cancelButton} onPress={onCancel}>
                        <Icon name="close" size={24} color={colors.text.secondary} />
                    </Pressable>
                )}

                <View style={[styles.lockIcon, { backgroundColor: colors.primarySurface }]}>
                    <Icon name="lock" size={32} color={colors.primary} />
                </View>

                <Text style={[styles.title, { color: colors.text.primary }]}>
                    {getTitle()}
                </Text>
                <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                    {getSubtitle()}
                </Text>
            </View>

            {/* PIN Dots */}
            <Animated.View
                style={[
                    styles.pinContainer,
                    { transform: [{ translateX: shakeAnim }] }
                ]}
            >
                {[...Array(PIN_LENGTH)].map((_, i) => (
                    <PinDot key={i} filled={i < pin.length} />
                ))}
            </Animated.View>

            {/* Error */}
            {error ? (
                <Text style={[styles.errorText, { color: colors.danger }]}>
                    {error}
                </Text>
            ) : (
                <View style={styles.errorPlaceholder} />
            )}

            {/* Number Pad */}
            <View style={styles.numberPad}>
                <View style={styles.numberRow}>
                    <NumberButton num="1" />
                    <NumberButton num="2" letters="ABC" />
                    <NumberButton num="3" letters="DEF" />
                </View>
                <View style={styles.numberRow}>
                    <NumberButton num="4" letters="GHI" />
                    <NumberButton num="5" letters="JKL" />
                    <NumberButton num="6" letters="MNO" />
                </View>
                <View style={styles.numberRow}>
                    <NumberButton num="7" letters="PQRS" />
                    <NumberButton num="8" letters="TUV" />
                    <NumberButton num="9" letters="WXYZ" />
                </View>
                <View style={styles.numberRow}>
                    <View style={styles.emptyButton} />
                    <NumberButton num="0" />
                    <Pressable
                        style={[styles.deleteButton, { backgroundColor: colors.surface }]}
                        onPress={handleDelete}
                    >
                        <Icon name="backspace" size={24} color={colors.text.secondary} />
                    </Pressable>
                </View>
            </View>

            {/* Forgot PIN */}
            {step === 'verify' && (
                <Pressable style={styles.forgotButton}>
                    <Text style={[styles.forgotText, { color: colors.primary }]}>
                        Esqueci meu PIN
                    </Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    cancelButton: {
        position: 'absolute',
        top: 0,
        right: 20,
        padding: 8,
    },
    lockIcon: {
        width: 72,
        height: 72,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 40,
        marginBottom: 20,
    },
    pinDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 14,
        height: 20,
    },
    errorPlaceholder: {
        height: 20,
    },
    numberPad: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingBottom: 40,
    },
    numberRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 16,
    },
    numberButton: {
        width: 75,
        height: 75,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    numberText: {
        fontSize: 32,
        fontWeight: '500',
    },
    lettersText: {
        fontSize: 10,
        letterSpacing: 2,
        marginTop: 2,
    },
    emptyButton: {
        width: 75,
        height: 75,
    },
    deleteButton: {
        width: 75,
        height: 75,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    forgotButton: {
        alignItems: 'center',
        paddingBottom: 40,
    },
    forgotText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
