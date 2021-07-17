const discordButton = require("discord-buttons")

module.exports = {
    Button: function (_options = {}) {
        const options = {
            id: "default",
            style: "green",
            label: "",
            emoji: null,
            emojiAnimated: false,
            url: null,
            ..._options
        }

        console.log(Object.entries(options))

        const button = new discordButton.MessageButton()

        Object.entries(options).forEach(value => {
            let parameter

            if((value[0] === "id" || value[0] === "url") && value[1]) {
                parameter = value[0].toUpperCase()
            } else if(value[1]) {
                parameter = value[0][0].toUpperCase().concat(value[0].slice(1))
            }

            if(parameter) {
                let codeblock

                if(value[0] === "emoji") {
                    codeblock = `button.set${parameter}("${value[1]}", ${options.emojiAnimated})`
                } else {
                    codeblock = `button.set${parameter}("${value[1]}")`
                }

                try {
                    eval(codeblock)
                } catch(err) {
                    console.log(err)
                }
            }
        })

        return button
    }
}