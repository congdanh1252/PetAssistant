import React, { useState } from 'react';
import COLORS from '../theme/colors'
import { Feather, MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Input } from 'react-native-elements/dist/input/Input';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { TouchableOpacity } from 'react-native-gesture-handler';

export function RegisterScreen() {
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
                    label='Username'
                    placeholder='Username'
                    textContentType='username'
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
                    label='Password'
                    placeholder='Password'
                    textContentType='password'
                    secureTextEntry={true}
                    multiline={false}
                    errorMessage={
                        <Text style={style.pass_requirement}>Password must be at least 8 characters</Text>
                    }
                    leftIcon={<MaterialCommunityIcons style={style.icon} name="key" size={28} color="black" />}
                    rightIcon={
                        <View style={style.right_icon_container}>
                            <TouchableOpacity activeOpacity={0.5}>
                                <Ionicons name="eye" size={24} color="black" onPress={() => setEmail('')}/>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.5}>
                                <Feather name="x" size={24} color="black" onPress={() => setEmail('')}/>
                            </TouchableOpacity>
                            <AntDesign style={style.correct_icon} name="downcircle" size={24} color="#24e079" />
                        </View>
                    }
                    value={useEmail}
                    onChangeText={value => setEmail(value)}
                />
                
                <Input
                    containerStyle={style.input_container}
                    label='Confirm password'
                    placeholder='Confirm password'
                    textContentType='password'
                    secureTextEntry={true}
                    multiline={false}
                    leftIcon={<MaterialCommunityIcons style={style.icon} name="key" size={28} color="black" />}
                    rightIcon={
                        <View style={style.right_icon_container}>
                            <TouchableOpacity activeOpacity={0.5}>
                                <Ionicons name="eye" size={24} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.5}>
                                <Feather name="x" size={24} color="black"/>
                            </TouchableOpacity>
                            <AntDesign style={style.correct_icon} name="downcircle" size={25} color="#24e079" />
                        </View>
                    }
                    value={useEmail}
                    onChangeText={value => setEmail(value)}
                />

                <Button
                    type='solid' 
                    containerStyle={{marginTop: 30}}
                    titleStyle={{fontSize: 20}}
                    buttonStyle={style.next_button} 
                    title='Finish'
                    onPress={() => clickNextButton()}/>

                <View style={style.indicator_container}>
                    <View style={style.indicator}/>
                    <View style={style.indicator}/>
                    <View style={style.active_indicator}/>
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
    input_container: {
        width: '80%',
        height: 100,
        padding: 15
    },
    right_icon_container: {
        width: 48,
        marginTop: 5,
        flexDirection: 'row',
    },
    icon: {
        marginRight: 10,
    },
    correct_icon: {
        marginTop: 1,
        marginLeft: 8
    },
    pass_requirement: {
        fontStyle: 'italic',
        fontSize: 16,
        color: COLORS.primaryDark,
    },
    next_button: {
        backgroundColor: COLORS.primaryDark,
        color: '#000',
        width: 130,
        height: 55,
        borderRadius: 10
    },
    indicator_container: {
        marginTop: 90,
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