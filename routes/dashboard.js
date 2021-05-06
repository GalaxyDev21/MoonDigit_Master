const   express         = require('express');
const   router          = express.Router();
const   resolve         = require('path').resolve;
const   passport        = require('passport');
const   jwt             = require('./jwt-strategy');

// Get dashboard
router.get('/', ensureAuthenticated, function(req, res){
	var context = { 
		username: req.user.username,
		isPremium: req.user.isPremium,
		email: req.user.email,
		robinhood_user: req.user.robinhood_user,
		coinbase_user: req.user.coinbase_user,
		robinhoodActive: req.user.robinhoodActive,
		coinbaseActive: req.user.coinbaseActive,
		newsSource: req.user.newSource,
		photo: "/img/users/"+req.user.photo
	}
	res.render("dashboard", context);
});

function ensureAuthenticated(req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, user/*, info*/) {
        if (err) {
            console.log("User was not authenticated properly.")
    		return res.redirect('/users/login');
        }

        if (user) {
            req.user = user;
            next();
        } else {
            console.log("User was not authenticated properly.")
    		res.redirect('/users/login');
        }
    })(req, res, next);
}

module.exports = router;