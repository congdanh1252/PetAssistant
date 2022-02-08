import React, { useState } from "react";
import {
    StyleSheet, View, TextInput, Text, TouchableOpacity, Image, TouchableWithoutFeedback,
    Keyboard, Alert, ScrollView,
} from 'react-native'
import DateTimePicker from "@react-native-community/datetimepicker";

import { Button } from "react-native-elements/dist/buttons/Button";
import Treatment from "../models/treatment";
import COLORS from '../theme/colors';
import strings from "../data/strings";
import BackButton from "../components/BackButton";
import Toast from "react-native-toast-message";
import { 
    addTreatmentToFirestore,
    updateTreatmentInFirestore,
    deleteTreatmentFromFirestore
} from "../api/HealthCareAPI";

const AddTreatmentScreen = ({route, navigation}) => {
    const { pet_id, action, treatmentParam } = route.params;

    var treatment = new Treatment();
    const [detail, setDetail] = useState(action == 'add' ? '' : treatmentParam.detail);
    const [medicine, setMedicine] = useState(action == 'add' ? '' : treatmentParam.medicine);
    const [note, setNote] = useState(action == 'add' ? '' : treatmentParam.note);

    const [show, setShow] = useState(false);
    const [choseDate, setChoseDate] = useState(action == 'add' ? false : true);
    const [date, setDate] = useState(action == 'add' ? new Date(2020, 12, 12) : treatmentParam.taken_date);
    const [isUploading, setUploading] = useState(false);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);

        var today = new Date();

        if (selectedDate!=null && currentDate < today) {
            setDate(currentDate);
            setChoseDate(true);
            console.log(selectedDate);
        }
        else {
            console.log("INVALID DATE");
        }
    };

    const resetAllFields = () => {
        setDetail('');
        setMedicine('');
        setNote('');
        setDate(new Date(2020, 12, 12));
        setChoseDate(false);
    }

    const handleCancelAction = () => {
        Alert.alert(
            'Cảnh báo',
            (action == 'add'
            ? 'Bạn có chắc muốn hủy việc thêm thông tin điều trị?'
            : 'Bạn có chắc muốn hủy việc chỉnh sửa thông tin điều trị?'),
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
                text2: action==='add' ? strings.msg_add_treatment_success : strings.msg_update_treatment_success,
                position: 'top',
                autoHide: true,
            });

            action==='add' ? console.log('Treatment added!') : console.log('Treatment updated!');
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

    const handleDeleteTreatment = () => {
        Alert.alert(
            'Cảnh báo',
            'Bạn có chắc muốn xóa điều trị này?',
            [
                {
                    text: strings.cancel,
                },
                {
                    text: strings.sure,
                    onPress: () => {
                        initTreatmentData();
                        deleteTreatmentFromFirestore(treatment, handleDeleteCallback);
                    }
                }
            ]
        );
    }

    const handleDeleteCallback = (result) => {
        if (result == 'Success') {
            Toast.show({
                type: 'success',
                text1: strings.success,
                text2: strings.msg_delete_treatment_success,
                position: 'top',
                autoHide: true,
            });

            console.log('Đã xóa điều trị');
        }
        else {
            Toast.show({
                type: 'error',
                text1: strings.fail,
                text2: strings.msg_add_pet_fail,
                position: 'top',
                autoHide: true,
            });
            console.log('Delete treatment error => ' + result);
        }
        
        navigation.goBack();
    }

    const initTreatmentData = () => {
        treatment.detail = detail;
        treatment.note = note;
        treatment.taken_date = date;
        treatment.medicine = medicine;
        treatment.pet_id = pet_id;
        action === 'edit' ? treatment._id = treatmentParam._id : null;
    }

    const handleCallback = (result) => {
        setUploading(false);
        showResultToast(result);

        navigation.goBack();
    }

    const checkSubmitFields = () => {
        if (medicine=='' || detail=='' || !choseDate) {
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
            initTreatmentData();
            
            action == 'add'
            ? addTreatmentToFirestore(treatment, handleCallback)
            : updateTreatmentInFirestore(treatment, handleCallback);
        }
    }

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <BackButton
                    container={''}
                    navigation={navigation}
                />

                <Text style={styles.header_title}>
                    {action=='add' ? strings.add_treatment : strings.edit_vaccine}
                </Text>

                {
                    action == 'edit' ?
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            handleDeleteTreatment()
                        }}
                    >
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                marginTop: 16,
                                marginLeft: 8,
                                tintColor: COLORS.white
                            }}
                            source={require('../assets/icons/ic_bin.png')}
                        />
                    </TouchableOpacity>
                    : null
                }
            </View>

            <TouchableWithoutFeedback
                onPress={() => { Keyboard.dismiss() }}
            >
                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Ngày điều trị */}
                    <View style={styles.two_on_row}>
                        <View style={styles.input_holder_small}>
                            <Text style={styles.label}>{strings.treatment_taken_date}</Text>

                            <TextInput
                                editable={false}
                                style={styles.input}
                                placeholderTextColor={'#898989'}
                                placeholder={strings.treatment_taken_date}
                                value={
                                    choseDate
                                    ?
                                    (
                                        String(date.getDate()).padStart(2, '0') + "-" +
                                        String(date.getMonth() + 1).padStart(2, '0') + "-" +
                                        date.getFullYear()
                                    ) : (null)
                                }
                            />
                        </View>

                        {/* Calendar icon */}
                        <View style={[styles.input_holder_small, {alignItems: 'center'}]}>
                            <TouchableOpacity
                                style={{width: '36%', alignItems: 'center', marginTop: 40,}}
                                activeOpacity={0.6}
                                onPress={() => setShow(true)}
                            >
                                <Image
                                    source={require('../assets/icons/ic_calendar.png')}
                                    style={styles.plus_icon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Nội dung */}
                    <View style={styles.input_holder}>
                        <Text style={styles.label}>{strings.content_label}</Text>

                        <TextInput
                            style={styles.input}
                            placeholderTextColor={'#898989'}
                            placeholder={strings.content_label}
                            value={detail}
                            onChangeText={value => {
                                setDetail(value);
                            }}
                        />
                    </View>

                    {/* Thuốc sử dụng */}
                    <View style={styles.input_holder}>
                        <Text style={styles.label}>{strings.taken_medicine_label}</Text>

                        <TextInput
                            style={styles.input}
                            placeholderTextColor={'#898989'}
                            placeholder={strings.taken_medicine_label}
                            value={medicine}
                            onChangeText={value => {
                                setMedicine(value)
                            }}
                        />
                    </View>

                    {/* Ghi chú */}
                    <View style={styles.input_holder}>
                        <Text style={styles.label}>{strings.note_label}</Text>

                        <TextInput
                            style={[styles.input, {height: 90}]}
                            multiline={true}
                            placeholderTextColor={'#898989'}
                            placeholder={strings.note_label}
                            value={note}
                            onChangeText={value => {
                                setNote(value)
                            }}
                        />
                    </View>

                    {/* Save + Cancel buttons */}
                    <View style={styles.footer_buttons}>
                        <Button
                            title={strings.cancel}
                            titleStyle={styles.button_title}
                            buttonStyle={styles.button}
                            onPress={() => handleCancelAction()}
                        >
                        </Button>

                        <Button
                            title={strings.save}
                            titleStyle={styles.button_title}
                            buttonStyle={styles.button}
                            onPress={() => checkSubmitFields()}
                        >
                        </Button>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>

            {/* Date Picker */}
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={'date'}
                    is24Hour={true}
                    display="spinner"
                    dateFormat="day month year"
                    onChange={onChangeDate}
                />
            )}

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

export default AddTreatmentScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.dark
    },
    container: {
        paddingTop: 4,
        paddingLeft: 22,
        paddingRight: 22,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: COLORS.white,
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
    label: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: COLORS.black,
        opacity: 0.8,
        marginBottom: 10,
    },
    input_holder: {
        width: '100%',
        marginTop: 20,
    },
    input_holder_small: {
        width: '45%',
        marginTop: 12,
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
    plus_icon: {
        width: 48,
        height: 48,
    },
    two_on_row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    down_icon: {
        width: 16,
        height: 16,
        position: 'absolute',
        right: 10,
        top: 14,
        tintColor: COLORS.black,
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
        marginTop: 200,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdown_bottomsheet: {
        borderRadius: 10,
    },
    dropdown_option: {
        width: '99%',
        height: 60,
        padding: 12,
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
    else_option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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