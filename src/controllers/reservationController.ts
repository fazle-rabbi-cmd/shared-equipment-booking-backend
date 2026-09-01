import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ReservationService } from '../services/reservationService';
import { createReservationSchema } from '../validators/reservationValidator';

export class ReservationController {
  private reservationService = new ReservationService();

  createReservation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const validatedData = createReservationSchema.parse(req.body);
      const reservation = await this.reservationService.createReservation(userId, validatedData);
      res.status(201).json({ success: true, data: reservation });
    } catch (error) {
      next(error);
    }
  };

  getMyReservations = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const reservations = await this.reservationService.getUserReservations(userId);
      res.status(200).json({ success: true, data: reservations });
    } catch (error) {
      next(error);
    }
  };

  getAllReservations = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const reservations = await this.reservationService.getAllReservations();
      res.status(200).json({ success: true, data: reservations });
    } catch (error) {
      next(error);
    }
  };

  cancelReservation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const reservationId = Number(req.params.id);
      const userId = req.user!.id;
      const userRole = req.user!.role;
      const reservation = await this.reservationService.cancelReservation(reservationId, userId, userRole);
      res.status(200).json({ success: true, data: reservation });
    } catch (error) {
      next(error);
    }
  };

  updateApprovalStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const reservationId = Number(req.params.id);
      const { status } = req.body; // 'APPROVED' or 'REJECTED'
      const reservation = await this.reservationService.updateApprovalStatus(reservationId, status);
      res.status(200).json({ success: true, data: reservation });
    } catch (error) {
      next(error);
    }
  };
}