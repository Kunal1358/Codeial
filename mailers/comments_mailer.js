const nodeMailer = require('../config/nodemailer');

// New Comment 
exports.newComment = (comment) => {

    console.log('inside newComment mailer', comment);
    // Using template 
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs' )

    nodeMailer.transporter.sendMail({
       from: 'toyboxtb001@gmail.com',
       // TODO change to:
       to: 'toyboxtb001@gmail.com',// TODO CHange here
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


// Delete Commment
exports.deleteComment = (comment) => {

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/delete_comment.ejs' )

    nodeMailer.transporter.sendMail({
       from: 'toyboxtb001@gmail.com',
       // TODO change to:
       to: 'toyboxtb001@gmail.com',
       subject: "Comment Deleted!",
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