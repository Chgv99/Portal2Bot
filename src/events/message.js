const BaseEvent = require('../utils/structures/BaseEvent');
const StateManager = require('../utils/StateManager');

var mapSubmissionChannel = null;

module.exports = class MessageEvent extends BaseEvent {
    constructor () {
        super('message');
        this.connection = StateManager.connection;
    }

    async run (client, message) {
        /*StateManager.connection.query(
            `SELECT * FROM global WHERE id = 1`
        ).then(result => {
            mapSubmissionChannel = result[0][0].mapchannelid;            
            StateManager.emit('mapChannelUpdated', mapSubmissionChannel);

            console.log('Cache loaded!');
            console.log(client.user.tag + ' is online!');
        }).catch(e => console.log(e));*/
        console.log("e");

        if (message.channel === mapSubmissionChannel){
            console.log('message');
        }
        
    }
}

StateManager.on('mapChannelUpdated', (channel) => {
    mapSubmissionChannel = channel;
})