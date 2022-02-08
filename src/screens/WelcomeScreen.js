import React from 'react';
import COLORS from '../theme/colors'
import { Image, StyleSheet, Text, View } from 'react-native'

export function WelcomeScreen() {
    return (
        <View style={style.container}>
            <Image style={style.app_logo} source={require('../assets/icons/app_logo.png')} resizeMode='cover'/>
            <Text style={style.app_name}>Pet Assistant</Text>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    app_logo: {
        width: 160,
        height: 160,
        borderRadius: 160 / 2,
    },
    app_name: {
        marginTop: 25,
        fontFamily: "Roboto-Medium",
        fontSize: 24,
        color: COLORS.black
    }
});