const RiotApi = require('lol-stats-api-module');
const config = require('./../config.json');
const request = require('request');
const Discord = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');
const client = new Discord.Client();
const api = new RiotApi({
    key: config.apikey,
    region: config.region
});


client.on('ready', () => {
    let success = chalk.green;
    let error = chalk.red;
    let neutral = chalk.gray;
    let process_args = process.argv.slice(2);
    switch (process_args[0]) {
        case '--status':
            switch (process_args[1]) {
                case 'game':
                    client.user.setGame(process_args[2]);
                    console.log(success("Sucessfully ") + "set game status to " + neutral(process_args[2]));
                    break;
                case 'stream':
                    client.user.setGame(process_args[2], "https://www.twitch.tv/wyvern_bot"); // Streaming status trick... This twitch channel doesnt exist.
                    console.log(success("Sucessfully ") + "set stream status to " + neutral(process_args[2]));
                    break;
            }
            break;
    }
    api.getVersionsStaticData({ region: "eune" }, (err, data) => { 
        if (!err) console.log(success("Estabilished ") + "connection with Riot Api v-" + neutral(data[0]));
        else console.log(error("Couldn't ") + "connect to Riot Api. Error code: " + neutral(err.code));
    });
    fs.readdir('./commands/', (err, files) => {
        files.forEach((response) => {
            if (err) return console.error(err);
            if (!response.endsWith(".js")) return;
            if (response) console.log(success("Loaded ") + response);
        });
    });
});

client.on('message', message => {
    if (message.author.bot) return;

    if (!message.content.startsWith(config.prefix)) return;

    let args = message.content.substring(config.prefix.length).split(" ");
    let command = args[0].toLowerCase();

    if (args[0] === "help") {
        let help_content = [];
        let description = "";
        let files = fs.readdirSync('./commands/'); // It have to be done with synchronous function for proper array push.
        files.forEach((response) => {
            try {
                let commandFile = require('./commands/' + response);
                help_content.push(commandFile.getSyntax() + " ~ " + commandFile.getDescription());
            } catch (err) {
                console.error(err);
            }

        });
        help_content.sort((x, y) => { // Sort content by line length. 
            return x.length - y.length;  
        });
        for (let i = 0; i < files.length; i++) {
            description = description + help_content[i] + "\n";
        }
        return message.channel.send({
            embed: {
                color: 0x2ecc71,
                title: "List of commands.",
                description: description
            }
        });
    }

    try {
        let commandFile = require('./commands/' + command + '.js');
        commandFile.launch(client, api, config, message, args);
    } catch (err) {
        console.error(err);
    }
});

client.login(config.token);