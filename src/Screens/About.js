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

const _githubUrl = 'https://github.com/saurabhj/helpline-app';
const _feedbackEmail = 'feedback@mhtech.in';

class About extends Component {
    constructor(props, context) {
        super(props, context);
    }

    static navigationOptions = {
        title: 'About Us',
        headerStyle: {
            backgroundColor: '#27ae60',
        },
        headerTintColor: '#fff',
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.titleBar} />
                    <View style={styles.aboutUsContainer}>
                        <Text style={styles.textHeader}>About Us</Text>
                        <Text style={styles.textBody}>
                            Mental Health Technologies, is an informal venture
                            by an enthusiastic trio of a developer, a consultant
                            psychiatrist and an academic psychiatrist with
                            belief in the dream of utilizing technological
                            prowess for advancing mental health. {'\n'}
                            {'\n'}
                            This is our first app in the ongoing process of
                            realizing our dream. It's free in it's truest sense.
                            {'\n'}
                            {'\n'}
                            Source code is available under the MIT Open Source
                            License on:
                        </Text>
                        <TouchableHighlight
                            onPress={() => Communications.web(_githubUrl)}
                        >
                            <Text style={styles.hyperlink}>Github</Text>
                        </TouchableHighlight>
                        <Text style={styles.textBody}>
                            {'\n'}
                            Please share any feedback that you may have at:
                        </Text>
                        <TouchableHighlight
                            onPress={() =>
                                Communications.email(
                                    [_feedbackEmail],
                                    null,
                                    null,
                                    'Feedback on Emotional Support Helpline Directory App',
                                    ''
                                )}
                        >
                            <Text style={styles.hyperlink}>
                                {_feedbackEmail}
                            </Text>
                        </TouchableHighlight>
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

export default About;
