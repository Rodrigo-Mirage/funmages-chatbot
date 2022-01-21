const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const FunmagesBot = require('./bot');


const bot = new FunmagesBot();

var statusBot = false;

app.use(express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname,'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';


app.use('/', (req, res) => {
    res.render('index.html');
})

io.on('connection',socket =>{
    socket.emit('getInfo', {statusBot,channelList:bot.getChannelList()});
    socket.on('switchBot', () =>{
        statusBot = !statusBot;
        if(statusBot){
            bot.start();
        }else{
            bot.stop();
        }
        socket.emit('getInfo', {statusBot,channelList:bot.getChannelList()});
    })
})

console.log(port)
server.listen(port);