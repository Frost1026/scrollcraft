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
                const damageCalculator = (_stats = {}) => {
                    const stats = {
                        docs, 
                        ..._stats
                    }

                    console.log(stats)
                }
    
                switch(args[0]) {
                    case "damage":
                        damageCalculator({
                            "strength": 2,
                            "defence": 1,
                            "dexterity": 6,
                            "intelligence": 14,
                            "agility": 4,
                            "hp": 1200,
                        })
                        break
                }
            })
        }
    }
}