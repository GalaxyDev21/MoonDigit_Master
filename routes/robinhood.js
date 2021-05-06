const express = require('express');
const router = express.Router();
const Request = require('rest-request');
const API = new Request('https://api.robinhood.com/fundamentals/');
const User = require("../models/user");
const RH = require('../rh-lib');
const   passport = require('passport');
const   jwt = require('./jwt-strategy');

// Get fundamentals for a stock
router.get('/fundamentals/:tix', ensureAuthenticated, function (req, res) {
    var fundamentals = API.get(req.params.tix + "/", {});
    fundamentals.then(function (response) {
        res.send(response);
    }).catch(function (err) {
        console.log(err);
    });
});


//Get Robinhood Credentials
router.post('/register', ensureAuthenticated, function (req, res) {

    // Validation      
    req.checkBody('robinhood_user', 'Email is required').notEmpty();
    req.checkBody('robinhood_password', 'Password is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.status(400).json(errors);
    } else {
        User.findByIdAndUpdate({ _id: req.user._id }, req.body).then(function () {
            res.redirect("/dashboard")
        });

    }
});

router.get('/auth', ensureAuthenticated, async function (req, res) {

    var rh = new RH();
    let device_token = req.user.robinhood_device_token;
    if (!device_token) {
        device_token = rh.generateDeviceToken();
        await User.findByIdAndUpdate({ _id: req.user._id }, {
            robinhood_device_token: device_token
        });
        req.user.robinhood_device_token = device_token;
        let newUser = await User.findById(req.user._id);
    }
    var credentials = {
        username: req.user.robinhood_user,
        password: req.user.robinhood_password,
        device_token: device_token
    };
    let token = await rh.getToken(credentials);

    if (token){
        res.json({success: true, token: token})
    } else {
        res.json({success: false, challenge: rh.challenge})
    }
});

router.post('/challenge', ensureAuthenticated, async function(req, res) {
    // Validation      
    req.checkBody('challenge_id', '').notEmpty();
    req.checkBody('challenge_code', 'Challenge code is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.json({success: false, errors: errors});
    } else {
        var rh = new RH();
        let token = null;
        try {
            await rh.getChallenge(req.body.challenge_id, req.body.challenge_code);
            console.log("Answered challenge, now submitting auth");
            var credentials = {
                username: req.user.robinhood_user,
                password: req.user.robinhood_password,
                challenge_id: req.body.challenge_id,
                device_token: req.user.robinhood_device_token
            };
            let token = await rh.getToken(credentials);
            console.log(rh, token);
            res.json({success: true, token: token});
        } catch (error) {
            console.log("Error getting token", error);
            if (rh.challenge) {
                res.status(401).json({success: false, challenge: rh.challenge});
            } else {
                res.status(401).json({success: false, errors: error});
            }
        }
    }
});

router.get('/token', ensureAuthenticated, async function (req, res) {
    var credentials = {
        username: req.user.robinhood_user,
        password: req.user.robinhood_password,
        device_token: req.user.robinhood_device_token
    };
    console.log("In token");
    var rh = new RH();
    let token = await rh.getToken(credentials);
    console.log(rh, token);
    if (token){
        res.json({success: true, token: token})
    } else {
        res.json({success: false})
    }
});

router.get('/ui', ensureAuthenticated, async function (req, res) {
    var results = {
        watchlists: [],
        positions: []
    };
    try {
        let token = req.query.robin_token;
        var rh = new RH({token: token});
        var account = new rh.Account();
        console.log("rh account", account);
        var data = await account.positions;
        if (data) {
            results.positions = data;
        }
        data = await account.watchlists;
        if (data) {
            results.watchlists = data;
        }
    } catch (err) {
        console.error(err);
    }
    res.json(results);
});

//Non zero postions - not tested
router.get('/positions', ensureAuthenticated, function (req, res) {
    var credentials = {
        token: req.query.token,
        device_token: req.user.robinhood_device_token
    };
    var Robinhood = require('robinhood')(credentials, function () {
        Robinhood.nonzero_positions(function (err, response, body) {
            if (err) {
                console.error(err);
            } else {
                console.log("positions");
                console.log(body);
            }
        });
    });

});

// buy 
router.post('/buy', ensureAuthenticated, function (req, res) {
    var credentials = {
        token: req.body.token,
        device_token: req.user.robinhood_device_token
    };
    //var name = element.getAttribute("name");
    var Robinhood = require('robinhood')(credentials, function () {
        var type = req.body.order;
        var quantity = req.body.quantity;
        var bid_price = req.body.bid_price;
        var symbol = req.body.tix;
        var Robinhood = require('robinhood')(credentials, function () {
            Robinhood.instruments(symbol, function (err, response, body) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("instruments");
                    //console.log(body.results[0].url);
                    //will have to be a while loop
                    for (var i = 0, len = Object.keys(body.results).length; i < len; i++) {
                        if (body.results[i].symbol == symbol) {
                            var options = {
                                type: type,
                                quantity: quantity,
                                bid_price: bid_price,
                                instrument: {
                                    url: body.results[i].url,
                                    symbol: symbol
                                }
                                // // Optional:
                                // trigger: String, // Defaults to "gfd" (Good For Day)
                                // time: String,    // Defaults to "immediate"
                                // type: String     // Defaults to "market"
                            }
                            Robinhood.place_buy_order(options, function (error, response, body) {
                                if (error) {
                                    console.error(error);
                                } else {
                                    console.log(body);
                                    res.redirect("/dashboard")
                                }
                            })
                        }
                    }
                }
            })
        })
    })
});




// buy 
router.post('/sell', ensureAuthenticated, function (req, res) {
    var credentials = {
        token: req.body.token,
        device_token: req.user.robinhood_device_token
    };
    //var name = element.getAttribute("name");
    var Robinhood = require('robinhood')(credentials, function () {
        var type = req.body.order;
        var quantity = req.body.quantity;
        var bid_price = req.body.bid_price;
        var symbol = req.body.tix;
        var Robinhood = require('robinhood')(credentials, function () {
            Robinhood.instruments(symbol, function (err, response, body) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("instruments");
                    //console.log(body.results[0].url);
                    //will have to be a while loop
                    for (var i = 0, len = Object.keys(body.results).length; i < len; i++) {
                        if (body.results[i].symbol == symbol) {
                            var options = {
                                type: type,
                                quantity: quantity,
                                bid_price: bid_price,
                                instrument: {
                                    url: body.results[i].url,
                                    symbol: symbol
                                }
                                // // Optional:
                                // trigger: String, // Defaults to "gfd" (Good For Day)
                                // time: String,    // Defaults to "immediate"
                                // type: String     // Defaults to "market"
                            }
                            Robinhood.place_sell_order(options, function (error, response, body) {
                                if (error) {
                                    console.error(error);
                                } else {
                                    console.log(body);
                                    res.redirect("/dashboard")
                                }
                            })
                        }
                    }
                }
            })
        })
    })
});

// optional options hash.  If no hash is sent, all orders will be returned.
let options = {
    updated_at: '2017-08-25',
    instrument: 'https://api.robinhood.com/instruments/df6c09dc-bb4f-4495-8c59-f13e6eb3641f/'
}
//orders
router.get('/orders', ensureAuthenticated, function (req, res) {

    var Robinhood = require('robinhood')(credentials, function () {
        Robinhood.orders(options, function (err, response, body) {
            if (err) {
                console.error(err);
            } else {
                console.log("orders");
                console.log(body);
            }
        })
    });

});

// Watchlist
router.get('/watchlist', ensureAuthenticated, function (req, res) {
    var credentials = {
        username: req.user.robinhood_user,
        password: req.user.robinhood_password,
        device_token: req.user.robinhood_device_token
    };
    var Robinhood = require('robinhood')(credentials, function () {
        Robinhood.watchlists(function (err, response, body) {
            if (err) {
                console.error(err);
            } else {
                res.send(body);
            }
        })
    })
});
//cancel orders
router.get('/cancel', ensureAuthenticated, function (req, res) {

    var Robinhood = require('robinhood')(credentials, function () {
        //Get list of orders
        Robinhood.orders(function (error, response, body) {
            if (error) {
                console.error(error);
            } else {
                var orderToCancel = body.results[0];
                //Try to cancel the latest order
                Robinhood.cancel_order(orderToCancel, function (err, response, body) {
                    if (err) {
                        //Error

                        console.error(err);     // { message: 'Order cannot be cancelled.', order: {Order} }
                    } else {
                        //Success

                        console.log("Cancel Order Successful");
                        console.log(body)       //{}
                    }
                })
            }
        })
    })

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