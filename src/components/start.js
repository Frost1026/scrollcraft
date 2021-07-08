const discord = require("discord.js")
const mongoose = require("mongoose")
const model = require("./models/model.js")

module.exports = {
	key: "start",
	desc: "Creates player profile for the game",
	func: async (message, args, client, commands) => {
		model.profile.find({uid: `acc${message.author.id}`}, (err, docs) => {
			if(err == null) {
				message.channel.send(`**Creating profile for ${message.author}**`)
				
				
			} else {
				message.channel.send(`**${message.author} already have a profile created**`)
			}
		})
	}
}