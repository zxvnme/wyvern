const stringUtils = require('./../stringutils');

String.prototype.replaceAll = function (orig, repl) {
    return this.split(orig).join(repl);
}

module.exports.launch = (client, api, config, message, args) => {
    if (!args[1]) return message.channel.send("Invalid syntax! usage: " + stringUtils.wrapWithOBT(config.discord_bot_prefix + "rank <summonerName>"));

    args.shift();
    let rank_summoner = { name: args.join(" ") };
    let rank = {};
    api.getSummoner(rank_summoner, (err, data) => {
        if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
        rank = { summonerId: data.id };
        api.getSummonerLeaguePositions(rank, (err, data) => {
            if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));

            let rank_indexes = [
                -1, // Solo/Duo index
                -1, // Flex 5v5 index
                -1  // Flex 3v3 index
            ];
            data.find(function (item, i) {
                if (item.queueType === "RANKED_SOLO_5v5") {
                    rank_indexes[0] = i;
                }
            });

            if (!data[rank_indexes[0]]) message.channel.send({ embed: { color: 0x2c3e50, title: "Solo/Duo", description: "Unranked" } });
            else
            message.channel.send({
                embed: {
                    color: (data[rank_indexes[0]].tier === "BRONZE") ? 0xcd7f32 : ((data[rank_indexes[0]].tier === "SILVER") ? 0x95a5a6 : ((data[rank_indexes[0]].tier === "GOLD") ? 0xf1c40f : ((data[rank_indexes[0]].tier === "PLATINUM") ? 0x1abc9c : (data[rank_indexes[0]].tier === "DIAMOND") ? 0x3498db : 0xf39c12))),
                    thumbnail: {
                        url: (data[rank_indexes[0]].tier === "BRONZE") ? "http://pichoster.net/images/2018/01/13/9296b27724cc23b5e332ec8dc8f325da.png" : ((data[rank_indexes[0]].tier === "SILVER") ? "http://pichoster.net/images/2018/01/13/f699fef7b375f5b97189571a440fec70.png" : ((data[rank_indexes[0]].tier === "GOLD") ? "http://pichoster.net/images/2018/01/13/4aa6c1c1734529a588612568db2efa30.png" : ((data[rank_indexes[0]].tier === "PLATINUM") ? "http://pichoster.net/images/2018/01/13/2a0a1bbb6045723343996653fd6b863c.png" : (data[rank_indexes[0]].tier === "DIAMOND") ? "http://pichoster.net/images/2018/01/13/290ddbbc68d527fe2eb5279dce4ac11a.png" : "http://pichoster.net/images/2018/01/13/1e57a679ea9266281240bd430c2b37e9.png")))
                    },
                    author: {
                        name: "🏆 Rank info:"
                    },
                    description: "[" + data[rank_indexes[0]].playerOrTeamName + "](" + "http://" + config.riot_api_region + ".op.gg/summoner/userName=" + (data[rank_indexes[0]].playerOrTeamName.indexOf(" ") ? data[rank_indexes[0]].playerOrTeamName.replaceAll(" ", "+") + ")" : data[rank_indexes[0]].playerOrTeamName + ")"),
                    fields: [
                        {
                            name: "Solo/Duo",
                            value: "**Rank:** " + data[rank_indexes[0]].tier + " " + data[rank_indexes[0]].rank + " " + data[rank_indexes[0]].leaguePoints + " LP" + "\n" + "**League name:** " + data[rank_indexes[0]].leagueName + "\n" + "**Wins/Looses:** " + data[rank_indexes[0]].wins + " / " + data[rank_indexes[0]].losses
                        },
                    ]
                }
            });

            data.find(function (item, i) {
                if (item.queueType === "RANKED_FLEX_SR") {
                    rank_indexes[1] = i;
                    if(rank_indexes[0] === 0 || rank_indexes[0] === 1) rank_indexes[1] = rank_indexes[1] + 1
                }
            });

            if (!data[rank_indexes[1]]) message.channel.send({ embed: { color: 0x2c3e50, title: "Flex 5v5", description: "Unranked" } });
            else
            message.channel.send({
                embed: {
                    color: (data[rank_indexes[1]].tier === "BRONZE") ? 0xcd7f32 : ((data[rank_indexes[1]].tier === "SILVER") ? 0x95a5a6 : ((data[rank_indexes[1]].tier === "GOLD") ? 0xf1c40f : ((data_5v5flex[1].tier === "PLATINUM") ? 0x1abc9c : (data[rank_indexes[1]].tier === "DIAMOND") ? 0x3498db : 0xf39c12))),
                    thumbnail: {
                        url: (data[rank_indexes[1]].tier === "BRONZE") ? "http://pichoster.net/images/2018/01/13/9296b27724cc23b5e332ec8dc8f325da.png" : ((data[rank_indexes[1]].tier === "SILVER") ? "http://pichoster.net/images/2018/01/13/f699fef7b375f5b97189571a440fec70.png" : ((data[rank_indexes[1]].tier === "GOLD") ? "http://pichoster.net/images/2018/01/13/4aa6c1c1734529a588612568db2efa30.png" : ((data[rank_indexes[1]].tier === "PLATINUM") ? "http://pichoster.net/images/2018/01/13/2a0a1bbb6045723343996653fd6b863c.png" : (data[rank_indexes[1]].tier === "DIAMOND") ? "http://pichoster.net/images/2018/01/13/290ddbbc68d527fe2eb5279dce4ac11a.png" : "http://pichoster.net/images/2018/01/13/1e57a679ea9266281240bd430c2b37e9.png")))
                    },
                    author: {
                        name: "🏆 Rank info:"
                    },
                    description: "[" + data[rank_indexes[1]].playerOrTeamName + "](" + "http://" + "eune" + ".op.gg/summoner/userName=" + (data[rank_indexes[1]].playerOrTeamName.indexOf(" ") ? data[rank_indexes[1]].playerOrTeamName.replaceAll(" ", "+") + ")" : data[rank_indexes[1]].playerOrTeamName + ")"),
                    fields: [
                        {
                            name: "Flex 5v5",
                            value: "**Rank:** " + data[rank_indexes[1]].tier + " " + data[rank_indexes[1]].rank + " " + data[rank_indexes[1]].leaguePoints + " LP" + "\n" + "**League name:** " + data[rank_indexes[1]].leagueName + "\n" + "**Wins/Looses:** " + data[rank_indexes[1]].wins + " / " + data[rank_indexes[1]].losses
                        },
                    ]
                }
            });

            data.find(function (item, i) {
                if (item.queueType === "RANKED_FLEX_SR") {
                    rank_indexes[2] = i;
                    if(rank_indexes[1] === 1 || rank_indexes[1] === 0) rank_indexes[2] = rank_indexes[2] + 1
                }
            });

            if (!data[rank_indexes[2]]) message.channel.send({ embed: { color: 0x2c3e50, title: "Flex 3v3", description: "Unranked" } });
            else
            message.channel.send({
                embed: {
                    color: (data[rank_indexes[2]].tier === "BRONZE") ? 0xcd7f32 : ((data[rank_indexes[2]].tier === "SILVER") ? 0x95a5a6 : ((data[rank_indexes[2]].tier === "GOLD") ? 0xf1c40f : ((data[rank_indexes[2]].tier === "PLATINUM") ? 0x1abc9c : (data[rank_indexes[2]].tier === "DIAMOND") ? 0x3498db : 0xf39c12))),
                    thumbnail: {
                        url: (data[rank_indexes[2]].tier === "BRONZE") ? "http://pichoster.net/images/2018/01/13/9296b27724cc23b5e332ec8dc8f325da.png" : ((data[rank_indexes[2]].tier === "SILVER") ? "http://pichoster.net/images/2018/01/13/f699fef7b375f5b97189571a440fec70.png" : ((data[rank_indexes[2]].tier === "GOLD") ? "http://pichoster.net/images/2018/01/13/4aa6c1c1734529a588612568db2efa30.png" : ((data[rank_indexes[2]].tier === "PLATINUM") ? "http://pichoster.net/images/2018/01/13/2a0a1bbb6045723343996653fd6b863c.png" : (data[rank_indexes[2]].tier === "DIAMOND") ? "http://pichoster.net/images/2018/01/13/290ddbbc68d527fe2eb5279dce4ac11a.png" : "http://pichoster.net/images/2018/01/13/1e57a679ea9266281240bd430c2b37e9.png")))
                    },
                    author: {
                        name: "🏆 Rank info:"
                    },
                    description: "[" + data[rank_indexes[2]].playerOrTeamName + "](" + "http://" + "eune" + ".op.gg/summoner/userName=" + (data[rank_indexes[2]].playerOrTeamName.indexOf(" ") ? data[rank_indexes[2]].playerOrTeamName.replaceAll(" ", "+") + ")" : data[rank_indexes[2]].playerOrTeamName + ")"),
                    fields: [
                        {
                            name: "Flex 3v3",
                            value: "**Rank:** " + data[rank_indexes[2]].tier + " " + data[rank_indexes[2]].rank + " " + data[rank_indexes[2]].leaguePoints + " LP" + "\n" + "**League name:** " + data[rank_indexes[2]].leagueName + "\n" + "**Wins/Looses:** " + data[rank_indexes[2]].wins + " / " + data[rank_indexes[2]].losses
                        },
                    ]
                }
            });

            console.log(rank_indexes[0], rank_indexes[1], rank_indexes[2]);
        });
    });
};

module.exports.getSyntax = () => {
    return "rank <summonerName>";
};

module.exports.getDescription = () => {
    return "Display of specified summoner ranks.";
};