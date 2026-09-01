import { EquipmentRepository } from '../repositories/equipmentRepository';
import { ReservationRepository } from '../repositories/reservationRepository';
import { AppError } from '../errors/AppError';
import { Equipment } from '../models/Equipment';

export class EquipmentService {
  private equipmentRepository = new EquipmentRepository();
  private reservationRepository = new ReservationRepository();

  async getAllEquipment(search?: string, category?: string, onlyActive: boolean = true): Promise<Equipment[]> {
    return await this.equipmentRepository.findAll(search, category, onlyActive);
  }

  async getEquipmentById(id: number): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findById(id);
    if (!equipment) {
      throw new AppError('Equipment not found', 404);
    }
    return equipment;
  }

  async createEquipment(data: {
    name: string;
    description?: string;
    category: string;
    requiresApproval?: boolean;
  }): Promise<Equipment> {
    return await this.equipmentRepository.create(data);
  }

  async updateEquipment(id: number, data: any): Promise<Equipment> {
  if (data.isActive === false) {
    const hasConflicts = await this.reservationRepository.hasActiveOrPendingReservations(id);
    if (hasConflicts) {
      throw new AppError('Cannot deactivate equipment with active or pending reservations', 400);
    }
  }

  const updated = await this.equipmentRepository.update(id, data);
  if (!updated) {
    throw new AppError('Equipment not found to update', 404);
  }
  return updated;
}
}