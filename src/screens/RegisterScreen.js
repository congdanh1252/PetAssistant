import React, { useRef, useState } from 'react';
import COLORS from '../theme/colors'
import { Feather, MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import {
    Image, StyleSheet, Text, View, Keyboard, TouchableWithoutFeedback,
    TouchableOpacity, StatusBar, Dimensions, Alert
} from 'react-native'
import { Input } from 'react-native-elements/dist/input/Input';
import { Button } from 'react-native-elements/dist/buttons/Button';
import ProgressBar from '../components/ProgressBar';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const height = Dimensions.get('window').height - StatusBar.currentHeight + 300;

export const RegisterScreen_1 = ({navigation}) => {
    const ref_input_mail = useRef();
    const ref_input_phone = useRef();
    const ref_input_pass = useRef();
    const ref_input_cfpass = useRef();

    var isAddedFirebase = false;
    var valid_inputs = false;
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
    const [isAuthChanged, setAuthChanged] = useState(false);

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
                email: useEmail,
            })
            .then(() => {
                console.log('firestore added');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Register1' }],
                });
            });
    }

    const checkInput = () => {
        if (useName==='' || useEmail==='' || usePassword==='' || useConfirmPassword != usePassword ||
            usePhone==='' || useConfirmPassword==='' || useValidEmail===false || useValidPassword===false) {
                valid_inputs = false;
        }
        else {
            valid_inputs = true;
        }
    }

    const registerNewAccount = () => {
        navigation.navigate('Register2');
        // checkInput();
        // if (valid_inputs) {console.log("duoc");
        //     try {
        //         // create user with email, pass
        //         const userCredential = auth().createUserWithEmailAndPassword(useEmail, usePassword)
        //         .catch((error) => {
        //             console.log(error)
        //         });
        //         console.log('user created');

        //         const onAuthStateChangedUnsubscribe = 
        //             auth().onAuthStateChanged(async (user) => {
        //                 if (user && !isAuthChanged) {
        //                     setAuthChanged(true);
        //                     //send mail to user
        //                     await user.sendEmailVerification()
        //                     .then(() => {
        //                             console.log('mail sent');
        //                             navigation.navigate('Register2');
        //                         }
        //                     )
        //                     .catch((error) => {
        //                         console.log(error)
        //                     });

        //                     //check verified mail
        //                     const onIdTokenChangedUnsubscribe = auth().onIdTokenChanged((newUser) => {
        //                         const unsubscribeSetInterval = setInterval(() => {
        //                             if (firebase.auth().currentUser && !isAddedFirebase) {
        //                                 firebase.auth().currentUser.reload();
        //                                 console.log('reload user');
        //                                 firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)

        //                                 if (newUser.emailVerified) {
        //                                     console.log('mail clicked');
        //                                     clearInterval(unsubscribeSetInterval); //delete timeout
        //                                     onAuthStateChangedUnsubscribe(); //unsubscribe onAuthStateChanged
        //                                     if ( !isAddedFirebase) {
        //                                         isAddedFirebase = true;
        //                                         addAccountToFirestoreAndFinish(user.uid);
        //                                     }
        //                                     return onIdTokenChangedUnsubscribe(); //unsubscribe onIdTokenChanged
        //                                 }
        //                             }
        //                             else if (isAddedFirebase) {
        //                                 clearInterval(unsubscribeSetInterval);
        //                                 onAuthStateChangedUnsubscribe(); 
        //                                 return onIdTokenChangedUnsubscribe();
        //                             }
        //                             console.log('mail not clicked');
        //                         }, 5000);
        //                     })
        //                 }
        //             })
        //     } catch (error) {
        //         throw error;
        //     }
        // }
        // else {
        //     alertEmptyInput();
        // }
    }

    return (
        <KeyboardAwareScrollView
            enableAutomaticScroll={true}
            scrollEnabled={true}
            onScroll={() => Keyboard.dismiss()}
            contentContainerStyle={{height: '100%'}}
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
                        <Text style={style.register_title}>Đăng ký{"\n"}tài khoản mới</Text>
                    </View>
                    
                    {/* Full name */}
                    <Input
                        placeholderTextColor='#4c4c4c'
                        inputStyle={{color: '#000'}}
                        containerStyle={style.input_container}
                        label='Họ tên'
                        placeholder='Nhập họ tên'
                        textContentType='name'
                        multiline={false}
                        leftIcon={<Feather style={style.icon} name="user" size={28} color="black" />}
                        rightIcon={
                            isTypingName ? (
                                <TouchableOpacity style={style.right_icon} activeOpacity={0.5} onPress={() => setName('')}>
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
                        blurOnSubmit={false}
                        onSubmitEditing={() => ref_input_mail.current.focus()}
                    />

                    {/* Email */}
                    <Input
                        ref={ref_input_mail}
                        placeholderTextColor='#4c4c4c'
                        inputStyle={{color: '#000'}}
                        containerStyle={style.input_container}
                        label='Email'
                        placeholder='Nhập email'
                        keyboardType='email-address'
                        textContentType='emailAddress'
                        multiline={false}
                        errorStyle={style.pass_requirement}
                        errorMessage={useValidEmail ? 'Email đúng định dạng' : 'Hãy nhập đúng định dạng email bạn nhé'}
                        leftIcon={<MaterialCommunityIcons style={style.icon} name="email-outline" size={28} color="black" />}
                        rightIcon={
                            isTypingEmail ? (
                                <TouchableOpacity
                                    style={style.right_icon}
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
                        blurOnSubmit={false}
                        onSubmitEditing={() => ref_input_phone.current.focus()}
                    />

                    {/* Phone */}
                    <Input
                        ref={ref_input_phone}
                        placeholderTextColor='#4c4c4c'
                        inputStyle={{color: '#000'}}
                        containerStyle={style.input_container}
                        label='Số điện thoại'
                        placeholder='Nhập số điện thoại'
                        keyboardType='numeric'
                        textContentType='telephoneNumber'
                        multiline={false}
                        leftIcon={<Feather style={style.icon} name="phone" size={28} color="black" />}
                        rightIcon={
                            isTypingPhone ? (
                                <TouchableOpacity style={style.right_icon} activeOpacity={0.5}>
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
                        blurOnSubmit={false}
                        onSubmitEditing={() => ref_input_pass.current.focus()}
                    />

                    {/* Password */}
                    <Input
                        ref={ref_input_pass}
                        placeholderTextColor='#4c4c4c'
                        inputStyle={{color: '#000'}}
                        containerStyle={style.input_container}
                        label='Mật khẩu'
                        placeholder='Nhập mật khẩu'
                        textContentType='password'
                        secureTextEntry={visiblePassword}
                        multiline={false}
                        errorMessage={
                            <Text style={style.pass_requirement}>Mật khẩu phải có hơn 8 ký tự</Text>
                        }
                        leftIcon={
                            <MaterialCommunityIcons style={style.icon} name="key" size={28} color="black" />
                        }
                        rightIcon={
                            <View style={style.right_icon_container}>
                                { isTypingPassword ? (
                                        <TouchableOpacity
                                            style={style.right_icon}
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
                                            style={style.right_icon}
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
                        blurOnSubmit={false}
                        onSubmitEditing={() => ref_input_cfpass.current.focus()}
                    />
                    
                    {/* Confirm password */}
                    <Input
                        ref={ref_input_cfpass}
                        placeholderTextColor='#4c4c4c'
                        inputStyle={{color: '#000'}}
                        containerStyle={style.input_container}
                        label='Xác nhận mật khẩu'
                        placeholder='Nhập lại mật khẩu'
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
                                            style={style.right_icon}
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
                                            style={style.right_icon}
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

                                { (useConfirmPassword === usePassword 
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
                        title='Tiếp tục'
                        onPress={() => registerNewAccount()}
                    />
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
                    <Text style={style.register_title}>Đăng ký{"\n"}tài khoản mới</Text>
                </View>
                
                <Text style={style.message}>
                    Chúng tôi đã gửi bạn một email để xác nhận tài khoản.{'\n'}
                    Bạn hãy kiểm tra email để hoàn tất đăng ký tài khoản nhé.
                </Text>
                {/* <View style={style.code_container}>
                    
                    <Button
                        titleStyle={style.resend_code} type='clear' title='Resend code'/>
                </View> */}

                <Text style={style.note}>
                    *Màn hình này sẽ chuyển khi bạn xác nhận email thành công
                </Text>

                {/* <Button
                    type='solid' 
                    containerStyle={{marginTop: 40}}
                    titleStyle={{fontSize: 20}}
                    buttonStyle={style.next_button} 
                    title='Next'
                    onPress={() => clickNextButton()}/> */}

                {/* <ProgressBar
                    num={2}
                    activeIndex={1}    
                /> */}
            </View>
        </TouchableWithoutFeedback>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flex: 1,
        alignItems: 'center',
    },
    icon_title_container: {
        marginTop: 35,
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bone_icon: {
        width: 50,
        height: 50,
    },
    register_title: {
        width: 210,
        marginTop: 15,
        fontFamily: "Roboto-Medium",
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.black,
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
        marginLeft: 5
    },
    right_icon_container: {
        width: 60,
        marginTop: 5,
        marginLeft: -10,
        flexDirection: 'row',
    },
    right_icon: {
        paddingLeft: 3,
        paddingRight: 3,
    },
    next_button: {
        backgroundColor: COLORS.black,
        color: '#000',
        width: 130,
        height: 55,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10
    },
    pass_requirement: {
        fontStyle: 'italic',
        fontSize: 16,
        color: COLORS.blue,
    },
    note: {
        width: '80%',
        marginTop: 20,
        fontStyle: 'italic',
        fontSize: 16,
        color: COLORS.blue,
        textAlign: 'center'
    },
    message: {
        width: '90%',
        padding: 10,
        fontFamily: "Roboto-Light",
        fontSize: 18,
        fontStyle: 'normal',
        textAlign: 'center',
        color: COLORS.black,
    },
});