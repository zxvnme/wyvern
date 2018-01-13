/**
 *  Code style NOTE.
 * 
 * 1. Strings
 *   - Events, cases and paths starts with one tick. ('example string')
 *   - All others starts with two ticks. ("example string")
 * 2. Other rules
 *   - Even though this is JavaScript, semicolons are required.
 *   - If statements with one line after it should be written in the same line.
 */
const Discord = require('discord.js');
const RiotApi = require('lol-stats-api-module');
const config = require('./../config.json');
const request = require('request');
const stringUtils = require('./stringutils.js');
const client = new Discord.Client();
const api = new RiotApi({
    key: config.apikey,
    region: config.region
});

var blueTeam = [
    summoner_one = null,
    summoner_two = null,
    summoner_three = null,
    summoner_four = null,
    summoner_five = null,
];
var redTeam = [
    summoner_six = null,
    summoner_seven = null,
    summoner_eight = null,
    summoner_nine = null,
    summoner_ten = null,
];

String.prototype.replaceAll = function (orig, repl) {
    return this.split(orig).join(repl);
}

client.on('ready', () => {
    console.log("Logged in as: " + client.user.tag);
    console.log("Node version: " + process.version);
    console.log("Process PID: " + process.pid);
    console.log("Process platform: " + process.platform);

});

client.on('message', (message) => {
    if (message.author.equals(client.user)) return;

    if (!message.content.startsWith(config.prefix)) return;

    var args = message.content.substring(config.prefix.length).split(" ");

    switch (args[0]) {

        case 'author':
            message.channel.send({
                embed: {
                    color: 0x8e44ad,
                    author: {
                        icon_url: "https://avatars.githubusercontent.com/zxvnme",
                        name: "zxvnme"
                    },
                    fields: [
                        {
                            name: "Programmer:",
                            value: '[zxvnme](https://github.com/zxvnme)',
                            inline: true,
                        },
                        {
                            name: "Graphic designer:",
                            value: "[vx1ne](https://github.com/vx1ne)",
                            inline: true,
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: "https://avatars.githubusercontent.com/zxvnme",
                        text: "© zxvnme"
                    }
                }
            })
            break;

        case 'ping':
            message.channel.send("Pinging...").then(sent => {
                sent.edit({
                    embed: {
                        title: "🏓Pong!",
                        description: "Took: " + (sent.createdTimestamp - message.createdTimestamp) + " MS"
                    }
                });
            });
            break;

        case 'summoner':
            if (!args[1]) return message.channel.send("Invalid syntax! usage: " + stringUtils.wrapWithOBT(config.prefix + "summoner <summonerName>"));
            args.shift();
            let summoner = { name: args.join(" ") };

            api.getSummoner(summoner, (err, data) => {
                if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
                message.channel.send({
                    embed: {
                        author: {
                            name: "📋 Summoner info."
                        },
                        description: "Info about: [" + data.name + "](" + "http://" + config.region + ".op.gg/summoner/userName=" + (summoner.name.indexOf(" ") ? summoner.name.replaceAll(" ", "+") + ")" : summoner.name + ")"),
                        thumbnail: {
                            url: "http://ddragon.leagueoflegends.com/cdn/8.1.1/img/profileicon/" + data.profileIconId + ".png"
                        },
                        fields: [
                            {
                                name: "Summoner LvL",
                                value: data.summonerLevel,
                                inline: true
                            },
                            {
                                name: "Summoner ID:",
                                value: data.id,
                                inline: true
                            },
                            {
                                name: "Account ID:",
                                value: data.accountId,
                                inline: true
                            },
                            {
                                name: "Icon ID:",
                                value: data.profileIconId,
                                inline: true
                            },
                        ]
                    }
                });
            });
            break;
        case 'champion':
            if (!args[1]) return message.channel.send(stringUtils.wrapWithOBT("Too few arguments!"));

            let champion = {
                id: parseInt(args[1]),
                dataById: true,
                champData: 'all'
            };
            api.getChampionsStaticData(champion, (err, data) => {
                if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
                message.channel.send({
                    embed: {
                        author: {
                            name: "Info about " + data.name + ","
                        },
                        description: data.title,
                        fields: [
                            {
                                name: "Statiscits: ",
                                value: "Armor: " + data.stats.armor.toString() + "\n" + "Attack Damage: " + data.stats.attackdamage + "\n" + "Attack Range: " + data.stats.attackrange + "\n" + "Health: " + data.stats.hp + "\n" + "Mana: " + data.stats.mp
                            },
                            {
                                name: "Abilities: ",
                                value: "Q" + "   " + data.spells[0].name + "\n" + "W" + "   " + data.spells[1].name + "\n" + "E   " + data.spells[2].name + "\n" + "R" + "   " + data.spells[3].name
                            }
                        ]
                    }
                })
            });
            break;
        case 'status':
            if (!args[1]) return message.channel.send("Invalid syntax! usage: " + stringUtils.wrapWithOBT(config.prefix + "status <region>"));
            let region = { region: args[1] };
            api.getStatus(region, (err, data) => {
                if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
                message.channel.send({
                    embed: {
                        author: {
                            name: "🌐 Servers status:"
                        },
                        title: stringUtils.wrapWithOBT(data.name),
                        thumbnail: {
                            url: "https://vignette.wikia.nocookie.net/leagueoflegends/images/1/12/League_of_Legends_Icon.png"
                        },
                        fields: [
                            {
                                name: "Game: ",
                                value: data.services[0].status,
                                inline: true
                            },
                            {
                                name: "Store: ",
                                value: data.services[1].status,
                                inline: true
                            },
                            {
                                name: "Website: ",
                                value: data.services[2].status,
                                inline: true
                            },
                            {
                                name: "Client: ",
                                value: data.services[3].status,
                                inline: true
                            }
                        ],
                        footer: {
                            text: "For more info " + config.prefix + "fullstatus <region>"
                        }
                    }
                });
            });
            break;
        case 'fullstatus':
            if (!args[1]) return message.channel.send("Invalid syntax! usage: " + stringUtils.wrapWithOBT(config.prefix + "status <region>"));

            let full_region = { region: args[1] };
            api.getStatus(full_region, (err, data) => {
                if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
                message.channel.send({
                    embed: {
                        author: {
                            name: "🌐 Servers full status:"
                        },
                        title: stringUtils.wrapWithOBT(data.name),
                        thumbnail: {
                            url: "https://vignette.wikia.nocookie.net/leagueoflegends/images/1/12/League_of_Legends_Icon.png"
                        },
                        fields: [
                            {
                                name: "Game: ",
                                value: (data.services[0].incidents[0]) ? data.services[0].incidents[0].updates[0].content : "No incidents."
                            },
                            {
                                name: "Store: ",
                                value: (data.services[1].incidents[1]) ? data.services[1].incidents[1].updates[1].content : "No incidents."
                            },
                            {
                                name: "Website: ",
                                value: (data.services[2].incidents[2]) ? data.services[2].incidents[2].updates[2].content : "No incidents."
                            },
                            {
                                name: "Client: ",
                                value: (data.services[3].incidents[3]) ? data.services[3].incidents[3].updates[3].content : "No incidents."
                            }
                        ],
                    }
                });
            });
            break;

        case 'match':
            if (!args[1]) return message.channel.send(stringUtils.wrapWithOBT("Too few arguments!"));
            let match = { summonerId: args[1] }

            api.getSummonerActiveGame(match, (err, data) => {
                if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));

                blueTeam[0] = data.participants[0].summonerName;
                blueTeam[1] = data.participants[1].summonerName;
                blueTeam[2] = data.participants[2].summonerName;
                blueTeam[3] = data.participants[3].summonerName;
                blueTeam[4] = data.participants[4].summonerName;
                redTeam[5] = data.participants[5].summonerName;
                redTeam[6] = data.participants[6].summonerName;
                redTeam[7] = data.participants[7].summonerName;
                redTeam[8] = data.participants[8].summonerName;
                redTeam[9] = data.participants[9].summonerName;

                message.channel.send({
                    embed: {
                        author: {
                            name: "🤼 Match info:"
                        },
                        description: (data.mapId == 11) ? "Summoners Rift" : "Twisted Treeline",
                        fields: [
                            {
                                name: "🔵 Blue team:",
                                value: blueTeam[0] + "\n" + blueTeam[1] + "\n" + blueTeam[2] + "\n" + blueTeam[3] + "\n" + blueTeam[4],
                                inline: true
                            },
                            {
                                name: "🔴 Red team:",
                                value: redTeam[5] + "\n" + redTeam[6] + "\n" + redTeam[7] + "\n" + redTeam[8] + "\n" + redTeam[9],
                                inline: true
                            }
                        ],
                    }
                });
            });
            break;
        case 'rank':
            if (!args[1]) return message.channel.send(stringUtils.wrapWithOBT("Too few arguments!"));

            switch (args[1]) {
                case 'sd': // Solo/Duo
                    args.splice(0, 2);
                    let sdq_rank_summoner = { name: args.join(" ") };
                    let sdq_rank = {};
                    api.getSummoner(sdq_rank_summoner, (err, data) => {
                        
                        if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
                        sdq_rank = { summonerId: data.id };
                        api.getSummonerLeaguePositions(sdq_rank, (err, data) => {
                            if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
                            if (!data[0]) return message.channel.send({ embed: { color: 0x2c3e50 }, description: "Unranked" });
                            message.channel.send({
                                embed: {
                                    color: (data[0].tier === "BRONZE") ? 0xcd7f32 : ((data[0].tier === "SILVER") ? 0x95a5a6 : ((data[0].tier === "GOLD") ? 0xf1c40f : ((data[0].tier === "PLATINUM") ? 0x1abc9c : (data[0].tier === "DIAMOND") ? 0x3498db : 0xf39c12))),
                                    thumbnail: {
                                        url: (data[0].tier === "BRONZE") ? "http://pichoster.net/images/2018/01/13/9296b27724cc23b5e332ec8dc8f325da.png" : ((data[0].tier === "SILVER") ? "http://pichoster.net/images/2018/01/13/f699fef7b375f5b97189571a440fec70.png" : ((data[0].tier === "GOLD") ? "http://pichoster.net/images/2018/01/13/4aa6c1c1734529a588612568db2efa30.png" : ((data[0].tier === "PLATINUM") ? "http://pichoster.net/images/2018/01/13/2a0a1bbb6045723343996653fd6b863c.png" : (data[0].tier === "DIAMOND") ? "http://pichoster.net/images/2018/01/13/290ddbbc68d527fe2eb5279dce4ac11a.png" : "http://pichoster.net/images/2018/01/13/1e57a679ea9266281240bd430c2b37e9.png")))
                                    },
                                    author: {
                                        name: "🏆 Rank info:"
                                    },
                                    description: "[" + data[0].playerOrTeamName + "](" + "http://" + config.region + ".op.gg/summoner/userName=" + (data[0].playerOrTeamName.indexOf(" ") ? data[0].playerOrTeamName.replaceAll(" ", "+") + ")" : data[0].playerOrTeamName + ")"),
                                    fields: [
                                        {
                                            name: "Solo/Duo",
                                            value: "**Rank:** " + data[0].tier + " " + data[0].rank + " " + data[0].leaguePoints + " LP" + "\n" + "**League name:** " + data[0].leagueName + "\n" + "**Wins/Looses:** " + data[0].wins + " / " + data[0].losses
                                        },
                                    ]
                                }
                            });
                        });
                    });
                    break;
                case 'flex5': //Flex 5v5
                    args.splice(0, 2);
                    let flex5_rank_summoner = { name: args.join(" ") };
                    let flex5_rank = {};
                    api.getSummoner(flex5_rank_summoner, (err, data) => {
                        if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
                        flex5_rank = { summonerId: data.id };
                        api.getSummonerLeaguePositions(flex5_rank, (err, data) => {
                            if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
                            if (!data[1]) return message.channel.send({ embed: { color: 0x2c3e50 }, description: "Unranked" });
                            message.channel.send({
                                embed: {
                                    color: (data[1].tier === "BRONZE") ? 0xcd7f32 : ((data[1].tier === "SILVER") ? 0x95a5a6 : ((data[1].tier === "GOLD") ? 0xf1c40f : ((data[1].tier === "PLATINUM") ? 0x1abc9c : (data[1].tier === "DIAMOND") ? 0x3498db : 0xf39c12))),
                                    thumbnail: {
                                        url: (data[1].tier === "BRONZE") ? "http://pichoster.net/images/2018/01/13/9296b27724cc23b5e332ec8dc8f325da.png" : ((data[1].tier === "SILVER") ? "http://pichoster.net/images/2018/01/13/f699fef7b375f5b97189571a440fec70.png" : ((data[1].tier === "GOLD") ? "http://pichoster.net/images/2018/01/13/4aa6c1c1734529a588612568db2efa30.png" : ((data[1].tier === "PLATINUM") ? "http://pichoster.net/images/2018/01/13/2a0a1bbb6045723343996653fd6b863c.png" : (data[1].tier === "DIAMOND") ? "http://pichoster.net/images/2018/01/13/290ddbbc68d527fe2eb5279dce4ac11a.png" : "http://pichoster.net/images/2018/01/13/1e57a679ea9266281240bd430c2b37e9.png")))
                                    },
                                    author: {
                                        name: "🏆 Rank info:"
                                    },
                                    description: "[" + data[1].playerOrTeamName + "](" + "http://" + config.region + ".op.gg/summoner/userName=" + (data[1].playerOrTeamName.indexOf(" ") ? data[1].playerOrTeamName.replaceAll(" ", "+") + ")" : data[1].playerOrTeamName + ")"),
                                    fields: [
                                        {
                                            name: "Flex 5v5",
                                            value: "**Rank:** " + data[1].tier + " " + data[1].rank + " " + data[1].leaguePoints + " LP" + "\n" + "**League name:** " + data[1].leagueName + "\n" + "**Wins/Looses:** " + data[1].wins + " / " + data[1].losses
                                        },
                                    ]
                                }
                            });
                        });
                    });
                    break;
                case 'flex3': //Flex 3v3
                    args.splice(0, 2);
                    let flex3_rank_summoner = { name: args.join(" ") };
                    let flex3_rank = {};
                    api.getSummoner(flex3_rank_summoner, (err, data) => {
                        if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
                        flex3_rank = { summonerId: data.id };
                        api.getSummonerLeaguePositions(flex3_rank, (err, data) => {
                            if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
                            if (!data[2]) return message.channel.send({ embed: { color: 0x2c3e50 }, description: "Unranked" });
                            message.channel.send({
                                embed: {
                                    color: (data[2].tier === "BRONZE") ? 0xcd7f32 : ((data[2].tier === "SILVER") ? 0x95a5a6 : ((data[2].tier === "GOLD") ? 0xf1c40f : ((data[2].tier === "PLATINUM") ? 0x1abc9c : (data[2].tier === "DIAMOND") ? 0x3498db : 0xf39c12))),
                                    thumbnail: {
                                        url: (data[2].tier === "BRONZE") ? "http://pichoster.net/images/2018/01/13/9296b27724cc23b5e332ec8dc8f325da.png" : ((data[2].tier === "SILVER") ? "http://pichoster.net/images/2018/01/13/f699fef7b375f5b97189571a440fec70.png" : ((data[2].tier === "GOLD") ? "http://pichoster.net/images/2018/01/13/4aa6c1c1734529a588612568db2efa30.png" : ((data[2].tier === "PLATINUM") ? "http://pichoster.net/images/2018/01/13/2a0a1bbb6045723343996653fd6b863c.png" : (data[2].tier === "DIAMOND") ? "http://pichoster.net/images/2018/01/13/290ddbbc68d527fe2eb5279dce4ac11a.png" : "http://pichoster.net/images/2018/01/13/1e57a679ea9266281240bd430c2b37e9.png")))
                                    },
                                    author: {
                                        name: "🏆 Rank info:"
                                    },
                                    description: "[" + data[2].playerOrTeamName + "](" + "http://" + config.region + ".op.gg/summoner/userName=" + (data[2].playerOrTeamName.indexOf(" ") ? data[2].playerOrTeamName.replaceAll(" ", "+") + ")" : data[2].playerOrTeamName + ")"),
                                    fields: [
                                        {
                                            name: "Flex 3v3",
                                            value: "**Rank:** " + data[2].tier + " " + data[2].rank + " " + data[2].leaguePoints + " LP" + "\n" + "**League name:** " + data[2].leagueName + "\n" + "**Wins/Looses:** " + data[2].wins + " / " + data[2].losses
                                        },
                                    ]
                                }
                            });
                        });
                    });
                    break;
            }
            break;
        case 'debug':
            switch (args[1]) {
                case 'request':
                    switch (args[2]) {
                        case 'all':
                            if (!args[3]) return message.channel.send(stringUtils.wrapWithOBT("Too few arguments!"));
                            let options = {
                                url: args[3] + "?api_key=" + config.apikey,
                            };
                            
                            function callback(error, response, body) {
                                if (!error && response.statusCode === 200) {
                                    var info = JSON.parse(body);
                                    message.channel.send(JSON.stringify(info));
                                }
                            }
                            request(options, callback);
                            break;
                    }
                    break;
            }
            break;

    }
});

client.login(config.token);