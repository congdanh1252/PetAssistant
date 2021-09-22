import React, { useState } from 'react';
import COLORS from '../theme/colors'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import {
    Image, StyleSheet, Text, View, Keyboard, StatusBar,
    TouchableWithoutFeedback, TouchableOpacity 
} from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button';
import { Input } from 'react-native-elements/dist/input/Input';
import ProgressBar from '../components/ProgressBar';

export function RegisterScreen_2({navigation}) {
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={style.container}>
                {/* <View style={style.back_button_container}>
                    <TouchableOpacity activeOpacity={0.4}>
                        <Ionicons name="chevron-back" size={36} color="black" />
                    </TouchableOpacity>
                </View> */}

                <View style={style.icon_title_container}>
                    <Image style={style.bone_icon} source={require('../assets/icons/bone.png')} resizeMode='cover'/>
                    <Text style={style.register_title}>Register{"\n"}new account</Text>
                </View>
                
                <Text style={style.message}>
                    We have sent you an email with a link to verify your email.{'\n'}
                    Open it to finish this last step of registeration.
                </Text>
                {/* <View style={style.code_container}>
                    
                    <Button
                        titleStyle={style.resend_code} type='clear' title='Resend code'/>
                </View> */}

                <Text style={style.note}>
                    *This screen will close right after the email is verified
                </Text>

                {/* <Button
                    type='solid' 
                    containerStyle={{marginTop: 40}}
                    titleStyle={{fontSize: 20}}
                    buttonStyle={style.next_button} 
                    title='Next'
                    onPress={() => clickNextButton()}/> */}

                <View style={{marginTop: 200 - StatusBar.currentHeight}}>
                    <ProgressBar
                        num={2}
                        activeIndex={1}    
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        flex: 1,
        alignItems: 'center',
    },
    icon_title_container: {
        marginTop: 35,
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bone_icon: {
        width: 80,
        height: 80,
    },
    register_title: {
        width: 210,
        marginTop: 15,
        fontFamily: "RedHatText",
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    message: {
        width: '90%',
        padding: 10,
        fontFamily: "RedHatText",
        fontSize: 20,
        fontStyle: 'normal',
        textAlign: 'center'
    },
    code_container: {
        width: '80%',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input_container: {
        width: '100%',
        height: 45,
        borderBottomWidth: 0,
        borderRadius: 20,
        padding: 5,
        backgroundColor: '#fff',
    },
    code: {
        fontSize: 22, 
        fontFamily: 'RedHatText',
        textAlign: 'center',
    },
    resend_code: {
        fontSize: 20,
        fontFamily: 'RedHatText',
        fontWeight: 'bold',
        color: COLORS.primaryDark
    },
    back_button_container: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 15,
        top: 15,
    },
    next_button: {
        backgroundColor: COLORS.primaryDark,
        color: '#000',
        width: 130,
        height: 55,
        borderRadius: 10
    },
    note: {
        width: '80%',
        marginTop: 20,
        fontStyle: 'italic',
        fontSize: 16,
        color: COLORS.primaryDark,
        textAlign: 'center'
    }
});