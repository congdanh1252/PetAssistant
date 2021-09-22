import React, { useState } from 'react';
import COLORS from '../theme/colors'
import { Feather, MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View, Keyboard, TouchableWithoutFeedback, TouchableOpacity,
    Dimensions, StatusBar
} from 'react-native'
import { Input } from 'react-native-elements/dist/input/Input';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ProgressBar from '../components/ProgressBar';

const height = Dimensions.get('window').height - StatusBar.currentHeight + 200;

export function RegisterScreen_3({navigation}) {
    const [useUsername, setUsername] = useState('');
    const [usePassword, setPassword] = useState('');
    const [useConfirmPassword, setConfirmPassword] = useState('');
    const [useValidPassword, setValidPassword] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(true);
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
    const [isTypingUsername, setIsTyingUsername] = useState(false);
    const [isTypingPassword, setIsTypingPassword] = useState(false);
    const [isTypingConfirmPassword, setIsTypingConfirmPassword] = useState(false);

    function clickNextButton() {
    }

    return (
        <KeyboardAwareScrollView
            enableAutomaticScroll={true}
            scrollEnabled={true}
            onScroll={() => Keyboard.dismiss()}
            contentContainerStyle={{height: height}}
        >
            <TouchableWithoutFeedback   
                onPress={() => {
                    Keyboard.dismiss()
                    setIsTyingUsername(false);
                    setIsTypingPassword(false);
                    setIsTypingConfirmPassword(false);
                }}>
                
                <View style={style.container}>
                    <View style={style.icon_title_container}>
                        <Image style={style.bone_icon} source={require('../assets/icons/bone.png')} resizeMode='cover'/>
                        <Text style={style.register_title}>Register{"\n"}new account</Text>
                    </View>
                        
                    <Input
                        placeholderTextColor='#000'
                        inputStyle={{color: '#000'}}
                        containerStyle={style.input_container}
                        label='Username'
                        placeholder='Username'
                        textContentType='username'
                        multiline={false}
                        leftIcon={<Feather style={style.icon} name="user" size={28} color="black" />}
                        rightIcon={
                            isTypingUsername ? (
                                <TouchableOpacity activeOpacity={0.5}>
                                    <Feather name="x" size={24} color="black" onPress={() => setUsername('')}/>
                                </TouchableOpacity>
                            ) : (null)
                        }
                        value={useUsername}
                        onChangeText={value => {
                            value.length > 0 ? setIsTyingUsername(true) : setIsTyingUsername(false)
                            setUsername(value)
                        }}
                        onFocus={() => {
                            useUsername.length > 0 ? setIsTyingUsername(true) : setIsTyingUsername(false)
                        }}
                    />

                    <Input
                        placeholderTextColor='#000'
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
                            <MaterialCommunityIcons style={style.icon} name="key" size={28} color="black" />
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
                        placeholderTextColor='#000'
                        inputStyle={{color: '#000'}}
                        containerStyle={style.input_container}
                        label='Confirm password'
                        placeholder='Confirm password'
                        textContentType='password'
                        secureTextEntry={visibleConfirmPassword}
                        multiline={false}
                        leftIcon={
                            <MaterialCommunityIcons style={style.icon} name="key" size={28} color="black" />
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

                    <Button
                        type='solid' 
                        containerStyle={{marginTop: 30}}
                        titleStyle={{fontSize: 20}}
                        buttonStyle={style.next_button} 
                        title='Finish'
                        onPress={() => clickNextButton()}
                    />
                    <View style={{marginTop: 70}}>
                        <ProgressBar
                            num={3}
                            activeIndex={1}    
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
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
        width: 295,
        height: 55,
        borderRadius: 10
    },
});