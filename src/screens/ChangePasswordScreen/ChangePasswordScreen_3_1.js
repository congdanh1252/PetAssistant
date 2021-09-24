import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native'
import { Button} from 'react-native-elements/dist/buttons/Button';
import { Input } from 'react-native-elements/dist/input/Input'
import { TextInput, TouchableOpacity  } from 'react-native-gesture-handler';
// import { Input } from 'react-native-elements';
import COLORS from '../../theme/colors';
import ProgressBar from '../../components/ProgressBar'

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const ChangePasswordScreen_3_1 = () => {
    const [phoneNumber, setPhoneNumber] = useState('+84 945 454 454')
    const [resendTime, setResendTime] = useState(59)

    // let timer = setInterval(countDown(), 1000)

    // const countDown = () => {
    //     resendTime == 0 
    //     ? clearInterval(timer)
    //     : setResendTime(resendTime - 1)
    // }
    
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
                <TextInput style={styles.input}
                    placeholder='Goffy'
                    placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                />
            </View>

            <Text
                style={{
                    color: COLORS.primaryDark,
                    fontSize: 12,
                }}
            >
                Resend code? Try again in ({resendTime}s)
            </Text>
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
        width: windowWidth - windowWidth / 3,
        color: "#000",
        textAlign: 'center',
        backgroundColor: '#EEEEEE',
        borderRadius: 15,
        padding: 10,
    }
})