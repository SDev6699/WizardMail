const express = require('express');
const router = express.Router();
const labelController = require('../controllers/labelController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, labelController.getLabels);
router.post('/', ensureAuthenticated, labelController.createLabel);
router.put('/:id', ensureAuthenticated, labelController.updateLabel);
router.delete('/:id', ensureAuthenticated, labelController.deleteLabel);

module.exports = router;
