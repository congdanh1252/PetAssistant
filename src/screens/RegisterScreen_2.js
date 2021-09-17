import React, { useState } from 'react';
import COLORS from '../theme/colors'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button';
import { Input } from 'react-native-elements/dist/input/Input';
import { TouchableOpacity } from 'react-native-gesture-handler';

export function RegisterScreen() {

    function clickNextButton() {
        console.log('OK');
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={style.container}>
                <View style={style.back_button_container}>
                    <TouchableOpacity activeOpacity={0.4}>
                        <Ionicons name="chevron-back" size={36} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={style.icon_title_container}>
                    <Image style={style.bone_icon} source={require('../assets/icons/bone.png')} resizeMode='cover'/>
                    <Text style={style.register_title}>Register{"\n"}new account</Text>
                </View>
                
                <Text style={style.message}>Check your email to get verify code</Text>
                <View style={style.code_container}>
                    <Input
                        inputStyle={style.code}
                        inputContainerStyle={style.input_container}
                        multiline={false}
                        placeholder='123456'
                        underlineColorAndroid={'#fff'}
                        rightIcon={
                            <AntDesign name="downcircle" size={25} color="#24e079" />
                        }
                    />
                    <Button
                        titleStyle={style.resend_code} type='clear' title='Resend code'/>
                </View>

                <Button
                    type='solid' 
                    containerStyle={{marginTop: 40}}
                    titleStyle={{fontSize: 20}}
                    buttonStyle={style.next_button} 
                    title='Next'
                    onPress={() => clickNextButton()}/>

                <View style={style.indicator_container}>
                    <View style={style.indicator}/>
                    <View style={style.active_indicator}/>
                    <View style={style.indicator}/>
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
        marginBottom: 40,
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
        width: '80%',
        padding: 15,
        fontFamily: "RedHatText",
        fontSize: 24,
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
        paddingLeft: 20
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
    indicator_container: {
        marginTop: 155,
        flexDirection: 'row',
        width: 120,
        justifyContent: 'space-evenly'
    },
    active_indicator: {
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
        backgroundColor: COLORS.primaryDark
    },
    indicator: {
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
        backgroundColor: '#99885E'
    }
});