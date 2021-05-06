const   express             = require('express');
const   router              = express.Router();
const   User                = require("../models/user")
const   resolve             = require('path').resolve
const   passport            = require('passport');
const   LocalStrategy       = require('passport-local').Strategy;

// Register User
router.post('/report', function(req, res){
    var user        = req.user;    
	var message     = req.body.password;

	req.checkBody('message', 'Message is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
        console.log(errors)
	} else {
		var newBugReport = new bugReport({
            user: req.user,
            message: message
		});

		User.createBugReport(newBugReport, function(err, report){
			if(err) {
                res.json({response:"error"})                
            }
        });
        res.json({response:"success"})
    }    
});