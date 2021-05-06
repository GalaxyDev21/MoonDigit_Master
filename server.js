const   express             = require("express"),
        mongoose            = require("mongoose"),
        cookieParser        = require("cookie-parser"),
        exphbs              = require("express-handlebars"),
        flash               = require("connect-flash"),
        session             = require("express-session"),
        passport            = require("passport"),
        localStrategy       = require("passport-local").Strategy,
        bodyParser          = require("body-parser"),        
        path                = require("path"),
        expressValidator    = require('express-validator');

// set up express
const app = express();

//connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/local", {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
  });

// middleware for grabbing body of req
app.use(expressValidator());

// serve static
app.use(express.static("public"));

// error handling middleware
app.use(function(err, req, res, next){
    res.status(422).send({error: err.message});
});

app.engine("handlebars", exphbs({  }));
app.set("view engine", "handlebars");

// express & passport session stuff
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'whiskyisgoodfortheheart',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// connect flash middleware
app.use(flash());

// global function for flash messages
app.use(function (req, res, next) {
    res.locals.success_msg  = req.flash("success message");
    res.locals.error_msg    = req.flash("error message");
    res.locals.error        = req.flash("error message");
    next();
});

// init routing
app.use("/dashboard",   require("./routes/dashboard"));
app.use("/robinhood",   require("./routes/robinhood"));
app.use("/coinbase",    require("./routes/coinbase"));
app.use("/ticker",      require("./routes/ticker"));
app.use("/users",       require("./routes/users"));
app.use("/news",        require("./routes/news"));
app.use("/",            require("./routes/index"));

// listen for requests
app.listen(process.env.PORT || 80, function (){
    console.log("Now listening on", process.env.PORT || 80);
});