import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import reservationRoutes from './routes/reservationRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/reservations', reservationRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running successfully!' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;