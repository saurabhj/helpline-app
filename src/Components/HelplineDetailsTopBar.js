'use strict';

import React, { Component } from 'react';

import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    TouchableHighlight,
    TouchableOpacity,
    Picker,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Communications from 'react-native-communications';

const _showPhoneCallAlert = false;

class HelplineDetailsTopBar extends Component {
    goBack() {
        this.props.navigation.goBack();
        this.props.listRefreshMethod();
    }

    callHelplineNumber() {
        this.props.callHelplineNumber();
    }

    render() {
        return (
            <View style={styles.container}>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {},
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
});

export default HelplineDetailsTopBar;
