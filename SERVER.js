var express = require('express');
var app = express();
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', './views');

var server = require('http').Server(app)
var io = require('socket.io')(server);
server.listen(3000);

//khai báo mảng chứa username
var mangUsers = [];

io.on('connection', function(socket) {
    console.log(socket.id + ' vừa kết nối')

    //xử lý đăng ký đăng nhập
    socket.on('client-send-username', function(data) {
        if(mangUsers.indexOf(data.trim()) >=0) { //kiểm tra data có trong mảng không(có trả về 1 k có trả về 0)
            socket.emit('server-send-dki-thatbai') //thông báo về người dùng là dki thất bại
        }else {
            //xử lý với user đăng ký
            mangUsers.push(data); //thêm username vào mảng
            socket.username = data; //tự tạo ra username để định danh người vừa dăng ký
            socket.emit('server-send-dki-thanhcong', data) //trả username về cho người dùng
        
            //thông báo đến tất cả mọi người danh sách đang online
            io.sockets.emit('server-send-danhsach-users', mangUsers)
        }
    })

    //xử lý logout
    socket.on('logout', function() {
        mangUsers.splice( // cắt thằng có username bấm logout đi, chỉ xóa 1 thằng ra khỏi mảng
            mangUsers.indexOf(socket.username),1
        )
        socket.broadcast.emit('server-send-danhsach-users', mangUsers)
    })

    //xử lý gửi tin nhắn
    socket.on('user-send-message', function(data) {
        io.sockets.emit('server-send-message', {user:socket.username, value:data})
    })

    //xử lý khi có người đang nhập tin nhắn
    socket.on('toi-dang-go', function() {
        var loadMessage = socket.username + ' đang nhập tin nhắn!!!'
        socket.broadcast.emit('ai-do-dang-go', loadMessage)
    })

    //xử lý khi người dùng blur ra khỏi ô nhập tin nhắn
    socket.on('toi-het-go', function() {
        socket.broadcast.emit('ai-do-het-go')
    })
})

app.get('/', (req, res) => {
    res.render('index')
})