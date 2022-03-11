const StateManager = require('./StateManager.js');


module.exports = (() => {
    var mapSubmissionChannel = null;
    var mapApprovedChannel = null;
    var mapShowcaseChannel = null;
    var solutionSubmissionChannel = null;
    var mapApprovalThreshold = 1;
    var maps = new Map();
    var messages = new Map();

    StateManager.on('mapChannelUpdated', (channel) => {
        //const guild = client.guilds.cache.get(process.env.GUILD_ID);
        //mapSubmissionChannel = guild.channels.cache.find(ch => ch.name === channel);
        mapSubmissionChannel = channel;
    })
    
    StateManager.on('mapApprovedChannelUpdated', (channel) => {
        //const guild = client.guilds.cache.get(process.env.GUILD_ID);
        //mapSubmissionChannel = guild.channels.cache.find(ch => ch.name === channel);
        mapApprovedChannel = channel;
    })
    
    StateManager.on('mapShowcaseChannelUpdated', (channel) => {
        mapShowcaseChannel = channel;
    })
    
    StateManager.on('messageAdded', (mapid, messageid) => {
        //const guild = client.guilds.cache.get(process.env.GUILD_ID);
        //mapSubmissionChannel = guild.channels.cache.find(ch => ch.name === channel);
        //console.log('message added');
        //// AÑADIR EL MENSAJE A LA CACHE DEL BOT ////
        //console.log(main.client);
        //main.client.channels.cache.get(mapSubmissionChannel).fetchMessage(messageid);
        //console.log("canal: " + main.client.channels.cache.get(mapSubmissionChannel).name);
        //main.client.channels.cache.get(mapSubmissionChannel).messages.fetch(messageid);
        messages.set(mapid, messageid);
        //console.log("eeeeeeeeee");
    })

    StateManager.on('mapsAdded', (id, url, picurl, title, desc, approvals, solutions) => {
        var map = new Map();
        //map.set('id', id);
        map.set('url', url);
        map.set('picurl', picurl);
        map.set('title', title);
        map.set('desc', desc);
        map.set('approvals', approvals);
        map.set('solutions', solutions);
        
        maps.set(id, map);
    })
});

/*module.exports = {
    mapSubmissionChannel: mapSubmissionChannel,
    mapApprovedChannel: mapApprovedChannel,
    mapShowcaseChannel: mapShowcaseChannel,
    solutionSubmissionChannel: solutionSubmissionChannel,
    mapApprovalThreshold: mapApprovalThreshold,
    maps: maps,
    messages: messages
}*/