const passport = require('passport');
const { stopPollingForUser } = require('../polling/gmailPolling');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email', 'https://mail.google.com/'] });

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/' }, (err, user) => {
    if (err) {
      console.error('Error during authentication:', err);
      return next(err);
    }
    if (!user) {
      console.log('No user found');
      return res.redirect('/');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error logging in user:', err);
        return next(err);
      }
      
      req.session.save(() => {
        if (!res.headersSent) {
          return res.redirect('https://localhost:5173/'); // Redirect to your frontend
        }
      });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    if (userId) {
      stopPollingForUser(userId);
    }
      
    res.redirect('/');
  });
};
