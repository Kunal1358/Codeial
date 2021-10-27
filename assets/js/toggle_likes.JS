
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;
            
            let notificationContainer =$('#noti-content');

            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));

                console.log(data)

                console.log(likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                    
                }else{
                    
// *******************************************************************************************

                    // TODO add notification by ajax

                //     console.log("Calling function")
                //     let newNotification = new Notifications(); // calling the ctr
                //    let print =  newNotification.sendNotifications();

                //     console.log('printing ', print );

                //     console.log("Like")
                //     // console.log($('#posts-list-container>'));
                //     console.log($('#list-of-items'));

                //     $('.list-of-items>ul').prepend(print);

                //     // Change when final notification
                //     new Noty({
                //         theme: 'relax',
                //         text: "Noti Send!",
                //         type: 'success',
                //         layout: 'topRight',
                //         timeout: 1500
                        
                //     }).show();


// *******************************************************************************************
                    likesCount += 1;
                }


                $(self).attr('data-likes', likesCount);
                $(self).html(` <i class="fas fa-heart fa-2x" style="font-size:23px; color:#7c80ed; padding-right: 3px;" ></i>  ${likesCount}  `);

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }

}
// *******************************************************************************************

// class Notifications{

//     constructor(){
//         this.sendNotifications();
//     }

//     sendNotifications(){

//         console.log("-------------------------------------------------------------------------------")
//         console.log("Inside Send Noti ")
//         console.log("-------------------------------------------------------------------------------")


//         // return $('<li> Wowrking </li>');
//         return $('<li> Wowrking </li>');

//     }
    
// }