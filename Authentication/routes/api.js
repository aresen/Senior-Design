var express = require('express');
var router = express.Router();
//models
var models = require('../models');

/* GET users listing. */
router.get('/api/users', function(req, res) {
    models.User.findAll({limit: 10}).then(function(user) {
        if(user) {
            res.send(user);
        }
    })
});

module.exports = router;
