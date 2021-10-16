

class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

     // this.socket = io('http://localhost:5000');
        this.socket = io('http://localhost:5000', { transports : ['websocket'] });


        if (this.userEmail){
            this.connectionHandler();
        }

    }


    connectionHandler(){
        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');
        });
    }
}