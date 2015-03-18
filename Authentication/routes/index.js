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

router.use(express.static(__dirname + '/public'));
module.exports = router;
router.use(passport.initialize());
router.use(passport.session());


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

router.all('/upload',function (req, res, next) {
		
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);
			filename='unface.jpg';
            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/' + filename,{encoding: 'binary'});
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);     
				child = exec('python face_detect.py routes/face.jpg haarcascade_frontalface_default.xml',
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

	res.sendFile(__dirname + '/' + 'unface.jpg');
	});

	

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
  res.render('signin');
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
function faceDetect(fileName,res) {

	sys.debug(fileName);
	exec('python face_detect.py routes/' + fileName + ' haarcascade_frontalface_default.xml');	

	};
  
//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});
	
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};
