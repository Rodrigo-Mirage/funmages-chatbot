const tmi = require('tmi.js');
require('dotenv').config();
const { Client } = require('twitchrequest');
const http = require('http');
const path = require('path');


class FunmagesBot{

    statusBot = false;
    statusMvp = false;
    onChannels = [];
    adList = {};
    discord = process.env.DISCORD;
    channelList = [];
    tmiInstance;
    clientInstance;
    mongoose;
    Schema;
    StatusSchema;
    AccountSchema;
    Status;
    Account;



    constructor(mongoose){
        this.mongoose = mongoose;

        this.Schema = this.mongoose.Schema;
        this.StatusSchema = new this.Schema({
                Name:String,
                Value:String
            });
        this.AccountSchema = new this.Schema({
                Name:String,
                twitch:String,
                streamer:Boolean,
                desc:String
            })
        
        this.Status = this.mongoose.model("Status", this.StatusSchema);
        this.Account = this.mongoose.model("Account", this.AccountSchema);
        
        this.Account.find({}).then((accs)=>{ 
            this.channelList = [];
            this.adList = {};
            accs.forEach((acc) =>{
                this.channelList.push(acc.twitch);
                if(acc.streamer){
                    this.adList[acc.twitch] = acc.desc;
                }
            });

            this.Status.find({}).then((stts)=>{
                stts.forEach((acc) =>{
                    switch(acc.Name){
                        case "online":
                            this.statusBot = acc.Value == "true";
                        break;
                        case "mvp":
                            this.statusMvp = acc.Value == "true";
                        break;
                    }

                });
        
                this.onChannels = [];
                    
                this.discord = process.env.DISCORD;
                
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

                if(this.statusBot){
                    this.start();
                }
            }).catch((error)=>{
                console.log(error)
            })
        }).catch((error)=>{
            console.log(error)
        })
    }
   
    
    start() {
        var cloneList = [];
        this.onChannels = []; 
        
        this.channelList.forEach(channel => {
            if(channel){
                this.clientInstance.addChannel(channel);
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
            
                    while(this.channelList[random].replace("#","") == channel || !this.adList[this.channelList[random].replace("#","")]){
                        
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
    
    getOnChannels(){
        return this.onChannels;
    }

    addChannel(channel){
        channel = channel.toLowerCase();
        if(!this.channelList.includes(channel)){
            this.channelList.append(channel);
            this.clientInstance.addChannel(channel);
            this.stop();
            this.start();
        }
    }

    addChannelAd(channel,description){
        this.adList[channel] = description;
    }

    removeChannel(){
        
    }

    removeChannelAd(){

    }

}

module.exports = FunmagesBot;




