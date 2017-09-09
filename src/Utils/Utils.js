'use strict';

exports.isEmpty = function(value) {
    return value === null || value === undefined || value === '';
}

exports.constructName = function(firstName, lastName) {
    var contactName = ''; 
    if(!this.isEmpty(firstName)) { 
        contactName = firstName + ' '; 
    } 
    if(!this.isEmpty(lastName)) { 
        contactName += lastName; 
    } 

    return contactName.trim(); 
}