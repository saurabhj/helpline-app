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
    TouchableOpacity,
    AsyncStorage,
    Alert,
    Platform,
    ScrollView,
    Share,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Communications from 'react-native-communications';

import DataStore from '../Data/DataStore';
import EmergencyContacts from '../Utils/EmergencyContactManager';
import EmergencyContactSetting from '../Components/EmergencyContactSetting';

const _feedbackEmail = 'feedback@mhtech.in';
const _appWebsite = 'https://mhtech.in';

class Settings extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            emergencyContacts: EmergencyContacts.getEmptyContacts(),
            currentDataVersion: '1.00',
        };

        EmergencyContacts.fetchContacts(result => {
            this.setState({ emergencyContacts: result });
        });

        DataStore.getOfflineDataVersion(version => {
            this.setState({ currentDataVersion: version.toString() });
        });
    }

    static navigationOptions = {
        title: 'Settings',
        headerStyle: {
            backgroundColor: '#27ae60',
        },
        headerTintColor: '#fff',
    };

    onContactTouch(contactPriority) {
        this.props.navigation.navigate('ContactList', {
            navigation: this.props.navigation,
            contactPriority: contactPriority,
        });
    }

    onDelete(contactPriority) {
        EmergencyContacts.deleteContact(contactPriority, contacts => {
            if (contacts !== null) {
                this.setState({
                    emergencyContacts: contacts,
                });
            } else {
                Alert.alert(
                    'An error occurred while trying to remove the emergency contact. Please try again.'
                );
            }
        });
    }

    factoryResetData() {
        Alert.alert(
            'Factory Reset Data?',
            'Performing a factory reset will clear out all your favourite helplines and emergency contacts and restore the helpline data to the version shipped with the app.',
            [
                {
                    text: 'Reset',
                    onPress: () => {
                        AsyncStorage.clear(error => {
                            this.setState({
                                emergencyContacts: EmergencyContacts.getEmptyContacts(),
                                currentDataVersion: '1.00',
                            });

                            Alert.alert(
                                'Data reset successfully',
                                'All data has been reset to factory settings.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            const { navigation } = this.props;
                                            navigation.goBack();
                                            navigation.state.params.onFactoryReset();
                                        },
                                    },
                                ]
                            );
                        });
                    },
                },
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
            ],
            { cancelable: true }
        );
    }

    shareAppDownload() {
        var message = [
            'Hey,',
            'I wanted to share this app with you which contains a directory of Emotional Support Helplines from all over India.',
            '',
            'Download it from: https://mhtech.in',
        ].join('\n');

        Share.share({
            message: message,
            title: 'Share details with a friend',
        });
    }

    giveAppFeedback() {
        Communications.email(
            [_feedbackEmail],
            null,
            null,
            'Feedback: Emotional Support Helpline Directory',
            ['Platform: ' + Platform.OS, '-----', ''].join('\n')
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.screenDetails}>
                        <Text>
                            Select up to 4 contacts that you would like to add
                            as your emergency contact group.
                        </Text>
                    </View>
                    <View style={styles.emergencyContacts}>
                        <EmergencyContactSetting
                            onDelete={this.onDelete.bind(this, 0)}
                            onPress={this.onContactTouch.bind(this, 0)}
                            name={this.state.emergencyContacts[0].name}
                            phoneNumber={this.state.emergencyContacts[0].number}
                            imageUrl={this.state.emergencyContacts[0].photo}
                            backgroundColor="#fff"
                        />

                        <EmergencyContactSetting
                            onDelete={this.onDelete.bind(this, 1)}
                            onPress={this.onContactTouch.bind(this, 1)}
                            name={this.state.emergencyContacts[1].name}
                            phoneNumber={this.state.emergencyContacts[1].number}
                            imageUrl={this.state.emergencyContacts[1].photo}
                            backgroundColor="#fff"
                        />

                        <EmergencyContactSetting
                            onDelete={this.onDelete.bind(this, 2)}
                            onPress={this.onContactTouch.bind(this, 2)}
                            name={this.state.emergencyContacts[2].name}
                            phoneNumber={this.state.emergencyContacts[2].number}
                            imageUrl={this.state.emergencyContacts[2].photo}
                            backgroundColor="#fff"
                        />

                        <EmergencyContactSetting
                            onDelete={this.onDelete.bind(this, 3)}
                            onPress={this.onContactTouch.bind(this, 3)}
                            name={this.state.emergencyContacts[3].name}
                            phoneNumber={this.state.emergencyContacts[3].number}
                            imageUrl={this.state.emergencyContacts[3].photo}
                            backgroundColor="#fff"
                        />
                    </View>
                    <View style={styles.feedbackButtonsContainer}>
                        <TouchableOpacity
                            onPress={this.shareAppDownload.bind(this)}
                            style={styles.feedbackButton}
                        >
                            <Image
                                style={styles.feedbackButtonIcon}
                                source={require('../images/share-white.png')}
                            />
                            <Text style={styles.feedbackButtonText}>
                                Share App Download Link
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.giveAppFeedback.bind(this)}
                            style={styles.feedbackButton}
                        >
                            <Image
                                style={styles.feedbackButtonIcon}
                                source={require('../images/feedback-white.png')}
                            />
                            <Text style={styles.feedbackButtonText}>
                                Give us Feedback
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.feedbackButton}
                            onPress={() =>
                                this.props.navigation.navigate('About')}
                        >
                            <Image
                                style={styles.feedbackButtonIcon}
                                source={require('../images/group-white.png')}
                            />
                            <Text style={styles.feedbackButtonText}>
                                About Us
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.feedbackButton}
                            onPress={() =>
                                this.props.navigation.navigate('Disclaimer')}
                        >
                            <Image
                                style={styles.feedbackButtonIcon}
                                source={require('../images/exclamation-triangle-white.png')}
                            />
                            <Text style={styles.feedbackButtonText}>
                                Disclaimer
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.currentDataVersion}>
                        <Text>
                            Current data version:{' '}
                            {this.state.currentDataVersion}
                        </Text>
                        <TouchableOpacity
                            style={styles.factoryResetLink}
                            onPress={this.factoryResetData.bind(this)}
                        >
                            <Text style={styles.clickableText}>
                                Factory Reset Data
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
    },
    headerStyle: {
        backgroundColor: '#27ae60',
        color: '#fff',
    },
    screenDetails: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    emergencyContacts: {
        marginTop: 20,
    },
    currentDataVersion: {
        marginTop: 10,
        padding: 20,
    },
    clickableText: {
        color: '#0080ff',
        textDecorationLine: 'underline',
    },
    factoryResetLink: {
        marginTop: 5,
    },
    feedbackButtonsContainer: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    feedbackButton: {
        flexDirection: 'row',
        backgroundColor: '#0080ff',
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 3,
        height: 40,
        alignSelf: 'center',
    },
    feedbackButtonText: {
        fontSize: 18,
        color: '#fff',
    },
    feedbackButtonIcon: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
});

export default Settings;
