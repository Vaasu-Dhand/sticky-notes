import React from 'react';
import {
    AppBar,
    Toolbar as MuiToolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Tooltip,
    useTheme,
    Badge
} from '@mui/material';
import {
    Add as AddIcon,
    Clear as ClearIcon,
    StickyNote2 as NoteIcon,
    Delete as DeleteIcon,
    LightModeOutlined as LightModeIcon,
    DarkModeOutlined as DarkModeIcon
} from '@mui/icons-material';

interface ToolbarProps {
    noteCount: number;
    deletedCount: number;
    onAddNote: () => void;
    onClearAll: () => void;
    onOpenTrash: () => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

/**
 *  Toolbar component with actions for adding notes, clearing all notes, toggling theme, and opening trash.
 */
export const Toolbar: React.FC<ToolbarProps> = ({
    noteCount,
    deletedCount,
    onAddNote,
    onClearAll,
    onOpenTrash,
    isDarkMode,
    onToggleTheme
}) => {
    const theme = useTheme();

    const iconButtonStyles = {
        color: theme.palette.text.secondary,
        borderRadius: 2,
        '&:hover': {
            backgroundColor: `${theme.palette.primary.main}15`,
            color: theme.palette.primary.main
        },
        '&:focus': {
            outline: 'none',
            boxShadow: 'none'
        },
        '&.MuiIconButton-root': {
            '&:focus': {
                outline: 'none'
            }
        }
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary
            }}
        >
            <MuiToolbar
                sx={{
                    minHeight: '64px !important',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                {/* Left side - Empty for spacing */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '200px' }} />

                {/* Center - Title */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    <NoteIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary
                        }}
                    >
                        Sticky Notes
                    </Typography>
                </Box>

                {/* Right side - Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                        <IconButton
                            onClick={onToggleTheme}
                            sx={iconButtonStyles}
                        >
                            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Open trash">
                        <Badge badgeContent={deletedCount} color="error">
                            <IconButton
                                onClick={onOpenTrash}
                                sx={iconButtonStyles}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Badge>
                    </Tooltip>

                    {noteCount > 0 && (
                        <Tooltip title="Clear all notes">
                            <IconButton
                                onClick={onClearAll}
                                sx={iconButtonStyles}
                            >
                                <ClearIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    <Tooltip title="Add new note">
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={onAddNote}
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 500,
                                px: 2,
                                py: 1,
                                minWidth: 'auto',
                                height: '36px',
                                fontSize: '0.875rem',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                    transform: 'translateY(-1px)'
                                },
                                '&:focus': {
                                    outline: 'none',
                                    boxShadow: 'none'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Add Note
                        </Button>
                    </Tooltip>
                </Box>
            </MuiToolbar>
        </AppBar>
    );
};