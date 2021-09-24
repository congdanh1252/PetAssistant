import React, { useState } from 'react';
import COLORS from '../../theme/colors'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button';
import ProgressBar from '../../components/ProgressBar';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export function ChangePasswordScreen_5(props) {
    return (
        <View style={style.container}>
            <Image style={style.icon} source={require('../../assets/icons/award.png')}/>
            <Text style={style.password_updated_title}>
                {
                    props.type == 'email'
                    ? "EMAIL SENT"
                    : "PASSWORD\nUPDATED"
                }
            </Text>
            <Text style={style.message}>
                {
                    props.type == 'email'
                    ? "Check your email for\nfurthur"
                    : "Your password has been changed!\nNow you can sign in!"
                }
                
            </Text>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        width: 100,
        height: 100,
    },
    password_updated_title: {
        width: 210,
        marginTop: 15,
        fontFamily: "RedHatText",
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    message: {
        width: '80%',
        padding: 15,
        marginTop: 15,
        fontFamily: "RedHatText",
        fontSize: 16,
        fontStyle: 'normal',
        textAlign: 'center'
    },
});