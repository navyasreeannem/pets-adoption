const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Existing routes
router.get('/', doctorController.getAllDoctors);
router.post('/', doctorController.addDoctor);
router.put('/:id', doctorController.updateDoctor); // Add this route
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;