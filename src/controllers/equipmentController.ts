import { Request, Response, NextFunction } from 'express';
import { EquipmentService } from '../services/equipmentService';
import { createEquipmentSchema, updateEquipmentSchema } from '../validators/equipmentValidator';

export class EquipmentController {
  private equipmentService = new EquipmentService();

  getEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const onlyActive = req.query.all !== 'true';
      const equipmentList = await this.equipmentService.getAllEquipment(search, category, onlyActive);
      res.status(200).json({ success: true, data: equipmentList });
    } catch (error) {
      next(error);
    }
  };

  getEquipmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const equipment = await this.equipmentService.getEquipmentById(id);
      res.status(200).json({ success: true, data: equipment });
    } catch (error) {
      next(error);
    }
  };

  createEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createEquipmentSchema.parse(req.body);
      const equipment = await this.equipmentService.createEquipment(validatedData);
      res.status(201).json({ success: true, data: equipment });
    } catch (error) {
      next(error);
    }
  };

  updateEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const validatedData = updateEquipmentSchema.parse(req.body);
      const equipment = await this.equipmentService.updateEquipment(id, validatedData);
      res.status(200).json({ success: true, data: equipment });
    } catch (error) {
      next(error);
    }
  };
}