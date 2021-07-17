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

        console.log(!!emoji)

        Object.entries(options).forEach(value => {
            switch(true) {
                case !!options.id:
                    console.log("ID exists")
                    options.id = null
                    break

                case !!options.style:
                    console.log("Style exists")
                    options.style = null
                    break

                case !!options.label:
                    console.log("Label exists")
                    options.label = null
                    break

                case !!options.emoji:
                    console.log("Emoji exists")
                    options.emoji = null
                    break

                case !!options.emojiAnimated:
                    console.log("Emoji Animated")
                    options.emojiAnimated = null
                    break

                case !!options.url:
                    console.log("URL exists")
                    options.url = null
                    break

                default:
                    console.log("All parameters null")
                    break
            }
        })
    }
}