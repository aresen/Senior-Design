"use strict";

module.exports = function(sequelize, Datatypes) {
    var Students = sequelize.define("Students", {
        familyname: { type: Datatypes.STRING},
        givenname: { type: Datatypes.STRING},
        email: {
            type: Datatypes.STRING,
            unique: true
        }
    },{
        classMethods: {
            assocate: function(models) {
                Students.belongsToMany(models.Class, {through: 'UserClass'});
            },
        timestamps: false
        }
    });
    return Students;

};
