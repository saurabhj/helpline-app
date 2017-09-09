'use strict';

import { Alert } from 'react-native';
import Util from '../Utils/Utils';

var Contacts = require('react-native-contacts');

exports.addToContacts = function(
    helpline,
    successFunction,
    failureFunction,
    permissionDeniedFunction
) {
    Contacts.checkPermission((err, permission) => {
        // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
        if (permission === 'undefined') {
            Contacts.requestPermission((err, permission) => {});
        }

        if (permission === 'authorized') {
            var emailAddresses = helpline.emails.map(function(email, i) {
                return {
                    label: 'work',
                    email: email,
                };
            });

            var phoneNumbers = helpline.phone_numbers.map(function(phone, i) {
                return {
                    label: 'work',
                    number: phone,
                };
            });

            var newContact = {
                company: helpline.name,
                emailAddresses: emailAddresses,
                familyName: '',
                givenName: helpline.name,
                jobTitle: '',
                middleName: '',
                phoneNumbers: phoneNumbers,
                hasThumbnail: true,
                thumbnailPath: '',
                postalAddresses: [
                    {
                        postCode: helpline.address.pin_code,
                        city: helpline.address.city,
                        neighborhood: '',
                        street: helpline.address.street,
                        formattedAddress: [
                            helpline.address.street,
                            helpline.address.city,
                            helpline.address.state +
                                ' ' +
                                helpline.address.pin_code,
                            helpline.address.country,
                        ].join('\n'),
                        label: 'work',
                    },
                ],
            };

            Contacts.addContact(newContact, err => {
                if (err == null || err == undefined) {
                    successFunction();
                } else {
                    failureFunction();
                }
            });
        }
        if (permission === 'denied') {
            permissionDeniedFunction();
        }
    });
};

exports.fetchAllContacts = function(callBack) {
    if (typeof callBack !== 'function') {
        return;
    }

    Contacts.checkPermission((err, permission) => {
        // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
        if (permission === 'undefined') {
            Contacts.requestPermission((err, permission) => {});
        }

        if (permission === 'authorized') {
            Contacts.getAll((error, contacts) => {
                if (error === 'denied') {
                    callBack(null);
                } else {
                    var sortedContacts = contacts.sort(this.compareContacts);
                    sortedContacts.forEach(function(element) {
                        element.completeName = '';
                        if(!Util.isEmpty(element.givenName)) {
                            element.completeName = element.givenName;
                        }
                        if(!Util.isEmpty(element.familyName)) {
                            element.completeName += ' ' + element.familyName;
                        }

                        element.completeName = element.completeName.trim().toLowerCase();
                    }, this);
                    callBack(sortedContacts);
                }
            });
        } else if (permission === 'denied') {
            callBack(null);
        }
    });
};

exports.compareContacts = function(a, b) {
    var aName = [a.givenName, a.middleName, a.familyName]
        .join(' ')
        .trim()
        .toLowerCase();
    var bName = [b.givenName, b.middleName, b.familyName]
        .join(' ')
        .trim()
        .toLocaleLowerCase();

    if (Util.isEmpty(aName) && !Util.isEmpty(bName)) {
        return 1;
    }

    if (Util.isEmpty(bName) && !Util.isEmpty(aName)) {
        return -1;
    }

    if (a.givenName.toLowerCase() < b.givenName.toLowerCase()) {
        return -1;
    }

    if (a.givenName.toLowerCase() > b.givenName.toLowerCase()) {
        return 1;
    }

    if (aName < bName) {
        return -1;
    }

    if (aName > bName) {
        return 1;
    }

    return 0;
}
