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
    if (!req.user) {
        res.redirect('/');
    } else {
        var match = req.body.email.match(/(@bu\.edu)$/);
        if (match != null) {
            models.User.findOrCreate({where: {email: req.body.email} }).then(function(success) {
                if (!req.user) {
                    res.redirect('/');
                } else {
                    models.User.findAll().then(function(results) {
                        res.render('admin', {user: req.user, authorized: results});
                    });
                }
            },
            function(err) {
                res.send(err);
            })
        } else {
            res.json({message: 'Error: no BU email detected'});
        }
    }
});

router.route('/api/users/:id/del')

.post(function(req,res) {
    if (!req.user) {
        res.redirect('/');
    } else {
        models.User.destroy({where: {id: req.params.id}}).then(function(success) {
            res.redirect('/admin');
        },
        function(err) {
            res.send(err);
        })
    }
});


module.exports = router;
