const { DataTypes } = require('sequelize');
const db = require('./db');

const VolunteerRequest = db.define('VolunteerRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  petName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  petType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  petBreed: {
    type: DataTypes.STRING,
    allowNull: false
  },
  petAge: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ownerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  petPhotoPath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  petCertPath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  }
});

module.exports = VolunteerRequest;
