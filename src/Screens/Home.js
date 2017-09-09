'use strict';

import React, { Component } from 'react';

import {
    Alert,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Platform,
    Button,
    TouchableHighlight,
    TouchableOpacity,
    AsyncStorage,
    NetInfo,
} from 'react-native';

import { NavigationActions, StackNavigator } from 'react-navigation';
import Communications from 'react-native-communications';

import UserImage from '../Components/UserImage';
import EmergencyContacts from '../Utils/EmergencyContactManager';
import DataStorage from '../Data/DataStore';

const Contacts = require('react-native-contacts');

class Home extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            emergencyContacts: EmergencyContacts.getEmptyContacts(),
            currentPos: null,
        };

        if (this.state.currentPos === null) {
            console.log('Getting current pos');
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.setState({
                        currentPos: position,
                    });

                    console.log(JSON.stringify(this.state.currentPos));
                },
                error => { console.log('Could not get location. ' + JSON.stringify(error)) },
                {
                    enableHighAccuracy: false,
                    timeout: 1000,
                    maximumAge: 60000,
                }
            );
        }
    }

    static navigationOptions = {
        header: null,
    };

    onFactoryResetFromSettings() {
        NetInfo.isConnected.fetch().then(isConnected => {
            DataStorage.checkAndUpdateDataFile(status => {
                console.log('Data updated: ' + JSON.stringify(status));
            });
        });
    }

    onSettingsPressed() {
        this.props.navigation.navigate('Settings', {
            onFactoryReset: this.onFactoryResetFromSettings,
        });
    }

    onHelplineDirectoryPressed() {
        this.props.navigation.navigate('HelplineListScreen', {
            currentPos: this.state.currentPos,
        });
    }

    onEmergencyContactPressed(phoneNumber) {
        if (phoneNumber == '') {
            this.props.navigation.navigate('Settings');
        } else {
            Communications.phonecall(phoneNumber, false);
        }
    }

    componentDidMount() {
        this.setState({ mounted: true });
        NetInfo.isConnected.addEventListener(
            'change',
            this._handleConnectivityChange
        );
    }

    componentWillUnmount() {
        this.setState({ mounted: false });
        NetInfo.isConnected.removeEventListener(
            'change',
            this._handleConnectivityChange
        );
    }

    _handleConnectivityChange = isConnected => {
        if (isConnected) {
            DataStorage.checkAndUpdateDataFile(status => {
                console.log('Data updated: ' + JSON.stringify(status));
            });
        }
    };

    render() {
        const userImageSize = 50;

        EmergencyContacts.fetchContacts(result => {
            if (this.state.mounted) {
                this.setState({ emergencyContacts: result });
            }
        });

        return (
            <View style={styles.container}>
                <View style={styles.titleBar} />
                <View style={styles.settingsButtonContainer}>
                    <TouchableOpacity
                        onPress={this.onSettingsPressed.bind(this)}
                    >
                        <Image
                            style={styles.settingsButtonImage}
                            source={require('../images/cog.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logoImage}
                        source={require('../images/logo.png')}
                    />
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.helplineDirectoryButton}
                        onPress={this.onHelplineDirectoryPressed.bind(this)}
                    >
                        <Image
                            style={styles.icon}
                            source={require('../images/map-signs.png')}
                        />

                        <Text style={styles.buttonText}>
                            Helpline Directory
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.emergencyContactContainer}>
                    <Text style={styles.emergencyContactText}>
                        Call my Emergency Contacts
                    </Text>
                    <View style={styles.emergencyContactButtons}>
                        <TouchableOpacity
                            style={styles.emergencyContactButton}
                            onPress={this.onEmergencyContactPressed.bind(
                                this,
                                this.state.emergencyContacts[0].number
                            )}
                        >
                            <UserImage
                                name={this.state.emergencyContacts[0].name}
                                imageUrl={this.state.emergencyContacts[0].photo}
                                size={userImageSize}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.emergencyContactButton,
                                styles.emergencyContactLower,
                            ]}
                            onPress={this.onEmergencyContactPressed.bind(
                                this,
                                this.state.emergencyContacts[1].number
                            )}
                        >
                            <UserImage
                                name={this.state.emergencyContacts[1].name}
                                imageUrl={this.state.emergencyContacts[1].photo}
                                size={userImageSize}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.emergencyContactButton,
                                styles.emergencyContactLower,
                            ]}
                            onPress={this.onEmergencyContactPressed.bind(
                                this,
                                this.state.emergencyContacts[2].number
                            )}
                        >
                            <UserImage
                                name={this.state.emergencyContacts[2].name}
                                imageUrl={this.state.emergencyContacts[2].photo}
                                size={userImageSize}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.emergencyContactButton}
                            onPress={this.onEmergencyContactPressed.bind(
                                this,
                                this.state.emergencyContacts[3].number
                            )}
                        >
                            <UserImage
                                name={this.state.emergencyContacts[3].name}
                                imageUrl={this.state.emergencyContacts[3].photo}
                                size={userImageSize}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },
    titleBar: {
        backgroundColor: '#e6e7e8',
        height: Platform.OS === 'ios' ? 20 : 0,
    },
    settingsButtonContainer: {
        padding: 10,
        alignItems: 'flex-end',
    },
    settingsButtonImage: {
        height: 32,
        width: 32,
    },
    logoContainer: {
        paddingTop: 35,
        alignItems: 'center',
    },
    logoImage: {
        height: 128,
        width: 128,
    },
    buttonsContainer: {
        marginTop: 35,
        alignItems: 'center',
    },
    getHelpNowButton: {
        backgroundColor: '#27ae60',
        flexDirection: 'row',
        borderRadius: 3,
        width: 256,
        justifyContent: 'center',
        padding: 10,
    },
    icon: {
        height: 32,
        width: 32,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
        alignSelf: 'center',
        marginLeft: 10,
    },
    helplineDirectoryButton: {
        marginTop: 12,
        backgroundColor: '#27ae60',
        flexDirection: 'row',
        borderRadius: 3,
        width: 256,
        justifyContent: 'center',
        padding: 10,
    },
    emergencyContactContainer: {
        paddingTop: 50,
    },
    emergencyContactText: {
        fontSize: 16,
        alignSelf: 'center',
    },
    emergencyContactButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingLeft: 45,
        paddingRight: 45,
    },
    emergencyContactButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    emergencyContactImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    emergencyContactLower: {
        marginTop: 30,
    },
});

export default Home;
