const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, searchController.searchEmails);

module.exports = router;
