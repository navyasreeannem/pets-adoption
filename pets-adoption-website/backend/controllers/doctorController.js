const Doctor = require('../models/doctorModel');

// Get all doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
};

// Add a new doctor
const addDoctor = async (req, res) => {
    try {
        const { name, specialization, phone, location, photo_url } = req.body;
        const newDoctor = await Doctor.create({ name, specialization, phone, location, photo_url });
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add doctor' });
    }
};

// Update or create a doctor
const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialization, phone, location, photo_url } = req.body;

        // Check if the doctor exists
        let doctor = await Doctor.findByPk(id);

        if (doctor) {
            // If the doctor exists, update the details
            await doctor.update({ name, specialization, phone, location, photo_url });
            return res.status(200).json({ message: 'Doctor updated successfully', doctor });
        } else {
            // If the doctor does not exist, create a new doctor
            doctor = await Doctor.create({ id, name, specialization, phone, location, photo_url });
            return res.status(201).json({ message: 'Doctor created successfully', doctor });
        }
    } catch (error) {
        console.error('Error in updateDoctor:', error);
        res.status(500).json({ error: 'Failed to update or create doctor' });
    }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the doctor by ID
        const doctor = await Doctor.findByPk(id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Delete the doctor
        await doctor.destroy();
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete doctor' });
    }
};

module.exports = {
    getAllDoctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
};