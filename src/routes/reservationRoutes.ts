import { Router } from 'express';
import { ReservationController } from '../controllers/reservationController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();
const reservationController = new ReservationController();

// Employee & Admin routes
router.post('/', authenticateToken, reservationController.createReservation);
router.get('/me', authenticateToken, reservationController.getMyReservations);
router.patch('/:id/cancel', authenticateToken, reservationController.cancelReservation);

// Admin-only routes
router.get('/admin/all', authenticateToken, requireRole('ADMIN'), reservationController.getAllReservations);
router.patch('/admin/:id/status', authenticateToken, requireRole('ADMIN'), reservationController.updateApprovalStatus);

export default router;