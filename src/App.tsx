import React, { useCallback, useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, Fab } from '@mui/material';
import RGL, { WidthProvider } from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import { Add as AddIcon } from '@mui/icons-material';
import { StickyNote } from './components/StickyNote';
import { TrashPanel } from './components/TrashPanel';
import { Toolbar } from './components/Toolbar';
import { useNotesManager } from './hooks/useNotesManager';
import { useTheme } from './hooks/useTheme';
import { lightTheme, darkTheme } from './theme/theme';

import type { NoteLayout } from './hooks/useNotesManager'

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const {
    notes,
    deletedNotes,
    layouts,
    createNote,
    updateNote,
    updateLayout,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    changeColor,
    clearAllNotes,
    clearTrash,
    colors
  } = useNotesManager();

  const [trashPanelOpen, setTrashPanelOpen] = useState(false);

  const handleLayoutChange = useCallback((newLayouts: Layout[]) => {
    // Convert Layout[] to NoteLayout[]
    const noteLayouts: NoteLayout[] = newLayouts.map(layout => ({
      ...layout,
      i: layout.i
    }));
    updateLayout(noteLayouts);
  }, [updateLayout]);

  const handleAddNote = useCallback(() => {
    createNote();
  }, [createNote]);

  const handleClearAll = useCallback(() => {
    if (window.confirm(`Are you sure you want to move all ${notes.length} notes to trash?`)) {
      clearAllNotes();
    }
  }, [clearAllNotes, notes.length]);

  const handleOpenTrash = useCallback(() => {
    setTrashPanelOpen(true);
  }, []);

  const handleCloseTrash = useCallback(() => {
    setTrashPanelOpen(false);
  }, []);

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          backgroundColor: currentTheme.palette.background.default
        }}
      >
        <Toolbar
          noteCount={notes.length}
          deletedCount={deletedNotes.length}
          onAddNote={handleAddNote}
          onClearAll={handleClearAll}
          onOpenTrash={handleOpenTrash}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        <Box sx={{ pt: 8, px: 2, pb: 2, minHeight: '100vh' }}>
          {notes.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 120px)',
                textAlign: 'center',
                px: 3
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: '5rem',
                  mb: 3,
                  opacity: 0.6,
                  color: currentTheme.palette.text.secondary
                }}
              >
                📝
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontWeight: 500,
                  color: currentTheme.palette.text.primary
                }}
              >
                Add a Note
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: currentTheme.palette.text.secondary,
                  maxWidth: 500,
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}
              >
                Create your first sticky note to start organizing your thoughts.
                Drag, resize, and customize to make it yours.
              </Typography>
              <Fab
                color="primary"
                size="large"
                onClick={handleAddNote}
                sx={{
                  width: 64,
                  height: 64,
                  '&:hover': {
                    transform: 'scale(1.05)'
                  },
                  transition: 'transform 0.2s ease',
                  boxShadow: currentTheme.shadows[8]
                }}
              >
                <AddIcon sx={{ fontSize: 28 }} />
              </Fab>
            </Box>
          ) : (
            <ReactGridLayout
              className="layout"
              layout={layouts}
              onLayoutChange={handleLayoutChange}
              cols={12}
              rowHeight={60}
              margin={[16, 16]}
              containerPadding={[0, 0]}
              isDraggable={true}
              isResizable={true}
              draggableCancel=".MuiTextField-root, .MuiIconButton-root, .MuiMenu-root"
              resizeHandles={['se', 'sw', 'ne', 'nw', 'e', 'w', 'n', 's']}
              compactType={null}
              preventCollision={true}
              allowOverlap={false}
              autoSize={true}
              useCSSTransforms={true}
            >
              {notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    overflow: 'visible',
                    borderRadius: currentTheme.shape.borderRadius
                  }}
                >
                  <StickyNote
                    note={note}
                    onUpdate={updateNote}
                    onDelete={deleteNote}
                    onColorChange={changeColor}
                    colors={colors}
                  />
                </div>
              ))}
            </ReactGridLayout>
          )}
        </Box>

        <TrashPanel
          isOpen={trashPanelOpen}
          onClose={handleCloseTrash}
          deletedNotes={deletedNotes}
          onRestore={restoreNote}
          onPermanentDelete={permanentlyDeleteNote}
          onClearTrash={clearTrash}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;