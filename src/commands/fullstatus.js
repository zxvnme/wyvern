const stringUtils = require('./../stringutils');

module.exports.launch = (client, api, config, message, args) => {
    if (!args[1]) return message.channel.send("Invalid syntax! usage: " + stringUtils.wrapWithOBT(config.discord_bot_prefix + "status <region>"));

    let full_region = { region: args[1] };
    api.getStatus(full_region, (err, data) => {
        if (err) return message.channel.send(stringUtils.wrapWithCSH("markdown", "# An error has occurred :(\n" + err.code + " " + err.message));
        message.channel.send({
            embed: {
                color: 0x2ecc71,
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
};

module.exports.getSyntax = () => {
    return "fullstatus <region>";
};

module.exports.getDescription = () => {
    return "Server status with all incidents.";
};