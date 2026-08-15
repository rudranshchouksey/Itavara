import { Router } from 'express';
import { HostsController } from '../controllers/hosts.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

// Create a new highlight
router.post('/highlights', authGuard, HostsController.createHighlight);

// Get host highlights (public)
router.get('/:id/highlights', HostsController.getHostHighlights);

// Delete a highlight
router.delete('/highlights/:id', authGuard, HostsController.deleteHighlight);

export default router;
