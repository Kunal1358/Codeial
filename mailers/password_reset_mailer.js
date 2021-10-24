const nodeMailer = require('../config/nodemailer');

exports.sendPasswordResetToken = (token) => {
    let htmlString = nodeMailer.renderTemplate({token: token}, '/password_reset.ejs');
    
    nodeMailer.transporter.sendMail({
        from: 'toyboxtb001@gmail.com',
        to: token.user.email,
        subject: 'Reset your Codeial password',
        html: htmlString,
    }, function(err, info){
        if(err){
            console.log('Error in sending mail: ', err);
            return;
        }
        console.log('Mail sent: ', info);
        return;
    })
}