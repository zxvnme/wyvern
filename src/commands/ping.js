module.exports.launch = (client, api, config, message, args) => {
    message.channel.send("Pinging...").then(sent => {
        sent.edit({
            embed: {
                title: "🏓Pong!",
                description: "Took: " + (sent.createdTimestamp - message.createdTimestamp) + " MS"
            }
        });
    });
};

module.exports.getSyntax = () => {
    return "ping";
};

module.exports.getDescription = () => {
    return "Pong!";
};