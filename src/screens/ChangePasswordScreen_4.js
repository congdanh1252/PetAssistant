import React, { useState } from 'react';
import COLORS from '../theme/colors'
import { Feather, MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { 
    Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard 
} from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button';
import ProgressBar from '../components/ProgressBar';
import { Input } from 'react-native-elements/dist/input/Input';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export function ChangePasswordScreen_4() {
    const [usePassword, setPassword] = useState('');
    const [useConfirmPassword, setConfirmPassword] = useState('');

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={style.container}>
                <View style={style.card}>
                    <Image style={style.icon} source={require('../assets/icons/print.png')}/>
                    <Text style={style.new_password_title}>NEW PASSWORD</Text>
                    <Text style={style.message}>
                        Your identity has been verified!{'\n'}
                        Set your new password
                    </Text>

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
                        leftIcon={<MaterialCommunityIcons style={style.input_icon} name="key" size={28} color="black" />}
                        rightIcon={
                            <View style={style.right_icon_container}>
                                <TouchableOpacity activeOpacity={0.5}>
                                    <Ionicons name="eye" size={24} color="black"/>
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.5}>
                                    <Feather name="x" size={24} color="black" onPress={() => setPassword('')}/>
                                </TouchableOpacity>
                                <AntDesign style={style.correct_icon} name="downcircle" size={24} color="#24e079" />
                            </View>
                        }
                        value={usePassword}
                        onChangeText={value => setPassword(value)}
                    />
                    
                    <Input
                        containerStyle={style.input_container}
                        label='Confirm password'
                        placeholder='Confirm password'
                        textContentType='password'
                        secureTextEntry={true}
                        multiline={false}
                        leftIcon={<MaterialCommunityIcons style={style.input_icon} name="key" size={28} color="black" />}
                        rightIcon={
                            <View style={style.right_icon_container}>
                                <TouchableOpacity activeOpacity={0.5}>
                                    <Ionicons name="eye" size={24} color="black" />
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.5}>
                                    <Feather name="x" size={24} color="black"  onPress={() => setConfirmPassword('')}/>
                                </TouchableOpacity>
                                <AntDesign style={style.correct_icon} name="downcircle" size={25} color="#24e079" />
                            </View>
                        }
                        value={useConfirmPassword}
                        onChangeText={value => setConfirmPassword(value)}
                    />
                </View>

                <View style={style.buttons_container}>
                <Button
                    type='solid' 
                    containerStyle={{marginTop: 40}}
                    titleStyle={{fontSize: 20}}
                    buttonStyle={style.button} 
                    title='Back'
                />

                <Button
                    type='solid' 
                    containerStyle={{marginTop: 40}}
                    titleStyle={{fontSize: 20}}
                    buttonStyle={style.button} 
                    title='Next'
                />
                </View>

                <View style={{marginTop: -20}}>
                    <ProgressBar
                        num={5}
                        activeIndex={3}    
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
        alignItems: 'center'
    },
    card: {
        marginTop: 45,
        backgroundColor: COLORS.white,
        height: windowHeight - (windowHeight / 3),
        width: windowWidth - (windowWidth / 7),
        borderRadius: 25,
        alignItems: 'center'
    },
    icon: {
        marginTop: 20,
        width: 100,
        height: 100,
    },
    new_password_title: {
        width: 240,
        marginTop: 20,
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
    input_icon: {
        marginRight: 10,
    },
    correct_icon: {
        marginTop: 1,
        marginLeft: 8
    },
    pass_requirement: {
        fontStyle: 'italic',
        fontSize: 14,
        color: COLORS.primaryDark,
    },
    buttons_container: {
        width: windowWidth - (windowWidth / 7),
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    button: {
        backgroundColor: COLORS.primaryDark,
        color: '#000',
        width: 130,
        height: 55,
        borderRadius: 10
    },
});