import React from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';

import COLORS from '../theme/colors';
import strings from '../data/strings';

const HomeScreen = ({navigation}) => {
    //Main 
    return (
        <View style={style.container}>
            <View style={style.header}>
                <View>

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
                        <Text style={style.activity_heading}>3</Text>
                        <Text style={style.activity_label}>
                            {strings.activity.toLowerCase()}
                        </Text>
                    </View>

                    <View style={style.activity_box}>
                        <Text style={style.activity_heading}>3</Text>
                        <Text style={style.activity_label}>
                            {strings.activity.toLowerCase()}
                        </Text>
                    </View>

                    <View style={style.activity_box}>
                        <Text style={style.activity_heading}>3</Text>
                        <Text style={style.activity_label}>
                            {strings.activity.toLowerCase()}
                        </Text>
                    </View>
                </View>

                <View style={style.menu}>
                    {/* Quản lý thú cưng */}
                    <TouchableOpacity
                        style={style.menu_box}
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
                        style={style.menu_box}
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
                        style={style.menu_box}
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
                        style={style.menu_box}
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
                    <TouchableOpacity
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
                    </TouchableOpacity>

                </View>
            </View>
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
        backgroundColor: COLORS.white,
    },
    logo: {
        width: 90,
        height: 90
    },
    content: {
        width: '100%',
        marginTop: 16,
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
        backgroundColor: COLORS.dark
    },
    activity_heading: {
        fontSize: 44,
        fontFamily: 'Roboto-Bold',
        color: COLORS.white
    },
    activity_label: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        color: COLORS.white
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
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white
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
});