import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import COLORS from '../theme/colors';
import Vaccine from '../models/vaccine';
import strings from '../data/strings';

const VaccinationScreen = ({route, navigation}) => {
    const { pet_id, pet_kind } = route.params;
    const [expandList, setExpandList] = useState([]);
    const [taken, setTaken] = useState([]);
    const [msgEmpty, setMsgEmpty] = useState('');
    const [vaccineList, setVaccineList] = useState([]);
    const [photoShow, setPhotoShow] = useState('');

    const convertJsDate = (date) => {
        return (
            String(date.getDate()).padStart(2, '0') + "/" +
            String(date.getMonth() + 1).padStart(2, '0') + "/" +
            date.getFullYear()
        );
    }

    const handleExpand = (order) => {
        var expand = []
        for (let i = 0; i < expandList.length; i++) {
            expand.push(expandList[i]);
        }
        expand[order] = !expand[order];
        setExpandList(expand);
    }

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            var list = [];
            var expand = [];
            var taken_check = [0, 0, 0, 0];

            pet_kind == 'Chó'
            ? list = ['Mũi 1', 'Mũi 2', 'Mũi 3', 'Bệnh Dại']
            : list = ['Bệnh giảm bạch cầu', 'Bệnh Viêm mũi', 'Bệnh do Herpesvirus', 'Bệnh Dại'];

            for (let i = 0; i < vaccineList.length; i++) {
                expand.push(false);

                if (list.includes(vaccineList[i].type)) {
                    switch (vaccineList[i].type) {
                        case 'Mũi 1':
                            taken_check[0] = 1;
                            break;
                        case 'Bệnh giảm bạch cầu':
                            taken_check[0] = 1;
                            break;
                        case 'Mũi 2':
                            taken_check[1] = 1;
                            break;
                        case 'Bệnh Viêm mũi':
                            taken_check[1] = 1;
                            break;
                        case 'Mũi 3':
                            taken_check[2] = 1;
                            break;
                        case 'Bệnh do Herpesvirus':
                            taken_check[2] = 1;
                            break;
                        default:
                            taken_check[3] = 1;
                    }
                }
            }
            setTaken(taken_check);
            setExpandList(expand);
        }
        return () => isMounted = false;
    }, [vaccineList]);

    const VaccineList = () => {
        var list = [];
        for (let i = 0; i < vaccineList.length; i++) {
            list.push(
                <View
                    key={i}
                    style={
                        !expandList[i]
                        ? 
                        style.vaccine_item : [style.vaccine_item, {height: 216}]
                    }
                >
                    {/* Mũi tên */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={style.item_title_holder}
                        onPress={() => {
                            handleExpand(i);
                        }}
                    >
                        <Text style={style.title}>
                            💉  {convertJsDate(vaccineList[i].taken_date)}    •    {vaccineList[i].type}
                        </Text>

                        <Image
                            style={
                                expandList[i]
                                ?
                                style.arrow_down : style.arrow_horiz
                            }
                            source={require('../assets/icons/Back_black.png')}
                        />
                    </TouchableOpacity>

                    {/* Mục lục chi tiết */}
                    {
                        expandList[i]
                        ?
                        <View style={style.vaccine_detail_holder}>
                            <Text style={style.label}>{strings.injection_label}: {vaccineList[i].detail}</Text>

                            <View style={style.item_title_holder}>
                                <Text style={style.label}>{strings.vaccine_label}:</Text>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setPhotoShow(vaccineList[i].label_photo)}
                                >
                                    <Image
                                        style={{width: 75, height: 70, borderRadius: 6}}
                                        source={{uri: vaccineList[i].label_photo}}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        navigation.navigate('AddVaccine', {
                                            pet_id: pet_id,
                                            action: 'edit',
                                            pet_kind: pet_kind,
                                            vaccineParam: vaccineList[i]
                                        });
                                    }}
                                >
                                    <Image source={require('../assets/icons/Pen.png')}/>
                                </TouchableOpacity>
                            </View>
                            
                            <Text style={style.label}>{strings.vaccine_retake_date}: {convertJsDate(vaccineList[i].retake_date)}</Text>
                        </View>
                        : null
                    }
                </View>
            )
        }

        return (
            <View>
                {list}
            </View>
        )
    }

    const TakenTable = () => {
        return (
            <View style={style.taken_list_container}>
                <View style={style.two_vaccine_row}>
                    <Text style={style.label}>
                        1. {pet_kind == 'Chó' ? 'Mũi 1 • 5 bệnh' : 'Bệnh giảm bạch cầu'}  {taken[0] ==  1 ? '💉' : '❌'}
                    </Text>

                    <Text style={style.label}>
                        2. {pet_kind == 'Chó' ? 'Mũi 2 • 7 bệnh' : 'Bệnh Viêm mũi'}  {taken[1] ==  1 ? '💉' : '❌'}
                    </Text>
                </View>

                <View style={style.two_vaccine_row}>
                    <Text style={style.label}>
                        3. {pet_kind == 'Chó' ? 'Mũi 3 • 7 bệnh' : 'Bệnh do Herpesvirus'}  {taken[2] ==  1 ? '💉' : '❌'}
                    </Text>

                    <Text style={style.label}>
                        4. {pet_kind == 'Chó' ? 'Mũi 4 • Bệnh Dại' : 'Bệnh Dại'}  {taken[3] ==  1 ? '💉' : '❌'}
                    </Text>
                </View>
            </View>
        )
    }

    //load vaccine list
    useEffect(() => {
        const subscriber = firestore()
        .collection('users/' + auth().currentUser.uid + '/pets/' + pet_id + '/vaccination')
        .orderBy('taken_date', 'desc')
        .onSnapshot(querySnapshot => {
            var list = new Array();
            querySnapshot.forEach(documentSnapshot => {
                var vaccine = new Vaccine();
                vaccine.update(documentSnapshot.data());
                vaccine.taken_date = new Date(documentSnapshot.data().taken_date.toDate());
                vaccine.retake_date = new Date(documentSnapshot.data().retake_date.toDate());
                vaccine._id = documentSnapshot.id;
                list.push(vaccine);
            })
            if (list.length == 0) {
                setMsgEmpty('Không có dữ liệu đã lưu')
            }
            setVaccineList(list);
        })

        return () => subscriber();
    }, []);

    return (
        <>
            <View style={style.container}>
                <ScrollView
                    style={style.vaccination_list_container}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        vaccineList.length==0 ?
                        <Text
                            style={[style.label, {
                                marginTop: 40,
                                textAlign: 'center',
                            }]}
                        >
                            {msgEmpty}
                        </Text>
                        : <VaccineList/>
                    }
                </ScrollView>

                {/* Vắc-xin đã tiêm */}
                {
                    (pet_kind == 'Chó' || pet_kind == 'Mèo')
                    ? <TakenTable/>
                    : null
                }

                <TouchableOpacity
                    style={style.floating_button}
                    activeOpacity={0.7}
                    onPress={() => {
                        navigation.navigate('AddVaccine', {
                            pet_id: pet_id,
                            action: 'add',
                            pet_kind: pet_kind,
                        });
                    }}
                >
                    <Image
                        source={require('../assets/icons/Add.png')}
                        style={style.add_btn}
                    />
                </TouchableOpacity>
            </View>

            {/* Xem ảnh */}
            {
                photoShow == '' ?
                null
                :
                <View style={style.overlay}>
                    <Image resizeMode='contain' style={style.full_width_photo} source={{uri: photoShow=='' ? null : photoShow}}/>

                    <TouchableOpacity
                        activeOpacity={0.6}
                        style={style.close_btn}
                        onPress={() => setPhotoShow('')}
                    >
                        <Image
                            style={{width: 24, tintColor: '#fff'}}
                            source={require('../assets/icons/ic_x.png')}
                        />
                    </TouchableOpacity>
                </View>
            }
        </>
    );
}

export default VaccinationScreen;

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '90%',
        padding: 22,
        flexDirection: 'column',
        backgroundColor: COLORS.white,
    },
    vaccination_list_container: {
        width: '100%',
        height: '40%',
        marginBottom: 24,
        backgroundColor: COLORS.white
    },
    taken_list_container: {
        width: '100%',
        height: 100,
        marginBottom: 16,
        borderRadius: 22,
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: COLORS.black,
        backgroundColor: COLORS.white
    },
    two_vaccine_row: {
        padding: 14,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    vaccine_item: {
        width: '100%',
        height: 50,
        fontSize: 16,
        padding: 12,
        elevation: 4,
        shadowRadius: 10,
        borderRadius: 12,
        marginBottom: 12,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.grey,
    },
    item_title_holder: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        color: COLORS.black
    },
    label: {
        color: COLORS.black,
        fontFamily: 'Roboto-Light',
        fontSize: 16,
    },
    arrow_horiz: {
        transform: [{
            rotateZ: '0deg',
        }]
    },
    arrow_down: {
        transform: [{
            rotateZ: '-90deg',
        }]
    },
    vaccine_detail_holder: {
        height: 160,
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    floating_button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
    },
    add_btn: {
        width: 56,
    },
    close_btn: {
        width: 48,
        height: 48,
        marginTop: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#fff',
        alignItems: 'center'
    },
    overlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    full_width_photo: {
        width: '100%',
        height: '70%',
        marginTop: '-20%',
    },
});