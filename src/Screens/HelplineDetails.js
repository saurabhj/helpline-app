'use strict';

import React, { Component } from 'react';

import {
    Alert,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    TouchableHighlight,
    TouchableOpacity,
    Share,
    Platform,
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import Communications from 'react-native-communications';
import ContactManager from '../Utils/ContactsManager';
import FavouriteHelplineManager from '../Utils/FavouriteHelplineManager';

const _showPhoneCallAlert = false;
var _phoneNumberToCall = null;

const _favIconEmpty = require('../images/heart-empty-white.png');
const _favIconFull = require('../images/heart-full.png');
const _feedbackEmail = 'feedback@mhtech.in';

class HelplineDetails extends Component {
    constructor(props, context) {
        super(props, context);
        _phoneNumberToCall = this.props.navigation.state.params.item
            .phone_numbers[0];

        const { state } = this.props.navigation;

        this.state = {
            isFavourite: state.params.item.isFavourite,
            favouriteIcon: state.params.item.isFavourite
                ? _favIconFull
                : _favIconEmpty,
        };
    }

    static navigationOptions = {
        header: null,
    };

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

    shareDetailsWithFriend() {
        const { state } = this.props.navigation;

        var message = [
            state.params.item.name,
            '',
            'Timing:',
            state.params.item.timing.description,
            '',
            'Phone Numbers:',
            state.params.item.phone_numbers.join(', '),
            '',
            'Address',
            state.params.item.address.street,
            state.params.item.address.city,
            state.params.item.address.state +
                ' ' +
                state.params.item.address.pin_code,
            state.params.item.address.country,
            '',
            'Map:',
            state.params.item.address.map_url,
            '',
            'Emails:',
            state.params.item.emails.join(', '),
            '',
            'Websites:',
            state.params.item.websites.join(', '),
            '',
            'Mode of Contact',
            state.params.item.mode_of_contact.join(', '),
        ].join('\n');

        Share.share({
            message: message,
            title: 'Share details with a friend',
        });
    }

    toggleFavourite(id) {
        const { state } = this.props.navigation;

        if (this.state.isFavourite) {
            FavouriteHelplineManager.removeFromFavourites(id, favourites => {
                this.setState({
                    isFavourite: false,
                    favouriteIcon: _favIconEmpty,
                });
            });
        } else {
            FavouriteHelplineManager.addToFavourites(id, favourites => {
                this.setState({
                    isFavourite: true,
                    favouriteIcon: _favIconFull,
                });
            });
        }
    }

    giveHelplineFeedback(item) {
        Communications.email(
            [_feedbackEmail],
            null,
            null,
            'Feedback for: ' + item.name,
            [
                'Feedback for: ' + item.name,
                'Id: ' + item.id,
                '--------------------',
                'Please type your feedback with this helpline from here on:',
            ].join('\n')
        );
    }

    goBack() {
        const { state } = this.props.navigation;

        this.props.navigation.goBack();
        state.params.parentUpdateMethod();
    }

    callHelplineNumber() {
        this.props.callHelplineNumber();
    }

    render() {
        const { state } = this.props.navigation;

        return (
            <View style={styles.container}>
                {/* Nav bar */}
                <View style={styles.navBarContainer}>
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

                        <Text style={styles.titleText}>Helpline Details</Text>

                        <TouchableOpacity
                            onPress={this.callHelplineNumber.bind(this)}
                            style={styles.emergencyCallButton}
                        >
                            <Image
                                source={require('../images/call-square-white.png')}
                                style={styles.defaultHeaderIconDimensions}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sub Nav bar */}
                <View style={styles.subBar}>
                    <Text style={styles.helplineName}>
                        {state.params.item.name}
                    </Text>
                    <TouchableOpacity
                        onPress={this.toggleFavourite.bind(
                            this,
                            state.params.item.id
                        )}
                        style={styles.heartButton}
                    >
                        <Image
                            style={styles.heartButtonImage}
                            source={this.state.favouriteIcon}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.helplineDetails}>
                    {/* Helpline Number */}
                    <View style={styles.detailsRow}>
                        <Image
                            style={styles.detailsIcon}
                            source={require('../images/call-black.png')}
                        />

                        <View style={styles.detailsColumn}>
                            {state.params.item.phone_numbers.map(function(
                                phone,
                                i
                            ) {
                                return (
                                    <TouchableOpacity
                                        onPress={() =>
                                            Communications.phonecall(
                                                phone,
                                                _showPhoneCallAlert
                                            )}
                                    >
                                        <Text
                                            style={[
                                                styles.phoneNumber,
                                                styles.detailsText,
                                                styles.clickable,
                                            ]}
                                        >
                                            {phone}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Timings */}
                    <View style={styles.detailsRow}>
                        <Image
                            style={styles.detailsIcon}
                            source={require('../images/clock-black.png')}
                        />
                        <View style={styles.detailsColumn}>
                            <Text style={styles.detailsText}>
                                {state.params.item.timing.description}
                            </Text>
                        </View>
                    </View>

                    {/* Address */}
                    <View style={styles.detailsRow}>
                        <Image
                            style={styles.detailsIcon}
                            source={require('../images/map-marker-black.png')}
                        />
                        <View style={styles.detailsColumn}>
                            <Text style={styles.detailsText}>
                                {state.params.item.address.street}
                            </Text>
                            <Text style={styles.detailsText}>
                                {state.params.item.address.city}
                            </Text>
                            <Text style={styles.detailsText}>
                                {state.params.item.address.state}{' '}
                                {state.params.item.address.pin_code}
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    Communications.web(
                                        state.params.item.address.map_url
                                    )}
                            >
                                <Text
                                    style={[
                                        styles.detailsText,
                                        styles.clickable,
                                    ]}
                                >
                                    Show on Map
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Meeting Options */}
                    <View style={styles.detailsRow}>
                        <Image
                            style={styles.detailsIcon}
                            source={require('../images/handshake-black.png')}
                        />
                        <View style={styles.detailsColumn}>
                            <Text style={styles.detailsText}>
                                {state.params.item.mode_of_contact.map(function(
                                    meetingType,
                                    i
                                ) {
                                    return (
                                        <Text>
                                            {i > 0 ? ', ' : ''}
                                            {meetingType}
                                        </Text>
                                    );
                                })}
                            </Text>
                        </View>
                    </View>

                    {/* Emails */}
                    <View style={styles.detailsRow}>
                        <Image
                            style={styles.detailsIcon}
                            source={require('../images/envelope-black.png')}
                        />
                        <View style={styles.detailsColumn}>
                            {state.params.item.emails.map(function(email, i) {
                                return (
                                    <TouchableOpacity
                                        onPress={() =>
                                            Communications.email(
                                                [email],
                                                null,
                                                null,
                                                null,
                                                null
                                            )}
                                    >
                                        <Text
                                            style={[
                                                styles.detailsText,
                                                styles.clickable,
                                            ]}
                                        >
                                            {email}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Website */}
                    <View style={styles.detailsRow}>
                        <Image
                            style={styles.detailsIcon}
                            source={require('../images/globe-black.png')}
                        />
                        <View style={styles.detailsColumn}>
                            {state.params.item.websites.map(function(
                                website,
                                i
                            ) {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            Communications.web(website);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.detailsText,
                                                styles.clickable,
                                            ]}
                                        >
                                            {website}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>

                <View style={styles.interactionButtons}>
                    {/* Call Now Button */}
                    <TouchableOpacity
                        onPress={() => {
                            Communications.phonecall(
                                state.params.item.phone_numbers[0],
                                _showPhoneCallAlert
                            );
                        }}
                        style={[styles.interactionButton, styles.callNowButton]}
                    >
                        <Image
                            style={styles.callNowImage}
                            source={require('../images/call-white.png')}
                        />
                        <Text style={styles.callNowText}>Call Now!</Text>
                    </TouchableOpacity>

                    {/* Share with Friend Button */}
                    <TouchableOpacity
                        onPress={this.shareDetailsWithFriend.bind(this)}
                        style={[
                            styles.interactionButton,
                            styles.shareWithFriendButton,
                        ]}
                    >
                        <Image
                            style={styles.shareWithFriendImage}
                            source={require('../images/share-white.png')}
                        />
                        <Text style={styles.shareWithFriendText}>
                            Share with a friend
                        </Text>
                    </TouchableOpacity>

                    {/* Add to my contacts button */}
                    <TouchableOpacity
                        onPress={this.askToAddToContacts.bind(
                            this,
                            state.params.item
                        )}
                        style={[
                            styles.interactionButton,
                            styles.addToMyContactsButton,
                        ]}
                    >
                        <Image
                            style={styles.addToMyContactsImage}
                            source={require('../images/user-add-white.png')}
                        />
                        <Text style={styles.addToMyContactsText}>
                            Add to my contacts
                        </Text>
                    </TouchableOpacity>

                    {/* Feedback for Helpline button */}
                    <TouchableOpacity
                        onPress={this.giveHelplineFeedback.bind(
                            this,
                            state.params.item
                        )}
                        style={[
                            styles.interactionButton,
                            styles.giveHelplineFeedbackButton,
                        ]}
                    >
                        <Image
                            style={styles.giveHelplineFeedbackImage}
                            source={require('../images/feedback-white.png')}
                        />
                        <Text style={styles.giveHelplineFeedbackText}>
                            Give feedback on this helpline
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'stretch',
    },

    navBarContainer: {},
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
    defaultHeaderIconDimensions: {
        width: 32,
        height: 32,
    },
    titleText: {
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 22,
        fontWeight: '600',
        color: '#fff',
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

    subBar: {
        padding: 5,
        backgroundColor: '#93c47d',
        flexDirection: 'row',
        alignItems: 'center',
    },
    helplineName: {
        color: '#fff',
        fontWeight: '600',
        flexGrow: 1,
        flexShrink: 1,
    },
    heartButton: {
        paddingLeft: 5,
        paddingRight: 5,
        flexGrow: 0,
        flexShrink: 0,
        justifyContent: 'center',
    },
    heartButtonImage: {
        height: 24,
        width: 24,
    },
    helplineDetails: {
        backgroundColor: '#e6e7e8',
        paddingBottom: 20,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingTop: 15,
    },
    detailsIcon: {
        width: 16,
        height: 16,
        marginRight: 20,
    },
    detailsColumn: {
        flexDirection: 'column',
        paddingRight: 50,
    },
    detailsText: {
        fontWeight: '600',
        fontSize: 12,
        alignSelf: 'flex-start',
    },
    interactionButtons: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    interactionButton: {
        width: 300,
        marginBottom: 10,
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    callNowButton: {
        height: 40,
        backgroundColor: '#27ae60',
        marginTop: 20,
    },
    callNowImage: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    callNowText: {
        fontWeight: '600',
        fontSize: 18,
        color: '#fff',
    },
    shareWithFriendButton: {
        height: 30,
        backgroundColor: '#0080ff',
        marginTop: 0,
    },
    shareWithFriendImage: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    shareWithFriendText: {
        fontSize: 14,
        color: '#fff',
    },
    addToMyContactsButton: {
        height: 30,
        backgroundColor: '#0080ff',
        marginTop: 0,
    },
    addToMyContactsImage: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    addToMyContactsText: {
        fontSize: 14,
        color: '#fff',
    },
    clickable: {
        color: '#0080ff',
        textDecorationLine: 'underline',
    },
    phoneNumber: {
        marginBottom: 5,
    },
    giveHelplineFeedbackButton: {
        height: 30,
        backgroundColor: '#0080ff',
        marginTop: 0,
    },
    giveHelplineFeedbackImage: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    giveHelplineFeedbackText: {
        fontSize: 14,
        color: '#fff',
    },
});

export default HelplineDetails;
