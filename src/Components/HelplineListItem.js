'use strict';

import React, { Component } from 'react';
import {
    Alert,
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    FlatList,
    Text,
    TouchableOpacity,
} from 'react-native';

import Communications from 'react-native-communications';
import Utils from '../Utils/Utils';

const _favIconEmpty = require('../images/heart-empty-red.png');
const _favIconFull = require('../images/heart-full.png');

class HelplineListItem extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isFavourite: this.props.item.isFavourite,
            favouriteIcon: this.props.item.isFavourite
                ? _favIconFull
                : _favIconEmpty,
        };
    }

    loadHelplineDetails() {
        this.props.loadHelplineDetails();
    }

    callPhoneNumber(phoneNumber) {
        Communications.phonecall(phoneNumber, false);
    }

    addToContactsFunction() {
        this.props.addToContactsFunction();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.item.isFavourite !== nextProps.item.isFavourite) {
            this.setState({
                isFavourite: nextProps.item.isFavourite,
                favouriteIcon: nextProps.item.isFavourite
                    ? _favIconFull
                    : _favIconEmpty,
            });
        }
    }

    toggleFavourites() {
        if (this.state.isFavourite) {
            this.setState({ isFavourite: false, favouriteIcon: _favIconEmpty });
            this.props.removeFromFavouritesFunction();
        } else {
            this.setState({ isFavourite: true, favouriteIcon: _favIconFull });
            this.props.addToFavouritesFunction();
        }
    }

    render() {
        var heartFunction = this.addToFavourites;

        if (this.state.isFavourite) {
            heartFunction = this.removeFromFavourites;
        }

        var cityState = this.props.item.address.state;
        if (!Utils.isEmpty(this.props.item.address.city)) {
            cityState =
                this.props.item.address.city +
                ', ' +
                this.props.item.address.state;
        }

        var timing = 'Operating time not available';
        if (!Utils.isEmpty(this.props.item.timing.description)) {
            timing = this.props.item.timing.description;
        }

        return (
            <TouchableHighlight
                underlayColor={'#ffbf00'}
                onPress={this.loadHelplineDetails.bind(this)}
                style={styles.container}
            >
                <View>
                    <View style={styles.headerContainer}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            style={styles.helplineName}
                        >
                            {this.props.item.name}
                        </Text>
                        <TouchableOpacity
                            onPress={this.toggleFavourites.bind(this)}
                            style={styles.heartIcon}
                        >
                            <Image
                                source={this.state.favouriteIcon}
                                style={styles.heartIconImage}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.helplineDetails}>
                        <View style={styles.helplineTimings}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                                style={styles.helplineTimingText}
                            >
                                {timing}
                            </Text>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                                style={styles.helplineTimingText}
                            >
                                {cityState}
                            </Text>
                        </View>
                        <View style={styles.helplineIcons}>
                            <TouchableOpacity
                                onPress={this.addToContactsFunction.bind(this)}
                                style={styles.addToAddressBookButton}
                            >
                                <Image
                                    style={styles.addToAddressBookImage}
                                    source={require('../images/user-add-blue.png')}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={this.callPhoneNumber.bind(
                                    this,
                                    this.props.item.phone_numbers[0]
                                )}
                                style={styles.callHelplineButton}
                            >
                                <Image
                                    style={styles.callHelplineButtonImage}
                                    source={require('../images/call-square-green.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderColor: '#000',
        borderWidth: 1,
        borderStyle: 'solid',
        marginBottom: 5,
        backgroundColor: '#ffffff',
    },
    headerContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#747575',
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 6,
    },
    helplineName: {
        fontWeight: '600',
        fontSize: 14,
        alignSelf: 'flex-start',
        flexGrow: 1,
        flexShrink: 1,
    },
    heartIcon: {
        alignSelf: 'flex-end',
        flexGrow: 0,
        flexShrink: 0,
    },
    heartIconImage: {
        width: 16,
        height: 16,
    },
    helplineTimings: {
        flexGrow: 1,
        flexShrink: 1,
        alignSelf: 'flex-start',
    },
    helplineDetails: {
        paddingTop: 4,
        flex: 1,
        flexDirection: 'row',
    },
    helplineTimingText: {
        fontSize: 10,
    },
    helplineIcons: {
        flexDirection: 'row',
        flexGrow: 0,
        flexShrink: 0,
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    addToAddressBookButton: {
        marginRight: 10,
    },
    addToAddressBookImage: {
        width: 24,
        height: 24,
    },
    callHelplineButton: {},
    callHelplineButtonImage: {
        width: 24,
        height: 24,
    },
});

export default HelplineListItem;
