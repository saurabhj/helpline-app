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
    FlatList,
} from 'react-native';

import { NavigationActions, StackNavigator } from 'react-navigation';

import ContactManager from '../Utils/ContactsManager';
import UserImage from '../Components/UserImage';
import Utils from '../Utils/Utils';
import ContactListItem from '../Components/ContactListItem';
import EmergencyContacts from '../Utils/EmergencyContactManager';

const contactItemBgColor = ['#f7f7f7', '#e6e7e8'];

class ContactList extends Component {
    static navigationOptions = {
        title: 'Select a Contact',
        headerStyle: {
            backgroundColor: '#27ae60',
        },
        headerTintColor: '#fff',
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            filter: '',
            allContacts: [],
            filteredContacts: [],
        };

        ContactManager.fetchAllContacts(contacts => {
            if (contacts != null) {
                this.setState({
                    allContacts: contacts,
                    filteredContacts: contacts,
                });
            } else {
                Alert.alert(
                    'An error occurred and we could not fetch contacts from your device'
                );
            }
        });
    }

    keyExtractor = (item, index) => index;

    clearFilter() {
        this.setState({ filter: '', filteredContacts: this.state.allContacts });
    }

    filterContacts(text) {
        text = text.toLowerCase();

        var filteredContacts = this.state.allContacts
            .filter(
                x =>
                    x.completeName.indexOf(text) != -1
            )
            .sort(ContactManager.compareContacts);

        this.setState({
            filter: text,
            filteredContacts: filteredContacts,
        });
    }

    onSelectContact(contact) {
        const { state } = this.props.navigation;

        if (contact.phoneNumbers.length == 0) {
            Alert.alert(
                'This contact does not have any phone numbers and hence cannot be added to your Emergency Contacts.'
            );
            return;
        }

        // Checking if the contact has multiple phone numbers
        if (contact.phoneNumbers.length > 1) {
            this.props.navigation.navigate('ContactDetails', {
                item: contact,
                navigation: this.props.navigation,
                contactPriority: state.params.contactPriority,
            });
        } else {
            // Contact has only 1 phone number - directly add to the Emergency Contact List
            const contactPriority = state.params.contactPriority;

            const phoneNumber = contact.phoneNumbers[0].number;
            const contactName = Utils.constructName(contact.givenName, contact.familyName);
            const thumbnail = contact.hasThumbnail ? contact.thumbnailPath : '';

            EmergencyContacts.saveContact(
                contactName,
                phoneNumber,
                thumbnail,
                contactPriority,
                contacts => {
                    if (contacts !== null) {
                        // The contact was saved correctly - move back to Settings screen
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
    }

    renderItem = ({ item, index }) => (
        <ContactListItem
            selectContact={this.onSelectContact.bind(this, item)}
            item={item}
            index={index}
            backgroundColor={contactItemBgColor[index % 2]}
        />
    );

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.filterBoxContainer}>
                    <TextInput
                        style={styles.searchTextbox}
                        onChangeText={this.filterContacts.bind(this)}
                        value={this.state.filter}
                    />
                    <TouchableOpacity
                        onPress={this.clearFilter.bind(this)}
                        style={styles.filterTextboxResetButton}
                    >
                        <Image
                            source={require('../images/cross-gray.png')}
                            style={styles.filterTextboxResetButtonImage}
                        />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={this.state.filteredContacts}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    filterBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    searchTextbox: {
        flexGrow: 1,
        flexShrink: 1,
    },
    filterTextboxResetButton: {
        width: 32,
        flexGrow: 0,
        flexShrink: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterTextboxResetButtonImage: {
        width: 20,
        height: 20,
    },
});

export default ContactList;
