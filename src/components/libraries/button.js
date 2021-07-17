const discordButton = require("discord-buttons")

module.exports = {
    Button: function (_options) {
        // const button = new discordButton.MessageButton()
        //     .setID(args.id)
        //     .setStyle(args.setStyle)
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
    }
}