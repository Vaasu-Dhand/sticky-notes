import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    Paper,
    TextField,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Tooltip,
    useTheme,
    alpha,
    Typography
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Palette as PaletteIcon,
    MoreVert as MoreIcon
} from '@mui/icons-material';
import type { Note } from '../hooks/useNotesManager';

interface StickyNoteProps {
    note: Note;
    onUpdate: (note: Note) => void;
    onDelete: (id: string) => void;
    onColorChange: (id: string, color: string) => void;
    colors: string[];
}

/**
 * StickyNote component representing an individual note with editing, color change, and delete functionalities.
 */
export const StickyNote: React.FC<StickyNoteProps> = ({
    note,
    onUpdate,
    onDelete,
    onColorChange,
    colors
}) => {
    const theme = useTheme();
    const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);
    const [optionsMenuAnchor, setOptionsMenuAnchor] = useState<null | HTMLElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [localText, setLocalText] = useState(note.text);
    const textFieldRef = useRef<HTMLInputElement>(null);

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        setLocalText(newText);
        // Ideally, this should be debounced update to avoid too frequent API calls.
        // It's okay here, since we're mocking API.
        onUpdate({ ...note, text: newText });
    }, [note, onUpdate]);

    const handleTextFieldFocus = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleTextFieldBlur = useCallback(() => {
        setIsEditing(false);
        // Ensure final update on blur
        if (localText !== note.text) {
            onUpdate({ ...note, text: localText });
        }
    }, [localText, note, onUpdate]);

    const handleColorMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setColorMenuAnchor(event.currentTarget);
        setOptionsMenuAnchor(null);
    }, []);

    const handleOptionsMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setOptionsMenuAnchor(event.currentTarget);
        setColorMenuAnchor(null);
    }, []);

    const handleMenuClose = useCallback(() => {
        setColorMenuAnchor(null);
        setOptionsMenuAnchor(null);
    }, []);

    const handleColorSelect = useCallback((color: string) => {
        onColorChange(note.id, color);
        handleMenuClose();
    }, [note.id, onColorChange, handleMenuClose]);

    const handleDelete = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        onDelete(note.id);
        handleMenuClose();
    }, [onDelete, note.id, handleMenuClose]);

    // Determine if the color is light or dark for text contrast
    const isLightColor = (color: string) => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128;
    };

    const textColor = isLightColor(note.color) ? '#1a1a1a' : '#ffffff';
    const secondaryTextColor = isLightColor(note.color) ? '#666666' : '#cccccc';

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: note.color,
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'move',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: note.zIndex,
                    border: `1px solid ${alpha('#000', 0.06)}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${alpha('#000', 0.12)}, 0 3px 10px ${alpha('#000', 0.08)}`,
                        '& .note-actions': {
                            opacity: 1
                        }
                    },
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, ${alpha('#fff', 0.3)} 0%, ${alpha('#000', 0.1)} 100%)`,
                        borderRadius: '12px 12px 0 0'
                    }
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        pb: 1,
                        minHeight: '48px'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: secondaryTextColor,
                                fontSize: '11px',
                                fontWeight: 500,
                                opacity: 0.8,
                                letterSpacing: '0.025em'
                            }}
                        >
                            {new Date(note.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </Typography>
                    </Box>

                    <Box
                        className="note-actions"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            opacity: 0.3,
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <Tooltip title="Change color" placement="top">
                            <IconButton
                                size="small"
                                onClick={handleColorMenuOpen}
                                sx={{
                                    width: 28,
                                    height: 28,
                                    color: secondaryTextColor,
                                    '&:hover': {
                                        backgroundColor: alpha('#000', 0.08),
                                        color: textColor
                                    }
                                }}
                            >
                                <PaletteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="More options" placement="top">
                            <IconButton
                                size="small"
                                onClick={handleOptionsMenuOpen}
                                sx={{
                                    width: 28,
                                    height: 28,
                                    color: secondaryTextColor,
                                    '&:hover': {
                                        backgroundColor: alpha('#000', 0.08),
                                        color: textColor
                                    }
                                }}
                            >
                                <MoreIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Content area */}
                <Box sx={{ flex: 1, px: 1.5, pb: 1.5 }}>
                    <TextField
                        ref={textFieldRef}
                        multiline
                        fullWidth
                        variant="standard"
                        placeholder="Click to add your note..."
                        value={localText}
                        onChange={handleTextChange}
                        onFocus={handleTextFieldFocus}
                        onBlur={handleTextFieldBlur}
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                fontSize: '14px',
                                lineHeight: 1.5,
                                fontWeight: 400,
                                color: textColor,
                                cursor: isEditing ? 'text' : 'inherit',
                                '& .MuiInputBase-input': {
                                    cursor: isEditing ? 'text' : 'inherit',
                                    color: textColor,
                                    padding: 0,
                                    '&::placeholder': {
                                        color: secondaryTextColor,
                                        opacity: 0.8,
                                        fontStyle: 'normal'
                                    }
                                }
                            }
                        }}
                        sx={{
                            '& .MuiInput-root': {
                                '&:before': { display: 'none' },
                                '&:after': { display: 'none' }
                            }
                        }}
                    />
                </Box>

                {/* Subtle drag indicator */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        width: 16,
                        height: 16,
                        opacity: 0.2,
                        background: `repeating-linear-gradient(
              45deg,
              ${textColor},
              ${textColor} 1px,
              transparent 1px,
              transparent 3px
            )`
                    }}
                />
            </Paper>

            {/* Color picker menu */}
            <Menu
                anchorEl={colorMenuAnchor}
                open={Boolean(colorMenuAnchor)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        p: 1.5,
                        minWidth: 'auto',
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        boxShadow: theme.shadows[8]
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxWidth: 200 }}>
                    {colors.map((color) => (
                        <Tooltip key={color} title={`Change to ${color}`} placement="top">
                            <IconButton
                                onClick={() => handleColorSelect(color)}
                                sx={{
                                    width: 36,
                                    height: 36,
                                    padding: 0,
                                    borderRadius: '8px',
                                    backgroundColor: color,
                                    border: color === note.color
                                        ? `3px solid ${theme.palette.primary.main}`
                                        : `1px solid ${alpha('#000', 0.1)}`,
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        boxShadow: `0 4px 12px ${alpha(color, 0.4)}`
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            />
                        </Tooltip>
                    ))}
                </Box>
            </Menu>

            {/* Options menu */}
            <Menu
                anchorEl={optionsMenuAnchor}
                open={Boolean(optionsMenuAnchor)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        minWidth: 150,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        boxShadow: theme.shadows[8]
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem
                    onClick={handleDelete}
                    sx={{
                        color: theme.palette.error.main,
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.08)
                        }
                    }}
                >
                    <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
                    Delete Note
                </MenuItem>
            </Menu>
        </>
    );
};