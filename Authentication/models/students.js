"use strict";

module.exports = function(sequelize, Datatypes) {
    return sequelize.define("Students", {
        familyname: { type: Datatypes.STRING},
        givenname: { type: Datatypes.STRING},
        email: {
            type: Datatypes.STRING,
            unique: true,
        },
        image: { type: Datatypes.STRING},
    })
};
