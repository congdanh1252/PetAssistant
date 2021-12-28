import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


import {
    PenIcon
} from '../assets/icons/index'
import COLORS from '../theme/colors';
import strings from '../data/strings';
import User from '../models/user'
import {
    getUserInfo
} from '../api/UserAPI'
import {
    moneyFormat
} from '../models/common/moneyStringFormat'

const ProfileScreen = ({navigation}) =>  {
    const [user, setUser] = useState(new User())

    const Author = () => {
        return (
            <View style={styles.author}>

                <Image source={require('../assets/icons/Logo.png')} />
                <Text style={{
                    margin: 20,
                    fontFamily: 'Roboto-Bold'
                }}>
                    dungtd
                </Text>

                <View style={styles.rowContainer}>
                    <Image source={require('../assets/icons/Facebook.png')} />
                    <Image source={require('../assets/icons/GitHub.png')} />
                    <Image source={require('../assets/icons/LinkedIn.png')} />

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

    useEffect(() => {
        console.log("Listen");
        let isCancelled = false;
        const subscriber = firestore()
                .collection('users')
                .doc(auth().currentUser.uid)
                .onSnapshot(documentSnapshot => {
                    var user = new User()
                    user.update(documentSnapshot.data())
                    setUser(user)
                })
        // getUserInfo(user => {
        //     try {
        //         if (!isCancelled) {
        //             setUser(user) 
        //         }
        //     } catch (error) {
        //         if (!isCancelled)
        //             throw error;
        //     }
        // })
        return () => {
            subscriber()
            //isCancelled = true
        }
    }, [])

    const logout = () => {
        auth()
        .signOut()
        .then(() => console.log('User signed out!'));
        navigation.navigate('Login')
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
                <ScrollView>
                    {/* Account Info */}
                    <View styles={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>
                            {strings.accountInfo}
                        </Text>

                        {/* Name */}
                        <View style={styles.accountInfoContainer}>
                            <Text
                                style={styles.sectionDetailTitle}
                            >
                                {strings.name}
                            </Text>

                            <View style={styles.rowContainer}>
                                <Text style={styles.accountInfo}>
                                    {user.name}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('Setting', {
                                            type: 'name',
                                            value: user.name,
                                        })
                                    }}
                                >
                                    <Image source={PenIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Email */}
                        <View style={styles.accountInfoContainer}>
                            <Text
                                style={styles.sectionDetailTitle}
                            >
                                {strings.email}
                            </Text>

                            <Text style={styles.accountInfo}>
                                    {user.email}
                            </Text>
                        </View>
                        {/* Phone */}
                        <View style={styles.accountInfoContainer}>
                            <Text
                                style={styles.sectionDetailTitle}
                            >
                                {strings.phone}
                            </Text>
                            <Text style={styles.accountInfo}>
                                    {user.phoneNumber}
                            </Text>
                        </View>
                        {/* Password */}
                        <View style={styles.accountInfoContainer}>
                            <Text
                                style={styles.sectionDetailTitle}
                            >
                                {strings.password}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('Setting', {
                                        type: 'password',
                                        value: '',
                                    })
                                }}
                            >
                                <Text style={styles.accountInfo}>
                                        {strings.changePassword}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                    <Line />
                    {/* Setting */}
                    <View styles={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>
                            {strings.setting}
                        </Text>

                        <View>
                            {/* Expenditure Setting */}
                            <Text style={styles.sectionDetailTitle, {
                                marginLeft: 10,
                                marginTop: 10,
                            }}>
                                Cài đặt chi tiêu
                            </Text>

                            <View style={styles.accountInfoContainer}>
                                <Text
                                    style={styles.sectionDetailTitle}
                                >
                                    {strings.limit}
                                </Text>
                                <View style={styles.rowContainer}>
                                    <Text style={styles.accountInfo}>
                                        {moneyFormat(user.expenditureLimit)} VNĐ
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate('Setting', {
                                                type: 'expenditure_limit',
                                                value: user.expenditureLimit,
                                            })
                                        }}
                                    >
                                        <Image source={PenIcon} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Line />
                            {/* Another */}
                        </View>
                    </View>
                    {/* Author */}
                    <View style={styles.authorContainer}>
                        <Text style={styles.sectionTitle}>
                            {strings.authorInfo}
                        </Text>

                        <ScrollView
                            horizontal={true}
                        >
                            <Author />
                            <Author />
                        </ScrollView>
                        
                    </View>
                    {/* Logout button */}
                    <TouchableOpacity
                        onPress={logout}
                    >
                        <View style={styles.logoutButton}>
                            <Text style={{
                                color: COLORS.white
                            }}>
                                {strings.logout}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    )
}

export default ProfileScreen;

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
    sectionContainer: {
        marginBottom: 20,
    },
    headerIcon: {
        padding: 8,
    },
    bodyContainer: {
        flex: 9,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 28, 
    },
    sectionTitle: {
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
    },
    accountInfoContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sectionDetailTitle: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
    },
    accountInfo: {
        fontFamily: 'Roboto-Italic',
        fontSize: 16,
    },
    authorContainer: {
    },
    author: {
        alignItems: 'center',
        backgroundColor: COLORS.green,
        marginTop: 10,
        marginLeft: 20,
        paddingVertical: 20,
        paddingHorizontal: 80,
        borderRadius: 15,
    },
    line: {
        backgroundColor: COLORS.dark,
        width: '80%',
        marginTop: 8, 
        marginBottom: 8,
        height: .5,
        alignSelf: 'center'
    },
    logoutButton: {
        marginTop: 20,
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.dark,
        borderRadius: 15,
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },  
})
