import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema } from '../validators/authValidator';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await this.authService.register(validatedData);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}