const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Adoption = require('../models/adoptionModel');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/adoptions';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create a unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to only allow images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// POST: Create a new adoption request
router.post('/', upload.fields([
  { name: 'petPhoto', maxCount: 1 },
  { name: 'petCert', maxCount: 1 }
]), async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || !req.files.petPhoto || !req.files.petCert) {
      return res.status(400).json({ 
        success: false, 
        error: 'Both pet photo and certificate are required' 
      });
    }

    // Get file paths
    const petPhotoUrl = '/' + req.files.petPhoto[0].path.replace(/\\/g, '/');
    const petCertUrl = '/' + req.files.petCert[0].path.replace(/\\/g, '/');

    // Create adoption request
    const adoption = await Adoption.create({
      ownerName: req.body.ownerName,
      email: req.body.email,
      phone: req.body.phone,
      petName: req.body.petName,
      petType: req.body.petType,
      petBreed: req.body.petBreed,
      petAge: parseInt(req.body.petAge),
      petGender: req.body.petGender,
      price: parseFloat(req.body.price),
      reason: req.body.reason,
      petPhotoUrl: petPhotoUrl,
      petCertUrl: petCertUrl
    });

    res.status(201).json({ success: true, data: adoption });
  } catch (error) {
    console.error('Error creating adoption request:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET: Get all adoption requests (for admin)
router.get('/', async (req, res) => {
  try {
    const adoptions = await Adoption.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({ success: true, data: adoptions });
  } catch (error) {
    console.error('Error fetching adoption requests:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET: Get only approved adoption requests (for public display)
router.get('/approved', async (req, res) => {
  try {
    const approvedAdoptions = await Adoption.findAll({
      where: {
        status: 'approved'
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({ success: true, data: approvedAdoptions });
  } catch (error) {
    console.error('Error fetching approved adoption requests:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET: Get a single adoption request by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const adoption = await Adoption.findByPk(id);
    if (!adoption) {
      return res.status(404).json({ success: false, error: 'Adoption request not found' });
    }
    
    res.status(200).json({ success: true, data: adoption });
  } catch (error) {
    console.error('Error fetching adoption request:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT: Update adoption status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid status. Status must be pending, approved, or rejected.' 
      });
    }
    
    const adoption = await Adoption.findByPk(id);
    if (!adoption) {
      return res.status(404).json({ success: false, error: 'Adoption request not found' });
    }
    
    // Update status
    adoption.status = status;
    await adoption.save();
    
    res.status(200).json({ success: true, data: adoption });
  } catch (error) {
    console.error('Error updating adoption status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE: Delete an adoption request
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const adoption = await Adoption.findByPk(id);
    if (!adoption) {
      return res.status(404).json({ success: false, error: 'Adoption request not found' });
    }
    
    // Delete associated files
    if (adoption.petPhotoUrl) {
      const photoPath = path.join(__dirname, '..', adoption.petPhotoUrl);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    if (adoption.petCertUrl) {
      const certPath = path.join(__dirname, '..', adoption.petCertUrl);
      if (fs.existsSync(certPath)) {
        fs.unlinkSync(certPath);
      }
    }
    
    // Delete the adoption record
    await adoption.destroy();
    
    res.status(200).json({ success: true, message: 'Adoption request deleted successfully' });
  } catch (error) {
    console.error('Error deleting adoption request:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
