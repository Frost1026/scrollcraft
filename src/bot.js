//Set default timezone for node process
process.env.TZ = 'Asia/Kuala_Lumpur'

//since replit have to log timecodes, this code lets all console.log to have one (time used from timezone set above)
require('console-stamp')(console, { 
	format: ':date(yyyy/mm/dd HH:MM:ss.l)',
})

// JSON buffers and template
const template = {
	table: []
}

var config = {}

var launchOptions = {}

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

//function for letting bot into maintenance(whitelists user only)
const maintenance = (message, args) => {
	switch(args) {
		case "on":
			config.table[0].MAINTENANCE_MODE.pop()
			config.table[0].MAINTENANCE_MODE.push(true)
			fs.writeFileSync(config_file, JSON.stringify(config, null, 2))
			refreshJSONBuffer(config_file, config)
			maintenance(message, "status")
			break;

		case "off":
			config.table[0].MAINTENANCE_MODE.pop()
			config.table[0].MAINTENANCE_MODE.push(false)
			fs.writeFileSync(config_file, JSON.stringify(config, null, 2))
			refreshJSONBuffer(config_file, config)
			maintenance(message, "status")
			break;

		case "status":
			if(config.table[0].MAINTENANCE_MODE[0]) {
				message.channel.send("I am in **Maintenance Mode**.")
			} else {
				message.channel.send("I am **not** in **Maintenance Mode**.")
			}
			break;

		default:
			message.channel.send(`${message.author} no arguments are given, please check again.`)
			break;
	}
}
//end of predefining functions

//Web Portion(for uptime robot to keep repl running)
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send("I'm not dead! :D"))

app.listen(port, () => console.log(`listening at http://localhost:${port}`))
//end of web portion


//Discord Bot Portion---------------------------------------------

//bot initial variables declaration
const components_folder = "./src/components"
const config_file = "./src/components/configs/config.json"
const launchOptions_file = "./src/components/configs/launch_options.json"

const discord = require("discord.js-light")
const mongoose = require("mongoose")
const fs = require("fs")

const client = new discord.Client({
    cacheGuilds: true,
    cacheChannels: true,
    cacheOverwrites: false,
    cacheRoles: false,
    cacheEmojis: true,
    cachePresences: false
})

require("discord-buttons")(client)

//parse json file content from configs into javascript objects
refreshJSONBuffer(config_file, config)
refreshJSONBuffer(launchOptions_file, launchOptions)

const prefix = config.table[0].PREFIX
const commands = new Map()

//get command files from components folder and parsing to a map
const jsFiles = fs.readdirSync(components_folder).filter(file => file.endsWith('.js'))

jsFiles.forEach(commandFile => {
	const command = require(`./components/${commandFile}`)
	if(command.key && command.func) {
		commands.set(command.key, command.func)
	}
})

//Verify database connection
mongoose.connect(config.table[0].MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}) .then(() => {
	console.log("Database Connected")
	//PLEASE REMOVE WHEN GOING INTO BETA 
	client.channels.cache.get("861187530338336788").send("Bot Restarted")
})

//bot initial running code similar to setup
client.once('ready', () => {
	console.log('Ready!')
	console.log(`Logged in as ${client.user.tag}`)

	client.user.setActivity(`for ${prefix}`, {type: "WATCHING"})

	if(launchOptions.table.length) {
		runOnStartup = launchOptions.table.some((value, index) => {
			let message = {}

			const args = value[0]
			const command = args.shift()
			const id = value.slice(-1)[0].channelID

			message["channel"] = client.channels.cache.get(id)
			message["createdTimestamp"] = Date.now()

			commands.get(command)(message, args, client, commands, config)
		}) 	
	}
});

//command handling section
client.on("message", async message => {
	try{
		if(!message.content.startsWith(prefix)) return

		//seperating prefix, command and arguments
		const preSlicedCommand = message.content.slice(prefix.length)
		const args = preSlicedCommand.split(" ")
		const command = args.shift().toLowerCase()

		//logging command ran to user who initiated the command
		console.log(`${message.author.username} wants to run the ${command} command with arguments of ${args}`)

		//Uncomment for bot release
		// refreshJSONBuffer(config_file, config)
		// refreshJSONBuffer(launchOptions_file, launchOptions)

		console.log(process.cwd())

		//code to determine should command be run
		if(command === "maintenance") {
			if(config.table[0].WHITELIST.includes(message.author.username)) {
				maintenance(message, args[0])
			} else {
				message.channel.send(`${message.author} only bot admins are able to run this command.`)
			}
		} else {
			if(commands.get(command) === undefined) {
				message.channel.send(`${command} command is not found`)
			} else if(message.author.bot) {
				return
			} else {
				if(!config.table[0].MAINTENANCE_MODE[0]) {
					commands.get(command)(message, args, client, commands, config)
				} else {
					if(config.table[0].WHITELIST.includes(message.author.username)) {
						commands.get(command)(message, args, client, commands. config)
					} else {
						message.channel.send(`${message.author} I am **under maintenance** only bot admins can use commands`)
					}
				}
			}
		}
	} catch(err) {
		console.log(err)
	}  
});
	
//discord bot log in
client.login(config.table[0].BOT_TOKEN);