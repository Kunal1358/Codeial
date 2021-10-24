let button = $('#updateNoti');
    
button.click(function(e){
    e.preventDefault();

    $.ajax({
        type: 'get',
        url: $(button).prop('href'),
        success: function(result) {
            alert('ok');
        },
        error: function(result) {
            alert('error');
        }
    })

})






// $("button").click(function(e) {
//     e.preventDefault();
//     $.ajax({
//         type: "POST",
//         url: "/pages/test/",
//         success: function(result) {
//             alert('ok');
//         },
//         error: function(result) {
//             alert('error');
//         }
//     });
// });



// change

{/* <script src="https://code.jquery.com/jquery-1.9.1.min.js"></script>
<script>
// window.alert("Workisdfsdfsfng");
$(window).load(function(){
    // window.alert("Worki-----------ng");
    // console.log('Wrking================================================');
    myClick();
});


function myClick() {
  setTimeout(
    function() {
        document.getElementById('not-read').style.backgroundColor='aliceblue';
      document.getElementById('div2').style.backgroundColor ='aliceblue';
    }, 2000);
}

</script> */}