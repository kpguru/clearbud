var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');

var stripe_secret = "sk_test_IeK9KWcycB3NKQkWunnNkWlN";
var stripe_public = "pk_test_VkqhfDUwIQNyWJK4sR7CKVsY";


exports.doPayment = function(req, res){
  var stripe = require("stripe")(stripe_secret);
  var stripeToken = req.body.token;
	var cardno = req.body.number;
	var card_cvc = req.body.card_cvc;
	var exp_month = req.body.exp_month;
	var exp_year = req.body.exp_year;
	var amount = req.body.amount;
  
	console.log("Body =", req.body);
					stripe.customers.create({
							card: stripeToken,
							email: 'patoliya@grepruby.com'
				  }).then(function(customer) {
							console.log('customer :' ,customer);
							return stripe.charges.create({
									amount: amount, // amount in cents, again
									currency: "usd",									
									description: "patoliya@grepruby.com",
									customer : customer.id
					});
				}).then(function(charge) {
					console.log('charge :' ,charge);
					res.json(charge);					
				});	
				
 }
