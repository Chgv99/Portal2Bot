const Message = require('../events/message.js');
const StateManager = require('../../utils/StateManager');
const { MessageEmbed } = require('discord.js');
const parseSubmission = require('../SubmissionParser.js');

module.exports = class MapSubmission {
    constructor (author, url){
        this.author = author;
        this.url = url;
        //this.connection = StateManager.connection;
    }

    async run (client, message) {
        if (message.author.bot) return;

        try {
            const [author, url] = parseSubmission(client, message);
            
        } catch (error) {
            console.error(error);
        }
    }
}