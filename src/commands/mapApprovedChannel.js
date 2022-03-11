require('dotenv').config();
const { SlashCommandBuilder } = require('@discordjs/builders');
const StateManager = require('../utils/StateManager.js');
const SMH = require('../utils/StateManagerHandler.js');
const { client } = require('../main.js');
//const client = main[0];
//const StateManager = require('../utils/StateManager.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('mapapprovedchannel')
        .setDescription('Sets the channel for approved maps')
        .addSubcommand(subcommand =>
            subcommand
                .setName("get")
                .setDescription("Returns current approved maps channel"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("set")
                .setDescription("Sets a new approved maps channel")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Approved maps channel ID")
                        .setRequired(true))
        ),
            
	async execute(interaction) {
        console.log("CLIENT GUILDS MAPCHANNEL: " + client.guilds);
        const guild = client.guilds.cache.find(guild => guild.id === process.env.GUILD_ID);
        if (interaction.options.getSubcommand() === "get"){
            const channel = guild.channels.cache.find(ch => ch.id === SMH.mapApprovedChannel);
            console.log("mapApprovedChannel: " + SMH.mapApprovedChannel);
            console.log("channel: " + channel);
            await interaction.reply(`Current approved map channel is ${channel}`);
        } else if (interaction.options.getSubcommand() === "set"){
            console.log(interaction.options.getChannel("channel").id);
            try {
                await StateManager.connection.query(
                    `UPDATE global SET mapapprovedchannelid = '${interaction.options.getChannel("channel").id}' WHERE id = 1`
                )
                StateManager.emit('mapApprovedChannelUpdated', interaction.options.getChannel("channel").id);
                console.log(SMH.mapApprovedChannel);
                console.log("client: " + client);
                const channel = guild.channels.cache.find(ch => ch.id === SMH.mapApprovedChannel);
                await interaction.reply(`Approved map channel updated to ${channel}`);
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

SMH();
/*StateManager.on('mapApprovedChannelUpdated', (channel) => {
    //const guild = client.guilds.cache.get(process.env.GUILD_ID);
    //mapApprovedChannel = guild.channels.cache.find(ch => ch.name === channel);
    mapApprovedChannel = channel;
})*/