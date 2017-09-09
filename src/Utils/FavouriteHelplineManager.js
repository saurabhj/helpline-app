'use strict';

import { Alert, AsyncStorage } from 'react-native';

const key = '@FavouriteHelplines:key';

exports.fetchFavourites = function(callBack) {
    if (typeof callBack == 'function') {
        AsyncStorage.getItem(key, (error, result) => {
            if (result != null) {
                const jsonFavourites = JSON.parse(result);
                callBack(jsonFavourites);
            } else {
                callBack(null);
            }
        });
    }
};

exports.addToFavourites = function(id, callBack) {
    this.fetchFavourites(favourites => {
        if(favourites == null) {
            favourites = [];
        }

        if(favourites.indexOf(id) == -1) {
            favourites.push(id);
        }
        
        AsyncStorage.setItem(key, JSON.stringify(favourites), error => {
            if (typeof callBack === 'function') {
                if (error == null) {
                    callBack(favourites);
                } else {
                    callBack(null);
                }
            }
        });
    });
};

exports.removeFromFavourites = function(id, callBack) {
    this.fetchFavourites(favourites => {
        if(favourites == null) {
            favourites = [];
        }

        var index = favourites.indexOf(id);
        if(index !== -1) {
            favourites.splice(index, 1);
        }

        AsyncStorage.setItem(key, JSON.stringify(favourites), error => {
            if (typeof callBack === 'function') {
                if (error == null) {
                    callBack(favourites);
                } else {
                    callBack(null);
                }
            }
        });
    });
};
