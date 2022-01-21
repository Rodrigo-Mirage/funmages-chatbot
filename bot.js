const tmi = require('tmi.js');
require('dotenv').config();
const { Client } = require('twitchrequest');
const http = require('http');
const path = require('path');


class FunmagesBot{

    statusBot = false;
    
    onChannels = [];
        
    adList = {};
        
    discord = process.env.DISCORD;
    
    channelList = [];

    tmiInstance;
    clientInstance;

    constructor(){

        this.statusBot = false;
    
        this.onChannels = [];
            
        this.adList = {
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
        };
            
        this.discord = process.env.DISCORD;
        
        this.channelList = [    
            "mirageiw",
            "verinha_hime",
            "zorak_x",
            "canal_rzero",
            "brunoantonucci",
            "dani_leone22",
            "anderfanta",
            "jeffreyhaiduk",
            "hortaracing",
            "pha_el",
            "juneamamiya",
            "felipeconrad",
            "seshimoon",
            "artemyss"
        ];

        const options = {
            channels: [],
            client_id: process.env.BOT_CLIENT,
            client_secret: process.env.BOT_SECRET,
            interval: 15
        };

        this.clientInstance = new Client(options);
        this.clientInstance.on('live', (data) => {
            if (this.onChannels.indexOf(data.name.toLowerCase()) > -1) {
                this.onChannels.splice(this.onChannels.indexOf(data.name.toLowerCase()), 1);
            }
            console.log(`${data.name} is online!`);
            this.onChannels.push(data.name.toLowerCase());
        });
        this.clientInstance.on('unlive', (data) => {
            if (this.onChannels.indexOf(data.name.toLowerCase()) > -1) {
                this.onChannels.splice(this.onChannels.indexOf(data.name.toLowerCase()), 1);
            }
            console.log(`${data.name} is offline!`);
        });
    }
   
    
    start() {
        var cloneList = [];
        this.onChannels = []; 
        
        this.channelList.forEach(channel => {
            if(channel){
                this.clientInstance.includesChannel(channel);
            }
        });

        this.channelList.forEach(async channel => {
            cloneList.push(channel);
            await this.clientInstance.getStream(channel).then(data => {
                if (data) {
                    console.log(`${channel} is online!`);
                    if (this.onChannels.indexOf(channel.toLowerCase()) > -1) {
                        this.onChannels.splice(this.onChannels.indexOf(channel.toLowerCase()), 1);
                    }
                    this.onChannels.push(channel.toLowerCase());
                }
            });
           
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
            channels: cloneList
        });
        tmiClient.connect().catch(()=>{
            console.log("erro de coneçao");
            console.error;
        });
        tmiClient.on('message', (channel, tags, message, self) => {
            if (message == "!fm") { 
                try{
                    this.adTwitch(channel,tmiClient);
                }catch(e){
                    console.log(channel, message)
                }
            }
            if (message == "!fmulti") { 
                try{
                    tmiClient.say(channel, this.createMulti());
                }catch(e){
                    console.log(channel, message)
                }
            }
            if (message == "!fmdiscord") { 
                try{
                    tmiClient.say(channel, this.createDiscord());
                }catch(e){
                    console.log(channel, message)
                }
            }
            
        });
        console.log("Bot online");

        this.tmiInstance = tmiClient;
        this.statusBot = true;
    
        setTimeout(()=>{
            this.adBreak(tmiClient);
        },600000);
    
    }

    stop(){
        if(this.tmiInstance){
            this.tmiInstance.disconnect().catch(()=>{
                console.log("erro de coneçao");
                console.error;
            });
            console.log("Bot offline");
        }
        this.channelList.forEach(channel => {
            if(channel){
                this.clientInstance.removeChannel(channel);
            }
        });
        this.statusBot = false;
    }
    
    createMulti(){
        if (this.onChannels.length > 1) {
            var base = "Se liga, ta aqui um link pra todos os streamers da Fun Mages online no momento: https://www.multitwitch.tv";
            this.onChannels.forEach(channel => {
                base += "/" + channel;
            });
            return base;
        } else {
            var base = "StinkyCheese No momento a Fun Mages não tem streamers online o suficiente para criar um multi CrreamAwk";
            return base;
            
        }
    }
    
    createDiscord(){
        
        var base = " 1) Acesse: " + this.discord + " 2) Vá até a COMMON AREA e entre em #CHECKIN 3) Reaja ao emote do canal. Pronto! agora já tem acesso à area do streamer, lembrando que você pode reagir com mais de um emote, e ganhará acesso a todas as areas que desejar.";
        return base;
            
    }
    
    adTwitch (channel,tmiClient){
            
        console.log("!fm p/ " + channel);
        var messBase = "";
    
        messBase = "Este streamer faz parte da FUN MAGES. Somos um time de streamers, com diversos conteúdos recheados de variedade e qualidade! Siga todos os nossos magos e não perca nada da magia da diversão";
    
        tmiClient.say(channel,messBase);
        
    }
    
    adBreak (tmiClient) {
        
        if(this.statusBot){
            console.log("HORA DO AD");
            this.onChannels.forEach(channel => {
                if(channel != ""){
                    var messBase = "";
                
                    var random = Math.floor(Math.random() * (this.channelList.length - 1 ));
            
                    while(this.channelList[random].replace("#","") == channel || !adList[this.channelList[random].replace("#","")]){
                        
                    console.log(channel + " ad: " + this.channelList[random]);
                        random = Math.floor(Math.random() * (this.channelList.length - 1 ));
                    }
                    console.log("ad p/ " + channel);
                    console.log("ad: " + this.channelList[random].replace("#",""));
                
                    messBase = "!sh " + (this.channelList[random].replace("#","")) + " => Esse(a) streamer participará da live especial da Fun Mages dia 29 de janeiro, junto com o host do canal. não perca! ";
                    setTimeout(()=>{
                        tmiClient.say(channel,messBase);
                    },3000);
                    
                }else{
                    console.log("nenhum mage on")
                }
            });
        
            setTimeout(()=>{
                this.adBreak(tmiClient);
            },1200000)
        }
    }

    getBotStatus(){
        return this.statusBot;
    }
    
    getChannelList(){
        return this.channelList;
    }
}

module.exports = FunmagesBot;




