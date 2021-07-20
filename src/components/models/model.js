const mongoose = require("mongoose")
const models = new Map()

const schemas = [
	{
		id: "profile",
		schema: new mongoose.Schema({
			uid: {type: String, required: true},
			username: {type: String, required: true},
			stats: new mongoose.Schema({
				strength: {type: Number, default: 0},
				defence: {type: Number, default: 0},
				dexterity: {type: Number, default: 0},
				intelligence: {type: Number, default: 0},
				agility: {type: Number, default: 0},
				hp: {type: Number, default: 1000},
			})
		})
	}
]

schemas.forEach((value, index) => {
	const model = mongoose.model(`${value.id}_model`, value.schema)

	if(!models.has(value.id)) {
		models.set(value.id, model)
	} else {
		console.log("Duplicated schema found in models.js")
	}
})

module.exports = Object.fromEntries(models)