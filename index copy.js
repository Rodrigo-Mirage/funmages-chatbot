const tmi = require('tmi.js');
require('dotenv').config();
const { Client } = require('twitchrequest');
const http = require('http');


var onChannels = [];

var channelList = [    
    "mirageiw",
    "verinha_hime",
    "zorak_x",
    "canal_rzero",
    "brunoantonucci",
    "dani_leone22",
    "davebey",
    "gmstation",
    "anderfanta",
    "jeffreyhaiduk",
    "hortaracing",
    "pha_el",
    "juneamamiya",
    "felipeconrad",
    "seshimoon",
    "artemyss"
];

var adList = {
    "mirageiw": "Multiplayers online, randomizers, competitivos, e diversos",
    //"verinha_hime": "Jogos casuais e clássicos de simulação",
    "zorak_x": "Retrogames, indie e jogos de ação",
    "canal_rzero": "Jogos de ação, RPGs táticos e diversos",
    "brunoantonucci": "Fotografia e jogos de ação",
    //"dani_leone22": "Multiplayers online e RPGs",
    //"davebey": "Estratégia, RPGs táticos e pôquer",
    //"gmstation": "Retrogames, RPG, storytelling e cosplay",
    //"anderfanta": "Jogos de ação, aventura e RPG (FANTAsia!)",
    "jeffreyhaiduk": "Artes, bate-papo e RPGs",
    "hortaracing": "Simulador de corridas e retrogames",
    "pha_el": "Multiplayers online e jogos de ação",
    //"juneamamiya": "Jogos de ação, lego e mitologia",
    //"felipeconrad": "Quadrinhos, cinema e jogos diversos",
    "seshimoon":"Jogos casuais e CIENCIA",
    "artemyss":"Cosplay, e jogos casuais"
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
                adTwitch(channel,tmiClient);
            }catch(e){
                console.log(channel, message)
            }
        }
        if (message == "!fmulti") { 
            try{
                tmiClient.say(channel, createMulti());
            }catch(e){
                console.log(channel, message)
            }
        }
        if (message == "!fmdiscord") { 
            try{
                tmiClient.say(channel, createDiscord());
            }catch(e){
                console.log(channel, message)
            }
        }
        
    });
    console.log("Bot online");

    setTimeout(()=>{
        adBreak(tmiClient);
    },360000);

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

var discord = process.env.DISCORD;

const createDiscord = () => {
    
    var base = " 1) Acesse: " + discord + " 2) Vá até a COMMON AREA e entre em #CHECKIN 3) Reaja ao emote do canal. Pronto! agora já tem acesso à area do streamer, lembrando que você pode reagir com mais de um emote, e ganhará acesso a todas as areas que desejar.";
    return base;
        
    
}


const adTwitch = (channel,tmiClient) =>{
    console.log("HORA DO AD");
        
    console.log("!fm p/ " + channel);
    var messBase = "";

    messBase = "Este streamer faz parte da FUN MAGES. Somos um time de streamers, com diversos conteúdos recheados de variedade e qualidade! Siga todos os nossos magos e não perca nada da magia da diversão";

    tmiClient.say(channel,messBase);
    
}

const adBreak = (tmiClient) =>{
    console.log("HORA DO AD");
    onChannels.forEach(channel => {
        
        console.log("ad p/ " + channel);
        var messBase = "";

        messBase = "Conheça este parceiro da Fun Mages(!fm) :";
        
        var random = Math.floor(Math.random() * (channelList.length - 1 ));

        while(channelList[random].replace("#","") == channel){
            random = Math.floor(Math.random() * (channelList.length - 1 ));
        }
        tmiClient.say(channel,messBase);
    
        messBase = "!sh " + (channelList[random].replace("#","")) + " => Esse/a streamer participará da live especial da Fun Mages dia 29 de janeiro, junto com o host do canal. não perca! ";
        setTimeout(()=>{
            tmiClient.say(channel,messBase);
        },3000);
        
        console.log("ad: " + channelList[random]);
        

    });

    setTimeout(()=>{
        adBreak(tmiClient);
    },1200000)
}

 



