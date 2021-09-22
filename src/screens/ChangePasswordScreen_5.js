import React, { useState } from 'react';
import COLORS from '../theme/colors'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button';
import ProgressBar from '../components/ProgressBar';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export function ChangePasswordScreen_5({navigation}) {

    function click() {
        navigation.navigate('Register1');
    }

    return (
        <View style={style.container}>
            <View style={style.card}>
                <Image style={style.icon} source={require('../assets/icons/award.png')}/>
                <Text style={style.password_updated_title}>PASSWORD{'\n'}UPDATED</Text>
                <Text style={style.message}>
                    Your password has been changed!{'\n'}
                    Now you can sign in!
                </Text>
            </View>

            <Button
                type='solid' 
                containerStyle={{marginTop: 40}}
                titleStyle={{fontSize: 20}}
                buttonStyle={style.finish_button} 
                title='Finish'
                onPress={() => click()}
            />

            <View style={{marginTop: -20}}>
                <ProgressBar
                    num={5}
                    activeIndex={4}    
                />
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        flex: 1,
        alignItems: 'center'
    },
    card: {
        marginTop: 45,
        backgroundColor: COLORS.white,
        height: windowHeight - (windowHeight / 3),
        width: windowWidth - (windowWidth / 7),
        borderRadius: 25,
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
    finish_button: {
        backgroundColor: COLORS.primaryDark,
        color: '#000',
        width: 130,
        height: 55,
        borderRadius: 10
    },
});