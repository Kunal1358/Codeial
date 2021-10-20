module.exports.contactUs = async function(req,res){

    console.log("///////////////////    Inside Conroller     ////////////////////////");


        return res.render('contactForm',{
            title: 'FOrm'
        });
}
