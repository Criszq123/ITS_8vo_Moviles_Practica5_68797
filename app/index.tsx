import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import useNotes from '../hooks/useNotes';
import { auth } from '../services/auth';

export default function NotesListScreen() {
    const router = useRouter();
    const { notes, isLoading, error, deleteNote, loadNotes } = useNotes();

    useFocusEffect(
        useCallback(() => {
            const checkAuth = async () => {
                const token = await auth.getToken();
                if (!token) {
                    router.replace('/login');
                } else {
                    loadNotes();
                }
            };
            checkAuth();
        }, [loadNotes])
    );

    const handleEditNote = (noteId: number) => {
        router.push(`/create-note?id=${noteId}`);
    };

    const handleDeleteNote = async (noteId: number) => {
        Alert.alert(
            'Eliminar Nota',
            '¿Estás seguro de que quieres eliminar esta nota?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteNote(noteId);
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la nota');
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator animating={true} size="large" color="#0a66c2" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {notes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No hay notas creadas</Text>
                    </View>
                ) : (
                    notes.map(note => (
                        <View key={note.id} style={styles.noteCard}>
                            <View style={styles.noteTitleContainer}>
                                <Text style={styles.noteTitle}>{note.titulo}</Text>
                            </View>
                            <View style={styles.noteContentContainer}>
                                <Text numberOfLines={3} ellipsizeMode="tail" style={styles.noteContent}>
                                    {note.descripcion.replace(/<[^>]*>/g, '').substring(0, 200)}
                                </Text>
                            </View>
                            <View style={styles.noteActions}>
                                <TouchableOpacity style={styles.editButton} onPress={() => handleEditNote(note.id)}>
                                    <MaterialIcons name="edit" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteNote(note.id)}>
                                    <MaterialIcons name="delete" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Floating Action Buttons */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/create-note')}
            >
                <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.logoutFab}
                onPress={() => {
                    Alert.alert(
                        'Cerrar sesión',
                        '¿Estás seguro de que quieres cerrar sesión?',
                        [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                                text: 'Cerrar sesión',
                                style: 'destructive',
                                onPress: async () => {
                                    await auth.logout();
                                    router.replace('/login');
                                },
                            },
                        ]
                    );
                }}
            >
                <MaterialIcons name="logout" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Fondo blanco consistente
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f6f8', // Fondo gris claro consistente
    },
    scrollContainer: {
        paddingBottom: 80,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
    noteCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        elevation: 2, // Sombra sutil
        padding: 16,
    },
    noteTitleContainer: {
        marginBottom: 8,
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    noteContentContainer: {
        marginBottom: 12,
    },
    noteContent: {
        color: '#555',
        lineHeight: 20,
    },
    noteActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    editButton: {
        backgroundColor: '#0a66c2', // Azul consistente
        borderRadius: 20,
        padding: 8,
        marginLeft: 8,
    },
    deleteButton: {
        backgroundColor: '#d32f2f', // Rojo consistente
        borderRadius: 20,
        padding: 8,
        marginLeft: 8,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#0a66c2', // Azul consistente
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    logoutFab: {
        position: 'absolute',
        left: 20,
        bottom: 20,
        backgroundColor: '#d32f2f', // Rojo consistente
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
});