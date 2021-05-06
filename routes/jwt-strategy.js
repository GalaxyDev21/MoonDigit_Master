'use strict';

const   passport            = require('passport');
const   passportJwt         = require('passport-jwt');
const   JwtSimple           = require('jwt-simple');
const   Promise             = require('bluebird');
const   User                = require("../models/user");

const jwtExtract = (req) => {
    let result = passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!result) {
        result = req.query.token;
    }
    return result;
};
const jwtOpts = {
    secretOrKey: 'h*V%:[@=d5!\'?${8x',
    jwtFromRequest: jwtExtract,
    issuer: 'MoonDigits',
    audience: 'moondigits.com'
};

function JwtStrategy (passport) {

    let jwtStrategyInstance = new passportJwt.Strategy(jwtOpts, function (jwtPayload, done/*, info*/) {
        console.log("jwt payload", jwtPayload);

        User.getUserById(jwtPayload.sub, function(err, user){
            if (err) {
                return done(err);
            } else if (!user) {
                return done(null, false, { message:"Unknown user" });
            } else {
                return done(null, user);
            }
        });
    });

    passport.use(jwtStrategyInstance);
    return jwtStrategyInstance;
}

function JwtToken (user) {
    return JwtSimple.encode({
        sub: user.id,
        iss: jwtOpts.issuer,
        aud: jwtOpts.audience
    }, jwtOpts.secretOrKey);
}

function JwtAuthentication (req, res, next, authArgs) {
    passport.authenticate('jwt', authArgs, function (err, user/*, info*/) {
        if (!authArgs) {
            authArgs = { session: false };
        }
        if (err) {
            return next(JSON.stringify({message: err}));
        }

        if (user) {
            req.user = user;
            next();
        } else {
            next(JSON.stringify({message: "Authentication failed!"}));
        }
    })(req, res, next);
}

function JwtOptionalAuthentication (req, res, next, authArgs) {
    passport.authenticate('jwt', authArgs, function (err, user/*, info*/) {
        if (!authArgs) {
            authArgs = { session: false };
        }
        if (err) {
            // No auth token
            return next();
        } else {
            if (user) {
                req.user = user;
            }
            next();
        }
    })(req, res, next);
}

let jwtStrategyInstance = JwtStrategy(passport);

function RefreshToken(req) {
    return new Promise((resolve, reject) => {
        let authHeader = req.headers["authorization"];
        let token = null;
        if (authHeader) {
            authHeader = authHeader.split(" ");
            if ("bearer" === String(authHeader[0]).toLowerCase()) {
                token = authHeader[1];
            }
        }
        if (token) {
            passportJwt.Strategy.JwtVerifier(token, jwtOpts.secretOrKey, jwtOpts, function(jwt_err, payload) {
                if (jwt_err) {
                    reject(jwt_err);
                } else {
                    // console.info("JWT payload: %s", JSON.stringify(payload));
                    // Pass the parsed token to the user
                    var verified = function(err, user) {
                        if(err) {
                            reject(err);
                        } else if (!user) {
                            reject({message: "User not found!"});
                        } else {
                            let token = JwtToken(user);
                            let u = Object.assign({}, user);
                            delete u.id;
                            delete u.password;
                            resolve({
                                user: u,
                                token: token
                            });
                        }
                    };

                    try {
                        if (jwtStrategyInstance._passReqToCallback) {
                            jwtStrategyInstance._verify(req, payload, verified);
                        } else {
                            jwtStrategyInstance._verify(payload, verified);
                        }
                    } catch(ex) {
                        reject(ex);
                    }
                }
            });
        } else {
            reject({message: "Invalid token!"});
        }
    });
}

module.exports = {
    instance: jwtStrategyInstance,
    JwtToken: JwtToken,
    JwtAuthentication: JwtAuthentication,
    JwtOptionalAuthentication: JwtOptionalAuthentication,
    RefreshToken: RefreshToken
};
