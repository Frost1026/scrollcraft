const discord = require("discord.js")
const mongoose = require("mongoose")
const model = require("./models/model.js")

module.exports = {
	key: "start",
	func: async (message, args, client, commands) => {
		console.log(model.profile.find())
	}
}