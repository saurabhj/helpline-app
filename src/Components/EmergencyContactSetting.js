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
} from 'react-native';

import UserImage from '../Components/UserImage';
import renderIf from '../Utils/RenderIf';

class EmergencyContactSetting extends Component {
    onContactPressed() {
        return this.props.onPress();
    }

    onContactDeleted() {
        return this.props.onDelete();
    }

    render() {
        const bgColor = this.props.backgroundColor.toString();

        var contactName = 'Tap to select a contact';
        var foregroundColor = '#747575';
        var contactAvailable = false;

        if (this.props.name != '' && this.props.name != undefined) {
            contactName = this.props.name;
            foregroundColor = '#000';
            contactAvailable = true;
        }

        return (
            <TouchableOpacity
                style={[styles.container, { backgroundColor: bgColor }]}
                onPress={this.onContactPressed.bind(this)}
            >
                <View style={styles.iconAndName}>
                    <View style={styles.userImage}>
                        <UserImage
                            name={this.props.name}
                            imageUrl={this.props.imageUrl}
                            size={50}
                        />
                    </View>
                    <View style={styles.contactDetails}>
                        <Text
                            numberOfLines={2}
                            ellipsizeMode={'tail'}
                            style={[
                                styles.contactName,
                                { color: foregroundColor },
                            ]}
                        >
                            {contactName}
                        </Text>
                        <Text style={styles.contactPhone}>
                            {this.props.phoneNumber}
                        </Text>
                    </View>
                </View>
                {renderIf(
                    contactAvailable,
                    <TouchableOpacity
                        onPress={this.onContactDeleted.bind(this)}
                        style={styles.deleteButton}
                    >
                        <Image
                            source={require('../images/trash-red.png')}
                            style={styles.deleteButtonImage}
                        />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
    },
    iconAndName: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        flexGrow: 1,
        flexShrink: 1,
    },
    contactDetails: {
        flexGrow: 1,
        flexShrink: 1,
    },
    contactName: {
        fontWeight: '600',
        fontSize: 18,
    },
    contactPhone: {},
    deleteButton: {
        justifyContent: 'flex-end',
        flexGrow: 0,
        flexShrink: 0,
        width: 45,
    },
    deleteButtonImage: {
        justifyContent: 'flex-end',
        width: 32,
        height: 32,
        alignSelf: 'flex-end',
    },
    userImage: {
        padding: 10,
    },
});

export default EmergencyContactSetting;
