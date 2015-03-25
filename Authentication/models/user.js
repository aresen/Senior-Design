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
        timestamps      : false,
        getterMethods   : {
            fullname        : function() {
                if (!this.givenname || this.familyname) {
                    return null;
                }
                return this.givenname + " " + this.familyname;
            },
            email       : function() {
                return this.email;
            }
        },
        setterMethods   : {
            setFirstName    : function(value) {
                this.setDataValue = ('givenname', value);
            },
            setLastName     : function(value) {
                this.setDataValue = ('familyname', value);
            },
            addUserByEmail  : function(email) {
                var val = /\S+@b\.edu/;
                if (val == null) { throw new Error("Require a bu.edu email address");}
                this.setDataValue = ('email', val);
            },
        },
    })
    return User;
};
