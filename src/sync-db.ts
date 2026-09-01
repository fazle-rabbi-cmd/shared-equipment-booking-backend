import sequelize from './config/database';
import './models/User';
import './models/Equipment';
import './models/Reservation';

async function syncDatabase() {
  try {
    // { alter: true } updates tables if they change without dropping data
    await sequelize.sync({ alter: true });
    console.log('Database tables synced successfully!');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();