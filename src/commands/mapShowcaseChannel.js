require('dotenv').config();
const { SlashCommandBuilder } = require('@discordjs/builders');
const StateManager = require('../utils/StateManager.js');
const { client } = require('../main.js');
//const client = main[0];
//const StateManager = require('../utils/StateManager.js');

var mapShowcaseChannel = null;

module.exports = {
	data: new SlashCommandBuilder()
        .setName('mapshowcasechannel')
        .setDescription('Sets the map showcase channel')
        .addSubcommand(subcommand =>
            subcommand
                .setName("get")
                .setDescription("Returns current map showcase channel"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("set")
                .setDescription("Sets a new map showcase channel")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Map showcase channel ID")
                        .setRequired(true))
        ),
            
	async execute(interaction) {
        console.log("CLIENT GUILDS MAPCHANNEL: " + client.guilds);
        const guild = client.guilds.cache.find(guild => guild.id === process.env.GUILD_ID);
        if (interaction.options.getSubcommand() === "get"){
            const channel = guild.channels.cache.find(ch => ch.id === mapShowcaseChannel);
            console.log("mapShowcaseChannel: " + mapShowcaseChannel);
            console.log("channel: " + channel);
            await interaction.reply(`Current map showcase channel is ${channel}`);
        } else if (interaction.options.getSubcommand() === "set"){
            console.log(interaction.options.getChannel("channel").id);
            try {
                await StateManager.connection.query(
                    `UPDATE global SET mapshowcasechannelid = '${interaction.options.getChannel("channel").id}' WHERE id = 1`
                )
                StateManager.emit('mapShowcaseChannelUpdated', interaction.options.getChannel("channel").id);
                console.log(mapShowcaseChannel);
                console.log("client: " + client);
                const channel = guild.channels.cache.find(ch => ch.id === mapShowcaseChannel);
                await interaction.reply(`Map showcase channel updated to ${channel}`);
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

StateManager.on('mapShowcaseChannelUpdated', (channel) => {
    mapShowcaseChannel = channel;
})