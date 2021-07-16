const discord = require("discord.js")
const fs = require("fs")
const mongoose = require("mongoose")
const model = require("./models/model.js")

const classes_file = "./src/components/assets/classes.json"

const template = {}

var classes = {}

// Functions to get declared, write here
const refreshJSONBuffer = (filepath, obj) => {
	try {
		const data = fs.readFileSync(filepath)
		const temp = JSON.parse(data)
		const keys = Object.keys(temp)

		keys.some((value) => {
			obj[value] = temp[value]
		})
	} catch {
		console.log(`Can't read ${filepath}`)
		console.log(`Writing template to ${filepath}`)
		fs.writeFileSync(filepath, JSON.stringify(template, null, 2))
		refreshJSONBuffer(filepath, obj)
	}

	Object.freeze(obj)
}

module.exports = {
	key: "start",
	desc: "Creates player profile for the game",
	func: async (message, args, client, commands) => {
		model.profile.find({uid: `acc-${message.author.id}`}, (err, docs) => {
			if(err == null) {
				refreshJSONBuffer(classes_file, classes)

				let proceed = false
				let payload
				let pages 
				let initialIndex = 0
			
				const pageLimit = 1
				const payloadBuffer = []
				const reactions = ['✅', '❌', '⬅️', '➡️']

				const readFirstEmbed = new discord.MessageEmbed()

				const generateEmbed = (page) => {
					const payloadEmbed = new discord.MessageEmbed()
		
					pages = payloadBuffer.length
		
					payloadBuffer[page - 1].forEach((value, index) => {
						payloadEmbed.addField(`${value[0]} ${value[1].icon}` , value[1].desc)
					})
		
					payloadEmbed
						.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true }))
						.setTitle("Character Creation")
						.setDescription("Classes only determine your starting weapon and stats.")
						.setColor("#0074FF")
						.setFooter(`Page ${page} of ${pages}`)
		
					return payloadEmbed
				}

				payload = Object.entries(classes).map(value => {
					return value
				})
		
				payload.forEach((value, index) => {
					index += 1
					if((index % pageLimit) === 0) {
						payloadBuffer.push(payload.slice(initialIndex, index))
						initialIndex += pageLimit
					} else if(index === payload.length) {
						payloadBuffer.push(payload.slice(initialIndex, index))
					}
				})
			
				const filter = (reaction, user) => {
					return reactions.includes(reaction.emoji.name) && user.id === message.author.id
				}

				message.channel.send(generateEmbed(1)).then((list) => {
					const collector = list.createReactionCollector(filter, {
						time: 180000
					})

					let currentPage = 1
	
					if(pages > 1) {
						list.react("➡️")
		
						collector.on("collect", (reaction) => {
							list.reactions.removeAll().then(async() => {
								if(reaction.emoji.name === '➡️') {
									currentPage += 1
								} else if(reaction.emoji.name === '⬅️') {
									currentPage -= 1
								}
		
								list.edit(generateEmbed(currentPage))
		
								if(currentPage > 1) {
									await list.react('⬅️')
								}
		
								if(currentPage < pages) {
									list.react('➡️')
								}
							})
						})

						collector.on("end", collected => {
							message.channel.send("**Selection Timed Out**")
							list.reactions.removeAll().then(async() => {
								list.delete()
							})
						})
					}
				})
			} else {
				message.channel.send(`**${message.author} already have a profile on the database**`)
			}
		})
	}
}