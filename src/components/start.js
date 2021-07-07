const discord = require("discord.js")
const mongoose = require("mongoose")
const model = require("./models/model.js")

module.exports = {
	key: "start",
	func: async (message, args, client, commands) => {
		model.profile.find({uid: `acc${message.author.id}`}, (err, docs) => {
			console.log(err)
			console.log(docs)
		})
	}
}