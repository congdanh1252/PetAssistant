import React, { useMemo, useState } from "react";
import {
    StyleSheet, View, TextInput, Text, TouchableOpacity, Image, TouchableWithoutFeedback,
    Keyboard, TouchableHighlight, Alert, ScrollView
} from 'react-native'
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import BottomSheet from '@gorhom/bottom-sheet';
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CheckBox } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

import { Button } from "react-native-elements/dist/buttons/Button";
import COLORS from '../theme/colors';
import strings from "../data/strings";
import BackButton from "../components/BackButton";
import Vaccine from "../models/vaccine";
import Reminder from "../models/reminder";

import { addReminder } from "../api/ReminderAPI";
import { uploadImageToStorage, deleteImageFromStorage } from '../api/PetAPI';
import {
    addVaccineToFirestore,
    updateVaccineInFirestore,
    deleteVaccineFromFirestore
} from "../api/HealthCareAPI";

const AddVaccineScreen = ({route, navigation}) => {
    const { action, pet_id, pet_kind, vaccineParam } = route.params;
    var elseOption = '';
    var vaccine = new Vaccine();
    var reminder = new Reminder();
    const [type, setType] = useState(action == 'add' ? '' : vaccineParam.type);
    const [editDetail, setEditDetail] = useState(false);
    const [detail, setDetail] = useState(action == 'add' ? '' : vaccineParam.detail);
    const [photoUri, setPhotoUri] = useState(action == 'add' ? '' : vaccineParam.label_photo);
    const [photoFileName, setPhotoFileName] = useState('');
    const [dropdown, setDropdown] = useState('');
    const [autoAdd, setAutoAdd] = useState(false);
    const [isUploading, setUploading] = useState(false);

    const [show, setShow] = useState(false);
    const [showRetake, setShowRetake] = useState(false);
    const [takenDate, setTakenDate] = useState(action == 'add' ? new Date(2020, 12, 12) : vaccineParam.taken_date);
    const [retakeDate, setRetakeDate] = useState(action == 'add' ? new Date(2020, 12, 12) : vaccineParam.retake_date);
    const [choseTakenDate, setChoseTakenDate] = useState(action == 'add' ? false : true);
    const [choseRetakeDate, setChoseRetakeDate] = useState(action == 'add' ? false : true);
    const snapPoints = useMemo(() => ['100%', '100%'], []);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || takenDate;
        show ? setShow(false) : setShowRetake(false);

        show ? setTakenDate(currentDate) : setRetakeDate(currentDate);
        show ? setChoseTakenDate(true) : setChoseRetakeDate(true);
    };

    const resetAllFields = () => {
        setType('');
        setDetail('');
        setEditDetail(false);
        setPhotoUri('');
        setPhotoFileName('');
        setTakenDate(new Date(2020, 12, 12));
        setRetakeDate(new Date(2020, 12, 12));
        setChoseTakenDate(false);
        setChoseRetakeDate(false);
    }

    const handleCancelAction = () => {
        Alert.alert(
            'C???nh b??o',
            (action == 'add'
            ? 'B???n c?? ch???c mu???n h???y vi???c th??m th??ng tin v???c-xin?'
            : 'B???n c?? ch???c mu???n h???y vi???c ch???nh s???a th??ng tin v???c-xin?'),
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

    const handleDeleteVaccine = () => {
        Alert.alert(
            'C???nh b??o',
            'B???n c?? ch???c mu???n x??a m??i v???c-xin?',
            [
                {
                    text: strings.cancel,
                },
                {
                    text: strings.sure,
                    onPress: () => {
                        deleteVaccineFromFirestore(vaccineParam, handleDeleteCallback);
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
                text2: action==='add' ? strings.msg_add_vaccine_success : strings.msg_update_vaccine_success,
                position: 'top',
                autoHide: true,
            });

            action==='add' ? console.log('Vaccine added!') : console.log('Vaccine updated!');
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

    const handleDeleteCallback = (result) => {
        if (result == 'Success') {
            Toast.show({
                type: 'success',
                text1: strings.success,
                text2: strings.msg_delete_vaccine_success,
                position: 'top',
                autoHide: true,
            });

            console.log('???? x??a vaccine');
        }
        else {
            Toast.show({
                type: 'error',
                text1: strings.fail,
                text2: strings.msg_add_pet_fail,
                position: 'top',
                autoHide: true,
            });
            console.log('Delete vaccine error => ' + result);
        }

        navigation.goBack();
    }

    const handleCallback = (result) => {
        setUploading(false);
        showResultToast(result);

        navigation.goBack();
    }

    const initVaccineData = (photoUrl) => {
        vaccine.type = type;
        vaccine.detail = detail;
        vaccine.label_photo = photoUrl;
        vaccine.taken_date = takenDate;
        vaccine.retake_date = retakeDate;
        vaccine.pet_id = pet_id;
        action === 'edit' ? vaccine._id = vaccineParam._id : null;
    }

    const checkSubmitFields = () => {
        if (photoUri=='' || type=='' || detail=='' || !choseTakenDate || !choseRetakeDate || retakeDate < takenDate) {
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
                uploadImageToStorage(photoUri, photoFileName, handleImageUrl);
            } else {
                if (photoFileName==='') {
                    initVaccineData(vaccineParam.label_photo);
                    updateVaccineInFirestore(vaccine, handleCallback);
                } else {
                    uploadImageToStorage(photoUri, photoFileName, handleImageUrl);
                    deleteImageFromStorage(vaccineParam.label_photo);
                }
            }
        }
    }

    const initReminderData = () => {
        reminder.datetime = retakeDate;
        reminder.frequency = 'custom';
        reminder.title = 'T??i ch???ng ' + type;
        reminder.type = 'Doctor';
        reminder.reminderType = 'custom';
        reminder.pets.push(pet_id);
    }

    const handleImageUrl = (url) => {
        initVaccineData(url);

        if (action==='add') {
            if (autoAdd) {
                initReminderData();
                addReminder(reminder, (rm) => {
                    console.log("???? t??? ?????ng th??m reminder t??i ch???ng: " + rm._id);
                    addVaccineToFirestore(vaccine, handleCallback);
                })
            } else {
                addVaccineToFirestore(vaccine, handleCallback);
            }
        } else {
            updateVaccineInFirestore(vaccine, handleCallback);
        }
    }

    const handleTypeChose = (value) => {
        setEditDetail(false);
        switch (value) {
            case 'M??i 1':
                setDetail('Care virus, Pravo virus, Vi??m gan truy???n nhi???m, Ho c??i ch??, Ph???i c??m');
                break;
            case 'M??i 2':
                setDetail('Care virus, Pravo virus, Vi??m gan truy???n nhi???m, Ho c??i ch??, Ph???i c??m, Lepto, Corona');
                break;
            case 'M??i 3':
                setDetail('Care virus, Pravo virus, Vi??m gan truy???n nhi???m, Ho c??i ch??, Ph???i c??m, Lepto, Corona');
                break;
            case 'M??i 4':
                setDetail('B???nh D???i');
                break;
            default:
                setDetail(value);
                setEditDetail(true)
        }
    }

    const addPetPhoto = (method) => {
        console.log(method);
        let options = {
            selectionLimit: 1,
            mediaType: 'photo',
        }

        if (method==strings.pick_photo_fr_lib) {
            launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                }
                else if (response.errorCode == 'permission') {
                    console.log(strings.err_photo_picker_permission);
                }
                else {
                    setPhotoUri(response.assets[0].uri);
                    setPhotoFileName(response.assets[0].fileName);
                    console.log(response.assets[0].fileName);
                }
            })
        }
        else {
            launchCamera(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                }
                else if (response.errorCode == 'permission') {
                    console.log(strings.err_photo_picker_permission);
                }
                else {
                    setPhotoUri(response.assets[0].uri);
                    setPhotoFileName(response.assets[0].fileName);
                    console.log(response.assets[0].fileName);
                }
            })
        }
    }

    const setValueFromDropdown = (value) => {
        switch (dropdown) {
            case 'Type':
                setType(value);
                handleTypeChose(value);
                break;
            default:
                addPetPhoto(value);
        }

        setDropdown('');
    }

    const DropDownOptions = () => {
        var options = [];
        var optionViews = [];

        switch (dropdown) {
            case 'Type':
                if (pet_kind == 'Ch??') {
                    options.push('M??i 1', 'M??i 2', 'M??i 3', 'M??i 4', strings.else_option)
                }
                else if (pet_kind == 'M??o') {
                    options.push(
                        'B???nh gi???m b???ch c???u',
                        'B???nh Vi??m m??i',
                        'B???nh do Herpesvirus',
                        'B???nh D???i',
                        strings.else_option
                    )
                }
                else options.push(strings.else_option);
                break;
            default:
                options.push(strings.take_photo, strings.pick_photo_fr_lib);
        }

        for (let i = 0; i < options.length; i++) {
            optionViews.push(
                <TouchableHighlight
                    key={i}
                    activeOpacity={0.7}
                    underlayColor='#EEEEEE'
                    style={
                        options[i]==type
                        ?
                        [styles.dropdown_option, {backgroundColor: COLORS.grey}] : styles.dropdown_option
                    }
                    onPress={() => 
                        options[i]!=strings.else_option
                        ? setValueFromDropdown(options[i]) : (null)
                    }
                >
                    <View style={styles.else_option}>
                        <Text style={styles.dropdown_option_text}>
                            {options[i]}
                        </Text>

                        {
                            options[i]==strings.else_option ? 
                            (
                                <TextInput
                                    editable={true}
                                    style={[styles.input, {width: '60%', height: 44}]}
                                    placeholder={strings.type_value}
                                    onChangeText={value => {
                                        elseOption = value;
                                    }}
                                    onSubmitEditing={() => {
                                        setValueFromDropdown(elseOption)
                                    }}
                                />
                            ) : (null)
                        }
                    </View>
                </TouchableHighlight>
            )
        }

        return (
            <View>
                {optionViews}
            </View>
        )
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
                    {action == 'add' ? strings.add_vaccine : strings.edit_vaccine}
                </Text>

                {
                    action == 'edit' ?
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleDeleteVaccine()}
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
                onPress={() => {
                    Keyboard.dismiss()
                    setDropdown('');
                }}
            >
                {/* Content */}
                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Photo */}
                    <View style={styles.pet_photo_holder}>
                        <Text style={styles.label}>
                            {strings.vaccine_label}
                        </Text>

                        <TouchableOpacity
                            style={styles.photo_picker}
                            activeOpacity={0.7}
                            onPress={() => {
                                setDropdown('AddPhoto')
                            }}
                        >
                            {(photoUri=='' ? 
                                <View style={styles.plus_icon}>
                                    <Image
                                        source={require('../assets/icons/Add.png')}
                                        style={styles.plus_icon}
                                    />
                                </View>
                                : 
                                <View style={styles.pet_photo}>
                                    <Image
                                        source={{uri: photoUri}}
                                        style={styles.pet_photo}
                                    />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* M??i ti??m */}
                    <View style={styles.input_holder}>
                        <Text style={styles.label}>{strings.injection_label}</Text>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => { setDropdown('Type') }}
                        >
                            <TextInput
                                editable={false}
                                style={styles.input}
                                placeholderTextColor={'#898989'}
                                placeholder={strings.injection_label}
                                value={type}
                            />

                            <Image
                                source={require('../assets/icons/ic_down.png')}
                                style={styles.down_icon}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Chi ti???t */}
                    <View style={styles.input_holder}>
                        <Text style={styles.label}>{strings.detail}</Text>

                        <TextInput
                            editable={editDetail}
                            style={[styles.input, {height: 66}]}
                            multiline={true}
                            placeholderTextColor={'#898989'}
                            placeholder={strings.detail + ' ' + strings.injection_label.toLowerCase()}
                            value={detail}
                            onChangeText={value => {
                                setDetail(value)
                            }}
                        />
                    </View>

                    {/* Ng??y ti??m */}
                    <View style={styles.two_on_row}>
                        <View style={styles.input_holder_small}>
                            <Text style={styles.label}>{strings.vaccine_taken_date}</Text>

                            <TextInput
                                editable={false}
                                style={styles.input}
                                placeholderTextColor={'#898989'}
                                placeholder={strings.vaccine_taken_date}
                                value={
                                    choseTakenDate
                                    ?
                                    (
                                        String(takenDate.getDate()).padStart(2, '0') + "-" +
                                        String(takenDate.getMonth() + 1).padStart(2, '0') + "-" +
                                        takenDate.getFullYear()
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

                    {/* Ng??y t??i ch???ng */}
                    <View style={styles.two_on_row}>
                        <View style={styles.input_holder_small}>
                            <Text style={styles.label}>{strings.vaccine_retake_date}</Text>

                            <TextInput
                                editable={false}
                                style={styles.input}
                                placeholderTextColor={'#898989'}
                                placeholder={strings.vaccine_retake_date}
                                value={
                                    choseRetakeDate
                                    ?
                                    (
                                        String(retakeDate.getDate()).padStart(2, '0') + "-" +
                                        String(retakeDate.getMonth() + 1).padStart(2, '0') + "-" +
                                        retakeDate.getFullYear()
                                    ) : (null)
                                }
                            />
                        </View>

                        {/* Calendar icon */}
                        <View style={[styles.input_holder_small, {alignItems: 'center'}]}>
                            <TouchableOpacity
                                style={{width: '36%', alignItems: 'center', marginTop: 40,}}
                                activeOpacity={0.6}
                                onPress={() => setShowRetake(true)}
                            >
                                <Image
                                    source={require('../assets/icons/ic_calendar.png')}
                                    style={styles.plus_icon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* CheckBox t??? ?????ng th??m */}
                    {action=='add' ?
                        <View style={[styles.two_on_row, {justifyContent: 'flex-start', marginTop: 8}]}>
                            <CheckBox
                                center
                                checkedColor="#000"
                                size={28}
                                containerStyle={{
                                    backgroundColor: COLORS.white,
                                    width: 0,
                                }}
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                checked={autoAdd}
                                onPress={() => setAutoAdd(!autoAdd)}
                            />

                            <Text
                                style={{
                                    color: COLORS.black,
                                    fontSize: 16,
                                    fontFamily: 'Roboto-Light'
                                }}
                            >T??? ?????ng th??m ho???t ?????ng t??i ch???ng</Text>
                        </View>
                        : null
                    }

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

            {/* Dropdown bottomsheet */}
            {
                dropdown=='' ?
                    null
                :
                    <BottomSheet
                        index={1}
                        snapPoints={snapPoints}
                        backgroundStyle={{borderWidth: 0}}
                        style={styles.dropdown_bottomsheet}
                        enableOverDrag={false}
                        enablePanDownToClose={true}
                        onClose={() => setDropdown('')}
                    >
                        <DropDownOptions/>
                    </BottomSheet>
            }

            {/* Date Picker */}
            {(show || showRetake) && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={show ? takenDate : retakeDate}
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

export default AddVaccineScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.dark
    },
    container: {
        paddingTop: 8,
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
    pet_photo_holder: {
        width: '35%',
        height: 160,
        marginTop: 12,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    photo_picker: {
        width: '100%',
        height: 130,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.grey,
    },
    pet_photo: {
        width: '100%',
        height: 130,
        borderRadius: 15,
    },
    plus_icon: {
        width: 45,
        height: 45,
    },
    input_holder: {
        width: '100%',
        marginTop: 22,
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
        marginTop: 50,
        marginBottom: 30,
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