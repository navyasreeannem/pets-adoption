const VolunteerRequest = require('../models/volunteerModel'); // Changed to match your actual model file name
const path = require('path');
const fs = require('fs');

// Helper function to ensure upload directory exists
const ensureUploadDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const volunteerController = {
  // Add a new volunteer request
  addRequest: async (req, res) => {
    try {
      // Handle file uploads
      const petPhotoPath = req.files?.petPhoto?.[0]?.path;
      const petCertPath = req.files?.petCert?.[0]?.path;
      
      if (!petPhotoPath || !petCertPath) {
        return res.status(400).json({ message: 'Pet photo and certificate are required' });
      }
      
      // Create request data object
      const requestData = {
        petName: req.body.petName,
        petType: req.body.petType,
        petBreed: req.body.petBreed,
        petAge: req.body.petAge,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        ownerName: req.body.ownerName,
        email: req.body.email,
        phone: req.body.phone,
        instructions: req.body.instructions || '',
        petPhotoPath: petPhotoPath.replace(/\\/g, '/'), // Normalize path for storage
        petCertPath: petCertPath.replace(/\\/g, '/')
      };
      
      // Save to database using Sequelize
      const newRequest = await VolunteerRequest.create(requestData);
      
      res.status(201).json({
        message: 'Volunteer request submitted successfully',
        request: newRequest
      });
    } catch (error) {
      console.error('Error adding volunteer request:', error);
      res.status(500).json({ message: 'Server error while processing request' });
    }
  },
  
  // Get all volunteer requests
  getAllRequests: async (req, res) => {
    try {
      const requests = await VolunteerRequest.findAll({
        order: [['createdAt', 'DESC']] // Changed from 'created_at' to 'createdAt' to match Sequelize naming
      });
      
      res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching volunteer requests:', error);
      res.status(500).json({ message: 'Server error while fetching requests' });
    }
  },
  
  // Update volunteer request status
  updateRequestStatus: async (req, res) => {
    try {
      const { id, status } = req.body;
      
      if (!id || !status) {
        return res.status(400).json({ message: 'Request ID and status are required' });
      }
      
      const request = await VolunteerRequest.findByPk(id);
      
      if (!request) {
        return res.status(404).json({ message: 'Volunteer request not found' });
      }
      
      request.status = status;
      await request.save();
      
      res.status(200).json({
        message: 'Volunteer request status updated successfully',
        request: request
      });
    } catch (error) {
      console.error('Error updating volunteer request status:', error);
      res.status(500).json({ message: 'Server error while updating request status' });
    }
  },
  
  // Get approved volunteer requests
  getApprovedRequests: async (req, res) => {
    try {
      console.log('Fetching approved volunteer requests...');
      
      const approvedRequests = await VolunteerRequest.findAll({
        where: { status: 'approved' },
        order: [['startDate', 'ASC']]
      });
      
      console.log('Found', approvedRequests.length, 'approved requests');
      
      // Process the data to include URLs for frontend display
      const processedRequests = approvedRequests.map(request => {
        const requestData = request.toJSON();
        
        // Convert file paths to URLs
        if (requestData.petPhotoPath) {
          requestData.petPhotoUrl = '/' + requestData.petPhotoPath;
        }
        
        if (requestData.petCertPath) {
          requestData.petCertUrl = '/' + requestData.petCertPath;
        }
        
        return requestData;
      });
      
      return res.json({
        success: true,
        data: processedRequests
      });
    } catch (error) {
      console.error('Error fetching approved volunteer requests:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch approved volunteer requests'
      });
    }
  }
};

module.exports = volunteerController;
