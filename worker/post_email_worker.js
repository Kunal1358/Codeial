const queue = require('../config/kue');

const postsMailer = require('../mailers/posts_mailer');

// create
queue.process('newPost' ,function(job,done){
    console.log("Email worker is processing a Job -> ", job.data);

    postsMailer.createPost(job.data);

    done();

});

// delete
queue.process('deletePost' ,function(job,done){
    console.log("Email worker is processing a Job -> ", job.data);

    postsMailer.deletePost(job.data);

    done();

});