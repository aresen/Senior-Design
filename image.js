"use strict";

module.exports = function(sequelize, Datatypes) {
    var Image = sequelize.define("Image", {
        path: { type: Datatypes.STRING },
        primary: { 
            type: Datatypes.BOOLEAN,
            defaultValue: false
        }
    } , {
        classMethods    : {
            associate   : function(models) {
                Image.hasOne(models.Students);
            },
        },
        setterMethods   : {
            save        : function(path, primary) {
                this.setDataValue('path', path);
                if (primary == true) {
                    this.setDataValue('primary', true);
                }
            },
        }
    });
    return Image;
};
