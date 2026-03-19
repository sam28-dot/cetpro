// routes/prediction.js
const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');
const { predictionValidator } = require('../middleware/validation');

// Public shared prediction
router.get('/share/:token', predictionController.getSharedPrediction);

// Protected routes
router.use(protect);
router.post('/', predictionValidator, predictionController.createPrediction);
router.get('/', predictionController.getPredictions);
router.get('/:id', predictionController.getPrediction);
router.patch('/:id/share', predictionController.toggleShare);
router.delete('/:id', predictionController.deletePrediction);

module.exports = router;
