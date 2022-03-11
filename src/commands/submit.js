require('dotenv').config();
const { SlashCommandBuilder } = require('@discordjs/builders');
const StateManager = require('../utils/StateManager.js');
const SMH = require('../utils/StateManagerHandler.js');
const Discord = require('discord.js');
const main = require('../main.js');
const fetch = require('node-fetch');
const resolve = require('path').resolve;
var https = require('https'),                                                
    Stream = require('stream').Transform,                                  
    fs = require('fs');   
const download = require('image-downloader');
//const client = main[0];
//const StateManager = require('../utils/StateManager.js');

var axios = require('axios');
var FormData = require('form-data');
const { isMessageComponentDMInteraction } = require('discord-api-types/utils/v9');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('submit')
        .setDescription('Submit either a map or a solution for a map')
        .addSubcommand(subcommand =>
            subcommand
                .setName("map")
                .setDescription("Submit a map")
                .addStringOption(option =>
                    option
                        .setName("mapurl")
                        .setDescription("Map url")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("solution")
                .setDescription("Submit a video solution")
                .addStringOption(option =>
                    option
                        .setName("videourl")
                        .setDescription("Video url")
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName("mapurl")
                        .setDescription("Solved map url")
                        .setRequired(true))
        ),
            
	async execute(interaction) {
        //console.log(interaction.options.getSubcommand());
        //console.log(interaction.channel.id);
        //console.log(`${process.env.BOT_COLOR}`);
        //check that channel and subcommand match
        if (interaction.options.getSubcommand() === "map" && interaction.channel.id === SMH.mapSubmissionChannel) {
            console.log("submit command execute");
            //sample url: https://steamcommunity.com/sharedfiles/filedetails/?id=2735851596
            //URL MAP ID EXTRACTION
            
            const mapurl = interaction.options.getString("mapurl").replace(/^"(.+(?="$))"$/, '$1');
            const index = mapurl.indexOf("id=");
            const mapid = mapurl.slice(index + 3);
            console.log("mapurl: " + mapurl);
            console.log("index: " + index);
            console.log("mapid: " + mapid);
            //API REQUEST
            var data = new FormData();
            data.append('publishedfileids[0]', `${mapid}`); //lasertopia: 2735851596
            data.append('itemcount', '1');
            var config = {
                method: 'post',
                url: 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/?itemcount=1&publishedfileids%5B0%5D=2735851596',
                headers: { 
                  ...data.getHeaders()
                },
                data : data
            };
            
            var title = "";
            var desc = "";
            var pic_url = "";
            var embed = new Discord.MessageEmbed()
                .setColor(`#${process.env.BOT_COLOR}`);
            var attachment = null;
            var err = "";
            await axios(config)
                .then(function (response) {
                    title = JSON.stringify(response.data.response.publishedfiledetails[0].title).replace(/^"(.+(?="$))"$/, '$1');
                    desc = JSON.stringify(response.data.response.publishedfiledetails[0].description).replace(/^"(.+(?="$))"$/, '$1');
                    pic_url = JSON.stringify(response.data.response.publishedfiledetails[0].preview_url).replace(/^"(.+(?="$))"$/, '$1');
            }).catch(function (error) {
                console.log("eeeeerror: " + error);
                err = error.message;
            });

            //DB insert
            try {
                await StateManager.connection.query(
                    `INSERT INTO chambers VALUES ('${mapid}', '${mapurl}', '${pic_url}', '${title}', '${desc}', '0', '0')`
                )
            } catch (error){
                console.error(error);
                err = error.message;
            }

            if (err !== "") {
                console.log("was error");
                if (err.includes("Duplicate")){
                    err = "Map has already been submitted. Ask mods for further help."
                } else {
                    err = "Error while trying to submit map."
                }
                embed.setTitle('Error')
                        .setDescription(`${err}`);    
                interaction.reply(
                    {
                        embeds: [ embed ],
                        ephemeral: true
                    }
                );
            } else {
                console.log('Database updated successfully');
                //preview download (now unnecesary, might use on further steps)
                async function downloadImage(url, filepath) {
                    return download.image({
                       url: url,
                       dest: filepath 
                    });
                }
                var pic = await downloadImage(pic_url, 'img/map_preview.png');
                
                StateManager.emit('mapsAdded', mapid, mapurl, pic_url, title, desc, 0, 0);

                var showcaseChannel = main.client.channels.cache.get(SMH.mapShowcaseChannel);

                attachment = new Discord
                      .MessageAttachment('img/map_preview.png', 'prev.png');
                var ephemeralEmbed = new Discord.MessageEmbed();
                ephemeralEmbed.setTitle(`${title} submitted successfully`) //map name??? + submitted???
                        .setDescription(`Approval process has started. This means that our mods must ` + 
                            `verify your chamber before going into ${showcaseChannel}. Please be patient.`)
                        .setURL(interaction.options.getString('mapurl'))
                        //.setImage('attachment://prev.png')
                        //.setThumbnail(`${pic_url}`);
                console.log("Title: " + title);
                console.log("Description: " + desc);
                interaction.reply(
                    {
                        embeds: [ ephemeralEmbed ],
                        ephemeral: true
                    }
                );
                
                embed.setTitle(`${title}`) //map name??? + submitted???
                        .setDescription(`${desc}`)
                        .setURL(interaction.options.getString('mapurl'))
                        .setImage('attachment://prev.png');
                        //.setThumbnail(`${pic_url}`);
                
                await interaction.fetchReply()
                //interaction.deleteReply();
                const message = await main.client.channels.cache.get(SMH.mapApprovedChannel).send({
                    embeds: [ embed ],
                    files: [ attachment ],

                });
                console.log(message)

                //DB insert (message id)
                try {
                    await StateManager.connection.query(
                        `INSERT INTO messages VALUES ('${mapid}', '${message.id}')`
                    )
                } catch (error){
                    console.error(error);
                }
                //StateManager.emit('messageAdded', mapid, message.id);
                StateManager.emit('messageAdded', mapid, message.id);
            }
            
            
        } else if (interaction.options.getSubcommand() === "solution" && interaction.channel.id === SMH.solutionSubmissionChannel){

        }
        
	},
};

SMH();

/*
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
})*/