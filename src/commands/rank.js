const stringUtils = require('./../stringutils');

String.prototype.replaceAll = function (orig, repl) {
    return this.split(orig).join(repl);
}

module.exports.launch = (client, api, message, args) => {
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
                            description: "[" + data[0].playerOrTeamName + "](" + "http://" + "eune" + ".op.gg/summoner/userName=" + (data[0].playerOrTeamName.indexOf(" ") ? data[0].playerOrTeamName.replaceAll(" ", "+") + ")" : data[0].playerOrTeamName + ")"),
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
                            description: "[" + data[1].playerOrTeamName + "](" + "http://" + "eune" + ".op.gg/summoner/userName=" + (data[1].playerOrTeamName.indexOf(" ") ? data[1].playerOrTeamName.replaceAll(" ", "+") + ")" : data[1].playerOrTeamName + ")"),
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
                            description: "[" + data[2].playerOrTeamName + "](" + "http://" + "eune" + ".op.gg/summoner/userName=" + (data[2].playerOrTeamName.indexOf(" ") ? data[2].playerOrTeamName.replaceAll(" ", "+") + ")" : data[2].playerOrTeamName + ")"),
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
    };
};