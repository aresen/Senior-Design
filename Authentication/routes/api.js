var express = require('express');
var router = express.Router();
//models
var models = require('../models');

/* GET users listing. */
router.route('/api/users')
.get(function(req, res) {
    models.User.findAll({limit: 10}).then(function(user) {
        if(user) {
            res.send(user);
        }
    })
})

.post(function(req, res) {
    var match = req.body.email.match(/(@bu\.edu)$/);
    if (match != null) {
        models.User.findOrCreate({where: {email: req.body.email} }).then(function(success) {
            res.json({message: 'User created!'});
        },
        function(err) {
            res.send(err);
        })
    } else {
        res.json({message: 'Error: no BU email detected'});
    }
});

router.route('/api/users/:id')

.delete(function(req,res) {
    models.User.destroy({where: {id: req.params.id}}).then(function(success) {
        res.json({message: "User deleted!"});
    },
    function(err) {
        res.send(err);
    })
});


module.exports = router;
