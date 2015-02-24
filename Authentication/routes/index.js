var express = require('express');
var fs = require('fs');
var router = express.Router();
var passport = require('passport');
var sys = require("sys");
var shelljs = require("shelljs/global");
var exec = require('child_process').exec,
    child;

router.use(express.static(__dirname + '/public'));
module.exports = router;
router.use(passport.initialize());
router.use(passport.session());


//===============ROUTES=================
//displays our homepage
router.get('/', function(req, res){
  res.redirect('/index.html');
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
				child = exec('python face_detect.py routes/unface.jpg haarcascade_frontalface_default.xml',
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

	res.sendFile(__dirname + '/' + 'face.jpg');
	
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

router.get('/auth/google', passport.authenticate('google',{scope: 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/signin' }),
  function(req, res, next) {
    // Successful authentication, redirect home.

	res.redirect('/index.html');

  });
 
function faceDetect(fileName,res) {

	sys.debug(fileName);
	exec('python face_detect.py routes/' + fileName + ' haarcascade_frontalface_default.xml');	

	}
   
  
router.get('/logout', function (req, res) {
        req.logOut();
        res.redirect('/');
    });
	
	

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/login', passport.authenticate('local-signin', { 
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});
	