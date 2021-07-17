const discordButton = require("discord-buttons")

module.exports = {
    Button: function (_options) {
        const options = {
            id: "default",
            style: "green",
            label: "default",
            emoji: null,
            emojiAnimated: false,
            url: null,
            ..._options
        }

        console.log(options)

        const button = new discordButton.MessageButton()
            .setID(options.id)
            .setStyle(options.style)
            .setEmoji(options.emoji)
    }
}