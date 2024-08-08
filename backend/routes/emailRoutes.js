const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { ensureAuthenticated } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', ensureAuthenticated, emailController.getEmails);
router.get('/threads', ensureAuthenticated, emailController.getThreads); // Add route for threads
router.post('/', [ensureAuthenticated, upload.array('attachments')], emailController.sendEmail);
router.put('/markAsRead/:id', ensureAuthenticated, emailController.markAsRead);
router.put('/markAsUnread/:id', ensureAuthenticated, emailController.markAsUnread);
router.put('/star/:id', ensureAuthenticated, emailController.starEmail);
router.put('/unstar/:id', ensureAuthenticated, emailController.unstarEmail);
router.put('/move/:id', ensureAuthenticated, emailController.moveEmail);
router.delete('/:id', ensureAuthenticated, emailController.deleteEmail);
router.delete('/permanently/:id', ensureAuthenticated, emailController.permanentlyDeleteEmail);
router.put('/snooze/:id', ensureAuthenticated, emailController.snoozeEmail);
router.put('/archive/:id', ensureAuthenticated, emailController.archiveEmail);
router.put('/spam/:id', ensureAuthenticated, emailController.markAsSpam); // Add route for marking as spam
router.put('/unspam/:id', ensureAuthenticated, emailController.unmarkAsSpam); // Add route for unmarking as spam

module.exports = router;
