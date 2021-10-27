const nodeMailer = require('../config/nodemailer');

// Post created
exports.createPost = (post) => {

    let htmlString = nodeMailer.renderTemplate({post: post}, '/posts/new_post.ejs' )

    nodeMailer.transporter.sendMail({
       from: 'toyboxtb001@gmail.com',
       // TODO change to:
       to: 'toyboxtb001@gmail.com', // TODO CHange here
       subject: "New Post Published!",
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


// Delete Post
exports.deletePost = (post) => {

    let htmlString = nodeMailer.renderTemplate({post: post}, '/posts/delete_post.ejs' )

    nodeMailer.transporter.sendMail({
       from: 'toyboxtb001@gmail.com',
       // TODO change to:
       to: 'toyboxtb001@gmail.com',
       subject: "Post Deleted!",
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