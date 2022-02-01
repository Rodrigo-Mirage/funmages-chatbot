const express = require('express');
const path = require('path');
const { brotliCompress } = require('zlib');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const FunmagesBot = require('./bot');

const mongoose = require ('mongoose');
const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBURL}`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
    console.log('DB conectado')
});

const bot = new FunmagesBot(mongoose);


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
    sendInfo(socket)
    socket.on('switchBot', () =>{
        if(!bot.statusBot){
            bot.start();
        }else{
            bot.stop();
        }
        sendInfo(socket)
    })
})

function sendInfo(socket){
    socket.emit('getInfo', {statusBot:bot.statusBot,channelList:bot.getChannelList(),adList: bot.adList});
}

console.log(port)
server.listen(port);