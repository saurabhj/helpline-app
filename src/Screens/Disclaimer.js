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
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Communications from 'react-native-communications';

class Disclaimer extends Component {
    constructor(props, context) {
        super(props, context);
    }

    static navigationOptions = {
        title: 'Disclaimer',
        headerStyle: {
            backgroundColor: '#27ae60',
        },
        headerTintColor: '#fff',
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleBar} />
                <ScrollView>
                    <View style={styles.disclaimerContainer}>
                        <Text style={styles.textHeader}>Disclaimer</Text>
                        <Text style={styles.textBody}>
                            Mental Health Technologies ("MHTech") - the
                            makers of the app, Emotional Support Helpline
                            Directory - are not in the business of providing
                            counselling services and do not own, operate or
                            control the helpline numbers listed in the app.{' '}
                            {'\n'}
                            {'\n'}
                            The helpline numbers are listed for referral
                            purposes only, and MHTech does not make any
                            recommendations or guarantees regarding the quality
                            of response and medical advice you might receive
                            from any of the helplines.
                            {'\n'}
                            {'\n'}
                            MHTech does not endorse these helplines and makes
                            no representations, warranties or guarantees as to,
                            and assumes no responsibility for, the services
                            provided by these entities. {'\n'}
                            {'\n'}
                            MHTech disclaims all liability for damages of any
                            kind arising out of calls made to these helpline
                            numbers.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    titleBar: {
        backgroundColor: '#e6e7e8',
        height: Platform.OS === 'ios' ? 20 : 0,
    },
    aboutUsContainer: {},
    textHeader: {
        fontWeight: '600',
        fontSize: 24,
        marginBottom: 10,
    },
    textBody: {
        fontSize: 16,
        textAlign: 'justify',
    },
    hyperlink: {
        color: '#0080ff',
        textDecorationLine: 'underline',
    },
});

export default Disclaimer;
