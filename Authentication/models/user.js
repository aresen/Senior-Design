"use strict";

module.exports = function(sequelize, Datatypes) {
    return sequelize.define("User", {
        familyname: { type: Datatypes.STRING },
        givenname: { type: Datatypes.STRING },
        email: { 
            type: Datatypes.STRING,
            unique: true,
            allowNull: false
        }
    },
    {
        timestamps: false
    })
};
