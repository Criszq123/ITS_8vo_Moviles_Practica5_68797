import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { auth } from '../services/auth';

export interface Note {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
}

export default function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const token = await auth.getToken?.(); // si lo tienes así en tu servicio
      if (!token) {
        console.log('[useNotes] Usuario no autenticado, no se cargan notas');
        setNotes([]); // opcional, por si quieres limpiar notas previas
        return;
      }
  
      const tareas = await api.getTareas();
      const adaptedNotes = tareas.map(tarea => ({
        ...tarea,
        title: tarea.titulo,
        content: tarea.descripcion
      }));
      setNotes(adaptedNotes);
    } catch (err) {
      console.error('[useNotes] Error al cargar notas:', err);
      setError('Error al cargar las notas');
    } finally {
      setIsLoading(false);
    }
  }, []);
  

  const saveNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTarea = await api.createTarea({
        titulo: note.titulo,
        descripcion: note.descripcion,
        completada: false
      });
      
      const newNote = {
        ...newTarea,
        title: newTarea.titulo,
        content: newTarea.descripcion,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setNotes(prev => [...prev, newNote]);
      return newNote;
    } catch (err) {
      console.error('Error saving note:', err);
      throw err;
    }
  };

  const updateNote = async (id: number, note: Partial<Note>) => {
    try {
      const updatedTarea = await api.updateTarea(id, {
        titulo: note.titulo,
        descripcion: note.descripcion,
        completada: note.completada
      });
      
      const updatedNote = {
        ...updatedTarea,
        title: updatedTarea.titulo,
        content: updatedTarea.descripcion,
        updatedAt: new Date().toISOString()
      };
      
      setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updatedNote } : n));
      return true;
    } catch (err) {
      console.error('Error updating note:', err);
      throw err;
    }
  };

  const deleteNote = async (id: number) => {
    try {
      await api.deleteTarea(id);
      setNotes(prev => prev.filter(note => note.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting note:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return { 
    notes, 
    isLoading, 
    error,
    saveNote, 
    updateNote, 
    deleteNote, 
    loadNotes 
  };
}