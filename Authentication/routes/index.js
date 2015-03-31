var express = require('express');
var fs = require('fs');
var router = express.Router();
var passport = require('passport');
var sys = require("sys");
var shelljs = require("shelljs/global");
var exec = require('child_process').exec,
    child;
var pg = require('pg');
var strings = require('../config/vars.json');

//models
var models = require('../models');

module.exports = router;
router.use(passport.initialize());
router.use(passport.session());
router.use(require('./api'));


//===============ROUTES=================

router.get('/', function(req, res) {
    res.render('index', {
        title: "Identiglass for Boston University", 
        user: req.user
    });
});

router.get('/uploads', function(request, response) {
	response.render('uploads', {
        user: request.user
    });
});
router.all('/upload',function (req, res, next) { var fstream; req.pipe(req.busboy); req.busboy.on('file', function (fieldname, file, filename) { console.log("Uploading: " + filename); filename='unface.jpg';
            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/' + filename,{encoding: 'binary'});
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);     
				child = exec('python main.py routes/unface.jpg Testing_Images/',
					function (error, stdout, stderr) {
					console.log('stdout: ' + stdout);
					console.log('stderr: ' + stderr);
					
					res.redirect('/send');
		
					if (error !== null) {
						console.log('exec error: ' + error);
					}});
			
            });
        });
    });

	
router.all('/send',function (req, res, next) {

	//res.sendFile(__dirname + '/results.html');

    res.json({name: "Alan Pisano", picture: null, message: "success"}); 
}); 

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}
	

function showImage(req,res) {
	fs.readFile('face.jpg',function (err, file3){
		var imagedata = new Buffer(file3).toString('base64');
		res.setHeader("200", {"Content-Type": "text/html"});
		res.write(
			'<body>'+
			'<img src="data:face.jpg;base64,'+imagedata+'" align="middle" />'+
			'</body>'
			);
		res.end();
		});
}
	
		
//displays our signup page
router.get('/signin', function(req, res){
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('signin');
    }
});

router.get('/auth/google', passport.authenticate('google',{scope: 
	'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}));

router.get('/auth/google/callback', 
  passport.authenticate('google', { 
      failureRedirect: '/signin' 
  }),
  function(req,res) {
      res.redirect('/');
});

  
//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});

router.get('/admin', function(req, res) {
    if (!req.user) {
        res.redirect('/');
    } else {
        models.User.findAll().then(function(results) {
            console.log(results);
            res.render('admin', {user: req.user, authorized: results});
        });
    }
});
