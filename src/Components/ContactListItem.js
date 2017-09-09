'use strict';

import React, { Component } from 'react';
import {
    Alert,
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    FlatList,
    Text,
    TouchableOpacity,
} from 'react-native';

import UserImage from '../Components/UserImage';
import Utils from '../Utils/Utils';

class ContactListItem extends Component {
    constructor(props, context) {
        super(props, context);
    }

    onSelectContact(contact) {
        this.props.selectContact(contact);
    }

    render() {
        var contactName = Utils.constructName(this.props.item.givenName, this.props.item.familyName);

        const thumbnail = this.props.item.hasThumbnail
            ? this.props.item.thumbnailPath
            : '';
        const bgColor = this.props.backgroundColor;

        return (
            <TouchableOpacity
                onPress={this.onSelectContact.bind(this, this.props.item)}
                style={[styles.container, { backgroundColor: bgColor }]}
            >
                <UserImage name={contactName} imageUrl={thumbnail} size={50} />
                <Text
                    style={styles.contactName}
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                >
                    {contactName}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 8,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactName: {
        fontSize: 16,
        paddingLeft: 10,
    },
});

export default ContactListItem;
