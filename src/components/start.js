const discord = require("discord.js")
const mongoose = require("mongoose")
const model = require("./models/model.js")

module.exports = {
	key: "start",
	func: async (message, args, client, commands) => {
		if(model.profile.find({uid: `acc${message.author.id}`}) === null) {
			message.channel.send(`No profile found for ${message.author.id}`)
		}
	}
}