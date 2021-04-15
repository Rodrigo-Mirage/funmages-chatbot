const tmi = require('tmi.js');
require('dotenv').config();
const { Client } = require('twitchrequest');


var onChannels = [];

async function start() {
    var channelList = [    
        "mirageiw",
        "verinha_hime",
        "praiadeconcreto",
        "ZorakX",
        "Canal_Rzero",
        "brunoantonucci",
        "Dany_Leone22",
        "ChrisBunny99",
        "DaveBey",
        "GMStation",
        "AnderFanta",
        "jeffreyhaiduk",
        "hortaracing"
    ];



    var cloneList = [];

    
    const options = {
        channels: cloneList,
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





    const tmiClient = new tmi.Client({
        connection: {
            secure: true,
            reconnect: true
        },
        identity: {
            username: 'bot_void_ling',
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


    client.on('live', (data) => {
        if (onChannels.indexOf(channel) > 0) {
            onChannels.splice(onChannels.indexOf(channel), 1);
        }

        onChannels.push(data.name);
    });

    client.on('unlive', (data) => {
        if (onChannels.indexOf(channel) > 0) {
            onChannels.splice(onChannels.indexOf(channel), 1);
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
start();