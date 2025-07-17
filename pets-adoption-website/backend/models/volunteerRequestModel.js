const { DataTypes } = require('sequelize');
const db = require('./db');

const VolunteerRequest = db.define('VolunteerRequest', {
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
  petPhotoUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  petCertUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  }
});

module.exports = VolunteerRequest;
