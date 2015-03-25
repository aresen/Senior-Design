"use strict";

module.exports = function(sequelize, Datatypes) {
    return sequelize.define("User", {
        familyname: { 
            type: Datatypes.STRING,
            get : function() {
                return this.getDataValue('familyname');
            }
        },
        givenname: { 
            type: Datatypes.STRING,
            get : function() {
                return this.getDataValue('givenname');
            }
        },
        email: { 
            type: Datatypes.STRING,
            unique: true,
            allowNull: false
        }
    },
    {
        timestamps      : false
    });
    return User;
};
