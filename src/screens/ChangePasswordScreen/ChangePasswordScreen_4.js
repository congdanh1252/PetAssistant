import React, { useState } from 'react';
import COLORS from '../../theme/colors'
import { Feather, MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { 
    Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard 
} from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button';
import { Input } from 'react-native-elements/dist/input/Input';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export function ChangePasswordScreen_4() {
    const [usePassword, setPassword] = useState('');
    const [useConfirmPassword, setConfirmPassword] = useState('');
    const [useValidPassword, setValidPassword] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(true);
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
    const [isTypingPassword, setIsTypingPassword] = useState(false);
    const [isTypingConfirmPassword, setIsTypingConfirmPassword] = useState(false);

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss()
                setIsTypingPassword(false);
                setIsTypingConfirmPassword(false);
            }}>
            <View style={style.container}>
                    <Image style={style.icon} source={require('../../assets/icons/print.png')}/>
                    <Text style={style.new_password_title}>NEW PASSWORD</Text>
                    <Text style={style.message}>
                        Your identity has been verified!{'\n'}
                        Set your new password
                    </Text>

                    <Input
                        placeholderTextColor='#4c4c4c'
                        inputStyle={{color: '#000'}}
                        containerStyle={style.input_container}
                        label='Password'
                        placeholder='Password'
                        textContentType='password'
                        secureTextEntry={visiblePassword}
                        multiline={false}
                        errorMessage={
                            <Text style={style.pass_requirement}>Password must be at least 8 characters</Text>
                        }
                        leftIcon={
                            <MaterialCommunityIcons style={style.input_icon} name="key" size={28} color="black" />
                        }
                        rightIcon={
                            <View style={style.right_icon_container}>
                                { isTypingPassword ? (
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => setVisiblePassword(!visiblePassword)}>
                                            <Ionicons
                                                name="eye"
                                                size={24}
                                                color="black"
                                            />
                                        </TouchableOpacity>
                                    ) : (null)
                                }

                                { isTypingPassword ? (
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => {
                                                setPassword('')
                                                setValidPassword(false)
                                            }}>
                                            <Feather
                                                name="x"
                                                size={24}
                                                color="black"
                                            />
                                        </TouchableOpacity>
                                    ) : (null)
                                }

                                { (useValidPassword && isTypingPassword) ? (
                                        <AntDesign
                                            style={style.correct_icon}
                                            name="downcircle"
                                            size={24}
                                            color="#24e079"
                                        />
                                    ) : (
                                        <AntDesign
                                            style={style.correct_icon, {display: 'none'}}
                                            name="downcircle"
                                            size={24}
                                            color="#24e079"
                                        />
                                    )
                                }
                            </View>
                        }
                        value={usePassword}
                        onChangeText={value => {
                            value.length > 0 ? setIsTypingPassword(true) : setIsTypingPassword(false)
                            value.length > 7 ? setValidPassword(true) : setValidPassword(false);
                            setPassword(value)
                        }}
                        onFocus={() => {
                            usePassword.length > 0 ? setIsTypingPassword(true) : setIsTypingPassword(false)
                        }}
                    />
                
                    <Input
                        placeholderTextColor='#4c4c4c'
                        inputStyle={{color: '#000'}}
                        containerStyle={style.input_container}
                        label='Confirm password'
                        placeholder='Confirm password'
                        textContentType='password'
                        secureTextEntry={visibleConfirmPassword}
                        multiline={false}
                        leftIcon={
                            <MaterialCommunityIcons style={style.input_icon} name="key" size={28} color="black" />
                        }
                        rightIcon={
                            <View style={style.right_icon_container}>
                                { isTypingConfirmPassword ? (
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => setVisibleConfirmPassword(!visibleConfirmPassword)}>
                                            <Ionicons
                                                name="eye"
                                                size={24}
                                                color="black"
                                            />
                                        </TouchableOpacity>
                                    ) : (null)
                                }

                                { isTypingConfirmPassword ? (
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => setConfirmPassword('')}>
                                            <Feather
                                                name="x"
                                                size={24}
                                                color="black"
                                            />
                                        </TouchableOpacity>
                                    ) : (null)
                                }

                                { (useConfirmPassword == usePassword 
                                    && useConfirmPassword != '' 
                                    && isTypingConfirmPassword) ? (
                                        <AntDesign
                                            style={style.correct_icon}
                                            name="downcircle"
                                            size={24}
                                            color="#24e079"
                                        />
                                    ) : (
                                        <AntDesign
                                            style={style.correct_icon, {display: 'none'}}
                                            name="downcircle"
                                            size={24}
                                            color="#24e079"
                                        />
                                    )
                                }
                            </View>
                        }
                        value={useConfirmPassword}
                        onChangeText={value => {
                            value.length > 0 ? setIsTypingConfirmPassword(true) : setIsTypingConfirmPassword(false)
                            
                            setConfirmPassword(value)
                        }}
                        onFocus={() => {
                            setIsTypingPassword(false)
                            useConfirmPassword.length > 0 ? setIsTypingConfirmPassword(true) : setIsTypingConfirmPassword(false)
                        }}
                    />
            </View>
        </TouchableWithoutFeedback>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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