var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StorySchema = new Schema({

	creator: String,
	content: String,
	reciever: String,
	created: {type: Date, defauly: Date.now}

});

module.exports=mongoose.model('Story', StorySchema);