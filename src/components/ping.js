module.exports = {
	key: "ping",
	desc: "Returns latency of server responding to your commands",
	func: async (message, args) => {
		const timeTaken = Date.now() - message.createdTimestamp;
		message.channel.send(`Pong! This message had a latency of ${timeTaken}ms.`)
	}
}