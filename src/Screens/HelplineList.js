'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    TouchableHighlight,
    FlatList,
    Alert,
    TouchableOpacity,
    Platform,
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import HelplineListItem from '../Components/HelplineListItem';

import DataStore from '../Data/DataStore';
import ContactManager from '../Utils/ContactsManager';
import FavouriteHelplineManager from '../Utils/FavouriteHelplineManager';
import Util from '../Utils/Utils';

class HelplineList extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedState: 'Choose State',
            helplineData: [],
            isFavouriteFilterOn: false,
            favouriteImage: require('../images/heart-empty-white.png'),
            searchImage: require('../images/search.png'),
        };

        const { state } = this.props.navigation;

        // Reading the favourites from memory
        DataStore.fetchAllData(null, mergedData => {
            if (state.params.currentPos !== null) {
                mergedData = this.sortByProximity(
                    mergedData,
                    state.params.currentPos
                );
            }

            this.setState({
                helplineData: mergedData,
                mergedData: mergedData,
            });
        });
    }

    keyExtractor = (item, index) => index;

    sortByProximity = function(data, pos) {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        data.forEach(function(element) {
            element.distance = this.calcDistance(
                lat,
                lon,
                element.address.lat,
                element.address.lon
            );
        }, this);

        var sortedData = data.sort((a, b) => {
            if (a.distance < b.distance) {
                return -1;
            }
            if (a.distance > b.distance) {
                return 1;
            }

            return 0;
        });

        return sortedData;
    };

    calcDistance(lat1, lon1, lat2, lon2) {
        if (
            Util.isEmpty(lat1) ||
            Util.isEmpty(lat2) ||
            Util.isEmpty(lon1) ||
            Util.isEmpty(lon2)
        ) {
            return 0;
        }

        var p = 0.017453292519943295; // Math.PI / 180
        var c = Math.cos;
        var a =
            0.5 -
            c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;

        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }

    showHelplineDetails(items) {
        this.props.navigation.navigate('HelplineDetails', {
            item: items,
            navigation: this.props.navigation,
            addToFavourites: this.addToFavourites,
            removeFromFavourites: this.removeFromFavourites,
            parentUpdateMethod: favourites => {
                this.favouritesToggledOnDetails(favourites);
            },
            refreshMethod: () => {
                this.refreshList();
            },
        });
    }

    addToFavourites(id) {
        FavouriteHelplineManager.addToFavourites(id, favourites => {
            if (favourites == null) {
                Alert.alert(
                    'An error occurred while trying to mark that entry as a Favourite. Please try again.'
                );
                favourites = [];
            }

            DataStore.fetchAllData({ favourites: favourites }, mergedData => {
                this.setState(
                    {
                        mergedData: mergedData,
                    },
                    () => {
                        this.refreshList();
                    }
                );
            });
        });
    }

    removeFromFavourites(id) {
        FavouriteHelplineManager.removeFromFavourites(id, favourites => {
            if (favourites == null) {
                favourites = [];
            }

            DataStore.fetchAllData({ favourites: favourites }, mergedData => {
                this.setState(
                    {
                        mergedData: mergedData,
                    },
                    () => {
                        this.refreshList();
                    }
                );
            });
        });
    }

    favouritesToggledOnDetails() {
        DataStore.fetchAllData(null, mergedData => {
            this.setState(
                {
                    mergedData: mergedData,
                },
                () => {
                    this.refreshList();
                }
            );
        });
    }

    refreshList() {
        var allStatesList = ['All States', 'Choose State'];
        var filteredData = this.state.mergedData;

        // Perform initial search
        var searchString = '';
        if (
            this.state !== undefined &&
            !Util.isEmpty(this.state.searchString)
        ) {
            searchString = this.state.searchString.toLowerCase().trim();
        }

        if (!Util.isEmpty(this.state.searchString)) {
            filteredData = filteredData.filter(
                x => x.searchString.indexOf(this.state.searchString) !== -1
            );
        }

        // A state has been selected - filter on that state
        if (allStatesList.indexOf(this.state.selectedState) === -1) {
            filteredData = filteredData.filter(
                x => x.address.state === this.state.selectedState
            );
        }

        // Filtering on Favouries
        if (this.state.isFavouriteFilterOn) {
            filteredData = filteredData.filter(x => x.isFavourite === true);
        }

        this.setState({
            helplineData: filteredData,
        });
    }

    onStateSelected(selectedState) {
        this.setState({ selectedState: selectedState }, () => {
            this.refreshList();
        });
    }

    onStateSelectorPress() {
        DataStore.fetchAllStates(states => {
            states.unshift('All States');

            this.props.navigation.navigate('StateSelector', {
                states: states,
                navigation: this.props.navigation,
                stateSetFunction: selectedState =>
                    this.onStateSelected(selectedState),
            });
        });
    }

    askToAddToContacts(item) {
        Alert.alert(
            'Add a new Contact?',
            'Do you want to add the following contact to your address book: "' +
                item.name +
                '"',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    onPress: () =>
                        ContactManager.addToContacts(
                            item,
                            () => Alert.alert('Contact added successfully'),
                            () =>
                                Alert.alert(
                                    'An error occurred and the contact could not be added'
                                ),
                            () =>
                                Alert.alert(
                                    'You have not given permission to this app to access your contacts. Please do so from the settings before trying again.'
                                )
                        ),
                },
            ],
            { cancelable: true }
        );
    }

    goBack() {
        this.props.navigation.goBack();
    }

    onFavouriteFilterToggle() {
        if (this.state.isFavouriteFilterOn === true) {
            this.setState(
                {
                    helplineData: this.state.mergedData,
                    isFavouriteFilterOn: false,
                    favouriteImage: require('../images/heart-empty-white.png'),
                },
                () => {
                    this.refreshList();
                }
            );
        } else {
            this.setState(
                {
                    helplineData: this.state.mergedData.filter(
                        helpline => helpline.isFavourite === true
                    ),
                    isFavouriteFilterOn: true,
                    favouriteImage: require('../images/heart-full.png'),
                },
                () => {
                    this.refreshList();
                }
            );
        }
    }

    onSearchTapped() {
        this.props.navigation.navigate('Search', {
            navigation: this.props.navigation,
            searchPerformed: searchString => {
                this.onSearchPerformed(searchString);
            },
            searchReset: () => {
                this.onSearchReset();
            },
            searchString: this.state.searchString,
        });
    }

    onSearchPerformed(searchString) {
        var searchImage = require('../images/search.png');
        if (searchString !== '') {
            searchImage = require('../images/search-plus.png');
        }

        this.setState(
            {
                searchString: searchString,
                searchImage: searchImage,
            },
            () => {
                this.refreshList();
            }
        );
    }

    onSearchReset() {
        this.setState(
            {
                searchString: '',
                searchImage: require('../images/search.png'),
            },
            () => {
                this.refreshList();
            }
        );
    }

    renderItem = ({ item, index }) => (
        <HelplineListItem
            addToFavouritesFunction={this.addToFavourites.bind(this, item.id)}
            removeFromFavouritesFunction={this.removeFromFavourites.bind(
                this,
                item.id
            )}
            addToContactsFunction={this.askToAddToContacts.bind(this, item)}
            loadHelplineDetails={this.showHelplineDetails.bind(this, item)}
            item={item}
            index={index}
        />
    );

    static navigationOptions = {
        header: null,
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.navBar}>
                    <View style={styles.titleBar} />
                    <View style={styles.topBar}>
                        <TouchableOpacity
                            onPress={this.goBack.bind(this)}
                            style={styles.backButton}
                        >
                            <Image
                                style={[
                                    styles.defaultHeaderIconDimensions,
                                    styles.backButtonImage,
                                ]}
                                source={require('../images/back-arrow.png')}
                            />
                        </TouchableOpacity>

                        {/* State Selector Button */}
                        <TouchableOpacity
                            onPress={this.onStateSelectorPress.bind(this)}
                            style={styles.stateSelector}
                        >
                            <Text style={styles.stateSelectorText}>
                                {this.state.selectedState}
                            </Text>

                            <Image
                                style={styles.stateSelectorArrow}
                                source={require('../images/caret-right.png')}
                            />
                        </TouchableOpacity>

                        <View style={styles.cornerButtons}>
                            {/* Heart Toggle Button */}
                            <TouchableOpacity
                                onPress={this.onFavouriteFilterToggle.bind(
                                    this
                                )}
                                style={styles.heartToggleButton}
                            >
                                <Image
                                    style={[
                                        styles.defaultHeaderIconDimensions,
                                        styles.heartToggleImage,
                                    ]}
                                    source={this.state.favouriteImage}
                                />
                            </TouchableOpacity>

                            {/* Search Button */}
                            <TouchableOpacity
                                style={styles.searchButton}
                                onPress={this.onSearchTapped.bind(this)}
                            >
                                <Image
                                    style={[
                                        styles.defaultHeaderIconDimensions,
                                        styles.searchButtonImage,
                                    ]}
                                    source={this.state.searchImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.helplineList}>
                    <FlatList
                        data={this.state.helplineData}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    navBar: {
        flexShrink: 0,
        flexGrow: 0,
    },
    helplineList: {
        flexShrink: 1,
        flexGrow: 1,
        padding: 5,
    },
    topBar: {
        padding: 5,
        backgroundColor: '#27ae60',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
    },
    backButtonImage: {
        width: 20,
        height: 20,
    },
    titleBar: {
        backgroundColor: '#e6e7e8',
        height: Platform.OS === 'ios' ? 20 : 0,
    },
    heartToggleButton: {},
    defaultHeaderIconDimensions: {
        width: 32,
        height: 32,
    },
    heartToggleImage: {},
    stateSelector: {
        flexDirection: 'row',
        backgroundColor: '#93c47d',
        borderRadius: 3,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 36,
    },
    stateSelectorText: {
        color: '#fff',
        fontSize: 12,
    },
    stateSelectorArrow: {
        width: 12,
        height: 12,
        opacity: 1,
        marginLeft: 5,
    },
    searchButton: {
        marginLeft: 20,
    },
    searchButtonImage: {},
    cornerButtons: {
        flexDirection: 'row',
    },
});

export default HelplineList;
