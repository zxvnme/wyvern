const stringUtils = require('./../stringutils');

module.exports.launch = (client, api, message, args) => {
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
};