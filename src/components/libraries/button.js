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
            let parameter

            if((value[0] === "id" || "url") && value[1]) {
                parameter = value[0].toUpperCase()
            } else if(value[1]) {
                parameter = value[0][0].toUpperCase()
            }

            console.log(parameter)
        })
    }
}