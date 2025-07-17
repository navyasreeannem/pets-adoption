const { DataTypes } = require('sequelize');
const db = require('./db');

const Adoption = db.define('Adoption', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  petGender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  reason: {
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
}, {
  timestamps: true
});

module.exports = Adoption;
