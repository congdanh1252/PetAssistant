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
        backgroundColor: COLORS.primary,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    app_logo: {
        width: 200,
        height: 200,
        borderRadius: 200 / 2,
    },
    app_name: {
        marginTop: 25,
        fontFamily: "RedHatText",
        fontSize: 35,
        fontWeight: '600'
    }
});