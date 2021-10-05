import React, { useState } from 'react';
import COLORS from '../theme/colors'
import { Feather, MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import {
    Image, StyleSheet, Text, View, Keyboard, TouchableWithoutFeedback,
    TouchableOpacity, StatusBar, Dimensions, Alert
} from 'react-native'
import { Input } from 'react-native-elements/dist/input/Input';
import { Button } from 'react-native-elements/dist/buttons/Button';
import ProgressBar from '../components/ProgressBar';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const height = Dimensions.get('window').height - StatusBar.currentHeight + 300;

export const RegisterScreen_1 = ({navigation}) => {
    const [useValidInputs, setValidInputs] = useState(false);
    const [useName, setName] = useState('');
    const [useEmail, setEmail] = useState('');
    const [useValidEmail, setValidEmail] = useState(false);
    const [usePhone, setPhone] = useState('');
    const [usePassword, setPassword] = useState('');
    const [useConfirmPassword, setConfirmPassword] = useState('');
    const [useValidPassword, setValidPassword] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(true);
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(true);
    const [isTypingPhone, setIsTyingPhone] = useState(false);
    const [isTypingPassword, setIsTypingPassword] = useState(false);
    const [isTypingConfirmPassword, setIsTypingConfirmPassword] = useState(false);
    const [isTypingName, setIsTyingName] = useState(false);
    const [isTypingEmail, setIsTypingEmail] = useState(false);

    const validateEmail = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(text) === false) {
          setValidEmail(false);
        }
        else {
          setValidEmail(true);
        }
    }

    const alertEmptyInput = () => {
        Alert.alert(
            'Caution',
            'Please fill in all fields OR check your email/ password again',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
    }

    const addAccountToFirestoreAndFinish = (uid) => {
        firestore()
            .collection('users')
            .doc(uid)
            .set({
                name: useName,
                phone: usePhone,
            })
            .then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
            });
    }

    const checkInput = () => {
        if (useName==='' || useEmail==='' || usePassword==='' || usePhone==='' ||
            useConfirmPassword==='' || useValidEmail===false || useValidPassword===false) {
                setValidInputs(false);
                // console.log(useName);
                // console.log(useEmail);
                // console.log(usePassword);
                // console.log(useConfirmPassword);
                // console.log(useValidEmail);
                // console.log(useValidPassword);
        }
        else {
            setValidInputs(true);
        }
    }

    const registerNewAccount = () => {
        //navigation.navigate('Register2');
        checkInput();
        if (useValidInputs) {
            try {
                // create user with email, pass
                const userCredential = auth().createUserWithEmailAndPassword(useEmail, usePassword)
                .catch((error) => {
                    console.log(error)
                });
                console.log('user created');

                const onAuthStateChangedUnsubscribe = 
                    firebase.auth().onAuthStateChanged(async (user) => {
                        if (user) {
                            //send mail to user
                            await user.sendEmailVerification()
                            .catch((error) => {
                                console.log(error)
                            });
                            console.log('mail sent');
                            navigation.navigate('Register2');

                            //check verified mail
                            const onIdTokenChangedUnsubscribe = firebase.auth().onIdTokenChanged((user) => {
                                const unsubscribeSetInterval = setTimeout(() => {
                                    firebase.auth().currentUser.reload();
                                    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
                                }, 5000);
                                
                                console.log('mail not clicked');
                                if (user && user.emailVerified) {
                                    console.log('mail clicked');
                                    clearInterval(unsubscribeSetInterval) //delete interval
                                    onAuthStateChangedUnsubscribe() //unsubscribe onAuthStateChanged
                                    addAccountToFirestoreAndFinish(user.uid);
                                    return onIdTokenChangedUnsubscribe() //unsubscribe onIdTokenChanged
                                }
                            })
                        }
                    })
            } catch (error) {
                throw error;
            }
        }
        else {
            alertEmptyInput();
        }
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
                    Keyboard.dismiss();
                    setIsTypingEmail(false);
                    setIsTyingName(false);
                    setIsTyingPhone(false);
                    setIsTypingPassword(false);
                    setIsTypingConfirmPassword(false);
                }}
            >
                <View style={style.container}>
                    <View style={style.icon_title_container}>
                        <Image style={style.bone_icon} source={require('../assets/icons/bone.png')} resizeMode='cover'/>
                        <Text style={style.register_title}>Register{"\n"}new account</Text>
                    </View>
                    
                    {/* Full name */}
                    <Input
                        placeholderTextColor='#4c4c4c'
                        inputStyle={{color: '#000'}}
                        containerStyle={style.input_container}
                        label='Full name'
                        placeholder='Full name'
                        textContentType='name'
                        multiline={false}
                        leftIcon={<Feather style={style.icon} name="user" size={28} color="black" />}
                        rightIcon={
                            isTypingName ? (
                                <TouchableOpacity activeOpacity={0.5} onPress={() => setName('')}>
                                    <Feather name="x" size={24} color="black"/>
                                </TouchableOpacity>
                            ) : (null)
                        }
                        value={useName}
                        onChangeText={value => {
                            value.length > 0 ? setIsTyingName(true) : setIsTyingName(false)
                            setName(value)
                        }}
                        onFocus={() => {
                            useName.length > 0 ? setIsTyingName(true) : setIsTyingName(false)
                        }}
                    />

                    {/* Email */}
                    <Input
                        placeholderTextColor='#4c4c4c'
                        inputStyle={{color: '#000'}}
                        containerStyle={style.input_container}
                        label='Email'
                        placeholder='Email'
                        keyboardType='email-address'
                        textContentType='emailAddress'
                        multiline={false}
                        errorStyle={style.pass_requirement}
                        errorMessage={useValidEmail ? 'This is a valid email' : 'Make sure you type a valid email'}
                        leftIcon={<MaterialCommunityIcons style={style.icon} name="email-outline" size={28} color="black" />}
                        rightIcon={
                            isTypingEmail ? (
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        setEmail('')
                                        setValidEmail(false)
                                    }}>
                                    <Feather name="x" size={24} color="black"/>
                                </TouchableOpacity>
                            ) : (null)
                        }
                        value={useEmail}
                        onChangeText={value => {
                            value.length > 0 ? setIsTypingEmail(true) : setIsTypingEmail(false)
                            setEmail(value)
                            validateEmail(value)
                        }}
                        onFocus={() => {
                            useEmail.length > 0 ? setIsTypingEmail(true) : setIsTypingEmail(false)
                        }}
                    />

                    {/* Phone */}
                    <Input
                        placeholderTextColor='#4c4c4c'
                        inputStyle={{color: '#000'}}
                        containerStyle={style.input_container}
                        label='Phone number'
                        placeholder='Phone number'
                        keyboardType='numeric'
                        textContentType='telephoneNumber'
                        multiline={false}
                        leftIcon={<Feather style={style.icon} name="phone" size={28} color="black" />}
                        rightIcon={
                            isTypingPhone ? (
                                <TouchableOpacity activeOpacity={0.5}>
                                    <Feather name="x" size={24} color="black" onPress={() => setPhone('')}/>
                                </TouchableOpacity>
                            ) : (null)
                        }
                        value={usePhone}
                        onChangeText={value => {
                            value.length > 0 ? setIsTyingPhone(true) : setIsTyingPhone(false)
                            setPhone(value)
                        }}
                        onFocus={() => {
                            usePhone.length > 0 ? setIsTyingPhone(true) : setIsTyingPhone(false)
                        }}
                    />

                    {/* Password */}
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
                    
                    {/* Confirm password */}
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
                        containerStyle={{marginTop: 40}}
                        titleStyle={{fontSize: 20}}
                        buttonStyle={style.next_button} 
                        title='Next'
                        onPress={() => registerNewAccount()}
                    />

                    <View style={{marginTop: 90 - StatusBar.currentHeight}}>
                        <ProgressBar
                            num={2}
                            activeIndex={0}    
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
    );
}   

export const RegisterScreen_2 = ({navigation}) => {
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
    input_container: {
        width: '85%',
        height: 100,
        padding: 15
    },
    icon: {
        marginRight: 10,
    },
    correct_icon: {
        marginTop: 1,
        marginLeft: 8
    },
    right_icon_container: {
        width: 48,
        marginTop: 5,
        flexDirection: 'row',
    },
    next_button: {
        backgroundColor: COLORS.primaryDark,
        color: '#000',
        width: 130,
        height: 55,
        borderRadius: 10
    },
    pass_requirement: {
        fontStyle: 'italic',
        fontSize: 16,
        color: COLORS.primaryDark,
    },
    note: {
        width: '80%',
        marginTop: 20,
        fontStyle: 'italic',
        fontSize: 16,
        color: COLORS.primaryDark,
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
});