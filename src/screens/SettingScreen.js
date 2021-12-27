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
    getUserInfo
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
        console.log(type + "/" + value);
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
                        placeholder={value}
                        placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                    >
                    </TextInput>
                </View>
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
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
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
