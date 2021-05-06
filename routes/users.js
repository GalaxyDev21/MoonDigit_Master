const   express             = require('express');
const   router              = express.Router();
const   User                = require("../models/user")
const   resolve             = require('path').resolve
const   passport            = require('passport');
const   LocalStrategy       = require('passport-local').Strategy;
const   RememberMeStrategy  = require('passport-remember-me').Strategy;
const   jwt                 = require('./jwt-strategy');

const auth = function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
        if (err) throw err;
        if(!user){
            return done(null, false, { message:"Unknown user" });
        }
        User.comparePassword(password, user.password, function(err,isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } else {
                return done(null, false, { message: "Invalid password" });
            }
        });
    });
};

passport.use(new LocalStrategy(auth));

passport.use(new RememberMeStrategy(
    function(token, done) {
        Token.consume(token, function (err, user) {
            if (err) { 
                return done(err); 
            }
            if (!user) { 
                return done(null, false); 
            }
            return done(null, user);
        });
    },
    function(user, done) {
        var token = utils.generateToken(64);
        Token.save(token, { 
            userId: user.id 
        }, 
        function(err) {
            if (err) { 
                return done(err); 
            }
            return done(null, token);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
})

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

// Login request
router.post('/login', (req, res, next) => {
    console.log("In login", req.body);
    auth(req.body.username, req.body.password, (err, user, data) => {
        if (err) {
            res.status(400).json(data);
        } else {
            const token = jwt.JwtToken(user);
            const u = Object.assign({}, user);
            delete u.password;
            res.json({
                token: token,
                user: u
            });
        }
    });
});

// Login page
router.get("/login", function(req, res){
    res.render("login");
});

// Register User
router.post('/register', function(req, res){
    var username    = req.body.username;    
    var email       = req.body.email;
	var password    = req.body.password;

    // Validation
    req.checkBody('username', 'Username is required').notEmpty();        
    req.checkBody('email', 'Email is required').notEmpty();    
	req.checkBody('password', 'Password is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
        console.log(errors)
	} else {
		var newUser = new User({
            email: email,
            username: username,
            password: password,
            robinhood_user:"",
            robinhood_password:""
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
        });
        res.redirect("/users/login")
    }    
});

router.post("/update", passport.authenticate('local', {
    failureRedirect:'/users/login'
    }),
    function(req, res, next){
        User.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
            User.findOne({_id: req.user.id}).then(function(data){
                User.findOne({_id: req.user.id}).then(function(user){
                    res.send.user;
                })
            });
        }).catch(next);
    }
);

// Logging out
router.get('/lock', function(req, res){
    if (req.user == undefined) {
        res.redirect('/users/login');
    } else {
        res.render('lock', { username: req.user.username, photo: "/img/users/"+req.user.photo });
        req.logout();
    }
});

module.exports = router;