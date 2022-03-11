const Message = require('../events/message.js');
const StateManager = require('../StateManager');
const { MessageEmbed } = require('discord.js');

module.exports = function (client, message) {
    try {
        var params = message.split(' ');
        if (params.length === 2) return params; //print error
    } catch (error) {
        console.error(error);
    }
    return [];
}