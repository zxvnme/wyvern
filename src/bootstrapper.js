const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./../config.json');
const fs = require('fs');
const RiotApi = require('lol-stats-api-module');
const api = new RiotApi({
    key: config.apikey,
    region: config.region
});

client.on('ready', () => {
    fs.readdir('./commands/', (err, files) => {
        files.forEach((response) => {
            if (!response.endsWith(".js")) return;
            if (response) console.log("Loaded " + response);
        });
    });
});

client.on('message', message => {
    if (message.author.bot) return;

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.substring(config.prefix.length).split(" ");
    const command = args[0].toLowerCase();

    try {
        let commandFile = require('./commands/' + command + '.js');
        commandFile.launch(client, api, config, message, args);
    } catch (err) {
        console.error(err);
    }
});

client.login(config.token);