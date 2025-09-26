import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Layout } from 'react-grid-layout';

export interface Note {
  id: string;
  text: string;
  color: string;
  zIndex: number;
  createdAt: number;
  isDeleted?: boolean;
  deletedAt?: number;
}

export interface NoteLayout extends Layout {
  i: string; // note id
}

interface NotesAPI {
  saveNote: (note: Note) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  updateNote: (note: Note) => Promise<Note>;
  restoreNote: (id: string) => Promise<void>;
}

// Mock API with async behavior
const mockAPI: NotesAPI = {
  saveNote: async (note: Note) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return note;
  },
  deleteNote: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 150));
  },
  updateNote: async (note: Note) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return note;
  },
  restoreNote: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

const COLORS = [
  '#FFE066', // Yellow
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Light Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#FFB347', // Orange
  '#B19CD9', // Lavender
  '#FF8A95', // Pink
  '#87CEEB', // Sky Blue
];

export function useNotesManager() {
  const [notes, setNotes] = useLocalStorage<Note[]>('sticky-notes', []);
  const [layouts, setLayouts] = useLocalStorage<NoteLayout[]>('sticky-notes-layout', []);
  const [newCounter, setNewCounter] = useState(() => {
    // Initialize counter based on existing notes to avoid conflicts
    const existingIds = notes.map(n => n.id).filter(id => id.startsWith('n'));
    const maxId = existingIds.reduce((max, id) => {
      const num = parseInt(id.substring(1));
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return maxId + 1;
  });
  // Track max zIndex to manage layering of notes
  const [maxZIndex, setMaxZIndex] = useState(() => 
    Math.max(...notes.filter(n => !n.isDeleted).map(n => n.zIndex), 0)
  );

  // Get only active (non-deleted) notes
  const activeNotes = notes.filter(note => !note.isDeleted);
  const deletedNotes = notes.filter(note => note.isDeleted);
  const activeLayouts = layouts.filter(layout => 
    activeNotes.some(note => note.id === layout.i)
  );

  const createNote = useCallback(async () => {
    const noteId = `n${newCounter}`;
    
    const newNote: Note = {
      id: noteId,
      text: '',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      zIndex: maxZIndex + 1,
      createdAt: Date.now(),
      isDeleted: false
    };

    // Simple positioning logic from react-grid-layout example
    // Calculate position based on existing layouts to avoid overlap
    const cols = 12;
    const newLayout: NoteLayout = {
      i: noteId,
      x: (activeLayouts.length * 3) % cols,
      y: 0, // Let the grid layout handle vertical positioning
      w: 3,
      h: 4,
      minW: 2,
      minH: 3,
      maxW: 8,
      maxH: 12
    };

    try {
      const savedNote = await mockAPI.saveNote(newNote);
      setNotes(prev => [...prev, savedNote]);
      setLayouts(prev => [...prev, newLayout]);
      setNewCounter(prev => prev + 1);
      setMaxZIndex(prev => prev + 1);
      return savedNote;
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  }, [activeLayouts, setNotes, setLayouts, newCounter, maxZIndex]);

  const updateNote = useCallback(async (updatedNote: Note) => {
    try {
      const savedNote = await mockAPI.updateNote(updatedNote);
      setNotes(prev => prev.map(note => 
        note.id === savedNote.id ? savedNote : note
      ));
      return savedNote;
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  }, [setNotes]);

  const updateLayout = useCallback((newLayouts: NoteLayout[]) => {
    setLayouts(prev => {
      const deletedLayouts = prev.filter(layout => 
        !newLayouts.some(newLayout => newLayout.i === layout.i)
      );
      return [...newLayouts, ...deletedLayouts];
    });
  }, [setLayouts]);

  const deleteNote = useCallback(async (id: string) => {
    try {
      const noteToDelete = notes.find(note => note.id === id);
      if (noteToDelete) {
        const deletedNote = { 
          ...noteToDelete, 
          isDeleted: true, 
          deletedAt: Date.now() 
        };
        await mockAPI.updateNote(deletedNote);
        setNotes(prev => prev.map(note => 
          note.id === id ? deletedNote : note
        ));
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  }, [notes, setNotes]);

  const restoreNote = useCallback(async (id: string) => {
    try {
      await mockAPI.restoreNote(id);
      const noteToRestore = notes.find(note => note.id === id);
      if (noteToRestore) {
        const restoredNote = { 
          ...noteToRestore, 
          isDeleted: false, 
          deletedAt: undefined,
          zIndex: maxZIndex + 1
        };
        
        // Simple positioning for restored notes
        const cols = 12;
        const restoredLayout: NoteLayout = {
          i: id,
          x: (activeLayouts.length * 3) % cols,
          y: 0,
          w: 3,
          h: 4,
          minW: 2,
          minH: 3,
          maxW: 8,
          maxH: 12
        };
        
        setNotes(prev => prev.map(note => 
          note.id === id ? restoredNote : note
        ));
        setLayouts(prev => {
          const filtered = prev.filter(layout => layout.i !== id);
          return [...filtered, restoredLayout];
        });
        setMaxZIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to restore note:', error);
      throw error;
    }
  }, [notes, setNotes, setLayouts, maxZIndex, activeLayouts]);

  const permanentlyDeleteNote = useCallback(async (id: string) => {
    try {
      await mockAPI.deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
      setLayouts(prev => prev.filter(layout => layout.i !== id));
    } catch (error) {
      console.error('Failed to permanently delete note:', error);
      throw error;
    }
  }, [setNotes, setLayouts]);

  const changeColor = useCallback(async (id: string, color: string) => {
    const note = activeNotes.find(n => n.id === id);
    if (note) {
      await updateNote({ ...note, color });
    }
  }, [activeNotes, updateNote]);

  const clearAllNotes = useCallback(async () => {
    try {
      const currentActiveNotes = notes.filter(note => !note.isDeleted);
      const deletedNotes = currentActiveNotes.map(note => ({
        ...note,
        isDeleted: true,
        deletedAt: Date.now()
      }));

      setNotes(prev =>
        prev.map(note => {
          const deletedNote = deletedNotes.find(d => d.id === note.id);
          return deletedNote || note;
        })
      );

      await Promise.all(
        currentActiveNotes.map(note => mockAPI.updateNote({
          ...note,
          isDeleted: true,
          deletedAt: Date.now()
        }))
      );
    } catch (error) {
      console.error('Failed to clear all notes:', error);
      throw error;
    }
  }, [notes, setNotes]);

  const clearTrash = useCallback(async () => {
    try {
      const currentDeletedNotes = notes.filter(note => note.isDeleted);
      const deletedNoteIds = currentDeletedNotes.map(note => note.id);

      setNotes(prev => prev.filter(note => !note.isDeleted));
      setLayouts(prev => prev.filter(layout => !deletedNoteIds.includes(layout.i)));

      await Promise.all(
        currentDeletedNotes.map(note => mockAPI.deleteNote(note.id))
      );
    } catch (error) {
      console.error('Failed to clear trash:', error);
      throw error;
    }
  }, [notes, setNotes, setLayouts]);

  return {
    notes: activeNotes,
    deletedNotes,
    layouts: activeLayouts,
    createNote,
    updateNote,
    updateLayout,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    changeColor,
    clearAllNotes,
    clearTrash,
    colors: COLORS
  };
}