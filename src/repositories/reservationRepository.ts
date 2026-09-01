import { Op } from 'sequelize';
import { Reservation } from '../models/Reservation';
import { Equipment } from '../models/Equipment';
import { User } from '../models/User';

export class ReservationRepository {
  async findOverlappingReservation(
    equipmentId: number,
    startTime: Date,
    endTime: Date,
    excludeReservationId?: number
  ): Promise<Reservation | null> {
    const whereClause: any = {
      equipmentId,
      status: 'APPROVED', // Only block if another booking is already APPROVED
      [Op.and]: [
        { startTime: { [Op.lt]: endTime } },
        { endTime: { [Op.gt]: startTime } },
      ],
    };

    if (excludeReservationId) {
      whereClause.id = { [Op.ne]: excludeReservationId };
    }

    return await Reservation.findOne({ where: whereClause });
  }

  async create(data: {
    userId: number;
    equipmentId: number;
    startTime: Date;
    endTime: Date;
    status: 'PENDING' | 'APPROVED';
  }): Promise<Reservation> {
    return await Reservation.create(data);
  }

  async findByUserId(userId: number): Promise<Reservation[]> {
    return await Reservation.findAll({
      where: { userId },
      include: [{ model: Equipment, as: 'equipment' }],
      order: [['createdAt', 'DESC']],
    });
  }

  async findAll(): Promise<Reservation[]> {
    return await Reservation.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Equipment, as: 'equipment' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number): Promise<Reservation | null> {
    return await Reservation.findByPk(id, {
      include: [
        { model: Equipment, as: 'equipment' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });
  }

  async updateStatus(id: number, status: 'APPROVED' | 'REJECTED' | 'CANCELLED'): Promise<Reservation | null> {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) return null;
    return await reservation.update({ status });
  }

  async hasActiveOrPendingReservations(equipmentId: number): Promise<boolean> {
  const count = await Reservation.count({
    where: {
      equipmentId: equipmentId,
      status: { [Op.in]: ['PENDING', 'APPROVED'] }
    }
    });
      return count > 0;
    }
}