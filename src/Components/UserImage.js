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
    Alert,
} from 'react-native';

import renderIf from '../Utils/RenderIf';
import Util from '../Utils/Utils';
import UserAvatar from 'react-native-user-avatar';

class UserImage extends Component {
    render() {
        const defaultUserImage = require('../images/user-pending.png');

        var imageUrl =
            this.props.imageUrl == undefined || this.props.imageUrl == ''
                ? defaultUserImage
                : { uri: this.props.imageUrl };

        const renderUserAvatar =
            (this.props.name != undefined && this.props.name != '') &&
            (this.props.imageUrl == undefined || this.props.imageUrl == '');

        var nameForAvatar = '';
        if(!Util.isEmpty(this.props.name)) {
            var splits = this.props.name.split(' ');
            if(splits.length > 1) {
                nameForAvatar = (splits[0] + ' ' + splits[1]).toUpperCase();
            }
            else {
                nameForAvatar = splits[0][0].toUpperCase();
            }
        }

        return (            
            <View style={styles.container}>
                {renderIf(
                    renderUserAvatar,
                    <UserAvatar name={nameForAvatar} size={this.props.size} />
                )}
                {renderIf(
                    !renderUserAvatar,
                    <Image
                        style={{
                            width: this.props.size,
                            height: this.props.size,
                            borderRadius: this.props.size / 2,
                        }}
                        source={imageUrl}
                    />
                )}
            </View>
        );
    }
}

const styles = {
    container: {},
};

export default UserImage;
