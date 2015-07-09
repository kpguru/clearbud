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
						var amt = req.body.amount;
						var amount = amt;
						var cleanerAmt = (amount*90);
						var cleanerAmount = cleanerAmt/100;
						console.log(cleanerAmount);
						var receipent = req.body.receipent;
						console.log(req.body.email);
					   stripe.customers.create({
							   card: stripeToken,
							   email: req.body.email
				     }).then(function(customer) {
						 	return stripe.charges.create({
									amount: amount*100, // amount in cents, again
									currency: "usd",									
									description: "patoliya@grepruby.com",
									customer : customer.id
					   });
			       	}).then(function(charge) {				
					       stripe.transfers.create({
											amount: cleanerAmount*100, // amount in cents
											currency: "usd",
											recipient: receipent.id,
											card: receipent.default_card,
											statement_descriptor: "Your first booking payment"
										}, function(err, transfer) {
											console.log(err);
									     res.json(charge);
								      });
								   //res.json(charge);
			   });					
      }
	    exports.createRecipentID = function(req, res){
				 var stripe = require("stripe")(stripe_secret);
				 var stripeToken = req.body.token;
				 var cardno = req.body.number;
				 var card_cvc = req.body.card_cvc;
				 var exp_month = req.body.exp_month;
				 var exp_year = req.body.exp_year;
				 var name = req.body.name;
				 var email = req.body.email;
				 stripe.recipients.create({
						name: name,
						type: "individual",
						tax_id  : '000000000',
						card: stripeToken,
						email: email
					}, function(err, recipient) {
						console.log(err);
						res.json(recipient);
					});			
	    }
