const discord = require("discord.js")
const fs = require("fs")
const mongoose = require("mongoose")
const model = require("./models/model.js")
const discordButton = require("./libraries/button.js")
const button = require("./libraries/button.js")

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
		model.profile.find({uid: `acc_${message.author.id}`}, (err, docs) => {
			if(!docs.length) {
				refreshJSONBuffer(classes_file, classes)

				let payload
				let pages 
				let initialIndex = 0
			
				const pageLimit = 1
				const payloadBuffer = []
				const buttonStorage = {
					id: [],
					buttons: []
				}

				const readFirstEmbed = new discord.MessageEmbed()

				//Add new Buttons here in order of appearance
				const buttonTypes = {
					'⬅️': {
						customid: `btn_${message.author.id}${message.id}leftarrow`,
						label: "Previous",
						style: "PRIMARY",
						emoji: '⬅️'
					},
					'➡️': {
						customid: `btn_${message.author.id}${message.id}rightarrow`,
						label: "Next",
						style: "PRIMARY",
						emoji: '➡️'
					},
					'✅': {
						customid: `btn_${message.author.id}${message.id}checkmark`,
						style: "SECONDARY",
						label: "Select",
						emoji: '✅'
					}
				}

				//Function Declaration
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

				const createCharacter = (selectedIndex) => {
					const characterDetail = {
						uid: `acc_${message.author.id}`,
						username: message.author.username,
						stats: classes[payload[selectedIndex][0]].stats
					}

					model.profile.create(characterDetail)
				}

				//Main Code Starts
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

				Object.entries(buttonTypes).forEach(value => {
					buttonStorage.id.push(value[0])
					buttonStorage.buttons.push(new discordButton.Button(value[1]))
				})

				const filter = (interaction) => {
					// return interaction.user.id === message.author.id
					console.log(interaction.user.id)
				}

				if(payloadBuffer.length > 1) {
					let intinialBtnRow = new discord.MessageActionRow()
					let currentBtnRow = new discord.MessageActionRow()
					
					buttonStorage.buttons.slice(1).forEach(value => {
						intinialBtnRow.addComponents(value)
					})

					message.channel.send({embeds: [generateEmbed(1)], components: [intinialBtnRow]}).then(list => {
						let currentPage = 1
						let selected = false
						let currentBtnArray = []

						const collector = list.createMessageComponentCollector(filter, {time: 120000})

						collector.on("collect", async(button) => {
							console.log(buttonStorage.buttons)

							const classIndex = currentPage - 1

							currentBtnArray = []

							switch(button.id) {
								case buttonTypes['⬅️'].customid:
									await button.deferReply()
									currentPage -= 1
									break
								
								case buttonTypes['➡️'].customid:
									await button.deferReply()
									currentPage += 1
									break
		
								case buttonTypes['✅'].customid:
									await button.deferReply()
									selected = true
									list.delete().then(() => {
										message.channel.send(`${message.author} selected the **${payload[classIndex][0]}** class.`)
										message.channel.send("**Creating Character...**").then((progress) => {
											createCharacter(classIndex)
											progress.edit("**Character Creation Complete**")
										})
									})
									break
							}

							if(!selected) {
								if(currentPage > 1) {
									currentBtnArray.push(buttonStorage.buttons[0])
								}

								if(currentPage < pages) {
									currentBtnArray.push(buttonStorage.buttons[1])
								}

								currentBtnArray.push(buttonStorage.buttons[2])

								currentBtnArray.forEach(value => {
									currentBtnRow.addComponents(value)
								})

								list.edit({embeds: [generateEmbed(currentPage)], components: [currentBtnRow]})
							}
						})

						collector.on("end", collected => {
							if(!selected) {
								list.delete().then(() => {
									message.channel.send("**Timed Out**")
								})
							}
						})
					})
				}
			} else {
				message.channel.send(`**${message.author} already have a profile on the database**`)
			}
		})
	}
}