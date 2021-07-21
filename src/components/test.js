const discord = require("discord.js-light")
const fs = require("fs")
const mongoose = require("mongoose")
const model = require("./models/model.js")
const discordButton = require("./libraries/button.js")
const button = require("./libraries/button.js")

module.exports = {
    key: "test",
    desc: "Testing commands and code in development 🛠",
    func: async (message, args, client, commands, config) => {
        if(config.table[0].WHITELIST.includes(message.author.username)){
            model.profile.find({uid: `acc_${message.author.id}`}, (err, docs) => {
                if(docs) {
                    const player = docs[0]

                    console.log(player)
                    console.log(client.users.cache.find("name", player.username).id)

                    const damageCalculator = (stats = {}) => {
                        
                    }
        
                    switch(args[0]) {
                        case "damage":
                            damageCalculator()
                            break
                    }
                } else {
                    message.channel.send(`**No account found for <@${player.username}>**`)
                }
            })
        }
    }
}