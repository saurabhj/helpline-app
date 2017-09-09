'use strict';

import React, { Component } from 'react';

import { AppRegistry } from 'react-native';

import { StackNavigator } from 'react-navigation';

import HomeScreen from './Screens/Home';
import SettingsScreen from './Screens/Settings';
import HelplineDetailsScreen from './Screens/HelplineDetails';
import HelplineListScreen from './Screens/HelplineList';
import ContactListScreen from './Screens/ContactList';
import ContactDetailsScreen from './Screens/ContactDetails';
import StateSelectorScreen from './Screens/StateSelector';
import SearchScreen from './Screens/Search';
import DisclaimerScreen from './Screens/Disclaimer';
import AboutScreen from './Screens/About';

const HelplineApp = StackNavigator(
    {
        ContactList: { screen: ContactListScreen },
        Home: { screen: HomeScreen },
        ContactDetails: { screen: ContactDetailsScreen },
        Settings: { screen: SettingsScreen },
        HelplineListScreen: { screen: HelplineListScreen },
        HelplineDetails: { screen: HelplineDetailsScreen },
        StateSelector: { screen: StateSelectorScreen },
        Search: { screen: SearchScreen },
        Disclaimer: { screen: DisclaimerScreen },
        About: { screen: AboutScreen },
    },
    {
        initialRouteName: 'Home',
    }
);

AppRegistry.registerComponent('HelplineApp', () => HelplineApp);
