const passport = require('passport');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email', 'https://mail.google.com/'] });

exports.googleAuthCallback = passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
};

exports.logout = (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
};
