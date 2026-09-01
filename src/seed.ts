import sequelize from './config/database';
import { User } from './models/User';
import { Equipment } from './models/Equipment';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Create Admin
    await User.findOrCreate({
      where: { email: 'admin@company.com' },
      defaults: {
        name: 'System Admin',
        email: 'admin@company.com',
        passwordHash,
        role: 'ADMIN',
      },
    });

    // Create Employee
    await User.findOrCreate({
      where: { email: 'employee@company.com' },
      defaults: {
        name: 'John Employee',
        email: 'employee@company.com',
        passwordHash,
        role: 'EMPLOYEE',
      },
    });

    // Create Sample Equipment
    await Equipment.bulkCreate([
      { name: 'MacBook Pro 16"', description: 'M3 Max development laptop', category: 'Laptops', requiresApproval: false },
      { name: 'Sony Alpha A7IV', description: '4K Mirrorless Camera', category: 'Cameras', requiresApproval: true },
      { name: 'Epson 4K Projector', description: 'Conference room projector', category: 'Projectors', requiresApproval: false },
    ], { ignoreDuplicates: true });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seed();