const stringUtils = require('./../stringutils');

String.prototype.replaceAll = function (orig, repl) {
    return this.split(orig).join(repl);
}

module.exports.launch = (client, api, config, message, args) => {
    if (!args[1]) return message.channel.send("Invalid syntax! usage: " + stringUtils.wrapWithOBT(config.discord_bot_prefix + "summoner <summonerName>"));
    args.shift();
    let summoner = { name: args.join(" ") };

    api.getSummoner(summoner, (err, data) => {
        console.log(summoner);
        if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
        message.channel.send({
            embed: {
                color: 0x2ecc71,
                author: {
                    name: "📋 Summoner info."
                },
                description: "Info about: [" + data.name + "](" + "http://" + config.riot_api_region + ".op.gg/summoner/userName=" + (summoner.name.indexOf(" ") ? summoner.name.replaceAll(" ", "+") + ")" : summoner.name + ")"),
                thumbnail: {
                    url: "http://ddragon.leagueoflegends.com/cdn/" + config.riot_api_version + "/img/profileicon/" + data.profileIconId + ".png"
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
};

module.exports.getSyntax = () => {
    return "summoner <summonerName>";
};

module.exports.getDescription = () => {
    return "Info about summoner.";
};