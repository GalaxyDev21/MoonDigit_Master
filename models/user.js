const mongoose  = require("mongoose");
const Schema    = mongoose.Schema;
const moment    = require("moment");
const bcrypt    = require("bcryptjs");

// create schema & model
const userSchema = new Schema({
    email: {
        type: String,
        required: [false]
    },
    username: {
        type: String,
        required: [true]
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    robinhood_user: {
        type: String,
        required: [false]
    },
    robinhood_password: {
        type: String,
        require: [false]
    },
    robinhood_device_token: {
        type: String,
        require: [false]
    },
    coinbase_user: {
        type: String,
        required: [false]
    },
    isPremium: {
        type: Boolean,
        required: [true],
        default: false
    },
    robinhoodActive: {
        type: Boolean,
        required: [true],
        default: true
    },
    coinbaseActive: {
        type: Boolean,
        required: [true],
        default: true
    },
    newsSource: {
        type: String,
        required: [true],
        default: "Bloomberg"
    },
    photo: {
        type: String,
        default: "default_avatar.jpg",
        required: [true]
    },
    stripe_id:{
        type: String,
        required: [false]
    },
    // automatically publish datetime added
    added: {
        type: String,
        default: String(moment().format('MMMM Do YYYY, h:mm:ss a')),
        required: [true, "Error adding datetime!"]
    }
});

const User = module.exports = mongoose.model("users", userSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
	});
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback){
    var query = { username: username };
    User.findOne(query, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
