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
            let parameter = value[0]
            let argument = value[1]

            if((parameter === "id" || parameter === "url") && argument) {
                parameter = parameter.toUpperCase()
            } else if(value[1]) {
                parameter = parameter[0].toUpperCase().concat(parameter.slice(1))
            }

            console.log(parameter)
        })
    }
}