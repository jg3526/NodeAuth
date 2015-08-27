// use mongoose module to interact with mongodb
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');	// for password encryption
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
		type: String,
		required: true,
		bcrypt: true
	},
	profileimage: {
		type: String
	}
});

// make this object available outside this file
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
	bcrypt.hash(newUser.password, 10, function(err, hash) {
		if (err) throw err;
		// Set hashed pw
		newUser.password = hash;
		newUser.save(callback);
	});
}