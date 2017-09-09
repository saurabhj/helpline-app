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
} from 'react-native';

import { NavigationActions, StackNavigator } from 'react-navigation';
import Util from '../Utils/Utils';

class Search extends Component {
    constructor(props, context) {
        super(props, context);

        const { state } = this.props.navigation;

        this.state = {
            text: '',
        };

        if(!Util.isEmpty(state.params.searchString)) {
            this.setState( {
                searchString: state.params.searchString,
            })
        }
    }

    static navigationOptions = {
        title: 'Search',
        headerStyle: {
            backgroundColor: '#27ae60',
        },
        headerTintColor: '#fff',
    };

    onSearch() {
        const { state } = this.props.navigation;
        
        state.params.searchPerformed(this.state.text.toLowerCase());
        this.props.navigation.goBack();
    }

    onReset() {
        this.setState({
            text: '',
        });

        const { state } = this.props.navigation;
        
        state.params.searchReset();
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleBar} />
                <View style={styles.searchTextboxContainer}>
                    <TextInput
                        style={styles.searchTextbox}
                        onChangeText={text => this.setState({ text: text })}
                        value={this.state.text}
                    />
                    <TouchableOpacity
                        onPress={this.onSearch.bind(this)}
                        style={styles.searchButton}
                    >
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.onReset.bind(this)}
                        style={styles.resetButton}
                    >
                        <Text style={styles.resetButtonText}>Reset</Text>
                    </TouchableOpacity>
                </View>
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
    searchTextboxContainer: {},
    searchButton: {
        height: 40,
        backgroundColor: '#0080ff',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        fontSize: 14,
        color: '#fff',
    },
    resetButton: {
        height: 40,
        backgroundColor: '#747575',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetButtonText: {
        fontSize: 14,
        color: '#fff',
    },
});

export default Search;
