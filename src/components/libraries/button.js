const discordButton = require("discord-buttons")

module.exports = {
    Button: function (_options) {
        const options = {
            id: "default",
            style: "green",
            label: "default",
            emoji: "",
            emojiAnimated: false,
            url: "",
            ..._options
        }

        console.log(options)

        const button = new discordButton.MessageButton()
            .setID(options.id)
            .setStyle(options.style)
            .setEmoji(options.emoji)
            .setDisabled()
    }
}