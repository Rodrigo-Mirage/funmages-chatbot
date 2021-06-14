const tmi = require('tmi.js');
require('dotenv').config();
const { Client } = require('twitchrequest');
const http = require('http');


var onChannels = [];

async function start() {
    var channelList = [    
        "mirageiw",
        "verinha_hime",
        "praiadeconcreto",
        "Zorak_X",
        "canal_rzero",
        "brunoantonucci",
        "dani_leone22",
        "chrisbunny99",
        "davebey",
        "GMStation",
        "AnderFanta",
        "jeffreyhaiduk",
        "hortaracing",
        "pha_el",
        "juneamamiya",
        "felipeconrad"
    ];
    var cloneList = [];
    onChannels = [];
    const options = {
        channels: channelList,
        client_id: process.env.BOT_CLIENT,
        client_secret: process.env.BOT_SECRET,
        interval: 15
    };
    const client = new Client(options);
    channelList.forEach(async channel => {
        cloneList.push(channel);
        await client.getStream(channel).then(data => {
            if (data) {
                console.log(`${channel} is online!`);
                if (onChannels.indexOf(channel) > 0) {
                    onChannels.splice(onChannels.indexOf(channel), 1);
                }
                onChannels.push(channel);
            }
        });
    });
    client.on('live', (data) => {
        if (onChannels.indexOf(data.name) > 0) {
            onChannels.splice(onChannels.indexOf(data.name), 1);
        }
        console.log(`${data.name} is online!`);
        onChannels.push(data.name);
    });
    client.on('unlive', (data) => {
        if (onChannels.indexOf(data.name) > 0) {
            onChannels.splice(onChannels.indexOf(data.name), 1);
        }
    });
    const tmiClient = new tmi.Client({
        connection: {
            secure: true,
            reconnect: true
        },
        identity: {
            username: process.env.BOT_LOGIN,
            password: process.env.BOT_OAUTH
        },
        channels: channelList
    });
    tmiClient.connect();
    tmiClient.on('message', (channel, tags, message, self) => {
        if (message == "!fm") { 
            tmiClient.say(channel, createMulti());
        }
    });
    console.log("Bot online");
}

const createMulti = () => {
    if (onChannels.length > 1) {
        var base = "Se liga, ta aqui um link pra todos os streamers da Fun Mages online no momento: https://www.multitwitch.tv";
        onChannels.forEach(channel => {
            base += "/" + channel;
        });
        return base;
    } else {
        var base = "StinkyCheese No momento a Fun Mages não tem streamers online o suficiente para criar um multi CrreamAwk";
        return base;
    }
}

console.log("starting");

const express = require('express')
const app = express()
const port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

app.get('/', (req, res) => {
  res.send(onChannels)
})

app.get('/reset', (req, res) => {
    start();
    console.log("reset");
    res.redirect('/');
})

app.listen(port,server_host, () => {
    start();
  console.log(`Example app listening at http://localhost:${port}`)
})