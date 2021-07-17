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

        Object.entries(options).forEach(value => {
            switch(true) {
                case options.id:
                    console.log("ID exists")
                    break

                case options.style:
                    console.log("Style exists")
                    break

                case options.label:
                    console.log("Label exists")
                    break

                case options.emoji:
                    console.log("Emoji exists")
                    break

                case options.emojiAnimated:
                    console.log("Emoji Animated")
                    break

                case options.url:
                    console.log("URL exists")
                    break

                default:
                    console.log("All parameters null")
                    break
            }
        })
    }
}