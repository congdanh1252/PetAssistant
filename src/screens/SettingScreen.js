import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image, TextInput } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

import COLORS from '../theme/colors';
import strings from '../data/strings';
import User from '../models/user'
import { windowHeight, windowWidth } from '../models/common/Dimensions'
import {
    getUserInfo,
    updateUserName
} from '../api/UserAPI'
import {
    updateMonthLimit
} from '../api/ExpenditureAPI'
import {
    moneyFormat
} from '../models/common/moneyStringFormat'

const SettingScreen = ({route, navigation}) =>  {
    const [type, setType] = useState(route.params.type)
    const [value, setValue] = useState(route.params.value.toString())

    const update = () => {
        switch (type) {
            case 'expenditure_limit':
                updateMonthLimit(value, () => {
                    Toast.show({
                        type: 'success',
                        text1: 'Thành công!',
                        text2: 'Hạn mức chi tiêu đã được cập nhật!'
                    });
                })
                break;
            case 'name':
                updateUserName(value, () => {
                    Toast.show({
                        type: 'success',
                        text1: 'Thành công!',
                        text2: 'Tên của bạn đã được cập nhật!'
                    });
                })
                break;
            case 'password': 
                checkPassword()
                break;
            default:
                break;
        }
    }

    const MonthLimit = () => {
        return (
            <View>
                <Text style={styles.sectionTitle}>
                    {strings.limit}
                </Text>
                <View style={styles.inputBox}>
                    <TextInput
                        keyboardType='numeric'
                        value={value}
                        onChangeText={value => {
                            setValue(value)
                        }}
                        style={styles.input}
                        placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                    >
                    </TextInput>
                </View>

                <TouchableOpacity
                    onPress={update}
                >
                    <View style={styles.logoutButton}>
                        <Text style={{
                            color: COLORS.white
                        }}>
                            {strings.save}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const UserName = () => {
        return (
            <View>
                <Text style={styles.sectionTitle}>
                    {strings.name}
                </Text>
                <View style={styles.inputBox}>
                    <TextInput
                        keyboardType='default'
                        value={value}
                        onChangeText={value => {
                            setValue(value)
                        }}
                        style={styles.input}
                        placeholder={value}
                        placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                    >
                    </TextInput>
                </View>

                <TouchableOpacity
                    onPress={update}
                >
                    <View style={styles.logoutButton}>
                        <Text style={{
                            color: COLORS.white
                        }}>
                            {strings.save}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const Password = () => {
        const [password, setPassword] = useState('')
        const passwordState = ''
        const newPaswordState = ''
        const [isValidPassword, setIsValidPassowrd] = useState(false)
        const [newPassword, setNewPassword] = useState('')
        const [isValidNewPassword, setIsValidNewPassword] = useState(false)
        const [confirmPassword, setConfirmPassword] = useState('')
        const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false)
        
        const checkPassword = () => {
            auth()
            .signInWithEmailAndPassword(auth().currentUser.email, password)
            .then(() => {
                console.log("Correct!");
                setIsValidPassowrd(true)
                changePassword()
            })
            .catch(error => {
                console.log(error)
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại!',
                    text2: 'Mật khẩu bạn đã nhập không chính xác!'
                })
            });  
        }
    
        const checkNewPassword = () => {
            if (newPassword.length < 6) {
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại!',
                    text2: 'Mật khẩu phải có ít nhất 6 ký tự!'
                });
            } else {
                // const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
                // if (regex.test(newPassword))
                //     Toast.show({
                //         type: 'error',
                //         text1: 'Thất bại!',
                //         text2: 'Mật khẩu phải chứa ít nhất 1 ký tự và 1 số!'
                //     });
                // else {
                    setIsValidNewPassword(true)
                // }
            }
        }
    
        const checkConfirmPassword = () => {
            if (confirmPassword == newPassword)
                setIsValidConfirmPassword(true)
        }

        const changePassword = () => {
            if (!isValidNewPassword) {
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại!',
                    text2: 'Mật khẩu mới phải có ít nhất 6 ký tự\nchứa ít nhất một chữ cái và một số!'
                })
                return
            }
            if (!isValidConfirmPassword) {
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại!',
                    text2: 'Mật khẩu xác nhận không trùng khớp!'
                })
                return
            }
            console.log("Updating...");
            auth()
            .currentUser
            .updatePassword(newPassword)
            .then(() => {
                auth()
                .signOut()
                .then(() => {
                    navigation.navigate('Login')
                    Toast.show({
                        type: 'success',
                        text1: 'Thành công!',
                        text2: 'Mật khẩu đã được thay đổi, vui lòng đăng nhập lại!'
                    })
                })
            })
            .catch(error => {
                console.log(error)
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại!',
                    text2: 'Đã có lỗi xảy ra!'
                })
                navigation.goBack()
            });
        }

        return (
            <View>
                {/* Old password */}
                <Text style={styles.sectionTitle}>
                    {strings.password}
                </Text>
                <View style={styles.inputBox}>
                    <TextInput
                        secureTextEntry={true}
                        keyboardType='default'
                        value={password}
                        onChangeText={value => {
                            setPassword(value)
                        }}
                        style={styles.input}
                        placeholder={value}
                        placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                    >
                    </TextInput>
                    {
                        isValidPassword == true
                        ? 
                        <Image
                            style={{
                                position: 'absolute',
                                right: 12,
                                bottom: 12,    
                            }}
                            source={require('../assets/icons/Ok.png')}
                        /> 
                        : null
                    }
                </View>
                {/* Enter new password */}
                <Text style={styles.sectionTitle}>
                    {strings.enterNewPassword}
                </Text>
                <View style={styles.inputBox}>
                    <TextInput
                        onEndEditing={checkNewPassword}
                        secureTextEntry={true}
                        keyboardType='default'
                        value={newPassword}
                        onChangeText={value => {
                            setNewPassword(value)
                        }}
                        style={styles.input}
                        placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                    >
                    </TextInput>
                    {
                        isValidNewPassword == true
                        ? 
                        <Image
                            style={{
                                position: 'absolute',
                                right: 12,
                                bottom: 12,    
                            }}
                            source={require('../assets/icons/Ok.png')}
                        /> 
                        : null
                    }
                </View>
                {/* Confirm new password */}
                <Text style={styles.sectionTitle}>
                    {strings.confirmPassword}
                </Text>
                <View style={styles.inputBox}>
                    <TextInput
                        onEndEditing={checkConfirmPassword}
                        secureTextEntry={true}
                        keyboardType='default'
                        value={confirmPassword}
                        onChangeText={value => {
                            setConfirmPassword(value)
                        }}
                        style={styles.input}
                        placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                    >
                    </TextInput>
                    {
                        isValidConfirmPassword == true
                        ? 
                        <Image
                            style={{
                                position: 'absolute',
                                right: 12,
                                bottom: 12,    
                            }}
                            source={require('../assets/icons/Ok.png')}
                        /> 
                        : null
                    }
                </View>

                <TouchableOpacity
                    onPress={checkPassword}
                >
                    <View style={styles.logoutButton}>
                        <Text style={{
                            color: COLORS.white
                        }}>
                            {strings.save}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const Line = () => {
        return (
            <View style={styles.line}>

            </View>
        )
    }

    const renderView = () => {
        switch (type) {
            case 'expenditure_limit':
                return <MonthLimit />
                break;
            case 'name':
                return <UserName />
                break;
            case 'password':
                return <Password />
                break;
            default:
                return null
                break;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    style={styles.headerIcon}
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <Image source={require('../assets/icons/Back.png')} />
                </TouchableOpacity>

                <Text style={styles.title}>
                    {strings.petAssistant}
                </Text>

                <TouchableOpacity style={styles.headerIcon}>
                    <Image source={require('../assets/icons/Settings.png')} />
                </TouchableOpacity>
            </View>

            <View style={styles.bodyContainer}>
                {renderView()}
            </View>
        </View>
    )
}

export default SettingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242B2E',
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        flex: 1.2,
        justifyContent: 'space-between'
    },
    title: {
        alignSelf: 'center',
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        color: COLORS.white,
    },  
    headerIcon: {
        padding: 8,
    },
    bodyContainer: {
        flex: 8.8,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 28, 
    },
    line: {
        backgroundColor: COLORS.dark,
        width: '80%',
        marginTop: 8, 
        marginBottom: 8,
        height: .5,
        alignSelf: 'center'
    },
    sectionTitle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
    },
    input: {
        position: 'relative',
        width: windowWidth - windowWidth / 6,
        color: "#000",
        textAlign: 'center',
        backgroundColor: '#EEEEEE',
        borderRadius: 15,
        padding: 10,
    },
    inputBox: {
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutButton: {
        marginTop: 20,
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.dark,
        borderRadius: 15,
    }, 
})
