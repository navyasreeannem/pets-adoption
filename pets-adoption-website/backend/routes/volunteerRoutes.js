const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const VolunteerRequest = require('../models/volunteerModel');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/volunteer';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// Handle multiple file uploads
const uploadFields = upload.fields([
  { name: 'petPhoto', maxCount: 1 },
  { name: 'petCert', maxCount: 1 }
]);

// Add a new volunteer request
router.post('/add', uploadFields, async (req, res) => {
  try {
    const {
      petName,
      petType,
      petBreed,
      petAge,
      startDate,
      endDate,
      ownerName,
      email,
      phone,
      instructions
    } = req.body;

    // Get file paths if files were uploaded
    const petPhotoPath = req.files.petPhoto ? req.files.petPhoto[0].path : null;
    const petCertPath = req.files.petCert ? req.files.petCert[0].path : null;

    // Create new volunteer request
    const volunteerRequest = await VolunteerRequest.create({
      petName,
      petType,
      petBreed,
      petAge,
      startDate,
      endDate,
      ownerName,
      email,
      phone,
      instructions,
      petPhotoPath,
      petCertPath
    });

    res.status(201).json({
      success: true,
      message: 'Volunteer request submitted successfully',
      data: volunteerRequest
    });
  } catch (error) {
    console.error('Error creating volunteer request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit volunteer request',
      error: error.message
    });
  }
});

// Get all volunteer requests
router.get('/', async (req, res) => {
  try {
    const volunteerRequests = await VolunteerRequest.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: volunteerRequests
    });
  } catch (error) {
    console.error('Error fetching volunteer requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch volunteer requests',
      error: error.message
    });
  }
});

// IMPORTANT: Place specific routes BEFORE parameterized routes
// Get all approved volunteer requests
router.get('/approved', async (req, res) => {
  try {
    console.log('Fetching approved volunteer requests...');
    
    const approvedRequests = await VolunteerRequest.findAll({
      where: {
        status: 'approved'
      },
      order: [['startDate', 'ASC']]
    });
    
    console.log('Found', approvedRequests.length, 'approved requests');
    
    // Process the data to include URLs for frontend display
    const processedRequests = approvedRequests.map(request => {
      const requestData = request.toJSON();
      
      // Convert file paths to URLs
      if (requestData.petPhotoPath) {
        requestData.petPhotoUrl = '/' + requestData.petPhotoPath.replace(/\\/g, '/');
      }
      
      if (requestData.petCertPath) {
        requestData.petCertUrl = '/' + requestData.petCertPath.replace(/\\/g, '/');
      }
      
      return requestData;
    });
    
    res.status(200).json({
      success: true,
      data: processedRequests
    });
  } catch (error) {
    console.error('Error fetching approved volunteer requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved volunteer requests',
      error: error.message
    });
  }
});

// Get volunteer requests by user email
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const userRequests = await VolunteerRequest.findAll({
      where: {
        email: email
      },
      order: [['createdAt', 'DESC']]
    });
    
    // Process the data to include URLs for frontend display
    const processedRequests = userRequests.map(request => {
      const requestData = request.toJSON();
      
      // Convert file paths to URLs
      if (requestData.petPhotoPath) {
        requestData.petPhotoUrl = '/' + requestData.petPhotoPath.replace(/\\/g, '/');
      }
      
      if (requestData.petCertPath) {
        requestData.petCertUrl = '/' + requestData.petCertPath.replace(/\\/g, '/');
      }
      
      return requestData;
    });
    
    res.status(200).json({
      success: true,
      data: processedRequests
    });
  } catch (error) {
    console.error('Error fetching user volunteer requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user volunteer requests',
      error: error.message
    });
  }
});

// Get a single volunteer request by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const volunteerRequest = await VolunteerRequest.findByPk(id);
    
    if (!volunteerRequest) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer request not found'
      });
    }
    
    // Add URLs for frontend display
    const volunteerData = volunteerRequest.toJSON();
    
    // Convert file paths to URLs
    if (volunteerData.petPhotoPath) {
      volunteerData.petPhotoUrl = '/' + volunteerData.petPhotoPath.replace(/\\/g, '/');
    }
    
    if (volunteerData.petCertPath) {
      volunteerData.petCertUrl = '/' + volunteerData.petCertPath.replace(/\\/g, '/');
    }
    
    res.status(200).json({
      success: true,
      data: volunteerData
    });
  } catch (error) {
    console.error('Error fetching volunteer request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch volunteer request',
      error: error.message
    });
  }
});

// Update volunteer request status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const volunteerRequest = await VolunteerRequest.findByPk(id);
    
    if (!volunteerRequest) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer request not found'
      });
    }
    
    volunteerRequest.status = status;
    await volunteerRequest.save();
    
    res.status(200).json({
      success: true,
      message: 'Volunteer request status updated successfully',
      data: volunteerRequest
    });
  } catch (error) {
    console.error('Error updating volunteer request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update volunteer request status',
      error: error.message
    });
  }
});

// Delete a volunteer request
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const volunteerRequest = await VolunteerRequest.findByPk(id);
    
    if (!volunteerRequest) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer request not found'
      });
    }
    
    // Delete associated files
    if (volunteerRequest.petPhotoPath && fs.existsSync(volunteerRequest.petPhotoPath)) {
      fs.unlinkSync(volunteerRequest.petPhotoPath);
    }
    
    if (volunteerRequest.petCertPath && fs.existsSync(volunteerRequest.petCertPath)) {
      fs.unlinkSync(volunteerRequest.petCertPath);
    }
    
    await volunteerRequest.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Volunteer request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting volunteer request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete volunteer request',
      error: error.message
    });
  }
});

module.exports = router;
