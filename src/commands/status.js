const stringUtils = require('./../stringutils');

module.exports.launch = (client, api, message, args) => {
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
};