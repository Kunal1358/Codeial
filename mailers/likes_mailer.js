const nodeMailer = require('../config/nodemailer');

// Post liked
exports.postLike = (like) => {

    // Using template 
    let htmlString = nodeMailer.renderTemplate({like: like}, '/likes/post_like.ejs' )

    nodeMailer.transporter.sendMail({
       from: 'toyboxtb001@gmail.com',
       // TODO change TO
       to: 'toyboxtb001@gmail.com',
       subject: "Someone Liked your Post!!!",
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


// Comment liked
exports.commentLike = (like) => {

    let htmlString = nodeMailer.renderTemplate({like: like}, '/likes/comment_like.ejs' )

    nodeMailer.transporter.sendMail({
       from: 'toyboxtb001@gmail.com',
       // TODO change TO
       to: 'toyboxtb001@gmail.com',
       subject: "Someone Liked your Comment!!!",
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
