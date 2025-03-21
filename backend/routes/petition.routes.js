// routes/petition.routes.js
const express = require('express');
const router = express.Router();
const petitionController = require('../controllers/petition.controller');
const authMiddleware = require('../middlewares/auth');

// Public routes
router.get('/', petitionController.getAllPetitions);
router.get('/search', petitionController.searchPetitions);
router.get('/:id', petitionController.getPetitionById);
router.get('/:id/signatures', petitionController.getPetitionSignatures);
// Route to get all voters for a specific petition
router.get('/:id/voters', petitionController.getPetitionVoters);

// Protected routes
router.use(authMiddleware); // Ensure this middleware is applied before protected routes
// Route to create a petition with image upload
router.post('/', petitionController.uploadPetitionData, petitionController.createPetition);
router.get('/user/me', petitionController.getUserPetitions);
router.put('/:id', petitionController.updatePetition);
router.delete('/:id', petitionController.deletePetition);
router.post('/:id/sign', petitionController.signPetition);
router.delete('/:id/sign', petitionController.removeSignature);

module.exports = router;