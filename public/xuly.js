var socket = io('http://localhost:3000')

//lắng nghe dki thất bại
socket.on('server-send-dki-thatbai', function() {
    alert('Tài khoản đã tồn tại')
})

//lắng nghe dki thành công
socket.on('server-send-dki-thanhcong', function(data) {
    $('#currentUser').html(data); // hiển thị username ra trình duyệt
    $('#loginForm').hide(); //bắt loginform ẩn đi
   $('#chatForm').show(); //hiện chatform
})

//lắng nghe danh sách users trả về
socket.on('server-send-danhsach-users', function(data){
    $('#boxContent').html('');
    data.forEach((element) => {
        $('#boxContent').append("<div class='user'>"  + element + "</div>")
    });
})

//nhận tin nhắn khi người khác đã gửi tin nhắn
socket.on('server-send-message', function(data) {
    $('#listMessages').append("<div class='ms'>"+ data.user + ': ' + data.value +"</div>")
    $('#txtMessage').val('')
})

//lắng nghe sự kiện có người đang nhắn tin
socket.on('ai-do-dang-go', function(data){
    $('#notification').html("<img width='150px' src='typing.webp'> </br>" + data)
})

//lắng nghe sự kiện khi có người hết nhắn tin
socket.on('ai-do-het-go', function() {
    $('#notification').html('')
})

//ở trong document này sẽ Xử lý khi người dùng thao tác trên website
$(document).ready(function() {
   $('#loginForm').show(); //hiện loginform
   $('#chatForm').hide(); //ẩn chatform

   //xử lý khi click vào nút đăng ký
   $('#btnRegister').click(function() { //khi click vào nút đăng ký
        socket.emit('client-send-username', $('#txtUsername').val()) //gửi value trong ô input lên server
   })

   //xử lý khi click vào nút đăng xuất
   $('#btnLogout').click(function() {
    socket.emit('logout');
    $('#chatForm').hide();
    $('#loginForm').show();
   })

   //xử lý khi click vào nút gửi tin nhắn
   $('#btnSendMessage').click(function() {
    socket.emit('user-send-message', $('#txtMessage').val()); //người dùng gửi tin nhắn lên server
   })

   //xử lý khi có người đang gõ tin nhắn
   $('#txtMessage').focusin(function() {
    socket.emit('toi-dang-go')
   })

   //xử lý khi người dùng blur ra khỏi ô nhập tin nhắn
   $('#txtMessage').focusout(function() {
    socket.emit('toi-het-go')
   })
})