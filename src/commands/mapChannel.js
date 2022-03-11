require('dotenv').config();
const { SlashCommandBuilder } = require('@discordjs/builders');
const StateManager = require('../utils/StateManager.js');
const { client } = require('../main.js');
//const client = main[0];
//const StateManager = require('../utils/StateManager.js');

var mapSubmissionChannel = null;

module.exports = {
	data: new SlashCommandBuilder()
        .setName('mapsubmissionchannel')
        .setDescription('Sets the channel for map submissions')
        .addSubcommand(subcommand =>
            subcommand
                .setName("get")
                .setDescription("Returns current map submission channel"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("set")
                .setDescription("Sets a new map submission channel")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Map submission channel ID")
                        .setRequired(true))
        ),
            
	async execute(interaction) {
        console.log("CLIENT GUILDS MAPCHANNEL: " + client.guilds);
        const guild = client.guilds.cache.find(guild => guild.id === process.env.GUILD_ID);
        if (interaction.options.getSubcommand() === "get"){
            const channel = guild.channels.cache.find(ch => ch.id === mapSubmissionChannel);
            console.log("mapSubmissionChannel: " + mapSubmissionChannel);
            console.log("channel: " + channel);
            await interaction.reply(`Current map submission channel is ${channel}`);
        } else if (interaction.options.getSubcommand() === "set"){
            console.log(interaction.options.getChannel("channel").id);
            try {
                await StateManager.connection.query(
                    `UPDATE global SET mapchannelid = '${interaction.options.getChannel("channel").id}' WHERE id = 1`
                )
                StateManager.emit('mapChannelUpdated', interaction.options.getChannel("channel").id);
                console.log(mapSubmissionChannel);
                console.log("client: " + client);
                const channel = guild.channels.cache.find(ch => ch.id === mapSubmissionChannel);
                await interaction.reply(`Map submission channel updated to ${channel}`);
            } catch (error){
                console.error(error);
                await interaction.reply(`:x: Error while trying to update the channel.`);
            }
            
            
            try {
                
            } catch (error){
                console.error(error);
            }
        } else {
            const act = interaction.options.getString('action'); 
            switch (act){
                case "get":
                    
                    break;
                case "set":
                    
                    
                    
                    break;
            }
        }
        //await interaction.reply('Map submission channel updated!');
	},
};

StateManager.on('mapChannelUpdated', (channel) => {
    //const guild = client.guilds.cache.get(process.env.GUILD_ID);
    //mapSubmissionChannel = guild.channels.cache.find(ch => ch.name === channel);
    mapSubmissionChannel = channel;
})