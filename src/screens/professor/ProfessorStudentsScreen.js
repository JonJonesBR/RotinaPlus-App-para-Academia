/**
 * ProfessorStudentsScreen - Lista de Alunos do Professor
 * 
 * Gerenciamento completo de alunos vinculados
 */
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    RefreshControl,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { UserService, AlunoService, ProfessorService } from '../../services/storageService';
import {
    PremiumCard,
    SearchBar,
    Avatar,
    EmptyState,
} from '../../components/common';

export default function ProfessorStudentsScreen({ navigation }) {
    const { colors, shadows } = useTheme();

    const [professor, setProfessor] = useState(null);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const user = await UserService.getCurrentUser();
            setProfessor(user);

            if (user) {
                const allStudents = await AlunoService.getByProfessorId(user.id);
                const sorted = allStudents.sort((a, b) => a.name.localeCompare(b.name));
                setStudents(sorted);
                setFilteredStudents(sorted);
            }
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, []),
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(s =>
                s.name.toLowerCase().includes(query.toLowerCase()) ||
                s.email?.toLowerCase().includes(query.toLowerCase()),
            );
            setFilteredStudents(filtered);
        }
    };

    const handleDeleteStudent = (student) => {
        Alert.alert(
            'Remover Aluno',
            `Deseja remover ${student.name} da sua lista de alunos?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        // Remove vínculo do aluno
                        await AlunoService.unlinkProfessor(student.id, professor.id);
                        // Remove do professor
                        await ProfessorService.removeStudent(professor.id, student.id);
                        loadData();
                    },
                },
            ],
        );
    };

    const StudentCard = ({ student }) => (
        <Pressable
            onPress={() => navigation.navigate('ProfessorStudentDetail', { studentId: student.id })}
        >
            <PremiumCard style={styles.studentCard}>
                <View style={styles.studentHeader}>
                    <Avatar name={student.name} size={50} />
                    <View style={styles.studentInfo}>
                        <Text style={[styles.studentName, { color: colors.text.primary }]}>
                            {student.name}
                        </Text>
                        <Text style={[styles.studentEmail, { color: colors.text.secondary }]}>
                            {student.email || 'Sem e-mail'}
                        </Text>
                    </View>
                    <Pressable
                        style={styles.menuButton}
                        onPress={() => handleDeleteStudent(student)}
                    >
                        <Icon name="more-vert" size={24} color={colors.text.secondary} />
                    </Pressable>
                </View>

                <View style={styles.studentDetails}>
                    {student.goal && (
                        <View style={[styles.goalTag, { backgroundColor: colors.primarySurface }]}>
                            <Icon name="flag" size={14} color={colors.primary} />
                            <Text style={[styles.goalText, { color: colors.primary }]}>
                                {student.goal}
                            </Text>
                        </View>
                    )}
                    {student.phone && (
                        <View style={styles.contactRow}>
                            <Icon name="phone" size={14} color={colors.text.secondary} />
                            <Text style={[styles.contactText, { color: colors.text.secondary }]}>
                                {student.phone}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.studentActions}>
                    <Pressable
                        style={[styles.actionButton, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.navigate('ProfessorWorkoutForm', { studentId: student.id })}
                    >
                        <Icon name="add" size={18} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Criar Treino</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                        onPress={() => navigation.navigate('ProfessorQRExport', {
                            type: 'workout',
                            studentId: student.id,
                        })}
                    >
                        <Icon name="qr-code" size={18} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Enviar QR</Text>
                    </Pressable>
                </View>
            </PremiumCard>
        </Pressable>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholder="Buscar aluno..."
                />
            </View>

            {/* Students Count */}
            <View style={styles.countContainer}>
                <Text style={[styles.countText, { color: colors.text.secondary }]}>
                    {filteredStudents.length} {filteredStudents.length === 1 ? 'aluno' : 'alunos'}
                </Text>
            </View>

            {/* Students List */}
            <FlatList
                data={filteredStudents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <StudentCard student={item} />}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <EmptyState
                        icon="people"
                        title={searchQuery ? 'Nenhum aluno encontrado' : 'Nenhum aluno ainda'}
                        message={searchQuery
                            ? 'Tente outro termo de busca'
                            : 'Compartilhe seu código para vincular alunos'
                        }
                    />
                }
            />

            {/* FAB - Share Code */}
            <Pressable
                style={[styles.fab, { backgroundColor: colors.primary, ...shadows.fab }]}
                onPress={() => navigation.navigate('ProfessorQRExport', { type: 'link' })}
            >
                <Icon name="person-add" size={26} color="#FFFFFF" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        padding: 16,
        paddingBottom: 8,
    },
    countContainer: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    countText: {
        fontSize: 13,
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
        paddingBottom: 100,
    },
    studentCard: {
        marginBottom: 12,
    },
    studentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    studentInfo: {
        flex: 1,
        marginLeft: 12,
    },
    studentName: {
        fontSize: 17,
        fontWeight: '600',
    },
    studentEmail: {
        fontSize: 13,
        marginTop: 2,
    },
    menuButton: {
        padding: 8,
    },
    studentDetails: {
        marginBottom: 12,
    },
    goalTag: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        gap: 4,
        marginBottom: 8,
    },
    goalText: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    contactText: {
        fontSize: 13,
    },
    studentActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        gap: 6,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
