const stringUtils = require('./../stringutils');

let blueTeam = [];
let redTeam = [];

module.exports.launch = (client, api, config, message, args) => {
    if (!args[1]) return message.channel.send(stringUtils.wrapWithOBT("Too few arguments!"));
    let match = { summonerId: args[1] }

    api.getSummonerActiveGame(match, (err, data) => {
        if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));

        for(let i = 0; i < 5; i++) { // 5 Players in each team.
            blueTeam.push(data.participants[i].summonerName);
        }

        for(let i = 5; i < 10; i++) {
            redTeam.push(data.participants[i].summonerName);
        }
        
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
                        value: redTeam[0] + "\n" + redTeam[1] + "\n" + redTeam[2] + "\n" + redTeam[3] + "\n" + redTeam[4],
                        inline: true
                    }
                ],
            }
        });
    });
};

module.exports.getSyntax = () => {
    return "match <summonerId>";
};

module.exports.getDescription = () => {
    return "Info about currently playing match.";
};