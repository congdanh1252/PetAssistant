import React, { useEffect, useState } from "react";
import {
    StyleSheet, View, TextInput, Text, TouchableOpacity, Image, TouchableWithoutFeedback,
    Keyboard, Alert,
} from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements/dist/buttons/Button";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

import COLORS from '../theme/colors';
import strings from "../data/strings";
import BackButton from "../components/BackButton";
import Appointment from "../models/appointment";

const MakeAppointmentScreen = ({route, navigation}) => {
    var appointment = new Appointment();
    const apmObj = {
        name: 'Phong kham',
        service: [
            'Tiem ngua',
            'Truyen nuoc bien',
            'Kham tong quat'
        ]
    };
    const action = 'add'; //route.params;
    const [name, setName] = useState(action=='add' ? '' : apmObj.name);
    const [phoneNumber, setPhoneNumber] = useState(action=='add' ? '' : apmObj.phone_number);
    const [date, setDate] = useState(action=='add' ? new Date() : apmObj.appointment_date);
    const [time, setTime] = useState(action=='add' ? '' : apmObj.appointment_time);
    const [timeDisplay, setTimeDisplay] = useState('');
    const [service, setService] = useState(action=='add' ? [
        'Tiem ngua',
        'Truyen nuoc bien',
        'Kham tong quat'
    ] : apmObj.service);
    const [note, setNote] = useState(action=='add' ? '' : apmObj.note);
    const [isUploading, setUploading] = useState(false);

    const [show, setShow] = useState(false);

    const onChangeTime = (event, selectedTime) => {
        setShow(false)
        if (selectedTime != null) {
            const val = new Date(selectedTime);
            setTime(val)
            setTimeDisplay(val.getHours().toString() + ":" + String(val.getMinutes()).padStart(2, '0'))
        }
    };

    const initAppointmentData = () => {
        pet.name = name;
        pet.kind = kind;
        pet.gender = gender;
        pet.species = species;
        pet.photo = urlArr[0];
        pet.additional_photos = urlArr.splice(1);
        pet.height = parseFloat(height);
        pet.weight = parseFloat(weight);
        pet.price = parseInt(price);
        pet.discount_price = parseInt(discountPrice);
        pet.description = description;
        //action === 'edit' ? pet._id = petObj._id : null;
    }

    const checkSubmitFields = () => {
        if (name=='' || phoneNumber=='' || date=='' || time=='' || service.length < 1) {
            Alert.alert(
                strings.fail,
                strings.err_check_inputs,
                [
                    {
                        text: 'OK',
                    }
                ]
            );
        }
        else {
            console.log('check input ok');
            setUploading(true);

            if (action==='add') {
                
            }
        }
    }

    const resetAllFields = () => {
        setPhotoUri(new Array());
        setPhotoFileName(new Array());
        setName('');
        setKind('');
        setGender('');
        setSpecies('');
        setDescription('');
        setPrice('');
        setDiscountPrice('');
        setHeight('');
        setWeight('');
        setDropdown('');
        setUploading(false);
        setShow(false);
    }

    const cancelAddingTask = () => {
        Alert.alert(
            'Cảnh báo',
            (action == 'add'
            ? 'Bạn có chắc muốn hủy đăng thông tin bán thú cưng?'
            : 'Bạn có chắc muốn hủy việc chỉnh sửa thông tin thú cưng?'),
            [
                {
                    text: strings.cancel,
                },
                {
                    text: strings.sure,
                    onPress: () => {
                        action == 'add'
                        ? resetAllFields()
                        : navigation.goBack();
                    }
                }
            ]
        );
    }

    const showResultToast = (result) => {
        if (result == 'Success') {
            Toast.show({
                type: 'success',
                text1: strings.success,
                text2: action==='add' ? strings.msg_upload_sell_pet_success : strings.msg_update_sell_pet_success,
                position: 'top',
                autoHide: true,
            });

            action==='add' ? console.log('Sell pet uploaded!') : console.log('Updated sell pet!');
        }
        else {
            Toast.show({
                type: 'error',
                text1: strings.fail,
                text2: strings.msg_add_pet_fail,
                position: 'top',
                autoHide: true,
            });

            action==='add' ?
            console.log('Add to firestore error => ' + result) :
            console.log('Update to firestore error => ' + result);
        }
    }

    const handleAppointmentAdded = (result) => {
        setUploading(false);
        showResultToast(result);

        navigation.goBack();
    }

    const updateServices = (element) => {
        let newList = [];

        for (let i = 0; i < service.length; i++) {
            newList.push(service[i]);
        }
        if (!newList.includes(element)) {
            newList.push(element);

            setService(newList);
        }
    }

    const removeItemOnClick = (item) => {
        let listItem = [];

        for (let i = 0; i < service.length; i++) {
            if (service[i] != item) {
                listItem.push(service[i])
            }
        }

        setService(listItem)
    }

    //get species list
    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            // const getSpecies = getSpeciesList(handleSpeciesList); 
        }

        return () => {
            isMounted = false;
        }
    }, [])

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <BackButton
                    container={''}
                    navigation={navigation}
                />

                <Text style={styles.header_title}>
                    {strings.make_appointment_label}
                </Text>
            </View>

            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                enableAutomaticScroll={true}
                scrollEnabled={true}
                onScroll={() => Keyboard.dismiss()}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss()
                    }}
                >
                    <View style={styles.container}>
                        {/* Content */}
                        <View style={styles.content}>
                            {/* Name + Phone number */}
                            <View style={styles.two_on_row}>
                                {/* Name */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.customer_label}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            keyboardType={'default'}
                                            textContentType={"name"}
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.name}
                                            onChangeText={value => {
                                               
                                            }}
                                            value={date}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Phone number */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.phone}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            keyboardType={'numeric'}
                                            textContentType={"telephoneNumber"}
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.phone}
                                            onChangeText={value => {
                                               
                                            }}
                                            value={date}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Date + Time */}
                            <View style={styles.two_on_row}>
                                {/* Date */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.appointment_date_label}</Text>

                                    <TextInput
                                        style={styles.input}
                                        editable={false}
                                        keyboardType={'default'}
                                        placeholderTextColor={'#898989'}
                                        placeholder={strings.appointment_date_label}
                                        value={
                                            String(date.getDate()).padStart(2, '0') + "-" +
                                            String(date.getMonth() + 1).padStart(2, '0') + "-" +
                                            date.getFullYear().toString()
                                        }
                                    />
                                </View>

                                {/* Time */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.time}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setShow(!show)
                                        }}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            editable={false}
                                            keyboardType={'default'}
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.time}
                                            value={timeDisplay}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Service items */}
                            <View style={styles.service_container}>
                                <Text style={[styles.label, {marginBottom: -8}]}>{strings.content_label}</Text>

                                <View style={styles.services_add_holder}>
                                    <View style={styles.services}>
                                        {
                                            service.map((item) => {
                                                return (
                                                    <View style={styles.service_item_holder} key={item}>
                                                        <TextInput
                                                            style={styles.input}
                                                            editable={false}
                                                            keyboardType={'numeric'}
                                                            textContentType={"telephoneNumber"}
                                                            placeholderTextColor={'#898989'}
                                                            value={item}
                                                        />

                                                        <TouchableOpacity
                                                            activeOpacity={0.7}
                                                            style={styles.remove_item_icon}
                                                            onPress={() => {
                                                                removeItemOnClick(item)
                                                            }}
                                                        >
                                                            <Text style={{fontSize: 22, color: '#fff'}}>-</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>

                                    {/* Add icon */}
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{marginTop: 16}}
                                        onPress={() => {

                                        }}
                                    >
                                        <Image
                                            style={styles.plus_icon}
                                            source={require('../assets/icons/Add.png')}
                                        />

                                        <Picker
                                            style={[styles.plus_icon, {marginTop: -44, marginLeft: 5, opacity: 0, backgroundColor: COLORS.green}]}
                                            selectedValue={"Doctor"}
                                            onValueChange={(itemValue, itemIndex) => {
                                                updateServices(itemValue)
                                            }}>
                                            <Picker.Item label="Tiêm ngừa" value="Vaccine" />
                                            <Picker.Item label="Khám bệnh" value="Doctor" />
                                            <Picker.Item label="Mua sắm" value="Stuff" />
                                            <Picker.Item label="Tắm" value="Shower" />
                                        </Picker>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Note */}
                            <View style={[styles.input_holder, {marginTop: 26}]}>
                                <Text style={styles.label}>{strings.note_label}</Text>

                                <TextInput
                                    editable={true}
                                    style={[styles.input, {height: 116}]}
                                    multiline={true}
                                    placeholderTextColor={'#898989'}
                                    placeholder={strings.note_label}
                                    value={note}
                                    onChangeText={(value) => {
                                        setNote(value)
                                    }}
                                />
                            </View>

                            {/* Finish + Cancel buttons */}
                            <View style={styles.footer_buttons}>
                                <Button
                                    title={strings.cancel}
                                    titleStyle={styles.button_title}
                                    buttonStyle={styles.button}
                                    onPress={() => cancelAddingTask()}
                                >
                                </Button>

                                <Button
                                    title={strings.finist}
                                    titleStyle={styles.button_title}
                                    buttonStyle={styles.button}
                                    onPress={() => checkSubmitFields()}
                                >
                                </Button>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>

            {/* Time Picker */}
            {
                show ? (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode={'time'}
                        is24Hour={true}
                        display="spinner"
                        onChange={onChangeTime}
                    />
                ) : null
            }

            {/* Overlay */}
            {isUploading ?
                (
                    <View style={styles.overlay}>
                        <Text style={[styles.header_title, {fontSize: 24}]}>
                            {strings.processing}
                        </Text>

                        <Text style={[styles.header_title, {fontSize: 18}]}>
                            {strings.msg_please_wait}
                        </Text>
                    </View>
                ) : (null)
            }
        </View>
    )
}

export default MakeAppointmentScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        marginTop: 0,
        backgroundColor: COLORS.dark,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        height: 90,
        paddingLeft: 8,
        paddingTop: 16,
        flexDirection: 'row',
        backgroundColor: COLORS.dark,
    },
    header_title: {
        width: '74%',
        fontSize: 22,
        marginTop: 16,
        fontFamily: 'Roboto-Medium',
        color: COLORS.white,
        textAlign: 'center',
    },
    content: {
        height: '100%',
        width: '100%',
        paddingLeft: 22,
        paddingRight: 22,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: COLORS.black,
        opacity: 0.8,
        marginBottom: 10,
    },
    plus_icon: {
        width: 36,
        height: 36,
    },
    remove_item_icon: {
        position: 'absolute',
        right: -6,
        top: -6,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.black
    },
    input_holder: {
        width: '100%',
        marginTop: 22,
    },
    input_holder_small: {
        width: '45%',
        marginTop: 16,
    },
    input: {
        width: '100%',
        height: 46,
        fontSize: 16,
        backgroundColor: '#EEEEEE',
        color:COLORS.black,
        padding: 12,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    two_on_row: {
        width: '100%',
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    service_container: {
        width: '100%',
        marginTop: 24,
    },
    services_add_holder: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    services: {
        flexDirection: 'row',
        width: '90%',
        flexWrap: 'wrap'
    },
    service_item_holder: {
        marginTop: 16,
        alignSelf: 'flex-start',
        marginRight: 12,
    },
    button: {
        width: 120,
        height: 40,
        borderRadius: 12,
        marginLeft: 8,
        marginRight: 8,
        backgroundColor: COLORS.black,
    },
    button_title: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: COLORS.white,
    },
    footer_buttons: {
        width: '100%',
        height: 40,
        marginTop: 90,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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