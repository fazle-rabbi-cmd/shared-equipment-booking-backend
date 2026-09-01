import { Op } from 'sequelize';
import { Equipment } from '../models/Equipment';

export class EquipmentRepository {
  async findAll(searchQuery?: string, category?: string, onlyActive: boolean = true): Promise<Equipment[]> {
    const whereClause: any = { };

    if (onlyActive) {
      whereClause.isActive = true;
    }

    if (searchQuery) {
      whereClause.name = { [Op.like]: `%${searchQuery}%` };
    }

    if (category) {
      whereClause.category = category;
    }

    return await Equipment.findAll({ where: whereClause });
  }

  async findById(id: number): Promise<Equipment | null> {
    return await Equipment.findByPk(id);
  }

  async create(data: {
    name: string;
    description?: string;
    category: string;
    requiresApproval?: boolean;
  }): Promise<Equipment> {
    return await Equipment.create(data);
  }

  async update(id: number, data: Partial<Equipment>): Promise<Equipment | null> {
    const equipment = await Equipment.findByPk(id);
    if (!equipment) return null;
    return await equipment.update(data);
  }
}