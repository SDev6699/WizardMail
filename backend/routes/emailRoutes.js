const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.get('/', emailController.getEmails);
router.delete('/:id', emailController.deleteEmail);
router.post('/reply', emailController.replyEmail);

module.exports = router;
