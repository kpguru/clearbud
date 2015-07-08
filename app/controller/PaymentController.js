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
						var receipentID = req.body.receipentID
					   stripe.customers.create({
							   card: stripeToken,
							   email: 'patoliya@grepruby.com'
				     }).then(function(customer) {
						 	return stripe.charges.create({
									amount: amount, // amount in cents, again
									currency: "usd",									
									description: "patoliya@grepruby.com",
									customer : customer.id
					   });
			       	}).then(function(charge) {					
					       stripe.transfers.create({
											amount: 2, // amount in cents
											currency: "usd",
											recipient: receipentID,
											card: 'card_16LvIHEHY4NsJu4sP4aOdAj2',
											statement_descriptor: "Your first booking payment"
										}, function(err, transfer) {
									     res.json(charge);
								      });
								      res.json(charge);
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
						console.log(recipient);
						res.json(recipient.id);
					});			
	   }
