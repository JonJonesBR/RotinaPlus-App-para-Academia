/**
 * StorageService - Camada de abstração para AsyncStorage
 * Centraliza todas as operações de persistência de dados
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves de armazenamento
const STORAGE_KEYS = {
    STUDENTS: '@students',
    CUSTOM_PLANS: '@customPlans',
};

/**
 * Serviço de gerenciamento de alunos
 */
export const StudentService = {
    /**
     * Obtém todos os alunos
     * @returns {Promise<Array>} Lista de alunos
     */
    getAll: async () => {
        try {
            const storedStudents = await AsyncStorage.getItem(STORAGE_KEYS.STUDENTS);
            return storedStudents ? JSON.parse(storedStudents) : [];
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
            return [];
        }
    },

    /**
     * Obtém todos os alunos ordenados por nome
     * @returns {Promise<Array>} Lista de alunos ordenada
     */
    getAllSorted: async () => {
        try {
            const students = await StudentService.getAll();
            return students.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error('Erro ao carregar alunos ordenados:', error);
            return [];
        }
    },

    /**
     * Obtém um aluno pelo ID
     * @param {string} id - ID do aluno
     * @returns {Promise<Object|null>} Aluno encontrado ou null
     */
    getById: async (id) => {
        try {
            const students = await StudentService.getAll();
            return students.find((s) => s.id === id) || null;
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            return null;
        }
    },

    /**
     * Salva ou atualiza um aluno
     * @param {Object} student - Dados do aluno
     * @returns {Promise<Object>} Aluno salvo
     */
    save: async (student) => {
        try {
            const students = await StudentService.getAll();

            const studentToSave = student.id
                ? student
                : { ...student, id: Date.now().toString() };

            const updatedStudents = student.id
                ? students.map((s) => (s.id === student.id ? studentToSave : s))
                : [...students, studentToSave];

            await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
            return studentToSave;
        } catch (error) {
            console.error('Erro ao salvar aluno:', error);
            throw error;
        }
    },

    /**
     * Remove um aluno pelo ID
     * @param {string} id - ID do aluno
     * @returns {Promise<boolean>} Sucesso da operação
     */
    delete: async (id) => {
        try {
            const students = await StudentService.getAll();
            const updatedStudents = students.filter((s) => s.id !== id);
            await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
            return true;
        } catch (error) {
            console.error('Erro ao excluir aluno:', error);
            return false;
        }
    },

    /**
     * Vincula exercícios a um aluno
     * @param {string} studentId - ID do aluno
     * @param {Object} exercise - Dados do exercício
     * @returns {Promise<boolean>} Sucesso da operação
     */
    linkExercise: async (studentId, exercise) => {
        try {
            const students = await StudentService.getAll();

            const updatedStudents = students.map((s) => {
                if (s.id === studentId) {
                    const linkedExercises = s.linkedExercises || [];
                    return {
                        ...s,
                        linkedExercises: [...linkedExercises, exercise],
                    };
                }
                return s;
            });

            await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
            return true;
        } catch (error) {
            console.error('Erro ao vincular exercício:', error);
            return false;
        }
    },

    /**
     * Remove um exercício de um aluno
     * @param {string} studentId - ID do aluno
     * @param {string} exerciseId - ID do exercício
     * @returns {Promise<boolean>} Sucesso da operação
     */
    unlinkExercise: async (studentId, exerciseId) => {
        try {
            const students = await StudentService.getAll();

            const updatedStudents = students.map((s) => {
                if (s.id === studentId) {
                    const updatedExercises = s.linkedExercises.filter(
                        (exercise) => exercise.id !== exerciseId
                    );
                    return { ...s, linkedExercises: updatedExercises };
                }
                return s;
            });

            await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
            return true;
        } catch (error) {
            console.error('Erro ao desvincular exercício:', error);
            return false;
        }
    },
};

/**
 * Serviço de gerenciamento de planos/séries de exercícios
 */
export const ExercisePlanService = {
    /**
     * Obtém todos os planos de exercícios
     * @returns {Promise<Array>} Lista de planos
     */
    getAll: async () => {
        try {
            const storedPlans = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_PLANS);
            return storedPlans ? JSON.parse(storedPlans) : [];
        } catch (error) {
            console.error('Erro ao carregar planos:', error);
            return [];
        }
    },

    /**
     * Salva ou atualiza um plano
     * @param {Object} plan - Dados do plano
     * @returns {Promise<Object>} Plano salvo
     */
    save: async (plan) => {
        try {
            const plans = await ExercisePlanService.getAll();

            const planToSave = plan.id
                ? plan
                : { ...plan, id: Date.now().toString() };

            const updatedPlans = plan.id
                ? plans.map((p) => (p.id === plan.id ? planToSave : p))
                : [...plans, planToSave];

            await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_PLANS, JSON.stringify(updatedPlans));
            return planToSave;
        } catch (error) {
            console.error('Erro ao salvar plano:', error);
            throw error;
        }
    },

    /**
     * Remove um plano pelo ID
     * @param {string} id - ID do plano
     * @returns {Promise<boolean>} Sucesso da operação
     */
    delete: async (id) => {
        try {
            const plans = await ExercisePlanService.getAll();
            const updatedPlans = plans.filter((p) => p.id !== id);
            await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_PLANS, JSON.stringify(updatedPlans));
            return true;
        } catch (error) {
            console.error('Erro ao excluir plano:', error);
            return false;
        }
    },
};

export default {
    StudentService,
    ExercisePlanService,
    STORAGE_KEYS,
};
