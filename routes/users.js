var express = require('express');
var router = express.Router();

// handle file uploads
var multer = require('multer');
var upload = multer({dest: './uploads/'});

// include User model
var User = require('../models/user');

router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
	res.render('register', {
		'title': 'Register'
	});
});
router.get('/login', function(req, res, next) {
	res.render('login', {
		'title': 'Log In'
	});
});
// Core registration operation
router.post('/register', upload.array(), function(req, res, next) {
	// Get form values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// console.log(req.body);
	// res.render('register', {
	// 	'title': 'Register'
	// });

	// check the profile image
	if (req.files.profileimage) {
		console.log('Uploading File...');
		// file Info
		var profileImageOriginalName = req.files.profileimage.originalname;
		var profileImageName = req.files.profileimage.name;
		var profileImageMime = req.files.profileimage.mimetype;
		var profileImagePath = req.files.profileimage.path;
		var profileImageExt = req.files.profileimage.extension;
		var profileImageSize = req.files.profileimage.size;
	} else {
		// Set a default image
		// No file chosen
		console.log('No file chosen, using the default...');
		var profileImageName = 'superthumb.jpg';
	}
	// Form validation - using Express validator
	req.checkBody('name', 'Name field is required.').notEmpty();
	req.checkBody('email', 'Eamil field is required.').notEmpty();
	req.checkBody('email', 'Eamil not valid.').isEmail();
	req.checkBody('username', 'Username field is required.').notEmpty();
	req.checkBody('password', 'Password field is required.').notEmpty();
	req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

	// Check for errors
	var errors = req.validationErrors();
	// console.log(errors);
	if (errors) {
		// this must be 'register' instead of '/register'
		res.render('register', { 
			title: 'Register',
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	} else {
		var newUser = new User({
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			profileimage: profileImageName
		});

		// Create User
		User.createUser(newUser, function(err, user) {
			if (err) throw err;
			console.log(user);
		});

		// Send success message
		req.flash('success', 'Congratulations! You are now registered and may log in!');
		res.location('/');
		res.redirect('/');
	}
});

module.exports = router;