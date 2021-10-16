
console.log('===================Inside env==================')

const development = {
    name: 'development',
    // asset_path: '/assets',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'toyboxtb001@gmail.com', // my email
            pass: 'childboxadmin' // my pass
        }
    },
    google_client_id: '113798808560-7oka32dds52vf2v2ve4rlm21i1ck34sa.apps.googleusercontent.com',
    google_client_secret: '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',
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial'
}

const production = {
    name: 'production'
}



module.exports = development;