import React from 'react';
import { Fab, Tooltip, useTheme } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface TrashZoneProps {
  isActive: boolean;
  noteCount: number;
}

export const TrashZone: React.FC<TrashZoneProps> = ({ isActive, noteCount }) => {
  const theme = useTheme();

  if (noteCount === 0) return null;

  return (
    <Tooltip title="Drag notes here to delete" placement="left">
      <Fab
        color="error"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 72,
          height: 72,
          backgroundColor: isActive ? theme.palette.error.dark : theme.palette.error.main,
          transform: isActive ? 'scale(1.2)' : 'scale(1)',
          transition: 'all 0.3s ease',
          boxShadow: isActive 
            ? `0 8px 25px ${theme.palette.error.main}40`
            : theme.shadows[6],
          border: isActive ? `3px solid ${theme.palette.common.white}` : 'none',
          '&:hover': {
            backgroundColor: theme.palette.error.dark,
            transform: 'scale(1.1)'
          },
          zIndex: 1000
        }}
      >
        <DeleteIcon sx={{ fontSize: 28 }} />
      </Fab>
    </Tooltip>
  );
};