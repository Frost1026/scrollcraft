const discord = require("discord.js")
const mongoose = require("mongoose")
const model = require("./models/model.js")

module.exports = {
	key: "start",
	func: async (message, args, client, commands) => {
		model.profile.find({uid: `acc${message.author.id}`}, (err, docs) => {
			if(err == mull) {
				message.channel.send("No profile found")
			} else {
				message.channel.send("Found profile")
			}
		})
	}
}