
console.log("Inside chat engine");

class ChatEngine{
    //  chat box id change 
    constructor(chatBoxId, userEmail,userName){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

     // this.socket = io('http://localhost:5000');
        this.socket = io('http://localhost:5000', { transports : ['websocket'] });


        if (this.userEmail){
            this.connectionHandler();
        }

    }


    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })


        });

        // Send a message on clicking the send message button
        $('#fab_send').click(function(){
            let msg = $('#chatSend').val();

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    user_name: self.userName,
                    chatroom: 'codeial'
                });
            }
        });

        // Check if recive message event is happening or not     

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);


            let newMessage = $('<li>');

            let newMessageContainer = $('<div>');

            let status = $('<span>')


            let statusStyle = 'status2';
            let messageType = 'chat_msg_item chat_msg_item_admin ';

            if (data.user_email == self.userEmail){
                messageType = 'chat_msg_item chat_msg_item_user';
                statusStyle = 'status';
            }

            newMessageContainer.append($('<span>', {
                'html': data.message
            }));

            newMessageContainer.addClass(messageType);

            
            status.append($('<sub>', {
                // 'html': data.user_email
                'html': data.user_name
            }).addClass(statusStyle));



            $('#chat-messages-list').append(newMessageContainer).append(status);



        })





    }

}