const tmi = require('tmi.js');
require('dotenv').config();
const { Client } = require('twitchrequest');
const http = require('http');


var onChannels = [];

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

var adList = {
    "mirageiw": "Multiplayers online, speedrun, competitivos, e diversos",
    "verinha_hime": "Jogos casuais e clássicos de simulação",
    "praiadeconcreto": "Artes, cosplay e jogos diversos",
    "Zorak_X": "Retrogames, indie e jogos de ação",
    "canal_rzero": "Jogos de ação, RPGs táticos e diversos",
    "brunoantonucci": "Fotografia e jogos de ação",
    "dani_leone22": "Multiplayers online e RPGs",
    "chrisbunny99": "Artes e retrogames",
    "davebey": "Estratégia, RPGs táticos e pôquer",
    "GMStation": "Retrogames, RPG, storytelling e cosplay",
    "AnderFanta": "Jogos de ação, aventura e RPG (FANTAsia!)",
    "jeffreyhaiduk": "Artes, bate-papo e RPGs",
    "hortaracing": "Simulador de corridas e retrogames",
    "pha_el": "Multiplayers online e jogos de ação",
    "juneamamiya": "Jogos de ação, lego e mitologia",
    "felipeconrad": "Quadrinhos, cinema e jogos diversos"
}


async function start() {
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
                if (onChannels.indexOf(channel.toLowerCase()) > -1) {
                    onChannels.splice(onChannels.indexOf(channel.toLowerCase()), 1);
                }
                onChannels.push(channel.toLowerCase());
            }
        });
    });
    client.on('live', (data) => {
        if (onChannels.indexOf(data.name.toLowerCase()) > -1) {
            onChannels.splice(onChannels.indexOf(data.name.toLowerCase()), 1);
        }
        console.log(`${data.name} is online!`);
        onChannels.push(data.name.toLowerCase());
    });
    client.on('unlive', (data) => {
        if (onChannels.indexOf(data.name.toLowerCase()) > -1) {
            onChannels.splice(onChannels.indexOf(data.name.toLowerCase()), 1);
        }
        console.log(`${data.name} is offline!`);
    });
    const tmiClient = new tmi.Client({
        debug:true,
        connection: {
            secure: true,
            reconnect: true
        },
        joinInterval:2000,
        identity: {
            username: process.env.BOT_LOGIN,
            password: process.env.BOT_OAUTH
        },
        channels: channelList
    });
    tmiClient.connect().catch(console.error);;
    tmiClient.on('message', (channel, tags, message, self) => {
        if (message == "!fm") { 
            try{
                tmiClient.say(channel, createMulti());
            }catch(e){
                console.log(channel, message)
            }
        }
    });
    console.log("Bot online");

    setTimeout(()=>{
        adBreak(tmiClient);
    },5000);

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


const adBreak = (tmiClient) =>{
    console.log("HORA DO AD");
    onChannels.forEach(channel => {
        
        console.log("ad p/ " + channel);
        var messBase = "";
        var messBase2 = "";

        messBase = "A FUN MAGES é uma equipe de streamers com o objetivo de trazer conteúdos variados e de qualidade para a Twitch. Nosso time é composto por vários canais, falando sobre tudo um pouco: desde arte, quadrinhos e retrogames até os jogos mais atuais e tendências de cultura pop. Conheça um dos nossos parceiros a seguir:";
        
        var random = Math.floor(Math.random() * (channelList.length - 1 ));

        while(channelList[random].replace("#","") == channel){
            random = Math.floor(Math.random() * (channelList.length - 1 ));
        }
        messBase2 = "!sh " + (channelList[random].replace("#","")) + " :" + adList[(channelList[random].replace("#",""))];
        
        console.log("ad: " + channelList[random]);

        tmiClient.say(channel,messBase);
        
        setTimeout(()=>{
            tmiClient.say(channel,messBase2);
        },3000);

    });

    setTimeout(()=>{
        adBreak(tmiClient);
    },1200000)
}

 



