const discord = require("discord.js")
const mongoose = require("mongoose")
const model = require("./models/model.js")

const startingOutEmbed = new discord.MessageEmbed()

module.exports = {
	key: "start",
	desc: "Creates player profile for the game",
	func: async (message, args, client, commands) => {
		model.profile.find({uid: `acc${message.author.id}`}, (err, docs) => {
			if(err == null) {
				startingOutEmbed
					.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true }))
					.setTitle("Character Creation")
					.setDescription("Everyone only have a chance at character creation, so choose your options wisely.")
					.addField("React on the arrows to scroll through available classes")
					.setFooter("Classes will only determine your initial stats and initial ability to master which weapon.")
					.setTimestamp()

				message.channel.send(startingOutEmbed)
			} else {
				message.channel.send(`**${message.author} already have a profile on the database**`)
			}
		})
	}
}