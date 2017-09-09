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
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import UserImage from '../Components/UserImage';
import Utils from '../Utils/Utils';
import EmergencyContacts from '../Utils/EmergencyContactManager';

class ContactDetails extends Component {
    static navigationOptions = {
        title: 'Contact Details',
        headerStyle: {
            backgroundColor: '#27ae60',
        },
        headerTintColor: '#fff',
    };

    constructor(props, context) {
        super(props, context);
    }

    onPhoneSelected(phoneNumber) {
        const { state } = this.props.navigation;
        const contactPriority = state.params.contactPriority;

        const contactName = Utils.constructName(state.params.item.givenName, state.params.item.familyName);
        const thumbnail = state.params.item.hasThumbnail
            ? state.params.item.thumbnailPath
            : '';

        EmergencyContacts.saveContact(
            contactName,
            phoneNumber,
            thumbnail,
            contactPriority,
            contacts => {
                if (contacts !== null) {
                    //The contact was saved correctly - move back to Settings screen
                    this.props.navigation.dispatch(
                        NavigationActions.reset({
                            index: 1,
                            actions: [
                                NavigationActions.navigate({
                                    routeName: 'Home',
                                }),
                                NavigationActions.navigate({
                                    routeName: 'Settings',
                                }),
                            ],
                        })
                    );
                } else {
                    Alert.alert(
                        'An error occurred while trying to assign this contact number. Please try again.'
                    );
                }
            }
        );
    }

    render() {
        const { state } = this.props.navigation;
        var contactName =
            state.params.item.givenName + ' ' + state.params.item.familyName;

        const thumbnail = state.params.item.hasThumbnail
            ? state.params.item.thumbnailPath
            : '';

        var onPhoneNumberSelected = phoneNumber => {
            this.onPhoneSelected(phoneNumber);
        };

        return (
            <View style={styles.container}>
                <View style={styles.screenDetails}>
                    <Text style={styles.screenDetailsText}>
                        This contact has multiple phone numbers. Please select a
                        number from the list below to add to your emergency
                        list.
                    </Text>
                </View>
                <View style={styles.contactDetails}>
                    <UserImage
                        imageUrl={thumbnail}
                        name={contactName}
                        size={50}
                    />
                    <Text numberOfLines={2} style={styles.contactName}>
                        {contactName}
                    </Text>
                </View>
                <View style={styles.phoneNumbers}>
                    {state.params.item.phoneNumbers.map(function(phone, i) {
                        return (
                            <TouchableOpacity
                                onPress={() =>
                                    onPhoneNumberSelected(phone.number)}
                            >
                                <Text style={styles.label}>
                                    {phone.label}
                                </Text>
                                <Text style={styles.phoneNumber}>
                                    {phone.number}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    screenDetails: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#e6e7e8',
    },
    screenDetailsText: {
        fontSize: 16,
    },
    contactDetails: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    contactName: {
        fontWeight: '600',
        fontSize: 20,
        marginLeft: 10,
        flexGrow: 1,
        flexShrink: 1,
    },
    phoneNumbers: {
        padding: 10,
        marginTop: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    phoneNumber: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '600',
    }
});

export default ContactDetails;
