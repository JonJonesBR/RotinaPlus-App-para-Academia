/**
 * Data Models - RotinaPlus
 * 
 * Definições de tipos e modelos de dados para o app
 * com suporte a Professor e Aluno
 */

// ============================================
// ENUMS E CONSTANTES
// ============================================

export const UserRole = {
    PROFESSOR: 'professor',
    ALUNO: 'aluno',
};

export const PaymentStatus = {
    PENDING: 'pending',
    PAID: 'paid',
    OVERDUE: 'overdue',
};

export const PixKeyType = {
    CPF: 'cpf',
    CNPJ: 'cnpj',
    EMAIL: 'email',
    PHONE: 'phone',
    RANDOM: 'random',
};

export const QRDataType = {
    PROFESSOR_LINK: 'professor_link',
    WORKOUT: 'workout',
    PAYMENT_INFO: 'payment_info',
};

// ============================================
// GERADORES DE ID
// ============================================

/**
 * Gera ID único para professor (PROF-XXXXXX)
 */
export const generateProfessorId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `PROF-${code}`;
};

/**
 * Gera ID único para aluno (ALU-XXXXXX)
 */
export const generateAlunoId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ALU-${code}`;
};

/**
 * Gera código temporário de 6 dígitos
 */
export const generateTempCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============================================
// FACTORIES - Criação de objetos com defaults
// ============================================

/**
 * Cria objeto Professor com valores padrão
 */
export const createProfessor = (data = {}) => ({
    id: data.id || generateProfessorId(),
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    pixKey: data.pixKey || '',
    pixKeyType: data.pixKeyType || PixKeyType.CPF,
    academyName: data.academyName || '',
    createdAt: data.createdAt || Date.now(),
    students: data.students || [],
});

/**
 * Cria objeto Aluno com valores padrão
 */
export const createAluno = (data = {}) => ({
    id: data.id || generateAlunoId(),
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    birthDate: data.birthDate || null,
    goal: data.goal || '',
    professors: data.professors || [],
    createdAt: data.createdAt || Date.now(),
});

/**
 * Cria referência de professor para o aluno
 */
export const createProfessorRef = (professor) => ({
    id: professor.id,
    name: professor.name,
    pixKey: professor.pixKey,
    pixKeyType: professor.pixKeyType,
    academyName: professor.academyName,
});

/**
 * Cria objeto Exercício
 */
export const createExercise = (data = {}) => ({
    id: data.id || Date.now().toString(),
    name: data.name || '',
    sets: data.sets || 3,
    reps: data.reps || '12',
    weight: data.weight || '',
    rest: data.rest || 60,
    notes: data.notes || '',
});

/**
 * Cria objeto Série de Treino
 */
export const createWorkout = (data = {}) => ({
    id: data.id || Date.now().toString(),
    professorId: data.professorId || '',
    studentId: data.studentId || '',
    name: data.name || '',
    exercises: data.exercises || [],
    weekDays: data.weekDays || [],
    validFrom: data.validFrom || null,
    validUntil: data.validUntil || null,
    createdAt: data.createdAt || Date.now(),
});

/**
 * Cria objeto Mensalidade
 */
export const createPayment = (data = {}) => ({
    id: data.id || Date.now().toString(),
    professorId: data.professorId || '',
    studentId: data.studentId || '',
    studentName: data.studentName || '',
    amount: data.amount || 0,
    dueDay: data.dueDay || 10,
    status: data.status || PaymentStatus.PENDING,
    month: data.month || new Date().toISOString().slice(0, 7),
    paidAt: data.paidAt || null,
    createdAt: data.createdAt || Date.now(),
});

/**
 * Cria pacote QR para exportação
 */
export const createQRPackage = (type, payload, expiresIn = 86400000) => ({
    type,
    version: '1.0',
    payload,
    createdAt: Date.now(),
    expiresAt: Date.now() + expiresIn, // 24h por padrão
});

// ============================================
// VALIDADORES
// ============================================

export const validators = {
    isValidEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    isValidPhone: (phone) => {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 11;
    },

    isValidCPF: (cpf) => {
        const digits = cpf.replace(/\D/g, '');
        return digits.length === 11;
    },

    isValidCNPJ: (cnpj) => {
        const digits = cnpj.replace(/\D/g, '');
        return digits.length === 14;
    },

    isValidProfessorCode: (code) => {
        return /^PROF-[A-Z0-9]{6}$/.test(code);
    },

    isValidAlunoCode: (code) => {
        return /^ALU-[A-Z0-9]{6}$/.test(code);
    },
};

// ============================================
// DIAS DA SEMANA
// ============================================

export const WEEK_DAYS = {
    1: { short: 'Seg', full: 'Segunda-feira' },
    2: { short: 'Ter', full: 'Terça-feira' },
    3: { short: 'Qua', full: 'Quarta-feira' },
    4: { short: 'Qui', full: 'Quinta-feira' },
    5: { short: 'Sex', full: 'Sexta-feira' },
    6: { short: 'Sáb', full: 'Sábado' },
    7: { short: 'Dom', full: 'Domingo' },
};

export default {
    UserRole,
    PaymentStatus,
    PixKeyType,
    QRDataType,
    generateProfessorId,
    generateAlunoId,
    generateTempCode,
    createProfessor,
    createAluno,
    createProfessorRef,
    createExercise,
    createWorkout,
    createPayment,
    createQRPackage,
    validators,
    WEEK_DAYS,
};
