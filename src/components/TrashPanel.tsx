import React, { useState } from 'react';
import {
	Drawer,
	Box,
	Typography,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Tooltip,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Chip,
	useTheme,
	alpha
} from '@mui/material';
import {
	Delete as DeleteIcon,
	Restore as RestoreIcon,
	Close as CloseIcon,
	DeleteSweep as DeleteSweepIcon
} from '@mui/icons-material';
import type { Note } from '../hooks/useNotesManager';

interface TrashPanelProps {
	isOpen: boolean;
	onClose: () => void;
	deletedNotes: Note[];
	onRestore: (id: string) => void;
	onPermanentDelete: (id: string) => void;
	onClearTrash: () => void;
}

/**
 * TrashPanel component for managing deleted notes.
 */
export const TrashPanel: React.FC<TrashPanelProps> = ({
	isOpen,
	onClose,
	deletedNotes,
	onRestore,
	onPermanentDelete,
	onClearTrash
}) => {
	const theme = useTheme();
	const [clearDialogOpen, setClearDialogOpen] = useState(false);
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

	const handleRestore = (id: string) => {
		onRestore(id);
	};

	const handlePermanentDelete = (id: string) => {
		setDeleteConfirmId(id);
	};

	const confirmPermanentDelete = () => {
		if (deleteConfirmId) {
			onPermanentDelete(deleteConfirmId);
			setDeleteConfirmId(null);
		}
	};

	const handleClearTrash = () => {
		setClearDialogOpen(true);
	};

	const confirmClearTrash = () => {
		onClearTrash();
		setClearDialogOpen(false);
	};

	const formatDeletedDate = (timestamp: number) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		return `${diffDays}d ago`;
	};

	return (
		<>
			<Drawer
				anchor="right"
				open={isOpen}
				onClose={onClose}
				PaperProps={{
					sx: {
						width: 400,
						backgroundColor: theme.palette.background.default,
						borderLeft: `1px solid ${theme.palette.divider}`
					}
				}}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
					{/* Header */}
					<Box
						sx={{
							p: 2,
							borderBottom: `1px solid ${theme.palette.divider}`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							backgroundColor: alpha(theme.palette.error.main, 0.05)
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<DeleteIcon sx={{ color: theme.palette.error.main }} />
							<Typography variant="h6" sx={{ fontWeight: 600 }}>
								Trash
							</Typography>
							<Chip
								label={deletedNotes.length}
								size="small"
								color="error"
								variant="outlined"
							/>
						</Box>
						<IconButton onClick={onClose} size="small">
							<CloseIcon />
						</IconButton>
					</Box>

					{/* Content */}
					<Box sx={{ flex: 1, overflow: 'auto' }}>
						{deletedNotes.length === 0 ? (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									height: '60%',
									textAlign: 'center',
									px: 3
								}}
							>
								<DeleteIcon
									sx={{
										fontSize: 64,
										color: theme.palette.grey[400],
										mb: 2
									}}
								/>
								<Typography
									variant="body1"
									sx={{
										color: theme.palette.text.secondary,
										mb: 1
									}}
								>
									Trash is empty
								</Typography>
								<Typography
									variant="body2"
									sx={{
										color: theme.palette.text.secondary,
										fontSize: '0.875rem'
									}}
								>
									Deleted notes will appear here
								</Typography>
							</Box>
						) : (
							<List sx={{ px: 1, py: 1 }}>
								{deletedNotes.map((note) => (
									<ListItem
										key={note.id}
										sx={{
											mb: 1,
											backgroundColor: alpha(note.color, 0.3),
											borderRadius: 2,
											border: `1px solid ${theme.palette.divider}`,
											'&:hover': {
												backgroundColor: alpha(note.color, 0.4)
											}
										}}
									>
										<ListItemText

											primary={
												<Typography
													component='div'
													variant="body2"
													sx={{
														fontWeight: 500,
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap'
													}}
												>
													{note.text.trim() || 'Untitled Note'}
												</Typography>
											}
											secondary={
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }} component='div'>
													<Typography component="div"
														variant="caption" color="text.secondary"
													>
														Deleted {note.deletedAt ? formatDeletedDate(note.deletedAt) : 'recently'}
													</Typography>
													<Chip

														size="small"
														label={new Date(note.createdAt).toLocaleDateString()}
														variant="outlined"
														sx={{
															height: 18,
															fontSize: '10px',
															'& .MuiChip-label': { px: 1 }
														}}
													/>
												</Box>
											}
										/>
										<ListItemSecondaryAction>
											<Box sx={{ display: 'flex', gap: 0.5 }}>
												<Tooltip title="Restore note">
													<IconButton
														size="small"
														onClick={() => handleRestore(note.id)}
														sx={{
															color: theme.palette.success.main,
															'&:hover': {
																backgroundColor: alpha(theme.palette.success.main, 0.1)
															}
														}}
													>
														<RestoreIcon fontSize="small" />
													</IconButton>
												</Tooltip>
												<Tooltip title="Delete permanently">
													<IconButton
														size="small"
														onClick={() => handlePermanentDelete(note.id)}
														sx={{
															color: theme.palette.error.main,
															'&:hover': {
																backgroundColor: alpha(theme.palette.error.main, 0.1)
															}
														}}
													>
														<DeleteIcon fontSize="small" />
													</IconButton>
												</Tooltip>
											</Box>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>
						)}
					</Box>

					{/* Footer */}
					{deletedNotes.length > 0 && (
						<Box
							sx={{
								p: 2,
								borderTop: `1px solid ${theme.palette.divider}`,
								backgroundColor: theme.palette.background.paper
							}}
						>
							<Button
								fullWidth
								variant="outlined"
								color="error"
								startIcon={<DeleteSweepIcon />}
								onClick={handleClearTrash}
								sx={{ textTransform: 'none' }}
							>
								Empty Trash ({deletedNotes.length})
							</Button>
						</Box>
					)}
				</Box>
			</Drawer>

			{/* Permanent delete confirmation dialog */}
			<Dialog
				open={deleteConfirmId !== null}
				onClose={() => setDeleteConfirmId(null)}
				maxWidth="sm"
			>
				<DialogTitle>Delete Permanently</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to permanently delete this note? This action cannot be undone.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteConfirmId(null)}>
						Cancel
					</Button>
					<Button
						onClick={confirmPermanentDelete}
						color="error"
						variant="contained"
					>
						Delete Permanently
					</Button>
				</DialogActions>
			</Dialog>

			{/* Clear trash confirmation dialog */}
			<Dialog
				open={clearDialogOpen}
				onClose={() => setClearDialogOpen(false)}
				maxWidth="sm"
				fullWidth
				slotProps={{
					paper: {
						sx: {
							borderRadius: 3,
							boxShadow: theme.shadows[10]
						}
					}
				}}
			>
				<DialogTitle
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 2,
						pb: 2,
						fontSize: '1.25rem',
						fontWeight: 600
					}}
				>
					<Box
						sx={{
							width: 48,
							height: 48,
							borderRadius: '50%',
							backgroundColor: alpha(theme.palette.error.main, 0.1),
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<DeleteSweepIcon
							sx={{
								color: theme.palette.error.main,
								fontSize: 24
							}}
						/>
					</Box>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
							Empty Trash
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Permanently delete all notes in trash
						</Typography>
					</Box>
				</DialogTitle>

				<DialogContent sx={{ px: 3, pb: 2 }}>
					<Box
						sx={{
							backgroundColor: alpha(theme.palette.warning.main, 0.08),
							border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
							borderRadius: 2,
							p: 2,
							mb: 2
						}}
					>
						<Typography
							variant="body2"
							sx={{
								fontWeight: 500,
								color: theme.palette.warning.dark,
								mb: 1
							}}
						>
							⚠️ This action cannot be undone
						</Typography>
						<Typography variant="body2" color="text.secondary">
							You're about to permanently delete all {deletedNotes.length} notes from the trash.
							These notes will be completely removed and cannot be recovered.
						</Typography>
					</Box>

					{deletedNotes.length > 0 && (
						<Box sx={{ maxHeight: 120, overflow: 'auto' }}>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
								Notes to be deleted:
							</Typography>
							{deletedNotes.slice(0, 3).map((note) => (
								<Box
									key={note.id}
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 1,
										p: 1,
										backgroundColor: alpha(note.color, 0.2),
										borderRadius: 1,
										mb: 0.5,
										border: `1px solid ${alpha(note.color, 0.3)}`
									}}
								>
									<Typography
										variant="body2"
										sx={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											flex: 1
										}}
									>
										{note.text.trim() || 'Untitled Note'}
									</Typography>
								</Box>
							))}
							{deletedNotes.length > 3 && (
								<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
									and {deletedNotes.length - 3} more...
								</Typography>
							)}
						</Box>
					)}
				</DialogContent>

				<DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
					<Button
						onClick={() => setClearDialogOpen(false)}
						variant="outlined"
						sx={{
							textTransform: 'none',
							borderRadius: 2,
							px: 3
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={confirmClearTrash}
						color="error"
						variant="contained"
						startIcon={<DeleteSweepIcon />}
						sx={{
							textTransform: 'none',
							borderRadius: 2,
							px: 3,
							fontWeight: 600,
							boxShadow: theme.shadows[3],
							'&:hover': {
								boxShadow: theme.shadows[6]
							}
						}}
					>
						Empty Trash ({deletedNotes.length})
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};