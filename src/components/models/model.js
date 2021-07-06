const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
	userID: {type: String, required: true},
	stats: new mongoose.Schema({
		strength: {type: Number, default: 0},
		defence: {type: Number, default: 0},
		dexterity: {type: Number, default: 0},
		intelligence: {type: Number, default: 0},
		agility: {type: Number, default: 0},
		hp: {type: Number, default: 1000}
	})
})

const model = mongoose.model("profileModel", profileSchema)

module.exports = model