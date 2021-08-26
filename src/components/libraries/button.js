const discord = require("discord.js")

module.exports = {
    Button: function (_options = {}) {
        const options = {
            customid: "default",
            style: "PRIMARY",
            label: null,
            emoji: null,
            emojiAnimated: false,
            url: null,
            ..._options
        }

        const button = new discord.MessageButton()

        Object.entries(options).forEach(value => {
            let parameter

            if(value[1]) {
                if(value[0] === "customid") {
                    parameter = "CustomId"
                } else if(value[0] === "url") {
                    parameter = value[0].toUpperCase()
                } else {
                    parameter = value[0][0].toUpperCase().concat(value[0].slice(1))
                }
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