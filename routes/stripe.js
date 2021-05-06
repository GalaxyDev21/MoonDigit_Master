const   express     = require('express');
const   router      = express.Router();
const   resolve         = require('path').resolve;
const 	Request  	= require('rest-request');
const   User        = require("../models/user")

// Not sure what I'm doing here
//This should probably only be called once?
//Just don't call this use the Stripe Dashboard
router.get('/premiumcreation', ensureAuthenticated, function(req, res){
	// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_RKuN1zlF9dtIfC1uj5CSyPQi");

stripe.plans.create({
  name: "Premium Plan",
  id: "premium-monthly",
  interval: "month",
  currency: "usd",
  amount: 5,
}, function(err, plan) {
  // asynchronously called
});
});

// Not sure what I'm doing here
router.post('/addpremium', ensureAuthenticated, function(req, res){
	// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_RKuN1zlF9dtIfC1uj5CSyPQi");

//create customer
/*
Once you create the customer, 
store the id value in your own database for later reference
(presumably with the customer's email address). 
*/
stripe.customers.create({
    email: "jenny.rosen@example.com",
    description: 'Customer for alexander.taylor@example.com',
    source: "tok_mastercard" // obtained with Stripe.js
  }, function(err, customer) {
      console.log(customer);
    //User.findByIdAndUpdate({_id:req.user._id}, /*req.body*/).then(function(){
        /*
        User.findOne({_id: req.params.id}).then(function(ninja){
            res.send(ninja);
        }); */
});
  });
//add customore to subscption
stripe.subscriptions.create({
customer: "cus_4fdAW5ftNQow1a",
coupon: "free-period",
tax_percent: 4.75,
trial_period_days: 7,
items: [
    {
    plan: "premium-monthly",
    },
],
}, function(err, subscription) {
// asynchronously called
});  
});