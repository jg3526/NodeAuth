// use mongoose module to interact with mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
	name: {
		type: String,
		index: true
	},
	email: {
		type: String
	},
	username: {
		type: String
	},
	password: {
		type: String
	},
	profileimage: {
		type: String
	}
});

// make this object available outside this file
var User = module.exports = mongoose.model('User', UserSchema);


module.exports.createUser = function(newUser, callback) {
	newUser.save(callback);
}