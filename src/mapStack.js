require('dotenv').config();
const StateManager = require('./utils/StateManager.js');
const { client } = require('./main.js');

const mapSubmissionChannel = null;

/*StateManager.on('clientSet', (cl) => {
    client = cl;
})*/

StateManager.on('channelUpdated', (channel) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    mapSubmissionChannel = guild.channels.cache.find(ch => ch.name === channel);
})