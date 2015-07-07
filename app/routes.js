var bodyParser = require('body-parser');
    module.exports = function(app) {

    	var userController = require('./controller/PaymentController');
		
		app.get('/', function(req, res) {
	      res.sendfile('./public/home.html');
		});
		app.post('/doPayment', userController.doPayment);
    app.post('/createRecipentID', userController.createRecipentID);
		app.post('/*', function(req, res){
		   res.redirect('/');
	    });	
    }
