const mongoose = require('mongoose'),
	  Schema   = mongoose.Schema;

const task  = new Schema({
	topic: 			{ type: String, require: true, index: 1 },
	teacher: 		{ type: String, require: true },
	content: 		{ type: String, require: true },
	submission: 	{ type: Date, require: true }
}, { versionKey: false });

module.exports = mongoose.model('task', task);