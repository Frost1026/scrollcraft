const button = require("discord-buttons")

const buttonParameters = {
    id,
    style,
    label,
    emoji,
    emojiAnimated,
    url,
}

module.exports = {
    Button: async(buttonParameters) => {
        console.log(buttonParameters)
    }
}