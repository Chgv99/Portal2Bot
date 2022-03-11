require('dotenv').config();
//import dotenv from 'dotenv';
//const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
//import '@discordjs/rest';
const { Routes } = require('discord-api-types/v9');
//import Routes from 'discord-api-types/v9';
//const { clientId, guildId, token } = require('../config.json');
const path = require('path');
//import path from 'path';
const fs = require('fs').promises;
//import promises from 'fs';
const BaseEvent = require('./utils/structures/BaseEvent.js');
//import BaseEvent from './utils/structures/BaseEvent.js';
const { callbackify } = require('util');
//src\utils\structures\BaseEvent.js

async function registerEvents(client, dir = '') {
    console.log("Registering events...");
    try{
        const filePath = path.join(__dirname, dir);
        //console.log("events path: " + filePath);
        const files = await fs.readdir(filePath);

        for (const file of files) {
            const stat = await fs.lstat(path.join(filePath, file));
            if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
            if (file.endsWith('.js')){
                const Event = require(path.join(filePath, file));
                //console.log(`${filePath}\\${file}`);
                if (Event.prototype instanceof BaseEvent) {
                    const event = new Event();
                    //console.log(`${event.name}, ${event.run.bind(null,client)}`);
                    client.on(event.name, event.run.bind(event, client));
                    console.log(event.name);
                }
            }
        }
        console.log('Successfully registered application events.');
    } catch (err){
        console.error(err);
    }
}

async function registerCommands(){
    console.log('Registering commands...');
    const commands = [];
    const commandFiles = await fs.readdir(process.cwd() + "\\src\\commands");//.filter(file => file.endsWith('.js'));
    //console.log(commandFiles);
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
        //console.log(command.name);
    }
    //console.log(commands);

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);        

    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}

module.exports = { registerEvents, registerCommands };