const socket = io('http://localhost:8000')

const app = new Vue({
    el: "#app",
    data: {
        conectado: false,
        io: null,
        nome: "",
        estouConectado: false,
        token: null,
        chat: [],
        me: {},
        msg: "",
        users: [],
        alguemDigitando: false
    },
    mounted(){
        
    },
    methods: {
        entrarNoChat(){
            if(this.nome.length > 0){
                socket.emit('entrouAlguem', {'nome': this.nome})
                this.estouConectado = true
            }
        },
        enviarMensagem(){
            if(this.msg.length > 0){
                socket.emit('enviarMensagem', this.msg)
                this.msg = ""
            }
        },
        digitando(){
            if(this.msg.length > 0){
                socket.emit('digitando', true)
            } else{
                socket.emit('naoDigitando', true)
            }
        }
    }
})

socket.on('token', function(token){
    app.token = token
})

socket.on('digitandoAlguem', function(data){
    app.alguemDigitando = true
})

socket.on('naoDigitandoAlguem', function(data){
    app.alguemDigitando = false
})

socket.on('connect', function(){
    app.conectado = true
    socket.emit('entrou', true)
})

socket.on('msg', function(msg){
    app.chat.push(msg)
})

socket.on('meuUsuario', function(eu){
    app.me = eu
})

socket.on('disconnect', () => {
    socket.emit('disconnect', true)
})

socket.on('users', function(user){
    app.users = user
})