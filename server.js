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
        bot.BotSwitch().then(()=>{
            sendInfo(socket);
        });
    })

    socket.on('changeMvp', (channel) =>{
        bot.changeMvp(channel).then(()=>{
            sendInfo(socket)
        })
    })
    
    socket.on('editMvpMessage', (message) =>{
        bot.editMvpMessage(message).then(()=>{
            sendInfo(socket)
        })
    })
    
    socket.on('editAdMessage', (message) =>{
        bot.editadMessage(message).then(()=>{
            sendInfo(socket)
        })
    })

    socket.on('getChannelInfo', (channel) =>{
        bot.getChannel(channel).then((data)=>{
            socket.emit("editInfo",data)
        })
    })

    
    socket.on('saveChannel', (sentdata) =>{
        bot.editChannel(sentdata.channel,sentdata.editData).then((data)=>{
            sendInfo(socket)
        })
    })

    socket.on('removeChannel', (channel) =>{
        bot.removeChannel(channel).then((data)=>{
            sendInfo(socket)
        })
    })
})

function sendInfo(socket){
    socket.emit('getInfo', 
    {
        statusBot:bot.statusBot,
        channelList:bot.getChannelList(),
        adList: bot.adList,
        mvp:bot.Mvp,
        mvpMessage:bot.mvpMessage,
        adMessage:bot.adMessage
        
    });
}

console.log(port)
server.listen(port);