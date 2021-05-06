const   express			= require('express');
const   router 			= express.Router();
const   resolve 		= require('path').resolve;
const 	Request 		= require('request');
const	clientID		= "1be7fa9b53d79b55888e9b8c466f8a0bf064b7a4f39ba516f3eca0d2c453607c";
const	clientSecret 	= "8a42037bd448bf175bb019f2e12a19cf4a11060fff026d4d704852a477239c08";

// Get Coinbase
router.get('/', ensureAuthenticated, function(req, res){
	res.send("placeholder");
});

// OAuth from the Coinbase website
router.get('/auth', ensureAuthenticated, function(req, res){
	res.redirect("https://www.coinbase.com/oauth/authorize?client_id=1be7fa9b53d79b55888e9b8c466f8a0bf064b7a4f39ba516f3eca0d2c453607c&redirect_uri=https%3A%2F%2Fhunchtrade.com%2Fcoinbase%2Fcallback&response_type=code&scope=wallet%3Auser%3Aread");
});

// Get Coinbase
router.get('/callback', ensureAuthenticated, function(req, res){
	Request({
		headers: {
			"Authorization: Bearer ": req.user.coinbaseToken
		},
		uri: 'https://api.coinbase.com/oauth/token?grant_type=authorization_code&code='+res.body.code+'&client_id='+clientID+'&client_secret='+clientSecret+'&redirect_uri=https://hunchtrade.com/coinbase/callback',
		method: "POST"
	}, function (err, res, body) {
		console.log(res.body);
	})
});

router.get('/user', ensureAuthenticated, function(req, res){
	Request({
		headers: {
			"Authorization: Bearer ": req.user.coinbaseToken
		},
		uri: 'https://api.coinbase.com/v2/user',
		method: "GET"
	}, function (err, res, body) {
		console.log(res.body);
	})
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
        console.log("User was not authenticated properly.")
		res.redirect('/');
	}
}


module.exports = router;