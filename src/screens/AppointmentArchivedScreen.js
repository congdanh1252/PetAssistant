import React, { useState, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput,
    TouchableWithoutFeedback, TouchableHighlight
} from 'react-native';
import { Button } from "react-native-elements/dist/buttons/Button";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import BottomSheet from '@gorhom/bottom-sheet';

import { windowWidth, windowHeight } from '../models/common/Dimensions';

import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';
import Appointment from '../models/appointment';

const AppointmentArchivedScreen = ({route, navigation}) => {
    const data = [
        {
            _id: 'id1',
            third_party_thumbnail: 'https://petnhatrang.com/wp-content/uploads/2016/07/1527681338-485.png',
            third_party_name: 'Phòng khám Thành Nội',
            third_party_address: '34 Trương Định, Cầu Giấy, Hà Nội',
            customer_name: 'Mai Công Danh',
            customer_phone_number: '0909 555 333',
            appointment_time: '17:00',
            appointment_date: '09/05/2022',
            service: [
                'Khám tổng quát, Tiêm ngừa, Truyền nước biển'
            ],
            status: 'Chờ xác nhận',
            status_code: '0',
        },
        {
            _id: 'id2',
            third_party_thumbnail: 'https://petnhatrang.com/wp-content/uploads/2016/07/1527681338-485.png',
            third_party_name: 'Phòng khám Thành Nội',
            third_party_address: '34 Trương Định, Cầu Giấy, Hà Nội',
            customer_name: 'Mai Công Danh',
            customer_phone_number: '0909 555 333',
            appointment_time: '17:00',
            appointment_date: '09/05/2022',
            service: [
                'Khám tổng quát, Tiêm ngừa, Truyền nước biển'
            ],
            status: 'Đã xác nhận',
            status_code: '1',
        },
        {
            _id: 'id3',
            third_party_thumbnail: 'https://petnhatrang.com/wp-content/uploads/2016/07/1527681338-485.png',
            third_party_name: 'Phòng khám Thành Nội',
            third_party_address: '34 Trương Định, Cầu Giấy, Hà Nội',
            customer_name: 'Mai Công Danh',
            customer_phone_number: '0909 555 333',
            appointment_time: '17:00',
            appointment_date: '09/05/2022',
            service: [
                'Khám tổng quát, Tiêm ngừa, Truyền nước biển'
            ],
            status: 'Thành công',
            status_code: '2',
        },
        {
            _id: 'id4',
            third_party_thumbnail: 'https://petnhatrang.com/wp-content/uploads/2016/07/1527681338-485.png',
            third_party_name: 'Phòng khám Thành Nội',
            third_party_address: '34 Trương Định, Cầu Giấy, Hà Nội',
            customer_name: 'Mai Công Danh',
            customer_phone_number: '0909 555 333',
            appointment_time: '17:00',
            appointment_date: '09/05/2022',
            service: [
                'Khám tổng quát, Tiêm ngừa, Truyền nước biển'
            ],
            status: 'Đã hủy',
            status_code: '3',
        },
    ];
    const [appointment, setAppointment] = useState(new Appointment());
    const [show, setShow] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [items, setItems] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [filter, setFilter] = useState('');

    const snapPoints = useMemo(() => ['62%', '62%'], []);
    const filterSnapPoints = useMemo(() => ['34%', '34%'], []);

    const getItemListOrderByRating = (con) => {
        // const subscriber =
        // firestore()
        // .collection('thirdParty')
        // .orderBy('rating', con)
        // .get()
        // .then(querySnapshot => {
        //     var list = new Array();
        //     querySnapshot.forEach(documentSnapshot => {
        //         if (documentSnapshot.data().category == category) {
        //             var item = new thirdParty();
        //             item.update(documentSnapshot.data());
        //             item._id = documentSnapshot.id;
        //             list.push(item);
        //         }
        //     })
        //     setItems(list);
        //     // setDataList(list);
        // })
    }

    const filterListBySearch = (input) => {
        // var newList = [];
        // dataList.forEach(item => {
        //     if (item.name.toLowerCase().includes(input.toLowerCase())) {
        //         newList.push(item);
        //     }
        // });
        // setItems(newList);
        // input == "" ? setFilter('') : setFilter(filter);
    }

    const initAppointmentDetailData = (item) => {
        let data = new Appointment();
        data.update(item)
        setAppointment(data)
    }

    const ItemStatusTextInBtSht = () => {
        let color = '';

        switch (appointment.status_code) {
            case '0':
                color = COLORS.yellow;
                break;
            case '1':
                color = COLORS.blue;
                break;
            case '2':
                color = COLORS.success;
                break;
            default:
                color = COLORS.black;
        }

        return (
            <Text style={[style.item_status, {color: color, marginTop: 0}]}>
                {appointment.status}
            </Text>
        )
    }

    const Items = () => {
        return (
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                <View style={style.item_list_container} >    
                {
                    data.map((item) => {
                        const Status = () => {
                            let color = '';

                            switch (item.status_code) {
                                case '0':
                                    color = COLORS.yellow;
                                    break;
                                case '1':
                                    color = COLORS.blue;
                                    break;
                                case '2':
                                    color = COLORS.success;
                                    break;
                                default:
                                    color = COLORS.black;
                            }

                            return (
                                <Text style={[style.item_status, {color: color}]}>
                                    {item.status}
                                </Text>
                            )
                        }

                        return (
                            <TouchableOpacity
                                key={item._id}
                                activeOpacity={0.8}
                                style={style.item_holder}
                                onPress={() => {
                                    initAppointmentDetailData(item)
                                    setShowDetail(true)
                                }}
                            >
                                <Image
                                    source={{uri: item.third_party_thumbnail}}
                                    style={style.item_thumbnail}
                                />

                                <Text style={style.item_title} numberOfLines={1}>{item.third_party_name}</Text>

                                <View style={style.item_info_holder}>
                                    <Image
                                        source={require('../assets/icons/ic_calendar.png')}
                                        style={[style.info_icon, {tintColor: '#000'}]}
                                    />

                                    <Text style={style.info_text}>{item.appointment_time} - {item.appointment_date}</Text>
                                </View>

                                <View style={style.item_info_holder}>
                                    <Image
                                        source={require('../assets/icons/ic_calendar.png')}
                                        style={[style.info_icon, {tintColor: '#000'}]}
                                    />

                                    <Text style={style.info_text} numberOfLines={2}>{item.service}</Text>
                                </View>

                                <Status/>
                            </TouchableOpacity>
                        )
                    })
                }
                </View>
            </ScrollView>
        )
    }

    //load pet list
    useEffect(() => {
        // const subscriber = firestore()
        // .collection('thirdParty')
        // .where('category', '==', category)
        // .onSnapshot(querySnapshot => {
        //     var list = new Array();
        //     querySnapshot.forEach(documentSnapshot => {
        //         var item = new thirdParty();
        //         item.update(documentSnapshot.data());
        //         item._id = documentSnapshot.id;
        //         list.push(item);
        //     })
        //     setItems(list);
        //     setDataList(list);
        // })

        //return () => subscriber();
    }, []);

    //Main 
    return (
        <View style={style.screen}>
            <View style={style.header}>
                <BackButton
                    container={'trans'}
                    navigation={navigation}
                />

                <Text style={style.headerTitle}>Lưu trữ</Text>
            </View>

            <View style={style.container}>
                <TextInput
                    style={style.input}
                    placeholder={strings.find}
                    onChangeText={(value) => {
                        filterListBySearch(value)
                    }}
                />

                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                        setShow(true)
                    }}
                    style={{width: 70, marginTop: 24, marginBottom: 8}}
                >
                    <Text style={style.title}>{strings.sort}</Text>
                </TouchableOpacity>
                
                <Items/>
            </View>

            {/* BottomSheet Detail Appointment */}
            {
                !showDetail ?
                    null
                :
                    <TouchableWithoutFeedback onPress={() => {setShowDetail(false)}}>
                        <View style={style.overlay}>
                            <BottomSheet
                                index={1}
                                snapPoints={snapPoints}
                                backgroundStyle={{borderWidth: 1}}
                                style={style.dropdown_bottomsheet}
                                enableOverDrag={false}
                                enablePanDownToClose={true}
                                onClose={() => {setShowDetail(false)}}
                            >
                                <View style={style.detail_container}>
                                    <Text style={style.detail_title}>CHI TIẾT{"\n"}LỊCH HẸN</Text>

                                    {/* Third party name */}
                                    <View style={style.detail_info_holder}>
                                        <Text style={style.detail_info_bold}>
                                            {appointment.third_party_name}
                                        </Text>
                                    </View>

                                    {/* Third party address */}
                                    <Text style={style.info_text}>
                                        {appointment.third_party_address}
                                    </Text>

                                    <Text
                                        style={[style.detail_info_bold, {
                                            alignSelf: 'center',
                                            marginTop: 14,
                                            marginBottom: 14,
                                        }]}
                                    >
                                        THÔNG TIN LỊCH HẸN
                                    </Text>

                                    <View style={{flexDirection: 'row'}}>
                                        {/* Name */}
                                        <View style={style.detail_info_holder}>
                                            <Text style={style.detail_info_bold}>
                                                {strings.customer_label}:
                                            </Text>

                                            <Text style={style.info_text}>
                                                {appointment.customer_name}
                                            </Text>
                                        </View>

                                        {/* phoneNumber */}
                                        <View style={[style.detail_info_holder, {marginLeft: 20}]}>
                                            <Text style={style.detail_info_bold}>
                                                ĐT:
                                            </Text>

                                            <Text style={style.info_text}>
                                                {appointment.customer_phone_number}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Appointment Time */}
                                    <View style={style.detail_info_holder}>
                                        <Text style={style.detail_info_bold}>
                                            Thời gian hẹn:
                                        </Text>

                                        <Text style={style.info_text}>
                                            {appointment.appointment_time} ngày {appointment.appointment_date}
                                        </Text>
                                    </View>

                                    {/* Sent Time */}
                                    <View style={style.detail_info_holder}>
                                        <Text style={style.detail_info_bold}>
                                            Thời gian đặt:
                                        </Text>

                                        <Text style={style.info_text}>
                                            {appointment.created_at}
                                        </Text>
                                    </View>

                                    {/* Services */}
                                    <View style={style.detail_info_holder}>
                                        <Text style={style.detail_info_bold}>
                                            Nội dung dịch vụ: {' '}
                                            <Text style={[style.info_text, {fontWeight: 'normal'}]}>
                                                {appointment.service}
                                            </Text>
                                        </Text>
                                    </View>

                                    {/* Note */}
                                    <View style={style.detail_info_holder}>
                                        <Text style={style.detail_info_bold}>
                                            Ghi chú:
                                        </Text>

                                        <Text style={style.info_text}>
                                            {appointment.note}
                                        </Text>
                                    </View>

                                    {/* Status */}
                                    <View style={style.detail_info_holder}>
                                        <Text style={style.detail_info_bold}>
                                            Tình trạng: {' '}
                                        </Text>

                                        <ItemStatusTextInBtSht/>
                                    </View>

                                    {
                                        parseInt(appointment.status_code) < 2 ?
                                            <Button
                                                title={strings.cancel}
                                                titleStyle={style.button_title}
                                                buttonStyle={style.button}
                                                onPress={() => {

                                                }}
                                            >
                                            </Button>
                                        : null
                                    }
                                </View>
                            </BottomSheet>
                        </View>
                    </TouchableWithoutFeedback>
            }

            {/* BottomSheet Filter */}
            {
                !show ?
                    null
                :
                    <TouchableWithoutFeedback onPress={() => {setShow(false)}}>
                        <View style={style.overlay}>
                            <BottomSheet
                                index={1}
                                snapPoints={filterSnapPoints}
                                backgroundStyle={{borderWidth: 1}}
                                style={style.dropdown_bottomsheet}
                                enableOverDrag={false}
                                enablePanDownToClose={true}
                                onClose={() => {setShow(false)}}
                            >
                                {/* Chờ xác nhận */}
                                <TouchableHighlight
                                    key={0}
                                    activeOpacity={0.7}
                                    underlayColor='#EEEEEE'
                                    style={
                                        filter != '0'
                                        ?
                                        style.dropdown_option
                                        :
                                        [style.dropdown_option, {backgroundColor: COLORS.grey}]
                                    }
                                    onPress={() => {
                                        setShow(false)
                                        setFilter('0')
                                        getItemListOrderByRating('desc');
                                    }}
                                >
                                    <Text style={style.dropdown_option_text}>
                                    Chờ xác nhận
                                    </Text>
                                </TouchableHighlight>

                                {/* Đã xác nhận */}
                                <TouchableHighlight
                                    key={1}
                                    activeOpacity={0.7}
                                    underlayColor='#EEEEEE'
                                    style={
                                        filter != '1'
                                        ?
                                        style.dropdown_option
                                        :
                                        [style.dropdown_option, {backgroundColor: COLORS.grey}]
                                    }
                                    onPress={() => {
                                        setShow(false)
                                        setFilter('1')
                                        getItemListOrderByRating('asc')
                                    }}
                                >
                                    <Text style={style.dropdown_option_text}>
                                    Đã xác nhận
                                    </Text>
                                </TouchableHighlight>

                                {/* Thành công */}
                                <TouchableHighlight
                                    key={2}
                                    activeOpacity={0.7}
                                    underlayColor='#EEEEEE'
                                    style={
                                        filter != '2'
                                        ?
                                        style.dropdown_option
                                        :
                                        [style.dropdown_option, {backgroundColor: COLORS.grey}]
                                    }
                                    onPress={() => {
                                        setShow(false)
                                        setFilter('2')
                                        getItemListOrderByRating('desc');
                                    }}
                                >
                                    <Text style={style.dropdown_option_text}>
                                    Thành công
                                    </Text>
                                </TouchableHighlight>

                                {/* Đã hủy */}
                                <TouchableHighlight
                                    key={3}
                                    activeOpacity={0.7}
                                    underlayColor='#EEEEEE'
                                    style={
                                        filter != '3'
                                        ?
                                        style.dropdown_option
                                        :
                                        [style.dropdown_option, {backgroundColor: COLORS.grey}]
                                    }
                                    onPress={() => {
                                        setShow(false)
                                        setFilter('3')
                                        getItemListOrderByRating('asc')
                                    }}
                                >
                                    <Text style={style.dropdown_option_text}>
                                    Đã hủy
                                    </Text>
                                </TouchableHighlight>
                            </BottomSheet>
                        </View>
                    </TouchableWithoutFeedback>
            }
        </View>
    );
}

export default AppointmentArchivedScreen;

const style = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        height: '100%',
        paddingTop: 22,
        paddingLeft: 22,
        paddingRight: 22,
        paddingBottom: 22,
        marginTop: -20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: 'column',
        backgroundColor: COLORS.white,
    },
    header: {
        width: '100%',
        height: 110,
        paddingTop: 16,
        paddingLeft: 8,
        flexDirection: 'row',
        backgroundColor: COLORS.dark,
    },
    headerTitle: {
        width: '76%',
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
        fontSize: 22,
        marginTop: 16,
        color: COLORS.white,
    },
    input: {
        width: '100%',
        height: 46,
        fontSize: 16,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#EEEEEE',
        color:COLORS.black,
    },
    filter_holder: {
        width: '100%',
        height: 50,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
    },
    item_list_container: {
        marginTop: 10,
        marginBottom: '22%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    item_holder: {
        height: windowHeight / 3,
        width: windowWidth / 2 - 30,
        marginTop: 4,
        marginBottom: 8,
        borderRadius: 12,
        flexDirection: 'column',
        borderWidth: 2,
        borderColor: COLORS.grey,
        alignItems: 'center'
    },
    item_thumbnail: {
        height: 118,
        width: '100%',
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
    },
    item_info_holder: {
        width: '98%',
        marginTop: 5,
        paddingLeft: 2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    info_icon: {
        width: 24,
        height: 24
    },
    item_title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
        marginTop: 8,
        paddingLeft: 4,
        paddingRight: 2,
    },
    item_status: {
        fontSize: 17,
        marginTop: 12,
        color: COLORS.yellow,
        fontFamily: 'Roboto-Medium',
    },
    dropdown_bottomsheet: {
        borderRadius: 10,
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
    info_text: {
        color: COLORS.black,
        fontSize: 16,
        marginLeft: 4,
        flexShrink: 1,
        fontFamily: 'Roboto-Light',
    },
    detail_container: {
        paddingLeft: 22,
        paddingRight: 22,
        flexDirection: 'column',
    },
    detail_info_holder: {
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: 8
    },
    detail_title: {
        fontSize: 18,
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        alignSelf: 'flex-end',
    },
    detail_info_bold: {
        fontSize: 16,
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
    },
    button: {
        width: 94,
        height: 40,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 12,
        alignSelf: 'flex-end',
        backgroundColor: COLORS.black,
    },
    button_title: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: COLORS.white,
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