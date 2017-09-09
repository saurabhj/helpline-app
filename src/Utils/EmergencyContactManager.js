'use strict';

import { Alert, AsyncStorage } from 'react-native';

const key = '@EmergencyContacts:key';

exports.fetchContacts = function(callBack) {
    if (typeof callBack == 'function') {
        AsyncStorage.getItem(key, (error, result) => {
            if (result != null) {
                const jsonContacts = JSON.parse(result);
                callBack(jsonContacts);
            } else {
                callBack(this.getEmptyContacts());
            }
        });
    }
};

exports.saveContact = function(
    contactName,
    contactNumber,
    contactPhotoUrl,
    priority,
    callBack
) {
    this.fetchContacts(contacts => {
        contacts[priority].name = contactName;
        contacts[priority].number = contactNumber;
        contacts[priority].photo = contactPhotoUrl;

        const value = JSON.stringify(contacts);

        AsyncStorage.setItem(key, value, error => {
            if (typeof callBack == 'function') {
                if (error == null) {
                    callBack(contacts);
                } else {
                    callBack(null);
                }
            }
        });
    });
};

exports.deleteContact = function(priority, callBack) {
    this.saveContact('', '', '', priority, contacts => {
        if (typeof callBack === 'function') {
            callBack(contacts);
        }
    });
};

exports.getEmptyContacts = function() {
    var contacts = [];
    for (var i = 0; i < 4; i++) {
        contacts.push({
            name: '',
            number: '',
            photo: '',
            order: i,
        });
    }

    return contacts;
};
