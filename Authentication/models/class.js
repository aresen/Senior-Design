"use strict";

module.exports = function(sequelize, Datatypes) {
    var Class = sequelize.define("Class", {
        classtitle : { type: Datatypes.STRING },
        classcode : { type: Datatypes.STRING },
        year : {type: Datatypes.INTEGER},
        semester : {
            type: Datatypes.ENUM(
                      'Spring',
                      'Summer',
                      'Fall'
                      )
        }
    }, {
        classMethods: {
            associate: function(models) {
                Class.belongsToMany(models.Students, {through: 'UserClass'});
            },
        timestamps: false
        }
    });
    return Class;
};
