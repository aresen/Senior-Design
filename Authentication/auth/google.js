var passport = require('passport');
var strings = require('../config/vars');
var googleStrategy = require('passport-google-oauth').OAuth2Strategy; //Authentication

//Google Project Credentials  
passport.use(new googleStrategy({
    clientID: strings.google.clientID,
    clientSecret: strings.google.clientSecret,
    callbackURL: strings.google.callbackURL
},

function (accessToken, refreshToken, profile, done) {

    fs.writeFile(__dirname + "/profile.json", JSON.stringify(profile, null, 4), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("profile.json was saved!");
    }
});  //profile contains all the personal data returned 
    done(null, profile)
}
));

passport.serializeUser(function(user, callback){
        console.log('serializing user.');
        callback(null, user.id);
    });

passport.deserializeUser(function(user, callback){
       console.log('deserialize user.');
       callback(null, user.id);
    });

