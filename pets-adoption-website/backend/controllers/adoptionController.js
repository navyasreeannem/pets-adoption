// controllers/adoptionController.js

const pool = require('../config/db'); // Assuming you're using PostgreSQL
const fs = require('fs');

const handleAddAdoptionRequest = async (req, res) => {
  try {
    const { petName, petAge, petBreed, ownerName, ownerContact } = req.body;
    const petPhoto = req.files['petPhoto'] ? req.files['petPhoto'][0].buffer : null;
    const petCert = req.files['petCert'] ? req.files['petCert'][0].buffer : null;

    if (!petPhoto || !petCert) {
      return res.status(400).json({ error: 'Pet photo and certificate are required' });
    }

    const result = await pool.query(
      `INSERT INTO adoption_requests (pet_name, pet_age, pet_breed, owner_name, owner_contact, pet_photo, pet_cert, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
      [petName, petAge, petBreed, ownerName, ownerContact, petPhoto, petCert]
    );

    res.status(201).json({ message: 'Adoption request submitted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error adding adoption request:', error);
    res.status(500).json({ error: 'Failed to add adoption request' });
  }
};

const handleGetAllAdoptionRequests = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM adoption_requests`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching adoption requests:', error);
    res.status(500).json({ error: 'Failed to fetch adoption requests' });
  }
};

module.exports = { handleAddAdoptionRequest, handleGetAllAdoptionRequests };
