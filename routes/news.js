const   express         = require('express');
const   router          = express.Router();
const   resolve         = require('path').resolve;
const 	Request         = require('rest-request');
const 	Bloomberg       = new Request('https://newsapi.org/v1/articles');
const   BusinessInsider = new Request('https://newsapi.org/v1/articles');
const   Economist       = new Request('https://newsapi.org/v1/articles');

// Get Bloomberg news
router.get('/bloomberg', ensureAuthenticated, function(req, res){
	var articles = Bloomberg.get('?source=bloomberg&sortBy=top&apiKey=b0a547a22f3945b6bcd2d072c73eb97e', {});
    articles.then(function(response) {
        res.send(response);
    }).catch(function (err) {
        console.log(err);
    });
});

// Get Business Insider news
router.get('/business-insider', ensureAuthenticated, function(req, res){
	var articles = BusinessInsider.get('?source=business-insider&sortBy=top&apiKey=b0a547a22f3945b6bcd2d072c73eb97e', {});
    articles.then(function(response) {
        res.send(response);
    }).catch(function (err) {
        console.log(err);
    });
});

// Get Business Insider news
router.get('/economist', ensureAuthenticated, function(req, res){
	var articles = Economist.get('?source=the-economist&sortBy=top&apiKey=b0a547a22f3945b6bcd2d072c73eb97e', {});
    articles.then(function(response) {
        res.send(response);
    }).catch(function (err) {
        console.log(err);
    });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
        console.log("User was not authenticated properly.")
		res.redirect('/users/login');
	}
}

module.exports = router;