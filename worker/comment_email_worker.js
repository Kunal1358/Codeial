const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');

// create
queue.process('newComment' ,function(job,done){
    console.log("Email worker is processing a Job -> ", job.data);

    commentsMailer.newComment(job.data);

    done();

});

// delete
queue.process('deleteComment' ,function(job,done){
    console.log("Email worker is processing a Job -> ", job.data);

    commentsMailer.deleteComment(job.data);

    done();

});