const mongoose  = require('mongoose'),
	  TaskState = require('./taskState'),
	  Schema    = mongoose.Schema;

const user  = new Schema({
	name: 		{ type: String, require: true },	
	department: { type: String, require: true },
	phone: 		{ type: String, require: true },
	email: 		{ type: String, require: true, unique: true, index: 1 },
	picture: 	{ type: String, default: 'https://image.flaticon.com/icons/svg/149/149071.svg' },
	rank:		{ type: Number, default: 0 },
	taskList:   [TaskState],
}, { versionKey: false });

module.exports = mongoose.model('user', user); 