var bodyParser = require('body-parser');
    module.exports = function(app) {

    	var userController = require('./controller/PaymentController');
      var emailController = require('./controller/sendEmailController');
		
		app.get('/', function(req, res) {
	      res.sendfile('./public/home.html');
		});
		app.post('/contact-us', emailController.sendEmail);
    app.post('/doPayment', userController.doPayment);
    app.post('/createRecipentID', userController.createRecipentID);
		app.post('/*', function(req, res){
		   res.redirect('/');
	    });	
    }
