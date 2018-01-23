const stringUtils = require('./stringutils.js');
const packagejson = require('./../package.json');
const RiotApi = require('lol-stats-api-module');
const config = require('./../config.json');
const Discord = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');
const client = new Discord.Client();
const api = new RiotApi({
    key: config.riot_api_key,
    region: config.riot_api_region
});

function format(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

let process_args = process.argv.slice(2);
client.on('ready', () => {
    let success = chalk.green;
    let error = chalk.red;
    let neutral = chalk.gray;
    switch (process_args[0]) {
        case '--status':
            switch (process_args[1]) {
                case 'game':
                    client.user.setActivity(process_args[2], { type: "PLAYING" })
                    console.log(success("Sucessfully ") + "set playing status to " + neutral(process_args[2]));
                    break;
                case 'listen':
                    client.user.setActivity(process_args[2], { type: "LISTENING" })
                    console.log(success("Sucessfully ") + "set listening status to " + neutral(process_args[2]));
                    break;
                case 'watch':
                    client.user.setActivity(process_args[2], { type: "WATCHING" })
                    console.log(success("Sucessfully ") + "set watching status to " + neutral(process_args[2]));
                    break;
                case 'stream':
                    client.user.setActivity(process_args[2], { url: "https://www.twitch.tv/wyvern_bot", type: "STREAMING" });
                    console.log(success("Sucessfully ") + "set streaming status to " + neutral(process_args[2]));
                    break;
            }
            break;
    }

    api.getVersionsStaticData({ region: "eune" }, (err, data) => {

        let file_content = fs.readFileSync('./../config.json', 'utf-8');
        let jsonObj = JSON.parse(file_content);
        if (jsonObj.riot_api_version !== data[0]) { // Check if version defined in config.json is even with one in api callback.
            jsonObj.riot_api_version = data[0]; // Write actual version.
            fs.writeFile('./../config.json', JSON.stringify(jsonObj, null, 4), 'utf-8', (err) => { // Save it to the configuration file.
                if(!err) console.log(success("Updated ") + "Riot Api version in " + neutral("configuration file."));
                else console.log(error("Couldn't ") + "update " + neutral("configuration file") + " with latest Riot Api version.");
                
            });
        }
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

    if (!message.content.startsWith(config.discord_bot_prefix)) return;

    let args = message.content.substring(config.discord_bot_prefix.length).split(" ");
    let command = args[0].toLowerCase();

    if (args[0] === "help") {
        let help_content = [];
        let description = "";
        let files = fs.readdirSync('./commands/'); // It have to be done with synchronous function for proper array push.
        files.forEach((response) => {
            try {
                let commandFile = require('./commands/' + response);
                help_content.push(stringUtils.wrapWithBold(commandFile.getSyntax()) + " ~ " + commandFile.getDescription());
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

        if (args[1] === "dev")
            return message.channel.send({
                embed: {
                    color: 0x2ecc71,
                    title: "List of commands.",
                    thumbnail: {
                        url: "http://pichoster.net/images/2018/01/21/6171c6792a3fae80540e085ef53ca372.png"
                    },
                    description: description,
                    fields: [
                        {
                            name: "Version: ",
                            value: stringUtils.wrapWithOBT(packagejson.version),
                            inline: true
                        },
                        {
                            name: "Prefix: ",
                            value: config.discord_bot_prefix,
                            inline: true
                        },
                        {
                            name: "CLI Args: ",
                            value: (process_args.lenght > 0) ? stringUtils.wrapWithOBT(process_args.join(" ")) : stringUtils.wrapWithOBT("none"),
                            inline: true
                        },
                        {
                            name: "Uptime: ",
                            value: stringUtils.wrapWithOBT(format(process.uptime())),
                            inline: true
                        },
                    ]
                }
            });
        else
            return message.channel.send({
                embed: {
                    color: 0x2ecc71,
                    title: "List of commands.",
                    thumbnail: {
                        url: "http://pichoster.net/images/2018/01/21/6171c6792a3fae80540e085ef53ca372.png"
                    },
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

client.login(config.discord_bot_token);
