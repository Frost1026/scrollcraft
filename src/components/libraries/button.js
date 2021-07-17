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

        console.log(Object.entries(options))

        const button = new discordButton.MessageButton()

        Object.entries(options).forEach(value => {
            switch(true) {
                case !!options.id:
                    options.id = null
                    break

                case !!options.style:
                    options.style = null
                    break

                case !!options.label:
                    options.label = null
                    break

                case !!options.emoji:
                    options.emoji = null
                    break

                case !!options.emojiAnimated:
                    options.emojiAnimated = null
                    break

                case !!options.url:
                    options.url = null
                    break
            }
        })
    }
}