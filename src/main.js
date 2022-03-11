require('dotenv').config();
//import dotenv from 'dotenv';
const { Client, Intents, MessageEmbed, Collection, DiscordAPIError } = require('discord.js');
//import { Client, Intents, MessageEmbed, Collection } from 'discord.js';
//import 'fs';
const fs = require('fs');
const fetch = require('node-fetch');
//import * as fetch from 'node-fetch';
const StateManager = require('./utils/StateManager.js');
const SMH = require('./utils/StateManagerHandler.js');
//import './utils/StateManager.js';
const { registerEvents, registerCommands } = require('./register');
//import { registerEvents, registerCommands } from './register.js';
const Discord = require('discord.js');
const download = require('image-downloader');

const { checkReactions } = require('./utils/Reactions');
//var cron = require('node-cron');

var client = new Client({ 
	intents: [
		Intents.FLAGS.GUILDS, 
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS
	],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	})
//console.log("client: " + client);

module.exports = {
	client : client
};
//console.log("main client: " + client);
//module.exports = client;

/*var mapSubmissionChannel = null;
var mapApprovedChannel = null;
var mapShowcaseChannel = null;
var solutionSubmissionChannel = null;
var mapApprovalThreshold = 1;
var maps = new Map();
var messages = new Map();*/

/*() => {
	console.log('----- API REQUEST TEST -----');
	const response = axios.post({
		method: 'post',
		url: 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/?',
		headers: {},
		data: {
			itemcount: 1,
			'publishedfileids[0]': 2735851596
		}
	});
	if (response.status === 200){
		//console.log(response);
		console.log(response.data);
		console.log(response.status);
	} else {
		console.log("Api error");
	}
	console.log('----- API REQUEST TEST -----');
})();*/

(async () => {
	await registerEvents(client, './events');
	await registerCommands();

	//client.setInterval(checkReactions(client, mapid, msgid), 60000); //run every minute
})();

client.commands = new Collection();
const commandFiles = fs.readdirSync(process.cwd() + "\\src\\commands").filter(file => file.endsWith('.js'));
//console.log(commandFiles);
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	//console.log(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}
/*
client.once('ready', () => {
    
	//const API_URL = 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/?key=108106D2993C66C8F2BAB9540C9D8177&itemcount=1&publishedfileids%5B0%5D=2735851596';
	axios({
		url: 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/?key=108106D2993C66C8F2BAB9540C9D8177&itemcount=1&publishedfileids%5B0%5D=2735851596',
		method: 'post'
	});
	
});*/

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	//console.log("test");
	await command.execute(interaction);
});

//ESCUCHAR REACCIONES
client.on('messageReactionAdd', async (reaction, user) => {
	const guild = client.guilds.cache.get(process.env.GUILD_ID);
	const member = guild.members.cache.get(user.id);
	const role = member.roles.highest;

	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	if (reaction.message.member.roles.cache.some(role => role.name === 'Staff')) {
		// the reaction is coming from a user with the Staff role
		//checkReactions(reaction_orig);
		//console.log(reaction_orig);
		//console.log("staff");
	}	

	for (let [key, value] of SMH.messages.entries()) {
		if (value === reaction.message.id){
			//console.log("encontrado");
			const mapid = key;
			var approvals = -1;
			try {
				await StateManager.connection.query(
					`SELECT approvals FROM chambers WHERE '${mapid}'`
				).then(result => {
					approvals = result[0][0].approvals;    
					//console.log("approvals" + result);        
				}).catch(e => console.log(e));
			} catch (error){
				console.error(error);
			}

			if (approvals + 1 >= mapApprovalThreshold) {
				//send through map showcase channel
				for (let [key, value] of maps.entries()) {
					if (key === mapid) {
						var map = value;						
						// poner en un módulo aparte y hacer require (también en submit)
						async function downloadImage(url, filepath) {
							return download.image({
							   url: url,
							   dest: filepath 
							});
						}
						//console.log("map: " + map);
						//console.log("map pic url: " + map.get('picurl'));
						var pic = await downloadImage(map.get('picurl'), 'img/map_preview.png');
		
						var attachment = new Discord
							  .MessageAttachment('img/map_preview.png', 'prev.png');

						var embed = new Discord.MessageEmbed()
							.setColor(`#${process.env.BOT_COLOR}`)
							.setTitle(`${map.get('title')}`) //map name??? + submitted???
							.setDescription(`${map.get('desc')}`)
							.setURL(map.get('url'))
							.setImage('attachment://prev.png');
						const message = await client.channels.cache.get(mapShowcaseChannel).send({
							embeds: [ embed ],
							files: [ attachment ]
						});
						setTimeout(() => reaction.message.delete(), 1000)
					}
				}
			}

			try {
				await StateManager.connection.query(
					`UPDATE chambers SET approvals = '${approvals + 1}' WHERE id = '${mapid}'`
				).then(result => {
					StateManager.emit('mapApproved', mapid, approvals + 1);      
				}).catch(e => console.log(e));
			} catch (error){
				console.error(error);
			}
		}
	}

	//if (reaction.message.)
	//console.log("evento");
});

/*client.on('messageReactionAdd', (reaction, user) => {
	let message = reaction.message, emoji = reaction.emoji;

	if (emoji.name == '✅') {
			
	}

	else if (emoji.name == '❎') {
			
	}

	console.log("Reaccionado");

	// Remove the user's reaction
	reaction.remove(user);
});*/


/*client.on('message', message => {
	let args = message.content.substring(PREFIX.length).split(" ");
	switch (args[0]) {
		case 'react':
			message.react('🔥');
	}
})*/

client.login(process.env.TOKEN);
//console.log(dotenv.config().parsed?.TOKEN);
//client.login();

/*
StateManager.on('mapChannelUpdated', (channel) => {
    //const guild = client.guilds.cache.get(process.env.GUILD_ID);
    //mapSubmissionChannel = guild.channels.cache.find(ch => ch.name === channel);
    SMH.mapSubmissionChannel = channel;
})

StateManager.on('mapApprovedChannelUpdated', (channel) => {
    SMH.mapApprovedChannel = channel;
})

StateManager.on('mapShowcaseChannelUpdated', (channel) => {
    SMH.mapShowcaseChannel = channel;
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
	
	SMH.maps.set(id, map);
})

StateManager.on('mapApproved', (id, approvals) => {
	console.log(SMH.maps);
	var map = SMH.maps.get(id);
	map.set('approvals', approvals);
	console.log(maps);
})

StateManager.on('messageAdded', (mapid, messageid) => {
    //const guild = client.guilds.cache.get(process.env.GUILD_ID);
    //mapSubmissionChannel = guild.channels.cache.find(ch => ch.name === channel);
    
    //// AÑADIR EL MENSAJE A LA CACHE DEL BOT ////
    //client.channels.cache.get(mapSubmissionChannel).messages.fetch(messageid);
    SMH.messages.set(mapid, messageid);
})*/
SMH();