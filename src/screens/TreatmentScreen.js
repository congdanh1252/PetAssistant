import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import COLORS from '../theme/colors';
import Treatment from '../models/treatment';
import strings from '../data/strings';

const TreatmentScreen = ({route, navigation}) => {
    const { pet_id } = route.params;
    const [msgEmpty, setMsgEmpty] = useState('');
    const [expandList, setExpandList] = useState([]);
    const [treatmentList, setTreatmentList] = useState([]);

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

    const TreatmentList = () => {
        var list = [];
        for (let i = 0; i < treatmentList.length; i++) {
            list.push(
                <View
                    key={i}
                    style={
                        !expandList[i]
                        ? 
                        style.vaccine_item : [style.vaccine_item, {height: 150}]
                    }
                >
                    {/* Mũi tên */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={style.item_title_holder}
                        onPress={() => {
                            handleExpand(i)
                        }}
                    >
                        <Text style={style.title}>🏥️  {convertJsDate(treatmentList[i].taken_date)}</Text>

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
                            <Text style={style.label}>
                                {strings.content_label}: {treatmentList[i].detail}
                            </Text>

                            <View style={style.item_title_holder}>
                                <Text style={style.label}>
                                    {strings.taken_medicine_label}: {treatmentList[i].medicine}
                                </Text>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        navigation.navigate('AddTreatment', {
                                            action: 'edit',
                                            pet_id: pet_id,
                                            treatmentParam: treatmentList[i]
                                        })
                                    }}
                                >
                                    <Image source={require('../assets/icons/Pen.png')}/>
                                </TouchableOpacity>
                            </View>
                            
                            <Text style={style.label}>
                                {strings.note_label}: {treatmentList[i].note}
                            </Text>
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

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            var expand = [];

            for (let i = 0; i < treatmentList.length; i++) {
                expand.push(false);
            }
            setExpandList(expand);
        }
        return () => isMounted = false;
    }, [treatmentList]);

    //load vaccine list
    useEffect(() => {
        const subscriber = firestore()
        .collection('users/' + auth().currentUser.uid + '/pets/' + pet_id + '/treatment')
        .orderBy('taken_date', 'desc')
        .onSnapshot(querySnapshot => {
            var list = new Array();
            querySnapshot.forEach(documentSnapshot => {
                var treatment = new Treatment();
                treatment.update(documentSnapshot.data());
                treatment.taken_date = new Date(documentSnapshot.data().taken_date.toDate());
                treatment._id = documentSnapshot.id;
                list.push(treatment);
            })
            if (list.length == 0) {
                setMsgEmpty('Không có dữ liệu đã lưu')
            }
            setTreatmentList(list);
        })

        return () => subscriber();
    }, []);

    return (
        <View style={style.container}>
            <ScrollView
                style={style.vaccination_list_container}
                showsVerticalScrollIndicator={false}
            >
                {
                    treatmentList.length==0 ?
                    <Text
                        style={[style.label, {
                            marginTop: 40,
                            textAlign: 'center',
                        }]}
                    >
                        {msgEmpty}
                    </Text>
                    : <TreatmentList/>
                }
            </ScrollView>

            <TouchableOpacity
                style={style.floating_button}
                activeOpacity={0.7}
                onPress={() => {
                    navigation.navigate('AddTreatment', {
                        pet_id: pet_id,
                        action: 'add'
                    });
                }}
            >
                <Image
                    source={require('../assets/icons/Add.png')}
                    style={style.add_btn}
                />
            </TouchableOpacity>
        </View>
    );
}

export default TreatmentScreen;

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
        marginBottom: 12,
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
        backgroundColor: COLORS.white,
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
        height: 90,
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
    }
});