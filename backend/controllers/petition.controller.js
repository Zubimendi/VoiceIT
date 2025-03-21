// controllers/petition.controller.js
const multer = require('multer');
const path = require('path');
const Petition = require('../models/petition.model');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
const Signature = require('../models/signature.model');

exports.uploadPetitionData = upload.single('image');

exports.createPetition = async (req, res) => {
  console.log("Petition creation", req.body);
  try {
    const { title, description, category_id, user_id } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Ensure the image filename is passed to the model
    const petitionId = await Petition.create(title, description, user_id, category_id || null, image);

    res.status(201).json({
      message: 'Petition created successfully',
      petitionId: petitionId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllPetitions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'DESC';
    
    const petitions = await Petition.findAll(limit, offset, sortBy, sortOrder);
    const total = await Petition.count();

    console.log("ALL PETITIONS", petitions)
    
    res.status(200).json({
      data: petitions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
    console.log("ALL PETITIONS---", petitions)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPetitionById = async (req, res) => {
  try {
    const petitionId = req.params.id;
    
    const petition = await Petition.findById(petitionId);
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    // If user is logged in, check if they've signed
    let hasSigned = false;
    if (req.userId) {
      hasSigned = await Signature.hasUserSigned(petitionId, req.userId);
    }
    
    res.status(200).json({
      ...petition,
      hasSigned
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserPetitions = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(req.userId)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const petitions = await Petition.findByUserId(userId, limit, offset);
    console.log("PETITIONS", petitions)
    res.status(200).json({
      data: petitions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const { title, description, category_id } = req.body;
    const userId = req.userId;
    
    // Check if petition exists
    const petition = await Petition.findById(petitionId);
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    // Check if user is the owner or an admin
    if (petition.user_id !== userId && !req.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this petition' });
    }
    
    await Petition.update(petitionId, title, description, category_id);
    
    res.status(200).json({ message: 'Petition updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const userId = req.userId;
    
    // Check if petition exists
    const petition = await Petition.findById(petitionId);
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    // Check if user is the owner or an admin
    if (petition.user_id !== userId && !req.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this petition' });
    }
    
    await Petition.delete(petitionId);
    
    res.status(200).json({ message: 'Petition deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signPetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const userId = req.userId;
    const { comment } = req.body;
    
    // Check if petition exists
    const petition = await Petition.findById(petitionId);
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    // Check if user has already signed
    const hasAlreadySigned = await Signature.hasUserSigned(petitionId, userId);
    
    if (hasAlreadySigned) {
      return res.status(400).json({ message: 'You have already signed this petition' });
    }
    
    await Signature.create(petitionId, userId, comment);
    
    res.status(201).json({ message: 'Petition signed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPetitionSignatures = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    // Check if petition exists
    const petition = await Petition.findById(petitionId);
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    const signatures = await Signature.findByPetitionId(petitionId, limit, offset);
    res.status(200).json({
      data: signatures
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getPetitionVoters = async (req, res) => {
  try {
    const petitionId = req.params.id;

    // Check if petition exists
    const petition = await Petition.findById(petitionId);
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    // Fetch the voters
    const voters = await Signature.findByPetitionId(petitionId);
    const voterNames = voters.map(voter => voter.username);

    res.status(200).json({ voters: voterNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getPetitionSignatures = async (req, res) => {
    try {
      const petitionId = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;
      
      // Check if petition exists
      const petition = await Petition.findById(petitionId);
      
      if (!petition) {
        return res.status(404).json({ message: 'Petition not found' });
      }
      
      const signatures = await Signature.findByPetitionId(petitionId, limit, offset);
      const total = await Signature.countByPetitionId(petitionId);
      
      res.status(200).json({
        data: signatures,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.removeSignature = async (req, res) => {
    try {
      const petitionId = req.params.id;
      const userId = req.userId;
      
      // Check if petition exists
      const petition = await Petition.findById(petitionId);
      
      if (!petition) {
        return res.status(404).json({ message: 'Petition not found' });
      }
      
      // Check if user has signed
      const hasSigned = await Signature.hasUserSigned(petitionId, userId);
      
      if (!hasSigned) {
        return res.status(400).json({ message: 'You have not signed this petition' });
      }
      
      await Signature.delete(petitionId, userId);
      
      res.status(200).json({ message: 'Signature removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.searchPetitions = async (req, res) => {
    try {
      const { query } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const petitions = await Petition.search(query, limit, offset);
      
      res.status(200).json({
        data: petitions
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
