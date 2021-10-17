const queue = require('../config/kue');

const likesMailer = require('../mailers/likes_mailer');

// Like on Post
queue.process('postLike' ,function(job,done){
    console.log("Email worker is processing a Job -> ", job.data);

    likesMailer.postLike(job.data);

    done();

});


// Like on Comment
queue.process('commentLike' ,function(job,done){
    console.log("Email worker is processing a Job -> ", job.data);

    likesMailer.commentLike(job.data);

    done();

});
