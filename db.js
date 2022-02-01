
const { MongoClient } = require('mongodb');


class DB{
    Schema = mongoose.Schema;
    StatusSchema = new this.Schema({
        Name:String,
        Value:String
    })
    AccountSchema = new this.Schema({
        Name:String,
        twitch:String,
        streamer:Boolean,
        desc:String
    })

    Status = mongoose.model("Status", this.StatusSchema);
    Account = mongoose.model("Account", this.AccountSchema);

    constructor(){

        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.connection.on('connected',()=>{
            console.log('mongoooooose')
        });
    }
    addStatus(name,value){

        const data = {
            Name:name,
            Value:value
        }
        const newStatus = new this.Status(data);
        newStatus.save((error)=>{
            if(error){
                console.log("erro")
            }else{
                console.log("Data inserted")
            }
        });
    }
    getStatus(){
        console.log(`find`)
        this.Status.find({}).then((data)=>{
            return data;
        }).catch((error)=>{
            console.log(error)
        })
    }
    getAccounts(){

    }
};

module.exports = DB;
