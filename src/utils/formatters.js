/**
 * Funções utilitárias de formatação
 */

/**
 * Formata um CPF para o padrão brasileiro (XXX.XXX.XXX-XX)
 * @param {string} text - Texto a ser formatado
 * @returns {string} CPF formatado
 */
export const formatCPF = (text) => {
    const onlyNumbers = text.replace(/\D/g, '').slice(0, 11);
    return onlyNumbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

/**
 * Valida se um CPF tem o formato correto (não valida dígitos verificadores)
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} Se o CPF tem formato válido
 */
export const isValidCPFFormat = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
};

/**
 * Formata um valor monetário para o padrão brasileiro
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} Valor formatado (ex: R$ 150,00)
 */
export const formatCurrency = (value) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'R$ 0,00';

    return numValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

/**
 * Formata uma data para o padrão brasileiro (DD/MM/YYYY)
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada
 */
export const formatDate = (date) => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Converte um array de números de dias para nomes dos dias da semana
 * @param {number[]} days - Array de números (1-7)
 * @returns {string} Dias formatados
 */
export const formatFrequencyDays = (days) => {
    if (!days || days.length === 0) return 'Nenhum dia selecionado';

    const dayNames = {
        1: 'Segunda',
        2: 'Terça',
        3: 'Quarta',
        4: 'Quinta',
        5: 'Sexta',
        6: 'Sábado',
        7: 'Domingo',
    };

    return days.map((day) => dayNames[day] || `Dia ${day}`).join(', ');
};

export default {
    formatCPF,
    isValidCPFFormat,
    formatCurrency,
    formatDate,
    formatFrequencyDays,
};
