'use strict';

import { AsyncStorage, NetInfo } from 'react-native';

import allData from './data.json';
import FavouriteHelplineManager from '../Utils/FavouriteHelplineManager';

const key = '@HelplineData:key';
const versionKey = '@HelplineDataVersion:key';

// File Updates checker
const versionCheckUrl = '**URL_TO_CHECK_VERSION**';
const dataUrl = '**URL_TO_FETCH_DATA_JSON**';

exports.fetchAllData = function(params, callback) {
    if (typeof callback === 'function') {
        var helplineData = null;

        AsyncStorage.getItem(key, (error, result) => {
            if (result === null) {
                helplineData = allData;
                AsyncStorage.setItem(key, JSON.stringify(allData));
                AsyncStorage.setItem(versionKey, '1.00');
            } else {
                helplineData = JSON.parse(result);
            }
        }).then(() => {
            if (
                params === null ||
                typeof params === 'undefined' ||
                typeof params.favourites === 'undefined'
            ) {
                FavouriteHelplineManager.fetchFavourites(favourites => {
                    var mergedData = this.prepHelplineData(
                        helplineData,
                        favourites
                    );
                    callback(mergedData);
                });
            } else {
                var mergedData = this.prepHelplineData(
                    helplineData,
                    params.favourites
                );
                callback(mergedData);
            }
        });
    }
};

exports.fetchAllStates = function(callback) {
    if (typeof callback === 'function') {
        AsyncStorage.getItem(key, (error, result) => {
            var states = JSON.parse(result).map(x => {
                return x.address.state;
            });

            var uniqueStates = [...new Set(states)];
            callback(uniqueStates.sort());
        });
    }
};

exports.prepHelplineData = function(helplineData, favourites) {
    if (favourites == null) {
        favourites = [];
    }

    helplineData.forEach(function(obj) {
        obj.isFavourite = favourites.indexOf(obj.id) != -1;
        obj.searchString = [
            obj.name,
            obj.address.street,
            obj.address.city,
            obj.address.state,
            obj.address.pin_code,
            obj.mode_of_contact.join(' '),
            obj.emails.join(' '),
            obj.websites.join(' '),
        ]
            .join(' ')
            .toLowerCase();
    }, this);

    return helplineData;
};

exports.checkAndUpdateDataFile = function(callback) {
    fetch(versionCheckUrl)
        .then(version => version.json())
        .then(versionJson => {
            var onlineVersion = parseFloat(versionJson.v);
            AsyncStorage.getItem(versionKey, (error, result) => {
                var offlineVersion = result === null ? 0 : parseFloat(result);

                if (onlineVersion > offlineVersion) {
                    fetch(dataUrl)
                        .then(helplineData => helplineData.json())
                        .then(helplineDataJson => {
                            AsyncStorage.setItem(
                                key,
                                JSON.stringify(helplineDataJson)
                            ).then(() =>
                                AsyncStorage.setItem(
                                    versionKey,
                                    onlineVersion.toString()
                                ).then(() => callback({ status: 'updated' }))
                            );
                        })
                        .catch(error =>
                            callback({ status: 'error', error: error })
                        );
                } else {
                    callback({ status: 'already_updated' });
                }
            });
        })
        .catch(error => callback({ status: 'error', error: error }));
};

exports.getOfflineDataVersion = function(callback) {
    AsyncStorage.getItem(versionKey, (error, result) => {
        if (result == null) {
            callback('1.00');
        } else {
            callback(result);
        }
    });
};
