const StateManager = require('./StateManager.js');

var mapSubmissionChannel = null;
var solutionSubmissionChannel = null;
var maps = new Map();
var messages = new Map();

exports.checkReactions = function checkReactions(client, mapid, msgid) {
    const channel = client.channels.cache.find(mapSubmissionChannel);
    const message = channel.messages.fetch(msgid);

    //message.reactions.cache
}

StateManager.on('mapChannelUpdated', (channel) => {
    //const guild = client.guilds.cache.get(process.env.GUILD_ID);
    //mapSubmissionChannel = guild.channels.cache.find(ch => ch.name === channel);
    mapSubmissionChannel = channel;
})

StateManager.on('mapsAdded', (id, url, title, desc, approvals, solutions) => {
    var map = new Map();
	//map.set('id', id);
	map.set('url', url);
	map.set('title', title);
	map.set('desc', desc);
	map.set('approvals', approvals);
	map.set('solutions', solutions);
	
	maps.set(id, map);
})

StateManager.on('messageAdded', (mapid, messageid) => {
    //const guild = client.guilds.cache.get(process.env.GUILD_ID);
    //mapSubmissionChannel = guild.channels.cache.find(ch => ch.name === channel);
    messages.set(mapid, messageid);
})