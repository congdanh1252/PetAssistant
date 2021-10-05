import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Dimensions, Image, Button} from 'react-native'
import { TextInput, TouchableOpacity  } from 'react-native-gesture-handler';

import COLORS from '../../theme/colors';


import auth from '@react-native-firebase/auth';
const windowWidth = Dimensions.get('window').width;


export const ChangePasswordScreen_3_1 = (props) => {
    const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber)
    const [timeLeft, setTimeLeft] = useState(5)
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');
    const [isCorretCode, setIsCorrectCode] = useState(false);

    async function signInWithPhoneNumber(phoneNumber) {
        const confirmation = await auth().signInWithPhoneNumber("+84932696361");
        setConfirm(confirmation);
    }

    useEffect(() => {
        if (!timeLeft) return;
    
        const intervalId = setInterval(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
    
    
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    useEffect(() => {
        signInWithPhoneNumber(phoneNumber)
    },[])
    
    async function confirmCode() {
        try {
            await confirm.confirm(code);
            setIsCorrectCode(true)
            console.log('Valid code.')
            props.onReady(true)
        } catch (error) {
            console.log(error);
            setIsCorrectCode(false)
        }
    }

    useEffect(() => {
        if (code.length == 6)
            confirmCode()
    }, [code]);

    const renderCheckIcon = () => {
        if (isCorretCode) {
            return (
                <Image
                    style={{
                        position: 'absolute',
                        right: 8,
                        bottom: 12,    
                    }}
                    source={require('../../assets/icons/Ok.png')}
                />
            )
        }
        return null;
    }

    const renderResend = () => {
        if (timeLeft == 0) {
            return (
                <TouchableOpacity
                    disabled={isCorretCode}
                    onPress={() => {
                        signInWithPhoneNumber(phoneNumber)
                        setTimeLeft(10)
                    }}
                >
                    <Text
                        style={{color: COLORS.primaryDark, fontSize: 15, fontStyle: 'italic'}}
                    >
                        Resend code
                    </Text>
                </TouchableOpacity>
            )
        }
        return (
            <Text
                style={{color: COLORS.primary}}
            >
                Resend code? Try again in ({timeLeft}s)
            </Text>
        )
    }

    return (
        <View 
            style={styles.container}
        >
            <Image
                style={styles.img}
                source={require('../../assets/icons/cat-toy.png')}
            />

            <Text
                style={styles.title}
            >
                OTP
            </Text>

            <View style={styles.inputBox}>
                <Text style={styles.inputTitle}>Enter one time password sent on</Text>
                <Text style={styles.phoneNum}>{phoneNumber}</Text>
                <TextInput
                    editable={!isCorretCode}
                    value={code} 
                    onChangeText={text => {
                        setCode(text)
                    }}
                    style={styles.input}
                    placeholder='123456'
                    placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                >
                </TextInput>
                    
                {renderCheckIcon()}
            </View>

            {renderResend()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center'
    },
    img: {
        height: 100,
        width: 100,
        marginBottom: 20,
    },
    title: {
        fontFamily: 'RedHatText-Bold',
        fontSize: 25,
        marginBottom: 25
    },
    inputBox: {
        alignItems: 'center',
        marginBottom: 20,
    },
    phoneNum: {
        marginTop: 16,
        marginBottom: 20,
        fontFamily: 'RedHatText-Bold',
        fontSize: 16,
    },
    input: {
        position: 'relative',
        width: windowWidth - windowWidth / 3,
        color: "#000",
        textAlign: 'center',
        backgroundColor: '#EEEEEE',
        borderRadius: 15,
        padding: 10,
    },
})