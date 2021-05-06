const express   = require("express");
const router    = express.Router();
const Request   = require('rest-request');
const API       = new Request('https://api.cryptowat.ch/markets/gdax');

// Get BTC price
router.get("/btc", function(req, res){
    var btcPrice = API.get('btcusd/summary', {});
    btcPrice.then(function(response) {
        res.send(response);
    }).catch(function (err) {
        console.log(err);
    });
});

// Get ETH price
router.get("/eth", function(req, res){
    var btcPrice = API.get('ethusd/summary', {});
    btcPrice.then(function(response) {
        res.send(response);
    }).catch(function (err) {
        console.log(err);
    });
});

// Get LTC price
router.get("/ltc", function(req, res){
    var btcPrice = API.get('ltcusd/summary', {});
    btcPrice.then(function(response) {
        res.send(response);
    }).catch(function (err) {
        console.log(err);
    });
});

module.exports = router;