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
						.setColor("#0074FF")
						.setFooter(`Page ${page} of ${pages}`)
		
					return payloadEmbed
				}

				//main code starts
				readFirstEmbed
					.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true }))
					.setTitle("Character Creation")
					.setColor("#0074FF")
					.addField("React to start character creation", "Each class only gives you a differences in initial starting stats & ability to master a weapon class, meaning you can be a warlock but uses a sword, but with limitations.")
					.setFooter("Everyone only have one choice at character creation, choose wisely")
					.setTimestamp()

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

				message.channel.send(readFirstEmbed).then((list) => {
					list.react("✅").then(list.react("❌"))
			
					const confirmationFilter = (reaction, user) => {
						return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
					}

					const selectionFilter = (reaction, user) => {
						return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id
					}

					list.awaitReactions(confirmationFilter, {max: 1, time: 30000, errors: ['time']}).then((collected) => {
						if(collected.emoji.name === '✅') {
							list.edit(generateEmbed(1))
							// message.channel.send(generateEmbed(1)).then((list_2) => {
							// 	const collector = list_2.createReactionCollector(selectionFilter, {
							// 		time: 60000
							// 	})
								
							// 	let currentPage = 1
					
							// 	if(pages > 1) {
							// 		list_2.react("➡️")
					
							// 		collector.on("collect", (reaction) => {
							// 			list_2.reactions.removeAll().then(async() => {
							// 				if(reaction.emoji.name === '➡️') {
							// 					currentPage += 1
							// 				} else if(reaction.emoji.name === '⬅️') {
							// 					currentPage -= 1
							// 				}
					
							// 				list_2.edit(generateEmbed(currentPage))
					
							// 				if(currentPage > 1) {
							// 					await list_2.react('⬅️')
							// 				}
					
							// 				if(currentPage < pages) {
							// 					await list_2.react('➡️')
							// 				}
							// 			})
							// 		})
					
							// 		collector.on("end", collected => {
							// 			message.channel.send("**No Class Selected**")
							// 			list_2.reactions.removeAll().then(async() => {
							// 				list_2.delete()
							// 			})
							// 		})
							// 	}
							// })
						} else if(reaction.emoji.name === '❌') {
							message.channel.send("Exited Character Creation")
							list.reactions.removeAll().then(() => {
								list.delete()
							})
						}
					}).catch(err => {
						message.channel.send("**Timed Out**")
						list.reactions.removeAll().then(() => {
							list.delete()
						})
					})
				})
			} else {
				message.channel.send(`**${message.author} already have a profile on the database**`)
			}
		})
	}
}