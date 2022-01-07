import React, { useEffect, useMemo, useState } from 'react';
import {
    Image, StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback,
    TouchableHighlight
} from 'react-native';
import auth from '@react-native-firebase/auth';
import BottomSheet from '@gorhom/bottom-sheet';

import COLORS from '../theme/colors';
import strings from '../data/strings';
import User from '../models/user';
import {
    getUserName
} from '../api/UserAPI'
import {
    getDateReminder
} from '../api/ReminderAPI'
import {
    getMonthTotal
} from '../api/ExpenditureAPI'

const HomeScreen = ({navigation}) => {
    const [show, setShow] = useState(false);
    const snapPoints = useMemo(() => ['19%', '19%'], []);
    const [amountReminder, setAmountReminder] = useState(0);
    const [total, setTotal] = useState(0);

    const [user, setUser] = useState(new User())

    useEffect(() => {
        let isCancelled = false;
        getUserName(user => {
            console.log(user);
            setUser(user)
        })
        return () => {
            isCancelled = true
        }
    }, [])

    useEffect(() => {
        let isCancelled = false
        getDateReminder(new Date(), (reminders, oldReminder) => {
            console.log(reminders);
            setAmountReminder(reminders.length)
        })
        return () => {
            isCancelled = true
        }
    }, [])

    useEffect(() => {
        let isCancelled = false
        getMonthTotal(new Date(), total => {
            setTotal(total)
        })
        return () => {
            isCancelled = true
        }
    }, [])

    // useEffect(() => {
    //     let isCancelled = false
    //     getMonthTotal(new Date(), total => {
    //         setTotal(total)
    //     })
    //     return () => {
    //         isCancelled = true
    //     }
    // }, [])

    //Main 
    
    return (
        <View style={style.container}>
            <View style={style.header}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setShow(true)}
                >
                    <Image
                        style={[style.saved_button, {tintColor: COLORS.black}]}
                        source={require('../assets/icons/Hamburger.png')}
                    />
                </TouchableOpacity>

                <View style={{
                    marginLeft: -50,
                }}>
                    <Text style={{
                        fontFamily: 'Roboto-Regular',
                        color: COLORS.black,
                    }}>
                        {
                            new Date().getHours() > 17  
                            ? "Chào buổi tối,"
                            : new Date().getHours() > 12  
                            ? "Chào buổi chiều,"
                            : "Chào buỏi sáng,"
                        }
                    </Text>

                    <Text style={{
                        fontFamily: 'Roboto-Bold',
                        fontSize: 20,
                        color: COLORS.black
                    }}>
                        {user.name}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Profile')
                    }}
                >
                    <Image
                        source={require('../assets/icons/Logo.png')}
                        style={style.logo}
                    />
                </TouchableOpacity>
            </View>

            <View style={style.content}>
                <View style={style.activities}>
                    <View style={style.activity_box}>
                        <Text style={style.activity_heading}>
                            {amountReminder}
                        </Text>
                        <Text style={style.activity_label}>
                            {strings.activity.toLowerCase()}
                        </Text>
                    </View>

                    <View style={style.activity_box}>
                        <Text style={style.activity_heading}>
                            {"10"}
                        </Text>
                        <Text style={style.activity_label}>
                            {strings.activity.toLowerCase()}
                        </Text>
                    </View>

                    <View style={style.activity_box}>
                        <Text style={style.amount_title}>
                            {total}
                        </Text>
                        <Text style={style.activity_label}>
                            {strings.expenditure.toLowerCase()}
                        </Text>
                    </View>
                </View>

                <View style={style.menu}>
                    {/* Quản lý thú cưng */}
                    <TouchableOpacity
                        style={[style.menu_box, {marginRight: 8}]}
                        activeOpacity={0.7}
                        onPress={() => {
                            navigation.navigate('MyPets')
                        }}
                    >
                        <Image
                            source={require('../assets/icons/ic_cat_fl.png')}
                            style={style.menu_icon}
                        />

                        <Text style={style.menu_title}>{strings.pet_management}</Text>
                    </TouchableOpacity>

                    {/* Thời gian biểu */}
                    <TouchableOpacity
                        style={[style.menu_box, {marginLeft: 8}]}
                        activeOpacity={0.7}
                        onPress={() => {
                            navigation.navigate('ScheduleStack')
                        }}
                    >
                        <Image
                            source={require('../assets/icons/ic_schedules_fl.png')}
                            style={style.menu_icon}
                        />

                        <Text style={style.menu_title}>{strings.schedules}</Text>
                    </TouchableOpacity>

                    {/* Quản lý chi tiêu */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[style.menu_box, {marginRight: 8}]}
                        onPress={() => {
                            navigation.navigate('ExpenditureStack')
                        }}
                    >
                        <Image
                            source={require('../assets/icons/ic_shopping_fl.png')}
                            style={style.menu_icon}
                        />

                        <Text style={style.menu_title}>{strings.expenditure_management}</Text>
                    </TouchableOpacity>

                    {/* Cẩm nang chăm sóc */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[style.menu_box, {marginLeft: 8}]}
                        onPress={() => {
                            navigation.navigate('Guides');
                        }}
                    >
                        <Image
                            source={require('../assets/icons/ic_guide_fl.png')}
                            style={style.menu_icon}
                        />

                        <Text
                            style={style.menu_title}
                            >
                                {strings.care_guide}
                        </Text>
                    </TouchableOpacity>

                    {/* Chuẩn đoán bệnh */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={style.menu_box}
                        onPress={() => {
                            navigation.navigate('PredictStack')
                        }}
                    >
                        <Image
                            source={require('../assets/icons/ic_doctor_fl.png')}
                            style={style.menu_icon}
                        />

                        <Text style={style.menu_title}>{strings.diagnosis}</Text>

                    </TouchableOpacity>

                    {/* Tìm kiếm thông tin */}
                    {/* <TouchableOpacity
                        activeOpacity={0.7}
                        style={style.menu_box}
                        onPress={() => {
                            navigation.navigate('Searching')
                        }}
                    >
                        <Image
                            source={require('../assets/icons/ic_search_fl.png')}
                            style={style.menu_icon}
                        />

                        <Text style={style.menu_title}>{strings.search_info}</Text>
                    </TouchableOpacity> */}
                </View>
            </View>

            {/* BottomSheet góp ý */}
            {
                !show ?
                    null
                :
                    <TouchableWithoutFeedback onPress={() => setShow(false)}>
                        <View style={style.overlay}>
                            <BottomSheet
                                index={1}
                                snapPoints={snapPoints}
                                backgroundStyle={{borderWidth: 1}}
                                style={style.dropdown_bottomsheet}
                                enableOverDrag={false}
                                enablePanDownToClose={true}
                                onClose={() => setShow(false)}
                            >
                                {/* Góp ý */}
                                <TouchableHighlight
                                    key={1}
                                    activeOpacity={0.7}
                                    underlayColor='#EEEEEE'
                                    style={style.dropdown_option}
                                    onPress={() => {
                                        navigation.navigate('Feedback');
                                        setShow(false);
                                    }}
                                >
                                    <View style={style.dropdown_detail}>
                                        <Image
                                            style={style.dropdown_option_icon}
                                            source={require('../assets/icons/ic_mail.png')}
                                        />

                                        <Text style={style.dropdown_option_text}>
                                            {strings.feedback_n_report_label}
                                        </Text>
                                    </View>
                                </TouchableHighlight>

                                {/* Đăng xuất */}
                                <TouchableHighlight
                                    key={2}
                                    activeOpacity={0.7}
                                    underlayColor='#EEEEEE'
                                    style={style.dropdown_option}
                                    onPress={() => {
                                        auth()
                                        .signOut()
                                        .then(() => console.log('User signed out!'));
                                        navigation.navigate('Login')
                                    }}
                                >
                                    <View style={style.dropdown_detail}>
                                        <Image
                                            style={style.dropdown_option_icon}
                                            source={require('../assets/icons/ic_logout.png')}
                                        />

                                        <Text style={style.dropdown_option_text}>
                                            {strings.logout_label}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            </BottomSheet>
                        </View>
                    </TouchableWithoutFeedback>
            }
        </View>
    );
}

export default HomeScreen;

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        width: '100%',
        height: 110,
        paddingRight: 20,
        paddingLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 90,
        height: 90
    },
    content: {
        width: '100%',
        backgroundColor: COLORS.white,
    },
    activities: {
        height: '20%',
        paddingTop: 16,
        paddingLeft: 20,
        paddingRight: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.black
    },
    activity_box: {
        width: 112,
        height: 90,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: COLORS.dark,
        justifyContent: 'space-around',
    },
    activity_heading: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        color: COLORS.white
    },
    amount_title: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        color: COLORS.white
    },
    activity_label: {
        fontSize: 12,
        fontFamily: 'Roboto-Medium',
        color: COLORS.white,
    },
    menu: {
        height: '80%',
        marginTop: -22,
        paddingTop: '4%',
        paddingBottom: '5%',
        paddingLeft: '7%',
        paddingRight: '7%',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    menu_box: {
        width: '47%',
        height: '27%',
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 8,
        marginBottom: 8,
        borderWidth: 0.5,
        borderRadius: 20,
        borderColor: COLORS.dark,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: COLORS.white
    },
    menu_icon: {
        width: '46%',
        height: '46%',
    },
    menu_title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
    },
    saved_button: {
        width: 32,
        height: 32,
    },
    dropdown_bottomsheet: {
        borderRadius: 10,
    },
    dropdown_detail: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    dropdown_option_icon: {
        height: 20,
        width: 20,
        marginRight: 16
    },
    dropdown_option: {
        width: '99%',
        height: 60,
        padding: 24,
        alignSelf: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1.5,
        borderColor: COLORS.grey,
    },
    dropdown_option_text: {
        color: COLORS.black,
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
    },
    overlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
});