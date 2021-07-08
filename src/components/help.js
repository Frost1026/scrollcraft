const discord = require("discord.js")
const fs = require("fs")

const commandDesc = {}

module.exports = {
    key: "help",
	func: async (message, args, client, commands) => {
        let payload
        let pages	
        let initialIndex = 0
    
        const pageLimit = 6
        const payloadBuffer = []

        const jsFiles = fs.readdirSync("components/").filter(file => file.endsWith('.js'))

        console.log(jsFiles)

        jsFiles.forEach(commandFile => {
            const command = require(`./${commandFile}`)
            if(command.key && command.desc) {
                commandDesc[command.key] = command.desc
            }
        })

        console.log(commandDesc)

        const generateEmbed = (page) => {
            const payloadEmbed = new discord.MessageEmbed()

            pages = payloadBuffer.length

            payloadBuffer[page - 1].forEach((value, index) => {
                payloadEmbed.addField(value[0] , value[1])
            })

            payloadEmbed
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true }))
                .setTitle("Help Section")
                .setColor("#0074FF")
                .setFooter(`Page ${page} of ${pages}`)

            return payloadEmbed
        }

        payload = Object.entries(commandDesc).map(value => {
            return value
        })

        payload.forEach((value, index) => {
            console.log(payload.slice(initialIndex, index))
            index += 1
            if((index % pageLimit) === 0) {
                payloadBuffer.push(payload.slice(initialIndex, index))
                initialIndex += pageLimit
            } else if(index === payload.length) {
                payloadBuffer.push(payload.slice(initialIndex, index))
            }
        })

        message.channel.send(generateEmbed(1)).then((list) => {
            let currentPage = 1

            if(pages > 1) {
                list.react("➡️")

                const filter = (reaction, user) => {
                    return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id
                }

                const collector = list.createReactionCollector(filter, {
                    time: 60000
                })

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
                    list.reactions.removeAll().then(async() => {
                        list.delete()
                    })
                })
            }
        })
    }
}