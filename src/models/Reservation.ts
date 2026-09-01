import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Equipment } from './Equipment';

export class Reservation extends Model {
  public id!: number;
  public userId!: number;
  public equipmentId!: number;
  public startTime!: Date;
  public endTime!: Date;
  public status!: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: { model: 'users', key: 'id' },
    },
    equipmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'equipment_id',
      references: { model: 'equipment', key: 'id' },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_time',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'APPROVED',
    },
  },
  {
    sequelize,
    tableName: 'reservations',
    timestamps: true,
  }
);

// Define Associations
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Equipment.hasMany(Reservation, { foreignKey: 'equipmentId', as: 'reservations' });
Reservation.belongsTo(Equipment, { foreignKey: 'equipmentId', as: 'equipment' });