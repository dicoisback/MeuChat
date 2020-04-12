const express = require("express");
const path = require("path");
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, 'public')));
const porta = process.env.PORT || 8000;

app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
})

let users = []

io.on('connection', socket => {
    console.log(`Entrou alguem com ID ${socket.id}`)
    socket.on('entrou', data => {
        socket.emit('token', socket.id)
    })
    socket.on('entrouAlguem', data => {
        if(data.nome.length > 0){
            users.push({
                "id": users.length,
                "nome": data.nome,
                "token": socket.id
            })
            socket.broadcast.emit('msg', {'name': 'BOT', 'msg': `Entrou o ${data.nome}`, 'token': socket.id})
            socket.emit('msg', {'name': 'BOT', 'msg': `Entrou o ${data.nome}`, 'token': socket.id})
            socket.emit('meuUsuario', {
                "id": users.length,
                "nome": data.nome,
                "token": socket.id
            })
            socket.emit('users', users)
            socket.broadcast.emit('users', users)
        }
    })
    socket.on('enviarMensagem', data => {
        if(data.length > 0){
        const foundUser = users.find(e => e.token == socket.id)
        if(foundUser){
        socket.broadcast.emit('msg', {'name': foundUser.nome,'msg': data, 'token': socket.id})
        socket.emit('msg', {'name': foundUser.nome, 'msg':data, 'token': socket.id})
        }
        }
    })

    socket.on('disconnect', function(data){
        const foundUser = users.find(e => e.token == socket.id)
        if(foundUser){
            socket.broadcast.emit('msg', {'name': 'BOT', 'msg': `Saiu o ${foundUser.nome}`, 'token': socket.id})
            const id = users.indexOf(foundUser)
            users.splice(id, 1)
            socket.broadcast.emit('users', users)
        }
    })

    socket.on('digitando', function(){
        socket.broadcast.emit('digitandoAlguem', true)
    })

    socket.on('naoDigitando', function(){
        socket.broadcast.emit('naoDigitandoAlguem', true)
    })
})

server.listen(porta);