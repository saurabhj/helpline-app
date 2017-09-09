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
    FlatList,
} from 'react-native';

class StateSelector extends Component {
    keyExtractor = (item, index) => index;

    constructor(props, context) {
        super(props, context);
    }

    static navigationOptions = {
        title: 'State Selector',
        headerStyle: {
            backgroundColor: '#27ae60',
        },
        headerTintColor: '#fff',
    };

    renderItem = ({ item, index }) => {
        return (
            <TouchableHighlight
                onPress={this.stateSelected.bind(this, item)}
                underlayColor={'gold'}
                style={styles.stateSelectorRow}
            >
                <Text style={styles.stateSelectorText}>
                    {item}
                </Text>
            </TouchableHighlight>
        );
    };

    stateSelected(selectedState) {
        const { state } = this.props.navigation;

        state.params.stateSetFunction(selectedState);
        this.props.navigation.goBack();
    }

    render() {
        const { state } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={styles.titleBar} />
                <FlatList
                    data={state.params.states}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    titleBar: {
        backgroundColor: '#e6e7e8',
        height: Platform.OS === 'ios' ? 20 : 0,
    },
    stateSelectorRow: {
        paddingTop: 10,
        paddingBottom: 10,
        padding: 5,
    },
    stateSelectorText: {
        color: '#000',
        fontSize: 20,
    },
});

export default StateSelector;
