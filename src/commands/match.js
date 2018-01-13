const stringUtils = require('./../stringutils');

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

module.exports.launch = (client, api, message, args) => {
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
};