const nodeMailer = require('../config/nodemailer');

console.log('============================================= Inside comments mailer');

// this is another way of exporting a method
exports.newComment = (comment) => {

    console.log('inside newComment mailer', comment);
    // Using template 
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs' )

    nodeMailer.transporter.sendMail({
       from: 'toyboxtb001@gmail.com',
    //    to: comment.user.email,
       to: 'toyboxtb001@gmail.com',
       subject: "New Comment Published!",
       html: htmlString
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}