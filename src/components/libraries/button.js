const button = require("discord-buttons")

const buttonParameters = {
    id: {type: String},
    style: {type: String},
    label: {type: String},
    emoji: {type: String},
    emojiAnimated: {type: Boolean},
    url: {type: String},
}

module.exports = {
    Button: function (buttonParameters) {
        console.log(buttonParameters)
    }
}