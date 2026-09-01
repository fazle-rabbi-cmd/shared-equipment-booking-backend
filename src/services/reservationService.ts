import { ReservationRepository } from '../repositories/reservationRepository';
import { EquipmentRepository } from '../repositories/equipmentRepository';
import { AppError } from '../errors/AppError';
import { Reservation } from '../models/Reservation';

export class ReservationService {
  private reservationRepository = new ReservationRepository();
  private equipmentRepository = new EquipmentRepository();

  async createReservation(userId: number, data: { equipmentId: number; startTime: string; endTime: string }): Promise<Reservation> {
    const equipment = await this.equipmentRepository.findById(data.equipmentId);
    if (!equipment || !equipment.isActive) {
      throw new AppError('Equipment not found or is currently inactive', 404);
    }

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (start <= new Date()) {
      throw new AppError('Reservation start time must be in the future', 400);
    }

    // Strict Overlap Check
    const overlapping = await this.reservationRepository.findOverlappingReservation(equipment.id, start, end);
    if (overlapping) {
      throw new AppError('Equipment is already reserved for this time period', 409);
    }

    // Determine initial status based on approval requirement
    const status = equipment.requiresApproval ? 'PENDING' : 'APPROVED';

    return await this.reservationRepository.create({
      userId,
      equipmentId: equipment.id,
      startTime: start,
      endTime: end,
      status,
    });
  }

  async getUserReservations(userId: number): Promise<Reservation[]> {
    return await this.reservationRepository.findByUserId(userId);
  }

  async getAllReservations(): Promise<Reservation[]> {
    return await this.reservationRepository.findAll();
  }

  async cancelReservation(reservationId: number, userId: number, userRole: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new AppError('Reservation not found', 404);
    }

    if (userRole !== 'ADMIN' && reservation.userId !== userId) {
      throw new AppError('Unauthorized to cancel this reservation', 403);
    }

    if (reservation.status === 'CANCELLED' || reservation.status === 'REJECTED') {
      throw new AppError(`Reservation is already ${reservation.status.toLowerCase()}`, 400);
    }

    const updated = await this.reservationRepository.updateStatus(reservationId, 'CANCELLED');
    return updated!;
  }

  async updateApprovalStatus(reservationId: number, status: 'APPROVED' | 'REJECTED'): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new AppError('Reservation not found', 404);
    }

    if (reservation.status !== 'PENDING') {
      throw new AppError('Only pending reservations can be approved or rejected', 400);
    }

    // If approving, re-check overlap in case another request slipped through
    if (status === 'APPROVED') {
      const overlapping = await this.reservationRepository.findOverlappingReservation(
        reservation.equipmentId,
        reservation.startTime,
        reservation.endTime
      );
      if (overlapping) {
        throw new AppError('Cannot approve: An overlapping approved reservation exists', 409);
      }
    }

    const updated = await this.reservationRepository.updateStatus(reservationId, status);
    return updated!;
  }
}