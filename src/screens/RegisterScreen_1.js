import React, { useState } from 'react';
import COLORS from '../theme/colors'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import { Input } from 'react-native-elements/dist/input/Input';
import { Button } from 'react-native-elements/dist/buttons/Button';
import ProgressBar from '../components/ProgressBar';

export function RegisterScreen_1() {
    const [useName, setName] = useState('');
    const [useEmail, setEmail] = useState('');

    function clickNextButton() {
        console.log(useName, useEmail);
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={style.container}>
                <View style={style.icon_title_container}>
                    <Image style={style.bone_icon} source={require('../assets/icons/bone.png')} resizeMode='cover'/>
                    <Text style={style.register_title}>Register{"\n"}new account</Text>
                </View>
                
                <Input
                    containerStyle={style.input_container}
                    label='Full name'
                    placeholder='Full name'
                    textContentType='name'
                    multiline={false}
                    leftIcon={<Feather style={style.icon} name="user" size={28} color="black" />}
                    rightIcon={
                        <TouchableOpacity activeOpacity={0.5}>
                            <Feather name="x" size={24} color="black" onPress={() => setName('')}/>
                        </TouchableOpacity>
                    }
                    value={useName}
                    onChangeText={value => setName(value)}
                />
                <Input
                    containerStyle={style.input_container}
                    label='Email'
                    placeholder='Email'
                    textContentType='emailAddress'
                    multiline={false}
                    leftIcon={<MaterialCommunityIcons style={style.icon} name="email-outline" size={28} color="black" />}
                    rightIcon={
                        <TouchableOpacity activeOpacity={0.5}>
                            <Feather name="x" size={24} color="black" onPress={() => setEmail('')}/>
                        </TouchableOpacity>
                    }
                    value={useEmail}
                    onChangeText={value => setEmail(value)}
                />

                <Button
                    type='solid' 
                    containerStyle={{marginTop: 40}}
                    titleStyle={{fontSize: 20}}
                    buttonStyle={style.next_button} 
                    title='Next'
                    onPress={() => clickNextButton()}
                />

                <View style={{marginTop: 110}}>
                    <ProgressBar
                        num={3}
                        activeIndex={0}    
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
    input_container: {
        width: '80%',
        height: 100,
        padding: 15
    },
    icon: {
        marginRight: 10,
    },
    next_button: {
        backgroundColor: COLORS.primaryDark,
        color: '#000',
        width: 130,
        height: 55,
        borderRadius: 10
    },
    indicator_container: {
        marginTop: 170,
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