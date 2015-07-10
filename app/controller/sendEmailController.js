var nodemailer = require('nodemailer');
bodyParser = require('body-parser');
exports.sendEmail= function(req,res){
  var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
      user: "clearbudapp@gmail.com",
      pass: "okrhvfkqnxxqyjjg"
    }
  });
  // setup e-mail data with unicode symbols
  var mailOptions = {
                      from: req.body.name+"<"+ req.body.email_id +">", // sender address
                      to: "Receiver Name <clearbudapp@gmail.com>", // list of receivers
                      sender: req.body.email_id,
                      subject: req.body.subject, // Subject line
                      text: "", // plaintext body
                      html: "<html><h3>Hello, Sir/Mam </h3><body>"+ req.body.email_id +"</br><p>"+req.body.message+"</p></br><h3>Thanks</h3></body></html>"
                    }
  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
        res.json({msg:'mail send successfully'});
    }
  });       
}
