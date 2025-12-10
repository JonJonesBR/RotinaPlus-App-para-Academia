/**
 * StorageService - Camada de abstração para AsyncStorage
 * 
 * Refatorado para suportar os novos modelos:
 * - UserService: Usuário atual (Professor ou Aluno)
 * - ProfessorService: CRUD de professores
 * - AlunoService: CRUD de alunos  
 * - WorkoutService: Séries de treino
 * - PaymentService: Mensalidades e pagamentos
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole, PaymentStatus } from '../models/dataModels';

// ============================================
// CHAVES DE ARMAZENAMENTO
// ============================================
export const STORAGE_KEYS = {
    // Usuário atual
    CURRENT_USER: '@rotina_plus_current_user',
    USER_ROLE: '@rotina_plus_user_role',

    // Dados
    PROFESSORS: '@rotina_plus_professors',
    ALUNOS: '@rotina_plus_alunos',
    WORKOUTS: '@rotina_plus_workouts',
    PAYMENTS: '@rotina_plus_payments',

    // Códigos temporários (para sincronização)
    TEMP_CODES: '@rotina_plus_temp_codes',

    // Legacy (para migração)
    STUDENTS: '@students',
    CUSTOM_PLANS: '@customPlans',
};

// ============================================
// HELPERS
// ============================================
const getStorageItem = async (key, defaultValue = []) => {
    try {
        const data = await AsyncStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error(`Erro ao ler ${key}:`, error);
        return defaultValue;
    }
};

const setStorageItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Erro ao salvar ${key}:`, error);
        return false;
    }
};

// ============================================
// USER SERVICE - Usuário atual da sessão
// ============================================
export const UserService = {
    /**
     * Obtém o usuário logado
     */
    async getCurrentUser() {
        return getStorageItem(STORAGE_KEYS.CURRENT_USER, null);
    },

    /**
     * Obtém o papel do usuário (professor/aluno)
     */
    async getUserRole() {
        try {
            const role = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
            return role;
        } catch {
            return null;
        }
    },

    /**
     * Define o usuário logado
     */
    async setCurrentUser(user, role) {
        await setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
        return true;
    },

    /**
     * Limpa a sessão (logout)
     */
    async clearSession() {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_ROLE);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Verifica se está logado
     */
    async isLoggedIn() {
        const user = await this.getCurrentUser();
        return user !== null;
    },
};

// ============================================
// PROFESSOR SERVICE
// ============================================
export const ProfessorService = {
    /**
     * Obtém todos os professores
     */
    async getAll() {
        return getStorageItem(STORAGE_KEYS.PROFESSORS, []);
    },

    /**
     * Busca professor por ID
     */
    async getById(id) {
        const professors = await this.getAll();
        return professors.find(p => p.id === id) || null;
    },

    /**
     * Salva ou atualiza professor
     */
    async save(professor) {
        const professors = await this.getAll();
        const index = professors.findIndex(p => p.id === professor.id);

        if (index >= 0) {
            professors[index] = { ...professors[index], ...professor };
        } else {
            professors.push(professor);
        }

        await setStorageItem(STORAGE_KEYS.PROFESSORS, professors);
        return professor;
    },

    /**
     * Remove professor
     */
    async delete(id) {
        const professors = await this.getAll();
        const filtered = professors.filter(p => p.id !== id);
        return setStorageItem(STORAGE_KEYS.PROFESSORS, filtered);
    },

    /**
     * Adiciona aluno ao professor
     */
    async addStudent(professorId, studentId) {
        const professor = await this.getById(professorId);
        if (!professor) return false;

        if (!professor.students.includes(studentId)) {
            professor.students.push(studentId);
            await this.save(professor);
        }
        return true;
    },

    /**
     * Remove aluno do professor
     */
    async removeStudent(professorId, studentId) {
        const professor = await this.getById(professorId);
        if (!professor) return false;

        professor.students = professor.students.filter(id => id !== studentId);
        await this.save(professor);
        return true;
    },
};

// ============================================
// ALUNO SERVICE
// ============================================
export const AlunoService = {
    /**
     * Obtém todos os alunos
     */
    async getAll() {
        return getStorageItem(STORAGE_KEYS.ALUNOS, []);
    },

    /**
     * Busca aluno por ID
     */
    async getById(id) {
        const alunos = await this.getAll();
        return alunos.find(a => a.id === id) || null;
    },

    /**
     * Obtém alunos de um professor específico
     */
    async getByProfessorId(professorId) {
        const alunos = await this.getAll();
        return alunos.filter(a =>
            a.professors.some(p => p.id === professorId)
        );
    },

    /**
     * Salva ou atualiza aluno
     */
    async save(aluno) {
        const alunos = await this.getAll();
        const index = alunos.findIndex(a => a.id === aluno.id);

        if (index >= 0) {
            alunos[index] = { ...alunos[index], ...aluno };
        } else {
            alunos.push(aluno);
        }

        await setStorageItem(STORAGE_KEYS.ALUNOS, alunos);
        return aluno;
    },

    /**
     * Remove aluno
     */
    async delete(id) {
        const alunos = await this.getAll();
        const filtered = alunos.filter(a => a.id !== id);
        return setStorageItem(STORAGE_KEYS.ALUNOS, filtered);
    },

    /**
     * Vincula professor ao aluno
     */
    async linkProfessor(alunoId, professorRef) {
        const aluno = await this.getById(alunoId);
        if (!aluno) return false;

        // Verifica se já está vinculado
        if (!aluno.professors.some(p => p.id === professorRef.id)) {
            aluno.professors.push(professorRef);
            await this.save(aluno);
        }
        return true;
    },

    /**
     * Remove vínculo com professor
     */
    async unlinkProfessor(alunoId, professorId) {
        const aluno = await this.getById(alunoId);
        if (!aluno) return false;

        aluno.professors = aluno.professors.filter(p => p.id !== professorId);
        await this.save(aluno);
        return true;
    },
};

// ============================================
// WORKOUT SERVICE
// ============================================
export const WorkoutService = {
    /**
     * Obtém todos os treinos
     */
    async getAll() {
        return getStorageItem(STORAGE_KEYS.WORKOUTS, []);
    },

    /**
     * Busca treino por ID
     */
    async getById(id) {
        const workouts = await this.getAll();
        return workouts.find(w => w.id === id) || null;
    },

    /**
     * Obtém treinos de um professor
     */
    async getByProfessorId(professorId) {
        const workouts = await this.getAll();
        return workouts.filter(w => w.professorId === professorId);
    },

    /**
     * Obtém treinos de um aluno
     */
    async getByStudentId(studentId) {
        const workouts = await this.getAll();
        return workouts.filter(w => w.studentId === studentId);
    },

    /**
     * Obtém treino do dia atual para um aluno
     */
    async getTodayWorkout(studentId) {
        const workouts = await this.getByStudentId(studentId);
        const today = new Date().getDay() || 7; // Converte 0 (domingo) para 7

        return workouts.find(w => w.weekDays.includes(today)) || null;
    },

    /**
     * Salva ou atualiza treino
     */
    async save(workout) {
        const workouts = await this.getAll();
        const index = workouts.findIndex(w => w.id === workout.id);

        if (index >= 0) {
            workouts[index] = { ...workouts[index], ...workout };
        } else {
            workouts.push(workout);
        }

        await setStorageItem(STORAGE_KEYS.WORKOUTS, workouts);
        return workout;
    },

    /**
     * Remove treino
     */
    async delete(id) {
        const workouts = await this.getAll();
        const filtered = workouts.filter(w => w.id !== id);
        return setStorageItem(STORAGE_KEYS.WORKOUTS, filtered);
    },
};

// ============================================
// PAYMENT SERVICE
// ============================================
export const PaymentService = {
    /**
     * Obtém todos os pagamentos
     */
    async getAll() {
        return getStorageItem(STORAGE_KEYS.PAYMENTS, []);
    },

    /**
     * Busca pagamento por ID
     */
    async getById(id) {
        const payments = await this.getAll();
        return payments.find(p => p.id === id) || null;
    },

    /**
     * Obtém pagamentos de um professor
     */
    async getByProfessorId(professorId) {
        const payments = await this.getAll();
        return payments.filter(p => p.professorId === professorId);
    },

    /**
     * Obtém pagamentos de um aluno
     */
    async getByStudentId(studentId) {
        const payments = await this.getAll();
        return payments.filter(p => p.studentId === studentId);
    },

    /**
     * Obtém pagamentos pendentes de um professor
     */
    async getPendingByProfessorId(professorId) {
        const payments = await this.getByProfessorId(professorId);
        return payments.filter(p => p.status === PaymentStatus.PENDING);
    },

    /**
     * Salva ou atualiza pagamento
     */
    async save(payment) {
        const payments = await this.getAll();
        const index = payments.findIndex(p => p.id === payment.id);

        if (index >= 0) {
            payments[index] = { ...payments[index], ...payment };
        } else {
            payments.push(payment);
        }

        await setStorageItem(STORAGE_KEYS.PAYMENTS, payments);
        return payment;
    },

    /**
     * Marca pagamento como pago
     */
    async markAsPaid(id) {
        const payment = await this.getById(id);
        if (!payment) return false;

        payment.status = PaymentStatus.PAID;
        payment.paidAt = Date.now();
        await this.save(payment);
        return true;
    },

    /**
     * Remove pagamento
     */
    async delete(id) {
        const payments = await this.getAll();
        const filtered = payments.filter(p => p.id !== id);
        return setStorageItem(STORAGE_KEYS.PAYMENTS, filtered);
    },

    /**
     * Atualiza status de pagamentos vencidos
     */
    async updateOverduePayments() {
        const payments = await this.getAll();
        const today = new Date();
        let updated = false;

        for (const payment of payments) {
            if (payment.status === PaymentStatus.PENDING) {
                const [year, month] = payment.month.split('-').map(Number);
                const dueDate = new Date(year, month - 1, payment.dueDay);

                if (today > dueDate) {
                    payment.status = PaymentStatus.OVERDUE;
                    updated = true;
                }
            }
        }

        if (updated) {
            await setStorageItem(STORAGE_KEYS.PAYMENTS, payments);
        }

        return updated;
    },
};

// ============================================
// TEMP CODES SERVICE (para sincronização offline)
// ============================================
export const TempCodeService = {
    /**
     * Salva código temporário
     */
    async saveCode(code, data, expiresAt) {
        const codes = await getStorageItem(STORAGE_KEYS.TEMP_CODES, {});
        codes[code] = { data, expiresAt };
        await setStorageItem(STORAGE_KEYS.TEMP_CODES, codes);
        return true;
    },

    /**
     * Busca dados por código
     */
    async getByCode(code) {
        const codes = await getStorageItem(STORAGE_KEYS.TEMP_CODES, {});
        const entry = codes[code];

        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            // Código expirado, remove
            delete codes[code];
            await setStorageItem(STORAGE_KEYS.TEMP_CODES, codes);
            return null;
        }

        return entry.data;
    },

    /**
     * Remove código usado
     */
    async removeCode(code) {
        const codes = await getStorageItem(STORAGE_KEYS.TEMP_CODES, {});
        delete codes[code];
        return setStorageItem(STORAGE_KEYS.TEMP_CODES, codes);
    },

    /**
     * Limpa códigos expirados
     */
    async cleanExpired() {
        const codes = await getStorageItem(STORAGE_KEYS.TEMP_CODES, {});
        const now = Date.now();

        Object.keys(codes).forEach(key => {
            if (now > codes[key].expiresAt) {
                delete codes[key];
            }
        });

        return setStorageItem(STORAGE_KEYS.TEMP_CODES, codes);
    },
};

// ============================================
// LEGACY SERVICE (migração de dados antigos)
// ============================================
export const LegacyService = {
    /**
     * Verifica se existem dados legados
     */
    async hasLegacyData() {
        const students = await AsyncStorage.getItem(STORAGE_KEYS.STUDENTS);
        return students !== null;
    },

    /**
     * Migra dados do formato antigo
     * TODO: Implementar migração completa se necessário
     */
    async migrateLegacyData() {
        // Por enquanto apenas verificamos
        const hasLegacy = await this.hasLegacyData();
        if (hasLegacy) {
            console.log('Dados legados encontrados - migração pendente');
        }
        return hasLegacy;
    },
};

// ============================================
// EXPORT DEFAULT
// ============================================
export default {
    UserService,
    ProfessorService,
    AlunoService,
    WorkoutService,
    PaymentService,
    TempCodeService,
    LegacyService,
    STORAGE_KEYS,
};
