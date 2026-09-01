import { Router } from 'express';
import { EquipmentController } from '../controllers/equipmentController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();
const equipmentController = new EquipmentController();

// Public / Authenticated user routes
router.get('/', authenticateToken, equipmentController.getEquipment);
router.get('/:id', authenticateToken, equipmentController.getEquipmentById);

// Admin-only routes
router.post('/', authenticateToken, requireRole('ADMIN'), equipmentController.createEquipment);
router.patch('/:id', authenticateToken, requireRole('ADMIN'), equipmentController.updateEquipment);

export default router;