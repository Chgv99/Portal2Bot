const BaseEvent = require('../utils/structures/BaseEvent');
const StateManager = require('../utils/StateManager');
const SMH = require('../utils/StateManagerHandler.js');
const { Interaction } = require('discord.js');

//temp
const fetch = require('node-fetch');
//import axios, * as others from 'axios';
const axios = import('axios').default;

/*var mapSubmissionChannel = null;
var mapApprovedChannel = null;
var mapShowcaseChannel = null;
var solutionSubmissionChannel = null;
var maps = new Map();
var messages = new Map();*/

module.exports = class ReadyEvent extends BaseEvent {
    constructor () {
        super('ready');
        this.connection = StateManager.connection;
    }

    async run (client) {
        StateManager.connection.query(
            `SELECT * FROM global WHERE id = 1`
        ).then(result => {
            SMH.mapSubmissionChannel = result[0][0].mapchannelid;
            SMH.mapApprovedChannel = result[0][0].mapapprovedchannelid;
            SMH.mapShowcaseChannel = result[0][0].mapshowcasechannelid;
            console.log("id: " + SMH.mapSubmissionChannel);         
            StateManager.emit('mapChannelUpdated', SMH.mapSubmissionChannel);
            StateManager.emit('mapApprovedChannelUpdated', SMH.mapApprovedChannel);
            StateManager.emit('mapShowcaseChannelUpdated', SMH.mapShowcaseChannel);

            //console.log('Cache loaded!');
            //console.log(client.user.tag + ' is online!');

            /*const { file } = fetch('http://xkcd.com/info.0.json').then(response => response.json());
            const guild = client.guilds.cache.find(guild => guild.id === process.env.GUILD_ID);
            const channel = guild.channels.cache.find(ch => ch.id === mapSubmissionChannel);
            channel.send(file);*/
            /*axios.get('http://xkcd.com/info.0.json')
                .then(res => {
                    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
                    console.log('Status Code:', res.status);
                    console.log('Date in Response header:', headerDate);

                    const users = res.data;

                    for(user of users) {
                    console.log(`Got user with id: ${user.id}, name: ${user.name}`);
                    }
                })
                .catch(err => {
                    console.log('Error: ', err.message);
                });*/
        }).catch(e => console.log(e));

        StateManager.connection.query(
            `SELECT * FROM messages`
        ).then(result => {
            //// BUCLE QUE AÑADA TODOS LOS MENSAJES GUARDADOS Y NO 1 SOLO ////
            //console.log("mapid: " + result[0][0].mapid);
            //console.log("messageid: " + result[0][0].messageid);
            for (var i = 0; i < result[0].length; i++){
                StateManager.emit('messageAdded', 
                    result[0][i].mapid, 
                    result[0][i].messageid);
            }
            //StateManager.emit('messageAdded', mapid, msgid);
        }).catch(e => console.log(e));
        
        StateManager.connection.query(
            `SELECT * FROM chambers`
        ).then(result => {
            for (var i = 0; i < result[0].length; i++){
                StateManager.emit('mapsAdded', 
                    result[0][i].id, 
                    result[0][i].url, 
                    result[0][i].picurl, 
                    result[0][i].title,
                    result[0][i].desc,
                    result[0][i].approvals,
                    result[0][i].solutions);
            }
            //console.log("maps" + maps);
        }).catch(e => console.log(e));
    }
}

SMH();
/*StateManager.on('mapChannelUpdated', (channel) => {
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

StateManager.on('messageAdded', (mapid, messageid) => {
    //const guild = client.guilds.cache.get(process.env.GUILD_ID);
    //mapSubmissionChannel = guild.channels.cache.find(ch => ch.name === channel);
    
    //// AÑADIR EL MENSAJE A LA CACHE DEL BOT ////
    //client.channels.cache.get(mapSubmissionChannel).messages.fetch(messageid);
    messages.set(mapid, messageid);
})*/