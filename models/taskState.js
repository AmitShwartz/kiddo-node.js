const mongoose = require('mongoose'),
	  Schema   = mongoose.Schema;

const taskState  = new Schema({
	_id_task: 		{ type: String, require: true, index: 1 },
	status: 		{ type: String, default: "not complete" },
	given_date: 	{ type: Date, default: new Date() },
	finish_date: 	Date,
	helper_id:		[String]	
}, { versionKey: false});

module.exports = taskState; 